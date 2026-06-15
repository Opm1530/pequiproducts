import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserProducts } from '@/lib/queries'
import { PRODUCTS } from '@/lib/products'
import LojaClient from './LojaClient'

export default async function LojaPage() {
  const user = await getSession()
  if (!user) redirect('/login')

  const ownedSlugs = await getUserProducts(user.id)

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest block mb-1" style={{ color: '#BFBFBF' }}>
          VITRINE COMPLETA
        </span>
        <h1 className="font-black text-3xl" style={{ color: '#0B0501' }}>Loja</h1>
        <p className="text-sm mt-1" style={{ color: '#6b6b6b' }}>Todos os nossos produtos em um lugar</p>
      </div>
      <LojaClient products={PRODUCTS} ownedSlugs={ownedSlugs} />
    </div>
  )
}
