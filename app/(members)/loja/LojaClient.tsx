'use client'

import { Product } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

type Props = {
  products: Product[]
  ownedSlugs: string[]
}

export default function LojaClient({ products, ownedSlugs }: Props) {
  function handleBuy(product: Product) {
    if (product.kiwifyUrl) {
      window.open(product.kiwifyUrl, '_blank')
    }
  }

  const owned = products.filter(p => ownedSlugs.includes(p.slug))
  const available = products.filter(p => !ownedSlugs.includes(p.slug))

  return (
    <div className="space-y-10">
      {owned.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF6803' }}>
            Já adquiridos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {owned.map(p => (
              <ProductCard key={p.slug} product={p} owned onBuy={handleBuy} />
            ))}
          </div>
        </div>
      )}

      <div>
        {owned.length > 0 && (
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#BFBFBF' }}>
            Disponíveis
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {available.map(p => (
            <ProductCard key={p.slug} product={p} owned={false} onBuy={handleBuy} />
          ))}
        </div>
      </div>
    </div>
  )
}
