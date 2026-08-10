import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { token, password } = await request.json()
  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const { rows } = await pool.query(
    `SELECT * FROM password_reset_tokens
     WHERE token = $1 AND used_at IS NULL AND expires_at > now()`,
    [token]
  )
  const reset = rows[0]
  if (!reset) {
    return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
  }

  const hash = await bcrypt.hash(password, 12)
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, reset.user_id])
  await pool.query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [reset.id])

  return NextResponse.json({ ok: true })
}
