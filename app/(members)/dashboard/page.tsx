import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserProducts } from '@/lib/queries'
import { PRODUCTS } from '@/lib/products'
import Link from 'next/link'
import { ExternalLink, ShoppingBag } from 'lucide-react'

export default async function DashboardPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const ownedSlugs = await getUserProducts(user.id)
  const ownedProducts = PRODUCTS.filter(p => ownedSlugs.includes(p.slug))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Meus Produtos</h1>
        <p className="text-gray-400 text-sm mt-1">Produtos que você adquiriu</p>
      </div>

      {ownedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag size={48} className="text-gray-700 mb-4" />
          <h2 className="text-white font-semibold text-lg mb-2">Nenhum produto ainda</h2>
          <p className="text-gray-500 text-sm mb-6">Explore nossa loja e adquira seu primeiro produto.</p>
          <Link href="/loja" className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
            Ver loja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ownedProducts.map(product => (
            <div key={product.slug} className="flex flex-col rounded-2xl border border-violet-500/30 bg-violet-950/20 overflow-hidden">
              <div className={`h-1.5 w-full bg-gradient-to-r ${product.color}`} />
              <div className="flex flex-col flex-1 p-6 gap-3">
                <div>
                  <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">{product.code}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
                </div>
                <p className="text-sm text-gray-400 flex-1">{product.description}</p>
                <Link
                  href={`/produtos/${product.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors mt-2"
                >
                  <ExternalLink size={15} />
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
