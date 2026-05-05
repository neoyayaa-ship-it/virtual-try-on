import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[test-r2-simple] 开始测试 R2 上传...');
    console.log('[test-r2-simple] R2_ENDPOINT:', process.env.R2_ENDPOINT);
    console.log('[test-r2-simple] R2_BUCKET_NAME:', process.env.R2_BUCKET_NAME);

    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      return NextResponse.json({
        success: false,
        error: '缺少 R2 环境变量配置',
      });
    }

    const client = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    console.log('[test-r2-simple] 尝试上传测试文件...');
    const testContent = 'Hello, R2!';
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: 'test-file.txt',
      Body: testContent,
      ContentType: 'text/plain',
    });

    const response = await client.send(command);
    console.log('[test-r2-simple] R2 响应:', response);

    const publicUrl = `${process.env.R2_PUBLIC_URL || 'https://your-r2-url.com'}/test-file.txt`;

    return NextResponse.json({
      success: true,
      message: 'R2 上传成功！',
      publicUrl: publicUrl,
    });
  } catch (error: any) {
    console.error('[test-r2-simple] 测试失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      code: (error as any)?.Code,
      details: error,
    }, { status: 500 });
  }
}
