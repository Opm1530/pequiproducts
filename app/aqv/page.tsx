import BuyButton from './BuyButton'
import { getProductBySlug } from '@/lib/queries'

export const metadata = { title: 'AQV — Anúncios que Vendem | Pequi Digital' }

const faq = [
  { q: 'Tem garantia?', a: 'Sim! Você terá garantia total de 7 dias, podendo solicitar o reembolso pela própria plataforma caso seja necessário.' },
  { q: 'Quanto custa?', a: 'O AQV custa apenas {priceLabel} e isso já inclui atualizações futuras.' },
  { q: 'Posso copiar os conteúdos?', a: 'Sim. Utilize como uma fonte de ideias e referência para produzir seus anúncios conforme a cara da sua marca, pois conteúdo autêntico vende mais!' },
]

function formatPrice(price: number | string | null) {
  if (!price) return null
  return parseFloat(String(price)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function AqvPage() {
  const product = await getProductBySlug('aqv')
  const priceLabel = formatPrice(product?.price ?? null) ?? 'R$29,90'
  return (
    <main style={{ backgroundColor: '#0B0501', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#F5F0E8' }}>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#FF680318', border: '1px solid #FF680340', borderRadius: 100, padding: '6px 16px', marginBottom: 32 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF6803' }}>Moda Fitness</span>
        </div>

        <div style={{ position: 'relative', marginBottom: 8 }}>
          <span style={{ fontSize: 'clamp(120px, 22vw, 200px)', fontWeight: 900, lineHeight: 0.9, color: '#FF6803', opacity: 0.12, display: 'block', userSelect: 'none', letterSpacing: '-4px' }}>25</span>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1.1, textWrap: 'balance', margin: 0 }}>
              +25 modelos de anúncios<br />
              <span style={{ color: '#FF6803' }}>que vendem</span> para marcas<br />de Moda Fitness
            </h1>
          </div>
        </div>

        <p style={{ fontSize: 18, lineHeight: 1.7, color: '#C4BDB5', maxWidth: 520, margin: '40px auto 40px' }}>
          Copie, adapte e publique. Uma biblioteca curada de referências reais monitoradas nas maiores marcas do segmento.
        </p>

        <BuyButton
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            backgroundColor: '#FF6803', color: '#0B0501', border: 'none',
            padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 800,
            cursor: 'pointer', letterSpacing: '0.01em',
          } as React.CSSProperties}
        >
          Quero o AQV por {priceLabel}
        </BuyButton>

        <p style={{ marginTop: 12, fontSize: 13, color: '#7A7068' }}>7 dias de garantia · Acesso imediato</p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#1E1710', maxWidth: 720, margin: '0 auto' }} />

      {/* O que é */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 16 }}>O que é o AQV</p>
        <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 24, textWrap: 'balance' }}>
          Uma biblioteca de referências criada por quem gerencia e-commerces de moda fitness
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#C4BDB5', marginBottom: 16 }}>
          O Anúncios que Vendem conta com mais de 25 modelos de anúncios para você copiar e colar na sua marca. Aqui você encontrará um guia que mostra o conteúdo a ser replicado e como reproduzir o mesmo.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#C4BDB5', marginBottom: 16 }}>
          O AQV terá sempre <strong style={{ color: '#F5F0E8' }}>atualizações mensais</strong> para trazer novos anúncios que estejam em alta.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#C4BDB5' }}>
          Essa biblioteca foi criada por <strong style={{ color: '#F5F0E8' }}>Heitor Santin</strong> a partir do monitoramento de grandes marcas do ramo de moda fitness. Atualmente gerencia 5 e-commerces nesse nicho e por esse motivo está sempre de olho no que está vendendo e gerando resultados.
        </p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#1E1710', maxWidth: 720, margin: '0 auto' }} />

      {/* Para quem */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 24 }}>Para quem é</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['Marcas de moda (fitness ou não)', 'Fábricas', 'Revendedoras'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px', backgroundColor: '#130E09', borderRadius: 16, border: '1px solid #1E1710' }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{item}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <BuyButton
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              backgroundColor: '#FF6803', color: '#0B0501', border: 'none',
              padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 800,
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            Quero o AQV por {priceLabel}
          </BuyButton>
          <p style={{ marginTop: 12, fontSize: 13, color: '#7A7068' }}>7 dias de garantia · Acesso imediato</p>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#1E1710', maxWidth: 720, margin: '0 auto' }} />

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 32 }}>Dúvidas frequentes</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faq.map(({ q, a }) => (
            <div key={q} style={{ padding: '24px 0', borderBottom: '1px solid #1E1710' }}>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{q}</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#C4BDB5', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <BuyButton
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              backgroundColor: '#FF6803', color: '#0B0501', border: 'none',
              padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 800,
              cursor: 'pointer',
            } as React.CSSProperties}
          >
            Quero o AQV por {priceLabel}
          </BuyButton>
          <p style={{ marginTop: 12, fontSize: 13, color: '#7A7068' }}>7 dias de garantia · Acesso imediato</p>
        </div>
      </section>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid #1E1710' }}>
        <p style={{ fontSize: 13, color: '#7A7068' }}>© {new Date().getFullYear()} Pequi Digital. Todos os direitos reservados.</p>
      </div>
    </main>
  )
}
