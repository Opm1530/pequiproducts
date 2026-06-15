'use client'

import { Product } from '@/lib/products'
import { MessageCircle, ShoppingCart, ExternalLink } from 'lucide-react'

type Props = {
  product: Product
  owned?: boolean
  onBuy?: (product: Product) => void
}

export default function ProductCard({ product, owned, onBuy }: Props) {
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMessage ?? '')}`

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ backgroundColor: '#fff' }}
    >
      {owned && (
        <div
          className="absolute top-3 right-3 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#FF6803' }}
        >
          Adquirido
        </div>
      )}

      <div className="h-1 w-full" style={{ backgroundColor: '#FF6803' }} />

      <div className="flex flex-col flex-1 p-6 gap-3">
        <div>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>
            {product.code}
          </span>
          <h3 className="text-base font-black mt-1 leading-tight" style={{ color: '#0B0501' }}>
            {product.name}
          </h3>
        </div>

        <p className="text-sm flex-1 leading-relaxed" style={{ color: '#6b6b6b' }}>
          {product.description}
        </p>

        {product.features && (
          <ul className="space-y-1">
            {product.features.map(f => (
              <li key={f} className="text-xs flex items-center gap-2" style={{ color: '#6b6b6b' }}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#FF6803' }} />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2">
          {owned ? (
            <a
              href={`/produtos/${product.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF6803' }}
            >
              <ExternalLink size={14} />
              Acessar produto
            </a>
          ) : product.type === 'direct' ? (
            <button
              onClick={() => onBuy?.(product)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF6803' }}
            >
              <ShoppingCart size={14} />
              Comprar
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
