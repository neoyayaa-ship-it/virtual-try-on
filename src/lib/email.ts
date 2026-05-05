import { Resend } from 'resend'

export async function sendWelcomeEmail(
  userEmail: string,
  userName: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: '虚拟试衣 <onboarding@resend.dev>',
    to: userEmail,
    subject: '欢迎来到虚拟试衣，开启你的时尚之旅 ✨',
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
        <h2>Hi ${userName}，欢迎来到虚拟试衣！</h2>
        <p>在这里，你可以上传照片和服装，AI 会帮你生成逼真的试穿效果。</p>
        <p>无需真实试穿，轻松预览搭配，找到最适合你的风格。</p>
        <p>现在就上传你的第一套服装，开始体验吧！</p>
        <br/>
        <p>—— 虚拟试衣团队</p>
      </div>
    `,
  })
}
