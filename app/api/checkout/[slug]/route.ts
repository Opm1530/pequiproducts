import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getProductBySlug } from '@/lib/queries'
import { getPreference } from '@/lib/mp'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.access_type !== 'paid' || !product.price) {
    return NextResponse.json({ error: 'Produto inválido ou sem preço configurado' }, { status: 400 })
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''

  const preference = await getPreference().create({
    body: {
      items: [{
        id: product.slug,
        title: product.name,
        quantity: 1,
        unit_price: parseFloat(String(product.price)),
        currency_id: 'BRL',
      }],
      payer: { email: user.email },
      metadata: { user_id: user.id, product_slug: slug },
      back_urls: {
        success: `${base}/dashboard?success=1`,
        failure: `${base}/loja`,
        pending: `${base}/dashboard?pending=1`,
      },
      auto_return: 'approved',
      notification_url: `${base}/api/webhooks/mercadopago`,
    },
  })

  return NextResponse.json({ url: preference.init_point })
}
