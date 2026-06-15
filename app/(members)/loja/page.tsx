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
        <h1 className="text-2xl font-bold text-white">Loja</h1>
        <p className="text-gray-400 text-sm mt-1">Todos os nossos produtos em um lugar</p>
      </div>
      <LojaClient products={PRODUCTS} ownedSlugs={ownedSlugs} />
    </div>
  )
}
