import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/mp'
import { getUserByEmail, createUser, grantProductAccess } from '@/lib/queries'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body) return NextResponse.json({ ok: true })

  // MP envia topic=payment com data.id
  const topic = body.type ?? body.topic
  const paymentId = body.data?.id ?? body.id

  if (topic !== 'payment' || !paymentId) {
    return NextResponse.json({ ok: true, action: 'ignored' })
  }

  const payment = await getPayment().get({ id: String(paymentId) })

  if (payment.status !== 'approved') {
    return NextResponse.json({ ok: true, action: 'not_approved' })
  }

  const email = payment.payer?.email?.toLowerCase().trim()
  const slug = payment.metadata?.product_slug as string | undefined

  if (!email || !slug) {
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

  return NextResponse.json({ ok: true })
}
