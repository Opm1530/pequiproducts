import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY not set')
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendPasswordReset(email: string, resetUrl: string) {
  await getResend().emails.send({
    from: 'Pequi Digital <noreply@pequi.digital>',
    to: email,
    subject: 'Redefinir sua senha — Pequi Digital',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fff">
        <h1 style="font-size:22px;font-weight:900;color:#0B0501;margin:0 0 8px">Redefinir senha</h1>
        <p style="color:#6b6b6b;font-size:14px;margin:0 0 24px">
          Recebemos uma solicitação para redefinir a senha da sua conta no Pequi Digital.
          Clique no botão abaixo para criar uma nova senha.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#FF6803;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:12px;text-decoration:none">
          Redefinir minha senha
        </a>
        <p style="color:#9a9a9a;font-size:12px;margin:24px 0 0">
          Este link expira em 1 hora. Se você não solicitou a redefinição, ignore este e-mail.
        </p>
      </div>
    `,
  })
}
