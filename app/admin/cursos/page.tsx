import { getAllProducts } from '@/lib/queries'
import Link from 'next/link'
import { BookOpen, Settings } from 'lucide-react'

export default async function AdminCursosPage() {
  const products = await getAllProducts()
  const courses = products.filter(p => p.type === 'course')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div className="flex items-center gap-3">
          <BookOpen size={22} style={{ color: '#FF6803' }} />
          <div>
            <h1 className="font-black text-2xl" style={{ color: '#0B0501' }}>Cursos</h1>
            <p className="text-sm" style={{ color: '#9a9a9a' }}>{courses.length} curso{courses.length !== 1 ? 's' : ''} cadastrado{courses.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <BookOpen size={40} style={{ color: '#BFBFBF', margin: '0 auto 16px' }} />
            <p className="font-semibold" style={{ color: '#0B0501' }}>Nenhum curso cadastrado</p>
            <p className="text-sm mt-1" style={{ color: '#9a9a9a' }}>Crie um produto do tipo &quot;Curso&quot; na página de Produtos.</p>
            <Link href="/admin/produtos"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: '#FF6803' }}>
              Ir para Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-4 rounded-2xl" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div>
                  <p className="font-black" style={{ color: '#0B0501' }}>{c.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9a9a9a' }}>/{c.slug} · {c.is_active ? 'Ativo' : 'Inativo'}</p>
                </div>
                <Link href={`/admin/cursos/${c.slug}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ backgroundColor: '#FF6803', color: '#fff' }}>
                  <Settings size={14} /> Editar conteúdo
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
