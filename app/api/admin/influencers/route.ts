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

  const { name, niche, photo_url, instagram_url, tiktok_url, youtube_url, followers } = await request.json()
  const n = (v: string | undefined) => v || null

  const { rows } = await pool.query(
    `INSERT INTO influencers (name, niche, photo_url, instagram_url, tiktok_url, youtube_url, followers)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, niche, n(photo_url), n(instagram_url), n(tiktok_url), n(youtube_url), n(followers)]
  )
  return NextResponse.json(rows[0])
}

export async function PUT(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, name, niche, photo_url, instagram_url, tiktok_url, youtube_url, followers } = await request.json()
  const n = (v: string | undefined) => v || null

  const { rows } = await pool.query(
    `UPDATE influencers SET name=$1, niche=$2, photo_url=$3, instagram_url=$4,
     tiktok_url=$5, youtube_url=$6, followers=$7 WHERE id=$8 RETURNING *`,
    [name, niche, n(photo_url), n(instagram_url), n(tiktok_url), n(youtube_url), n(followers), id]
  )
  return NextResponse.json(rows[0])
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await pool.query('DELETE FROM influencers WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
