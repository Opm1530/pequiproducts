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

  const email = payment.payer?.email?.toLowerCase().trim()
  const slug = (payment.metadata as Record<string, string> | null)?.product_slug

  if (!email || !slug) {
    console.error('[MP webhook] Missing email or slug', { email, slug })
    return NextResponse.json({ error: 'Missing email or product' }, { status: 400 })
  }

  let user = await getUserByEmail(email)
  if (!user) {
    const tempHash = await bcrypt.hash(crypto.randomUUID(), 12)
    user = await createUser(email, tempHash)
    if (!user) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    await grantProductAccess(user.id, 'cde')
  }

  await grantProductAccess(user.id, slug, String(paymentId))
  console.log('[MP webhook] access granted', { email, slug })

  return NextResponse.json({ ok: true })
}
