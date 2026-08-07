import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/mp'
import { getUserByEmail, createUser, grantProductAccess } from '@/lib/queries'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const url = request.nextUrl
  // Legacy format sends topic + id as query params
  const topicParam = url.searchParams.get('topic')
  const idParam = url.searchParams.get('id')

  const body = await request.json().catch(() => ({}))

  // Resolve topic and payment ID from either format
  const topic = topicParam ?? body.type ?? body.topic
  const paymentId = idParam ?? body.data?.id ?? body.id

  console.log('[MP webhook]', { topic, paymentId, body: JSON.stringify(body) })

  if (!paymentId || (topic !== 'payment' && topic !== 'merchant_order')) {
    return NextResponse.json({ ok: true, action: 'ignored' })
  }

  let payment
  try {
    payment = await getPayment().get({ id: String(paymentId) })
  } catch (err) {
    console.error('[MP webhook] Failed to fetch payment', err)
    return NextResponse.json({ error: 'Failed to fetch payment' }, { status: 500 })
  }

  console.log('[MP webhook] payment status:', payment.status, 'metadata:', JSON.stringify(payment.metadata))

  if (payment.status !== 'approved') {
    return NextResponse.json({ ok: true, action: 'not_approved', status: payment.status })
  }

  const meta = payment.metadata as Record<string, string> | null
  const slug = meta?.product_slug
  const userId = meta?.user_id

  if (!slug) {
    console.error('[MP webhook] Missing slug in metadata', meta)
    return NextResponse.json({ error: 'Missing product slug' }, { status: 400 })
  }

  if (userId) {
    // User was logged in when buying — grant directly by ID
    await grantProductAccess(userId, slug, String(paymentId))
    console.log('[MP webhook] access granted by user_id', { userId, slug })
  } else {
    // Fallback: create/find user by email
    const email = payment.payer?.email?.toLowerCase().trim()
    if (!email || email === 'xxxxxxxxxxx') {
      console.error('[MP webhook] No user_id in metadata and email masked', meta)
      return NextResponse.json({ error: 'Cannot identify user' }, { status: 400 })
    }
    let user = await getUserByEmail(email)
    if (!user) {
      const tempHash = await bcrypt.hash(crypto.randomUUID(), 12)
      user = await createUser(email, tempHash)
      if (!user) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      await grantProductAccess(user.id, 'cde')
    }
    await grantProductAccess(user.id, slug, String(paymentId))
    console.log('[MP webhook] access granted by email', { email, slug })
  }

  return NextResponse.json({ ok: true })
}
