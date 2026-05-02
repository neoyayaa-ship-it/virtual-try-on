import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

interface SaveHistoryRequestBody {
  clothingImage: string;
  personImage: string;
  resultImage: string;
}

export async function POST(request: Request) {
  try {
    console.log('[save-history] 收到保存历史请求');
    
    const { userId: clerkUserId } = auth();
    console.log('[save-history] Clerk User ID:', clerkUserId);
    
    if (!clerkUserId) {
      console.log('[save-history] 用户未登录');
      return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });
    }
    
    const body: SaveHistoryRequestBody = await request.json();
    
    // 动态导入 Prisma，避免启动错误
    const { default: prisma } = await import('@/src/lib/prisma');
    console.log('[save-history] Prisma 导入成功');
    
    // 查找或创建用户
    let user = await prisma.user.findUnique({
      where: { clerkUserId }
    });
    console.log('[save-history] 查找用户结果:', user);
    
    if (!user) {
      console.log('[save-history] 创建新用户');
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email: 'user@example.com'
        }
      });
      console.log('[save-history] 用户创建成功:', user.id);
    }
    
    // 保存历史记录
    const history = await prisma.tryOnHistory.create({
      data: {
        userId: user.id,
        clothingImageUrl: body.clothingImage,
        personImageUrl: body.personImage,
        resultImageUrl: body.resultImage
      }
    });
    
    console.log('[save-history] 历史记录保存成功:', history.id);
    
    return NextResponse.json({ success: true, historyId: history.id });
  } catch (error: any) {
    console.error('[save-history] 保存失败:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
