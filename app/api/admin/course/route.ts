import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
} from '@/lib/queries'

async function requireAdmin() {
  const user = await getSession()
  if (!user || user.role !== 'admin') return null
  return user
}

export async function POST(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()

  if (body.type === 'module') {
    const mod = await createModule(body.slug, body.title, body.order_index ?? 0)
    return NextResponse.json(mod)
  }
  if (body.type === 'lesson') {
    const lesson = await createLesson(body.module_id, {
      title: body.title,
      video_url: body.video_url,
      duration_minutes: body.duration_minutes,
      description: body.description,
      order_index: body.order_index ?? 0,
    })
    return NextResponse.json(lesson)
  }
  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function PUT(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json()

  if (body.type === 'module') {
    const mod = await updateModule(body.id, { title: body.title, order_index: body.order_index })
    return NextResponse.json(mod)
  }
  if (body.type === 'lesson') {
    const lesson = await updateLesson(body.id, {
      title: body.title, video_url: body.video_url,
      duration_minutes: body.duration_minutes, description: body.description,
      order_index: body.order_index,
    })
    return NextResponse.json(lesson)
  }
  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function DELETE(request: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { type, id } = await request.json()

  if (type === 'module') { await deleteModule(id); return NextResponse.json({ ok: true }) }
  if (type === 'lesson') { await deleteLesson(id); return NextResponse.json({ ok: true }) }
  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
