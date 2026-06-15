import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { MessageCircle, ShoppingCart } from 'lucide-react'

export default function HomePage() {
  const whatsappBase = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const directProducts = PRODUCTS.filter(p => p.type === 'direct')
  const whatsappProducts = PRODUCTS.filter(p => p.type === 'whatsapp')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E8E8', color: '#0B0501' }}>

      {/* NAV */}
      <header className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <span className="font-black text-xl tracking-tight" style={{ color: '#0B0501' }}>
          Pequi<span style={{ color: '#FF6803' }}>Products</span>
        </span>

        <nav className="hidden md:flex items-center gap-1 rounded-full px-2 py-2" style={{ backgroundColor: '#0B0501' }}>
          {['Início', 'Produtos', 'Ferramentas', 'Contato'].map((item, i) => (
            <a
              key={item}
              href={i === 0 ? '#' : `#${item.toLowerCase()}`}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={i === 0
                ? { backgroundColor: '#2a2a2a', color: '#fff' }
                : { color: '#BFBFBF' }
              }
            >
              {item}
            </a>
          ))}
        </nav>

        <Link
          href="/login"
          className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
          style={{ backgroundColor: '#0B0501', color: '#fff' }}
        >
          Login / Entrar
        </Link>
      </header>

      {/* HERO */}
      <section className="relative max-w-7xl mx-auto px-8 pt-12 pb-20 overflow-hidden">

        {/* Background display text */}
        <div
          className="absolute bottom-0 left-0 right-0 text-center font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(60px, 12vw, 160px)', color: '#fff', opacity: 0.5, letterSpacing: '0.05em' }}
        >
          PEQUI SOFT
        </div>

        {/* Social icons */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-10">
          {['IG', 'FB', 'X'].map(label => (
            <a
              key={label}
              href="#"
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:opacity-70"
              style={{ backgroundColor: '#0B0501', color: '#fff' }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <span className="font-mono text-xs tracking-widest mb-4 block" style={{ color: '#BFBFBF' }}>
              [1/8] PRODUTOS DISPONÍVEIS
            </span>

            <h1 className="font-black leading-[0.95] mb-6" style={{ fontSize: 'clamp(42px, 6vw, 76px)', color: '#0B0501' }}>
              FERRAMENTAS<br />
              <span style={{ color: '#FF6803' }}>QUE FAZEM</span><br />
              VENDER MAIS
            </h1>

            <p className="text-base max-w-sm mb-8 leading-relaxed" style={{ color: '#6b6b6b' }}>
              Da calculadora de captação às melhores influenciadoras do seu nicho — tudo em um lugar.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="#produtos"
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF6803', color: '#fff' }}
              >
                Ver produtos
              </a>
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-semibold text-sm transition-all"
                style={{ backgroundColor: '#BFBFBF', color: '#0B0501' }}
              >
                Área de membros
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-6">
            <div className="rounded-2xl p-8 text-right" style={{ backgroundColor: '#fff' }}>
              <div className="font-black leading-none mb-1" style={{ fontSize: 64, color: '#FF6803' }}>
                3+
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#BFBFBF' }}>
                Ferramentas digitais
              </div>
              <p className="text-xs mt-2 max-w-[180px] ml-auto leading-relaxed" style={{ color: '#6b6b6b' }}>
                Prontas para escalar seu e-commerce agora.
              </p>
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: '#0B0501' }}>
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: '#FF6803' }}>Pequi Soft</div>
              <div className="font-bold text-white text-sm">Soluções para E-commerce</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUTOS DIRETOS */}
      <section id="produtos" className="max-w-7xl mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="font-mono text-xs tracking-widest block mb-2" style={{ color: '#BFBFBF' }}>
              ACESSO IMEDIATO
            </span>
            <h2 className="font-black text-3xl" style={{ color: '#0B0501' }}>Compre agora</h2>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold underline underline-offset-4"
            style={{ color: '#FF6803' }}
          >
            Já é membro? Entre aqui →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {directProducts.map((product, i) => (
            <div
              key={product.slug}
              className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: i === 0 ? '#0B0501' : '#fff' }}
            >
              <div className="h-1 w-full" style={{ backgroundColor: '#FF6803' }} />
              <div className="flex flex-col flex-1 p-7 gap-4">
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>
                    {product.code}
                  </span>
                  <h3
                    className="text-xl font-black mt-1 leading-tight"
                    style={{ color: i === 0 ? '#fff' : '#0B0501' }}
                  >
                    {product.name}
                  </h3>
                </div>
                <p className="text-sm flex-1 leading-relaxed" style={{ color: i === 0 ? '#BFBFBF' : '#6b6b6b' }}>
                  {product.description}
                </p>
                <a
                  href={product.kiwifyUrl ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#FF6803', color: '#fff' }}
                >
                  <ShoppingCart size={15} />
                  Comprar
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VITRINE WHATSAPP */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="mb-10">
          <span className="font-mono text-xs tracking-widest block mb-2" style={{ color: '#BFBFBF' }}>
            SERVIÇOS SOB MEDIDA
          </span>
          <h2 className="font-black text-3xl" style={{ color: '#0B0501' }}>Fale com a gente</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {whatsappProducts.map(product => {
            const whatsappUrl = `https://wa.me/${whatsappBase}?text=${encodeURIComponent(product.whatsappMessage ?? '')}`
            return (
              <div
                key={product.slug}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#fff' }}
              >
                <div>
                  <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>
                    {product.code}
                  </span>
                  <h3 className="font-black text-base mt-1 leading-tight" style={{ color: '#0B0501' }}>
                    {product.name}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed flex-1" style={{ color: '#6b6b6b' }}>
                  {product.description}
                </p>
                {product.features && (
                  <ul className="space-y-1">
                    {product.features.map(f => (
                      <li key={f} className="text-xs flex items-center gap-2" style={{ color: '#6b6b6b' }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#FF6803' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0B0501', color: '#fff' }}
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>
            )
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-8" style={{ backgroundColor: '#0B0501' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-black text-lg" style={{ color: '#fff' }}>
            Pequi<span style={{ color: '#FF6803' }}>Products</span>
          </span>
          <span className="text-xs" style={{ color: '#BFBFBF' }}>
            © {new Date().getFullYear()} Pequi Soft
          </span>
        </div>
      </footer>
    </div>
  )
}
