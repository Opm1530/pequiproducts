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

  const body = await request.json()
  const { title, description, niche, type, url, thumbnail_url } = body

  const { rows } = await pool.query(
    `INSERT INTO creatives (title, description, niche, type, url, thumbnail_url)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description || null, niche, type, url, thumbnail_url || null]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await pool.query('DELETE FROM creatives WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
