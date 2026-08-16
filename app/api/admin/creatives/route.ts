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
  const { title, description, niche, type, url, thumbnail_url, creative_type_label, attention_points, how_to_replicate } = body

  const { rows } = await pool.query(
    `INSERT INTO creatives (title, description, niche, type, url, thumbnail_url, creative_type_label, attention_points, how_to_replicate)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [title, description || null, niche, type, url, thumbnail_url || null,
     creative_type_label || null, attention_points || null, how_to_replicate || null]
  )
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { id, title, description, niche, type, url, thumbnail_url, creative_type_label, attention_points, how_to_replicate } = body

  const { rows } = await pool.query(
    `UPDATE creatives SET title=$2, description=$3, niche=$4, type=$5, url=$6,
     thumbnail_url=$7, creative_type_label=$8, attention_points=$9, how_to_replicate=$10
     WHERE id=$1 RETURNING *`,
    [id, title, description || null, niche, type, url, thumbnail_url || null,
     creative_type_label || null, attention_points || null, how_to_replicate || null]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await pool.query('DELETE FROM creatives WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
