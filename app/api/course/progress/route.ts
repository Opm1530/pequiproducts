import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { toggleLessonComplete } from '@/lib/queries'

export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { lessonId } = await request.json()
  const completed = await toggleLessonComplete(user.id, lessonId)
  return NextResponse.json({ completed })
}
