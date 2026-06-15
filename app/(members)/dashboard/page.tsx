import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserProducts } from '@/lib/queries'
import { PRODUCTS } from '@/lib/products'
import Link from 'next/link'
import { ShoppingBag, ExternalLink } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const ownedSlugs = await getUserProducts(user.id)
  const ownedProducts = PRODUCTS.filter(p => ownedSlugs.includes(p.slug))

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest block mb-1" style={{ color: '#BFBFBF' }}>
          ÁREA DE MEMBROS
        </span>
        <h1 className="font-black text-3xl" style={{ color: '#0B0501' }}>Meus Produtos</h1>
        <p className="text-sm mt-1" style={{ color: '#6b6b6b' }}>Produtos que você adquiriu</p>
      </div>

      {ownedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ backgroundColor: '#fff' }}>
          <ShoppingBag size={48} className="mb-4" style={{ color: '#BFBFBF' }} />
          <h2 className="font-black text-lg mb-2" style={{ color: '#0B0501' }}>Nenhum produto ainda</h2>
          <p className="text-sm mb-6" style={{ color: '#6b6b6b' }}>Explore nossa loja e adquira seu primeiro produto.</p>
          <Link
            href="/loja"
            className="px-6 py-3 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#FF6803' }}
          >
            Ver loja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ownedProducts.map(product => (
            <div
              key={product.slug}
              className="flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#fff' }}
            >
              <div className="h-1 w-full" style={{ backgroundColor: '#FF6803' }} />
              <div className="flex flex-col flex-1 p-6 gap-3">
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>
                    {product.code}
                  </span>
                  <h3 className="text-lg font-black mt-1" style={{ color: '#0B0501' }}>{product.name}</h3>
                </div>
                <p className="text-sm flex-1 leading-relaxed" style={{ color: '#6b6b6b' }}>{product.description}</p>
                <Link
                  href={`/produtos/${product.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 mt-2"
                  style={{ backgroundColor: '#FF6803' }}
                >
                  <ExternalLink size={14} />
                  Acessar produto
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
