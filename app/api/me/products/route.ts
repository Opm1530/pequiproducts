import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUserProducts } from '@/lib/queries'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ slugs: [] })
  const slugs = await getUserProducts(user.id)
  return NextResponse.json({ slugs })
}
