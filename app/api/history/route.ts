import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[API/history] 收到获取历史记录请求');

  try {
    const { userId: clerkUserId } = auth();
    console.log('[API/history] Clerk User ID:', clerkUserId);

    if (!clerkUserId) {
      console.warn('[API/history] 用户未登录');
      return NextResponse.json(
        { success: false, error: '用户未登录' },
        { status: 401 }
      );
    }

    // 动态导入 Prisma，避免启动错误
    const { default: prisma } = await import('@/src/lib/prisma');
    console.log('[API/history] Prisma 导入成功');

    // 查找用户
    let user = await prisma.user.findUnique({
      where: { clerkUserId }
    });
    console.log('[API/history] 查找用户结果:', user);

    if (!user) {
      console.warn('[API/history] 用户不存在');
      // 用户不存在也返回空列表
      return NextResponse.json({
        success: true, histories: [] });
    }

    // 获取历史记录
    const histories = await prisma.tryOnHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    console.log(`[API/history] 获取到 ${histories.length} 条历史记录`);

    return NextResponse.json({
      success: true,
      histories: histories.map((h: any) => ({
        id: h.id,
        clothingImageUrl: h.clothingImageUrl,
        personImageUrl: h.personImageUrl,
        resultImageUrl: h.resultImageUrl,
        createdAt: h.createdAt
      }))
    });
  } catch (error) {
    console.error('[API/history] 服务器内部错误:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
