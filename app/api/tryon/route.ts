import { NextResponse } from 'next/server';
import { tryOnService } from '@/src/services/tryon';
import type { Category, FitType } from '@/types';
import { uploadToCloud } from '@/src/services/uploadToCloud';
import { auth } from '@clerk/nextjs/server';

interface TryOnRequestBody {
  personImage: string;
  clothingImage: string;
  category: Category;
  fit?: FitType;
}

export async function POST(request: Request) {
  console.log('=== 1. 开始处理试衣请求 ===');
  console.log('[API/tryon] 收到换装请求');
  
  try {
    const body: TryOnRequestBody = await request.json();
    const { userId: clerkUserId } = auth();
    console.log('[API/tryon] Clerk User ID:', clerkUserId);
    
    // 参数校验
    if (!body.personImage || !body.clothingImage || !body.category) {
      console.warn('[API/tryon] 参数缺失');
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (!['top', 'bottom', 'dress'].includes(body.category)) {
      console.warn('[API/tryon] 无效的品类参数:', body.category);
      return NextResponse.json(
        { success: false, error: '无效的品类参数' },
        { status: 400 }
      );
    }

    if (body.fit && !['slim', 'oversized'].includes(body.fit)) {
      console.warn('[API/tryon] 无效的版型参数:', body.fit);
      return NextResponse.json(
        { success: false, error: '无效的版型参数' },
        { status: 400 }
      );
    }

    console.log(`[API/tryon] 请求参数 - 品类: ${body.category}, 版型: ${body.fit || '默认'}`);

    console.log('=== 2. 开始调用 AI 生成图片 ===');
    // 调用 Service 生成图片
    const result = await tryOnService.generate(
      body.personImage,
      body.clothingImage,
      body.category,
      body.fit
    );
    console.log('=== 3. AI 返回结果 ===', result);

    // 如果图片生成成功
    if (result.success && result.imageUrl) {
      console.log('=== 4. AI 生成成功，准备返回响应 ===');
      // 立即返回临时图片给前端
      const response = NextResponse.json({
        success: true,
        resultImage: result.imageUrl,
      });
      
      console.log('=== 5. 启动后台处理（R2 + 数据库） ===');
      // 在后台异步上传到 R2 + 保存数据库（不阻塞响应）
      processInBackground(body, result.imageUrl, clerkUserId).catch(error => {
        console.error('[API/tryon] 后台处理失败:', error);
      });
      
      return response;
    } else {
      console.warn('[API/tryon] 请求失败:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error('[API/tryon] 服务器内部错误:', error);
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 后台异步处理：上传 R2 + 保存数据库
async function processInBackground(
  body: { personImage: string; clothingImage: string; category: Category; fit?: FitType },
  tempImageUrl: string,
  clerkUserId: string | null
) {
  try {
    console.log('=== 6. 进入后台处理函数 ===');
    console.log('[API/tryon] 开始后台处理...');
    
    let finalImageUrl = tempImageUrl;
    
    // 1. 先尝试上传到 R2
    try {
      console.log('=== 7. 开始上传到 R2 ===');
      console.log('[API/tryon] 开始上传到 R2...');
      const fileName = `tryon-${Date.now()}`;
      finalImageUrl = await uploadToCloud(tempImageUrl, fileName);
      console.log('=== 8. R2 上传完成 ===', finalImageUrl);
      console.log('[API/tryon] R2 上传成功:', finalImageUrl);
    } catch (uploadError) {
      console.error('[API/tryon] R2 上传失败，使用临时链接:', uploadError);
    }
    
    // 2. 保存到数据库
    try {
      console.log('=== 9. 开始保存数据库 ===', clerkUserId);
      console.log('[API/tryon] Clerk User ID 检查:', clerkUserId);
      
      if (!clerkUserId) {
        console.log('[API/tryon] 用户未登录，不保存历史');
        return;
      }
      
      console.log('[API/tryon] 开始保存到数据库...');
      
      // 动态导入 Prisma
      const { default: prisma } = await import('@/src/lib/prisma');
      console.log('[API/tryon] Prisma 导入成功');
      
      // 查找或创建用户
      let user = await prisma.user.findUnique({
        where: { clerkUserId }
      });
      console.log('[API/tryon] 查找用户结果:', user);

      if (!user) {
        console.log('[API/tryon] 创建新用户...');
        user = await prisma.user.create({
          data: {
            clerkUserId,
            email: 'user@example.com'
          }
        });
        console.log('[API/tryon] 用户创建成功:', user.id);
      }
      
      console.log('[API/tryon] 保存试衣历史...');
      // 保存试衣历史
      const history = await prisma.tryOnHistory.create({
        data: {
          userId: user.id,
          clothingImageUrl: body.clothingImage,
          personImageUrl: body.personImage,
          resultImageUrl: finalImageUrl
        }
      });
      
      console.log('=== 10. 数据库保存完成 ===');
      console.log('[API/tryon] 历史记录保存成功:', history.id);
    } catch (dbError) {
      console.error('[API/tryon] 保存到数据库失败:', dbError);
    }
    
    console.log('[API/tryon] 后台处理完成');
  } catch (error) {
    console.error('[API/tryon] 后台处理异常:', error);
  }
}
