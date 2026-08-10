import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getLessonComments, addLessonComment } from '@/lib/queries'

export async function GET(request: NextRequest) {
  const lessonId = request.nextUrl.searchParams.get('lessonId')
  if (!lessonId) return NextResponse.json([])
  const comments = await getLessonComments(lessonId)
  return NextResponse.json(comments)
}

export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { lessonId, content } = await request.json()
  if (!lessonId || !content?.trim()) return NextResponse.json({ error: 'Invalid' }, { status: 400 })
  const comment = await addLessonComment(lessonId, user.id, content.trim())
  return NextResponse.json({ ...comment, user_email: user.email })
}
