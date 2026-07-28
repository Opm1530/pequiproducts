import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getUserByEmail, createUser, grantProductAccess, getProductByStripePrice } from '@/lib/queries'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ ok: true, action: 'ignored' })
  }

  const session = event.data.object
  const email = session.customer_email?.toLowerCase().trim()
  const productSlug = session.metadata?.product_slug
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
  const priceId = lineItems.data[0]?.price?.id

  // Resolve slug via metadata (preferred) or via price ID
  let slug = productSlug
  if (!slug && priceId) {
    const product = await getProductByStripePrice(priceId)
    slug = product?.slug
  }

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

  await grantProductAccess(user.id, slug, session.id)

  return NextResponse.json({ ok: true })
}
