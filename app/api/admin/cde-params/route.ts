import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import pool from '@/lib/db'

async function requireAdmin() {
  const user = await getSession()
  if (!user || user.role !== 'admin') return null
  return user
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { key, label, description, default_value, unit, order_index } = await request.json()
  const { rows } = await pool.query(
    `INSERT INTO cde_params (key, label, description, default_value, unit, order_index)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [key, label, description || null, default_value, unit || null, order_index]
  )
  return NextResponse.json(rows[0])
}

export async function PATCH(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, default_value } = await request.json()
  await pool.query('UPDATE cde_params SET default_value=$1 WHERE id=$2', [default_value, id])
  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await pool.query('DELETE FROM cde_params WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
