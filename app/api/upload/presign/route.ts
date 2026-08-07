import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getPresignedUploadUrl, getPublicUrl } from '@/lib/r2'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  const user = await getSession()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { filename, contentType, folder } = await request.json()
  if (!filename || !contentType) {
    return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
  }

  const ext = filename.split('.').pop()
  const key = `${folder ?? 'uploads'}/${randomUUID()}.${ext}`

  const uploadUrl = await getPresignedUploadUrl(key, contentType)
  const publicUrl = getPublicUrl(key)

  return NextResponse.json({ uploadUrl, publicUrl })
}
