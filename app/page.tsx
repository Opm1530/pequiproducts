import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { MessageCircle, ShoppingCart, CheckCircle2, ArrowRight, TrendingUp, Users, Zap } from 'lucide-react'

export default function HomePage() {
  const whatsappBase = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const directProducts = PRODUCTS.filter(p => p.type === 'direct')
  const whatsappProducts = PRODUCTS.filter(p => p.type === 'whatsapp')

  return (
    <div style={{ backgroundColor: '#E8E8E8', color: '#0B0501' }}>

      {/* NAV */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: '#E8E8E8', borderBottom: '1px solid #d0d0d0' }}>
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <span className="font-black text-xl tracking-tight">
            Pequi<span style={{ color: '#FF6803' }}>Products</span>
          </span>

          <nav className="hidden md:flex items-center gap-1 rounded-full px-2 py-1.5" style={{ backgroundColor: '#0B0501' }}>
            {[
              { label: 'Ferramentas', href: '#ferramentas' },
              { label: 'Serviços', href: '#servicos' },
              { label: 'Por que nós', href: '#diferenciais' },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="px-4 py-2 rounded-full text-sm font-medium" style={{ color: '#BFBFBF' }}>
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-sm font-medium" style={{ color: '#0B0501' }}>
              Entrar
            </Link>
            <a
              href="#ferramentas"
              className="px-5 py-2.5 rounded-full text-sm font-semibold"
              style={{ backgroundColor: '#FF6803', color: '#fff' }}
            >
              Ver produtos
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#0B0501' }}>
        {/* Background text */}
        <div
          className="absolute inset-0 flex items-center justify-center font-black pointer-events-none select-none"
          style={{ fontSize: 'clamp(80px, 15vw, 200px)', color: '#ffffff08', letterSpacing: '0.1em', lineHeight: 1 }}
        >
          PEQUI
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ backgroundColor: '#FF680318', color: '#FF6803', border: '1px solid #FF680340' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#FF6803' }} />
              Ferramentas e serviços para e-commerce
            </div>

            <h1 className="font-black leading-[0.9] mb-6" style={{ fontSize: 'clamp(44px, 7vw, 88px)', color: '#fff' }}>
              PARE DE<br />
              PERDER DINHEIRO<br />
              <span style={{ color: '#FF6803' }}>NO ACHISMO.</span>
            </h1>

            <p className="text-lg mb-10 max-w-xl leading-relaxed" style={{ color: '#9a9a9a' }}>
              Calculadoras, criativos prontos e lista de influenciadores — tudo o que você precisa para vender mais no e-commerce, sem enrolação.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="#ferramentas"
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: '#FF6803', color: '#fff' }}
              >
                Quero começar agora
                <ArrowRight size={16} />
              </a>
              <a
                href="#servicos"
                className="flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-all"
                style={{ backgroundColor: '#ffffff12', color: '#fff', border: '1px solid #ffffff20' }}
              >
                Ver serviços
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ backgroundColor: '#FF6803' }}>
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '8', label: 'produtos e serviços' },
              { value: '3', label: 'ferramentas digitais' },
              { value: '100%', label: 'focado em e-commerce' },
              { value: '24h', label: 'suporte pelo WhatsApp' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-black text-2xl text-white">{value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: '#ffffffcc' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              icon: TrendingUp,
              title: 'Investe em anúncio e não retorna',
              text: 'Sem saber sua margem real, você pode estar pagando para vender no prejuízo sem perceber.',
            },
            {
              icon: Zap,
              title: 'Perde horas criando do zero',
              text: 'Criar criativos do zero consome tempo que deveria estar sendo gasto em estratégia e crescimento.',
            },
            {
              icon: Users,
              title: 'Não sabe quais influenciadores usar',
              text: 'Fechar com o influenciador errado é dinheiro jogado fora. A escolha certa faz toda a diferença.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl p-7"
              style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: '#FF680315' }}
              >
                <Icon size={20} style={{ color: '#FF6803' }} />
              </div>
              <h3 className="font-black text-base mb-2" style={{ color: '#0B0501' }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6b6b6b' }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FERRAMENTAS DIGITAIS */}
      <section id="ferramentas" className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-xs tracking-widest block mb-2" style={{ color: '#FF6803' }}>
              1 GRATUITO • ACESSO IMEDIATO • ENTREGA DIGITAL
            </span>
            <h2 className="font-black text-3xl md:text-4xl" style={{ color: '#0B0501' }}>
              Ferramentas que você<br className="hidden md:block" /> usa hoje mesmo
            </h2>
          </div>
          <Link href="/login" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#FF6803' }}>
            Já tenho acesso <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {directProducts.map((product, i) => (
            <div
              key={product.slug}
              className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: i === 0 ? '#0B0501' : '#fff',
                boxShadow: i === 0 ? '0 8px 32px rgba(0,0,0,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {i === 0 && (
                <div className="px-7 pt-5 flex gap-2 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#22c55e20', color: '#16a34a' }}>
                    🎁 Gratuito
                  </span>
                </div>
              )}
              <div className="flex flex-col flex-1 p-7 gap-5">
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

                <p className="text-sm leading-relaxed flex-1" style={{ color: i === 0 ? '#9a9a9a' : '#6b6b6b' }}>
                  {product.description}
                </p>

                {product.features && (
                  <ul className="space-y-2">
                    {product.features.map(f => (
                      <li key={f} className="text-xs flex items-center gap-2" style={{ color: i === 0 ? '#BFBFBF' : '#555' }}>
                        <CheckCircle2 size={13} style={{ color: '#FF6803', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                {product.free ? (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#FF6803', color: '#fff' }}
                  >
                    Acessar grátis
                    <ArrowRight size={15} />
                  </Link>
                ) : (
                  <a
                    href={product.kiwifyUrl ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: '#FF6803', color: '#fff' }}
                  >
                    <ShoppingCart size={15} />
                    Comprar agora
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BANNER CTA */}
      <section className="mx-6 md:mx-auto max-w-7xl mb-16 md:mb-20 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FF6803' }}>
        <div className="px-8 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#ffffffaa' }}>
              Já é cliente?
            </div>
            <h3 className="font-black text-2xl md:text-3xl text-white leading-tight">
              Acesse sua área de membros<br className="hidden md:block" /> e use seus produtos.
            </h3>
          </div>
          <Link
            href="/login"
            className="flex-shrink-0 flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#0B0501', color: '#fff' }}
          >
            Acessar agora
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="max-w-7xl mx-auto px-6 pb-16 md:pb-20">
        <div className="mb-10">
          <span className="font-mono text-xs tracking-widest block mb-2" style={{ color: '#FF6803' }}>
            SERVIÇOS PERSONALIZADOS • VIA WHATSAPP
          </span>
          <h2 className="font-black text-3xl md:text-4xl" style={{ color: '#0B0501' }}>
            Quer um especialista<br className="hidden md:block" /> do seu lado?
          </h2>
          <p className="text-sm mt-3 max-w-lg" style={{ color: '#6b6b6b' }}>
            Nossos serviços são pensados para e-commerces que querem crescer com estratégia, não na tentativa e erro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {whatsappProducts.map(product => {
            const whatsappUrl = `https://wa.me/${whatsappBase}?text=${encodeURIComponent(product.whatsappMessage ?? '')}`
            return (
              <div
                key={product.slug}
                className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
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
                  <ul className="space-y-1.5">
                    {product.features.map(f => (
                      <li key={f} className="text-xs flex items-center gap-2" style={{ color: '#555' }}>
                        <CheckCircle2 size={12} style={{ color: '#FF6803', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0B0501', color: '#fff' }}
                >
                  <MessageCircle size={14} />
                  Falar no WhatsApp
                </a>
              </div>
            )
          })}
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section id="diferenciais" style={{ backgroundColor: '#0B0501' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="mb-10">
            <span className="font-mono text-xs tracking-widest block mb-2" style={{ color: '#FF6803' }}>
              POR QUE A PEQUI SOFT
            </span>
            <h2 className="font-black text-3xl md:text-4xl text-white">
              Não somos mais uma<br className="hidden md:block" /> agência genérica.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Foco 100% em e-commerce',
                text: 'Tudo que fazemos foi pensado para quem vende online. Sem soluções genéricas, sem tempo perdido.',
              },
              {
                title: 'Ferramentas + consultoria no mesmo lugar',
                text: 'Você encontra tanto produtos digitais prontos para usar quanto serviços completos de gestão.',
              },
              {
                title: 'Acesso imediato após a compra',
                text: 'Comprou, recebeu. Sem burocracia. Comece a usar as ferramentas ainda hoje.',
              },
              {
                title: 'Suporte direto, sem fila',
                text: 'Fale com a gente no WhatsApp. Respondemos rápido porque sabemos que seu negócio não espera.',
              },
            ].map(({ title, text }) => (
              <div
                key={title}
                className="rounded-2xl p-7 flex gap-4"
                style={{ backgroundColor: '#ffffff08', border: '1px solid #ffffff12' }}
              >
                <div
                  className="w-2 rounded-full flex-shrink-0 mt-1"
                  style={{ backgroundColor: '#FF6803', height: '100%', minHeight: 40, maxHeight: 40 }}
                />
                <div>
                  <h4 className="font-black text-base text-white mb-2">{title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#9a9a9a' }}>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 text-center">
        <span className="font-mono text-xs tracking-widest block mb-4" style={{ color: '#BFBFBF' }}>
          PRONTO PARA COMEÇAR?
        </span>
        <h2 className="font-black leading-tight mb-4" style={{ fontSize: 'clamp(32px, 5vw, 60px)', color: '#0B0501' }}>
          Seu e-commerce pode vender<br /> muito mais do que vende hoje.
        </h2>
        <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: '#6b6b6b' }}>
          Escolha uma ferramenta, um serviço ou converse com a gente. O próximo passo é seu.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#ferramentas"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: '#FF6803', color: '#fff' }}
          >
            Ver ferramentas
            <ArrowRight size={16} />
          </a>
          <a
            href={`https://wa.me/${whatsappBase}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da Pequi Soft.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all"
            style={{ backgroundColor: '#0B0501', color: '#fff' }}
          >
            <MessageCircle size={16} />
            Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#0B0501', borderTop: '1px solid #ffffff10' }}>
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black text-lg" style={{ color: '#fff' }}>
            Pequi<span style={{ color: '#FF6803' }}>Products</span>
          </span>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-medium" style={{ color: '#BFBFBF' }}>Área de membros</Link>
            <a
              href={`https://wa.me/${whatsappBase}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium"
              style={{ color: '#BFBFBF' }}
            >
              WhatsApp
            </a>
          </div>
          <span className="text-xs" style={{ color: '#555' }}>
            © {new Date().getFullYear()} Pequi Soft. Todos os direitos reservados.
          </span>
        </div>
      </footer>
    </div>
  )
}
