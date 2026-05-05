import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/src/lib/email'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    
    if (payload.type !== 'user.created') {
      return NextResponse.json({ received: true })
    }

    const userEmail = payload.data.email_addresses?.[0]?.email_address
    const userName = payload.data.first_name || '用户'

    if (!userEmail) {
      return NextResponse.json({ received: true })
    }

    try {
      await sendWelcomeEmail(userEmail, userName)
      console.log('[Webhook] 欢迎邮件发送成功:', userEmail)
    } catch (emailError) {
      console.error('[Webhook] 欢迎邮件发送失败:', emailError)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] 处理失败:', error)
    return NextResponse.json({ error: '处理失败' }, { status: 500 })
  }
}
