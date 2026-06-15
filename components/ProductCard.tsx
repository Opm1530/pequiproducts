'use client'

import { Product } from '@/lib/products'
import { MessageCircle, ShoppingCart, Lock, ExternalLink } from 'lucide-react'

type Props = {
  product: Product
  owned?: boolean
  onBuy?: (product: Product) => void
}

export default function ProductCard({ product, owned, onBuy }: Props) {
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMessage ?? '')}`

  return (
    <div className="relative flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
      {owned && (
        <div className="absolute top-3 right-3 bg-violet-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          Adquirido
        </div>
      )}

      <div className={`h-1.5 w-full bg-gradient-to-r ${product.color}`} />

      <div className="flex flex-col flex-1 p-6 gap-3">
        <div>
          <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">
            {product.code}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
        </div>

        <p className="text-sm text-gray-400 flex-1">{product.description}</p>

        {product.features && (
          <ul className="space-y-1">
            {product.features.map(f => (
              <li key={f} className="text-xs text-gray-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2">
          {owned ? (
            <a
              href={`/produtos/${product.slug}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              <ExternalLink size={15} />
              Acessar produto
            </a>
          ) : product.type === 'direct' ? (
            <button
              onClick={() => onBuy?.(product)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
            >
              <ShoppingCart size={15} />
              Comprar
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold transition-colors"
            >
              <MessageCircle size={15} />
              Falar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
