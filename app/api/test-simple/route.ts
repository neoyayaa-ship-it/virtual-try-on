import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '测试路由通了！',
    time: new Date().toISOString(),
  });
}
