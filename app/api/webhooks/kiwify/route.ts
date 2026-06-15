import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import pool from '@/lib/db'
import { getUserByEmail, createUser, grantProductAccess } from '@/lib/queries'

function verifyKiwify(request: NextRequest): boolean {
  const token = request.nextUrl.searchParams.get('token')
  return token === process.env.KIWIFY_WEBHOOK_SECRET
}

const KIWIFY_PRODUCT_MAP: Record<string, string> = {
  [process.env.KIWIFY_PRODUCT_ID_CDE ?? '']: 'cde',
  [process.env.KIWIFY_PRODUCT_ID_BDAQV ?? '']: 'bdaqv',
  [process.env.KIWIFY_PRODUCT_ID_BDI ?? '']: 'bdi',
}

export async function POST(request: NextRequest) {
  if (!verifyKiwify(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const orderStatus: string = body.order_status
  const email: string = body.Customer?.email?.toLowerCase()?.trim()
  const productId: string = body.Product?.id

  if (!email || !productId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const productSlug = KIWIFY_PRODUCT_MAP[productId]
  if (!productSlug) {
    return NextResponse.json({ error: 'Unknown product' }, { status: 400 })
  }

  if (!['paid', 'approved', 'complete'].includes(orderStatus)) {
    return NextResponse.json({ ok: true, action: 'ignored', status: orderStatus })
  }

  // Get or create user
  let user = await getUserByEmail(email)
  if (!user) {
    // Random temp password — user must reset via support or future forgot-password flow
    const tempHash = await bcrypt.hash(crypto.randomUUID(), 12)
    user = await createUser(email, tempHash)
    if (!user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }
  }

  await grantProductAccess(user.id, productSlug, body.id)

  return NextResponse.json({ ok: true })
}
