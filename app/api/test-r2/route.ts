import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[test-r2] 开始测试 R2 连接...');
    console.log('[test-r2] R2_ENDPOINT:', process.env.R2_ENDPOINT);
    console.log('[test-r2] R2_ACCESS_KEY_ID:', process.env.R2_ACCESS_KEY_ID ? '已配置' : '未配置');
    console.log('[test-r2] R2_SECRET_ACCESS_KEY:', process.env.R2_SECRET_ACCESS_KEY ? '已配置' : '未配置');

    if (!process.env.R2_ENDPOINT || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
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

    console.log('[test-r2] 尝试列出 Buckets...');
    const response = await client.send(new ListBucketsCommand({}));
    console.log('[test-r2] R2 响应:', response);

    return NextResponse.json({
      success: true,
      message: 'R2 连接成功！',
      buckets: response.Buckets?.map((b: any) => b.Name) || [],
    });
  } catch (error: any) {
    console.error('[test-r2] 测试失败:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
      details: error,
    }, { status: 500 });
  }
}
