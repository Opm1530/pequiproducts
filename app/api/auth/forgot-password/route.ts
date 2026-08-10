import { NextRequest, NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/queries'
import { sendPasswordReset } from '@/lib/email'
import pool from '@/lib/db'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  const { email } = await request.json()
  if (!email) return NextResponse.json({ ok: true }) // silent

  const user = await getUserByEmail(email.toLowerCase().trim())
  if (!user) return NextResponse.json({ ok: true }) // don't reveal if email exists

  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1h

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, token, expiresAt]
  )

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  await sendPasswordReset(email, `${base}/redefinir-senha?token=${token}`)

  return NextResponse.json({ ok: true })
}
