import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { MessageCircle, ShoppingCart, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const whatsappBase = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''

  return (
    <main className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10 max-w-7xl mx-auto">
        <span className="text-white font-bold text-xl tracking-tight">
          Pequi<span className="text-violet-400">Products</span>
        </span>
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          Área de membros <ArrowRight size={15} />
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-950/60 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-300 text-sm mb-6">
          Pequi Soft · Soluções para E-commerce
        </div>
        <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-4">
          Ferramentas que fazem<br />
          <span className="text-violet-400">seu e-commerce vender mais</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Da calculadora de captação às melhores influenciadoras do seu nicho — tudo em um lugar.
        </p>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS.map(product => {
            const whatsappUrl = `https://wa.me/${whatsappBase}?text=${encodeURIComponent(product.whatsappMessage ?? '')}`
            return (
              <div
                key={product.slug}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur overflow-hidden hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1"
              >
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
                    {product.type === 'direct' ? (
                      <a
                        href={product.kiwifyUrl ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
                      >
                        <ShoppingCart size={15} />
                        Comprar
                      </a>
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
          })}
        </div>
      </section>
    </main>
  )
}
