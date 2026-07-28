'use client'

import { DbProduct } from '@/lib/queries'
import { CheckCircle2, ExternalLink, ShoppingCart, MessageCircle } from 'lucide-react'
import { useState } from 'react'

type Props = {
  products: DbProduct[]
  ownedSlugs: string[]
  whatsappNumber: string
}

function ProductCard({ product, owned, whatsappNumber }: { product: DbProduct; owned: boolean; whatsappNumber: string }) {
  const [loading, setLoading] = useState(false)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(product.whatsapp_message ?? '')}`

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch(`/api/checkout/${product.slug}`, { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  const features = Array.isArray(product.features) ? product.features : []

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
    >
      {owned && (
        <div className="absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#FF6803' }}>
          Adquirido
        </div>
      )}
      {!owned && product.access_type === 'free' && (
        <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#22c55e20', color: '#16a34a', border: '1px solid #22c55e40' }}>
          Grátis
        </div>
      )}

      <div className="h-1 w-full" style={{ backgroundColor: '#FF6803' }} />

      <div className="flex flex-col flex-1 p-6 gap-3">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>{product.code}</span>
          <h3 className="text-base font-black mt-1 leading-tight" style={{ color: '#0B0501' }}>{product.name}</h3>
        </div>

        <p className="text-sm flex-1 leading-relaxed" style={{ color: '#6b6b6b' }}>{product.description}</p>

        {features.length > 0 && (
          <ul className="space-y-1">
            {features.map(f => (
              <li key={f} className="text-xs flex items-center gap-2" style={{ color: '#6b6b6b' }}>
                <CheckCircle2 size={12} style={{ color: '#FF6803', flexShrink: 0 }} />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2">
          {owned || product.access_type === 'free' ? (
            <a
              href={`/produtos/${product.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF6803' }}
            >
              <ExternalLink size={14} />
              {product.access_type === 'free' && !owned ? 'Acessar grátis' : 'Acessar produto'}
            </a>
          ) : product.access_type === 'paid' ? (
            <button
              onClick={handleBuy}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#FF6803' }}
            >
              <ShoppingCart size={14} />
              {loading ? 'Aguarde...' : 'Comprar'}
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#0B0501' }}
            >
              <MessageCircle size={14} />
              Falar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LojaClient({ products, ownedSlugs, whatsappNumber }: Props) {
  const owned = products.filter(p => ownedSlugs.includes(p.slug))
  const available = products.filter(p => !ownedSlugs.includes(p.slug))

  return (
    <div className="space-y-10">
      {owned.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF6803' }}>Já adquiridos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {owned.map(p => <ProductCard key={p.slug} product={p} owned whatsappNumber={whatsappNumber} />)}
          </div>
        </div>
      )}
      <div>
        {owned.length > 0 && (
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#BFBFBF' }}>Disponíveis</h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {available.map(p => <ProductCard key={p.slug} product={p} owned={false} whatsappNumber={whatsappNumber} />)}
        </div>
      </div>
    </div>
  )
}
