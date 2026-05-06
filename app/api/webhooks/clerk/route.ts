import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { sendWelcomeEmail } from '@/src/lib/email'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET
  if (!secret) {
    console.error('[Webhook] CLERK_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const body = await request.text()
  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  let payload: any
  try {
    const wh = new Webhook(secret)
    payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    })
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (payload.type !== 'user.created') {
    return NextResponse.json({ received: true })
  }

  const userEmail = payload.data.email_addresses?.[0]?.email_address
  const userName = payload.data.first_name || ''

  if (!userEmail) {
    return NextResponse.json({ received: true })
  }

  try {
    await sendWelcomeEmail(userEmail, userName)
    console.log('[Webhook] Welcome email sent:', userEmail)
  } catch (emailError) {
    console.error('[Webhook] Failed to send welcome email:', emailError)
  }

  return NextResponse.json({ received: true })
}
