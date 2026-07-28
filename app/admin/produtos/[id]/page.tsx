import { getAllProducts } from '@/lib/queries'
import { notFound } from 'next/navigation'
import ProductForm from '../ProductForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = await getAllProducts()
  const product = products.find(p => p.id === id)
  if (!product) notFound()

  return (
    <div>
      <Link href="/admin/produtos" className="flex items-center gap-1.5 text-sm mb-6" style={{ color: '#6b6b6b' }}>
        <ArrowLeft size={14} /> Voltar
      </Link>
      <h1 className="font-black text-2xl mb-8" style={{ color: '#0B0501' }}>Editar: {product.name}</h1>
      <div className="rounded-2xl p-7 max-w-2xl" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <ProductForm product={product} />
      </div>
    </div>
  )
}
