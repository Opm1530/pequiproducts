import BuyButton from './BuyButton'

export const metadata = { title: 'EQV — E-commerce que Vende | Pequi Digital' }

const learnings = [
  'Como construir ou otimizar sua loja',
  '5 modelos de anúncio que vendem',
  'Como fazer tráfego pago para e-commerce',
  'Estratégia de Marketing para moda fitness',
]

const faq = [
  { q: 'Tem garantia?', a: 'Sim! Você terá garantia total de 7 dias, podendo solicitar o reembolso pela própria plataforma caso seja necessário.' },
  { q: 'Quanto custa?', a: 'O EQV custa apenas R$29,90 e isso já inclui atualizações futuras.' },
  { q: 'Posso contratar o time de vocês?', a: 'Claro! Nossa equipe está à disposição para gerenciar seu tráfego, criar conteúdos, automatizar processos da loja e praticamente tudo o que engloba o marketing e as vendas da marca.' },
]

const btnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center',
  backgroundColor: '#FF6803', color: '#fff', border: 'none',
  padding: '18px 44px', borderRadius: 100, fontSize: 16, fontWeight: 800,
  cursor: 'pointer', letterSpacing: '0.01em',
}

export default function EqvPage() {
  return (
    <main style={{ backgroundColor: '#090F0A', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: '#F0F5F1' }}>

      {/* Hero */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 64px' }}>
        <div style={{ display: 'inline-block', backgroundColor: '#FF680318', border: '1px solid #FF680340', borderRadius: 100, padding: '6px 16px', marginBottom: 40 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF6803' }}>E-commerce · Moda Fitness</span>
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 32, textWrap: 'balance' }}>
          VENDA TODO DIA<br />
          <span style={{ color: '#FF6803' }}>no e-commerce</span><br />
          <span style={{ fontSize: '0.65em', fontWeight: 700, color: '#8FAF94' }}>com uma estratégia específica para moda fitness</span>
        </h1>

        {/* O que você vai aprender */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 44 }}>
          {learnings.map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#FF6803', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 900, color: '#fff' }}>✓</span>
              <span style={{ fontSize: 17, fontWeight: 600 }}>{item}</span>
            </div>
          ))}
        </div>

        <BuyButton style={btnStyle}>
          Quero o EQV por R$29,90
        </BuyButton>
        <p style={{ marginTop: 12, fontSize: 13, color: '#6A7F6D' }}>7 dias de garantia · Acesso imediato</p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#141F15', maxWidth: 720, margin: '0 auto' }} />

      {/* Credibilidade */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 24 }}>Como vou saber que funciona?</p>

        <div style={{ padding: '32px', backgroundColor: '#0E160F', borderRadius: 20, border: '1px solid #1A2B1B', marginBottom: 24 }}>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: '#C4D9C7', margin: 0 }}>
            Somos uma agência de marketing especialista em e-commerces, e dentro do nosso portfólio atualmente atendemos <strong style={{ color: '#F0F5F1' }}>5 marcas específicas do ramo de moda fitness</strong>. A partir de testes, erros, acertos e otimizações, encontramos o passo-a-passo capaz de fazer marcas do ramo gerarem resultados.
          </p>
        </div>

        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#8FAF94' }}>
          Resolvemos criar esse produto pois entendemos que nem todas as marcas possuem condições ainda de contratar nossos serviços, logo, resolvemos ensiná-las a fazer o básico bem feito que gera resultados. Preparando assim o seu negócio para alcançar patamares maiores e quem sabe fazer uma parceria conosco.
        </p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#141F15', maxWidth: 720, margin: '0 auto' }} />

      {/* Preço */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 16 }}>Quanto custa?</p>
        <div style={{ fontSize: 'clamp(52px, 10vw, 88px)', fontWeight: 900, color: '#F0F5F1', lineHeight: 1, marginBottom: 8 }}>
          R$<span style={{ color: '#FF6803' }}>29</span><span style={{ fontSize: '0.5em' }}>,90</span>
        </div>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#8FAF94', maxWidth: 520, margin: '16px auto 40px' }}>
          É um preço simbólico para cobrir os gastos que tivemos para te trazer até aqui. Nessa operação, ganhamos quando seu e-commerce passa a ter resultados e você resolve escalar a operação.
        </p>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#C4D9C7', maxWidth: 520, margin: '0 auto 40px', fontStyle: 'italic' }}>
          &ldquo;Encare esse investimento como um presente nosso para sua marca. O que mais queremos é que você tenha resultados!&rdquo;
        </p>

        <BuyButton style={btnStyle}>
          Quero o EQV por R$29,90
        </BuyButton>
        <p style={{ marginTop: 12, fontSize: 13, color: '#6A7F6D' }}>7 dias de garantia · Acesso imediato</p>
      </section>

      {/* Divider */}
      <div style={{ height: 1, backgroundColor: '#141F15', maxWidth: 720, margin: '0 auto' }} />

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF6803', marginBottom: 32 }}>Dúvidas frequentes</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faq.map(({ q, a }) => (
            <div key={q} style={{ padding: '24px 0', borderBottom: '1px solid #141F15' }}>
              <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{q}</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#8FAF94', margin: 0 }}>{a}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <BuyButton style={btnStyle}>
            Quero o EQV por R$29,90
          </BuyButton>
          <p style={{ marginTop: 12, fontSize: 13, color: '#6A7F6D' }}>7 dias de garantia · Acesso imediato</p>
        </div>
      </section>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 24px', borderTop: '1px solid #141F15' }}>
        <p style={{ fontSize: 13, color: '#6A7F6D' }}>© {new Date().getFullYear()} Pequi Digital. Todos os direitos reservados.</p>
      </div>
    </main>
  )
}
