import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getProductBySlug } from '@/lib/queries'
import { stripe } from '@/lib/stripe'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.access_type !== 'paid' || !product.stripe_price_id) {
    return NextResponse.json({ error: 'Produto inválido ou sem preço configurado' }, { status: 400 })
  }

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_BASE_URL ?? ''

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: product.stripe_price_id, quantity: 1 }],
    customer_email: user.email,
    metadata: { user_id: user.id, product_slug: slug },
    success_url: `${origin}/dashboard?success=1`,
    cancel_url: `${origin}/loja`,
  })

  return NextResponse.json({ url: session.url })
}
