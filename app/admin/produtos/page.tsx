import { getAllProducts } from '@/lib/queries'
import Link from 'next/link'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { toggleProductActive } from './actions'

export default async function AdminProdutosPage() {
  const products = await getAllProducts()

  const typeLabel: Record<string, string> = {
    tool: 'Ferramenta', video: 'Vídeo/Curso', content: 'Conteúdo', service: 'Serviço',
  }
  const accessLabel: Record<string, string> = {
    free: 'Grátis', paid: 'Pago (Stripe)', whatsapp: 'WhatsApp',
  }
  const accessColor: Record<string, string> = {
    free: '#16a34a', paid: '#FF6803', whatsapp: '#25D366',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-black text-2xl" style={{ color: '#0B0501' }}>Produtos</h1>
          <p className="text-sm mt-1" style={{ color: '#6b6b6b' }}>{products.length} produtos cadastrados</p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF6803', color: '#fff' }}
        >
          <Plus size={15} />
          Novo produto
        </Link>
      </div>

      <div className="space-y-3">
        {products.map(p => (
          <div
            key={p.id}
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              backgroundColor: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              opacity: p.is_active ? 1 : 0.5,
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>
                  {p.code}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: `${accessColor[p.access_type]}18`, color: accessColor[p.access_type] }}
                >
                  {accessLabel[p.access_type]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#f0f0f0', color: '#6b6b6b' }}>
                  {typeLabel[p.type]}
                </span>
                {!p.is_active && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fff0f0', color: '#ef4444' }}>
                    Inativo
                  </span>
                )}
              </div>
              <p className="font-black text-base mt-1" style={{ color: '#0B0501' }}>{p.name}</p>
              {p.price && (
                <p className="text-xs mt-0.5 font-mono" style={{ color: '#9a9a9a' }}>
                  R$ {parseFloat(String(p.price)).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <form action={toggleProductActive}>
                <input type="hidden" name="id" value={p.id} />
                <input type="hidden" name="is_active" value={String(!p.is_active)} />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                  style={{ backgroundColor: '#f0f0f0', color: '#6b6b6b' }}
                  title={p.is_active ? 'Desativar' : 'Ativar'}
                >
                  {p.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </form>
              <Link
                href={`/admin/produtos/${p.id}`}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
                style={{ backgroundColor: '#f0f0f0', color: '#6b6b6b' }}
              >
                <Pencil size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
