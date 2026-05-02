import { NextResponse } from 'next/server';
import { uploadToCloud } from '@/src/services/uploadToCloud';

export async function POST(request: Request) {
  try {
    const { imageUrl, fileName } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: '缺少 imageUrl 参数' },
        { status: 400 }
      );
    }

    const resultUrl = await uploadToCloud(imageUrl, fileName || 'test-image');

    return NextResponse.json({
      success: true,
      originalUrl: imageUrl,
      permanentUrl: resultUrl,
    });
  } catch (error) {
    console.error('[test-upload] 测试失败:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
