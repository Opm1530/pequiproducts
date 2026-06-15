export type ProductSlug = 'cde' | 'bdaqv' | 'bdi' | 'atq' | 'cdl' | 'pe' | 'pl' | 'pp'

export type Product = {
  slug: ProductSlug
  code: string
  name: string
  description: string
  type: 'direct' | 'whatsapp'
  kiwifyUrl?: string
  whatsappMessage?: string
  features?: string[]
  free?: boolean
  color: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'cde',
    code: 'CDE',
    name: 'Calculadora de Ecom',
    description: 'Saiba exatamente quanto investir, qual margem praticar e quando escalar — antes de gastar R$1 em anúncio. Funciona para qualquer nicho.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_CDE_URL,
    features: ['Cálculo de margem e ticket médio', 'ROI e ponto de equilíbrio', 'Projeção de faturamento', 'Funciona para qualquer nicho'],
    free: true,
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'bdaqv',
    code: 'BDAQV',
    name: 'Banco de Criativos que Vendem',
    description: 'Centenas de criativos testados e aprovados, organizados por nicho. Pare de criar do zero e comece a usar o que já comprovadamente converte.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_BDAQV_URL,
    features: ['Criativos segmentados por nicho', 'Formatos para feed, stories e reels', 'Atualizações periódicas', 'Prontos para veicular'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'bdi',
    code: 'BDI',
    name: 'Lista de Influenciadores',
    description: 'Base curada de influenciadores prontos para fechar parceria. Encontre os perfis certos para o seu nicho e expanda seu alcance sem achismo.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_BDI_URL,
    features: ['Influenciadores por nicho e segmento', 'Dados de contato e perfil', 'Filtros por tamanho de audiência', 'Atualizações periódicas'],
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'atq',
    code: 'ATQ',
    name: 'Autoqui',
    description: 'A solução ideal para quem está começando ou quer automatizar processos de venda sem complexidade. Entre em contato e saiba mais.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no ATQ - Autoqui. Pode me passar mais informações?',
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'cdl',
    code: 'CDL',
    name: 'Criação de Loja',
    description: 'Sua loja online do zero, pronta para vender. Design profissional, estrutura otimizada para conversão e integração com os principais meios de pagamento.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse na CDL - Criação de Loja. Pode me passar mais informações?',
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pe',
    code: 'P.E',
    name: 'Pequi Express',
    description: 'Loja criada ou otimizada, Instagram profissional e 2 meses de acompanhamento próximo. O pacote completo para quem quer resultado rápido.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.E - Pequi Express. Pode me passar mais informações?',
    features: ['Criação ou otimização de e-commerce', 'Instagram 10x', '2 meses de acompanhamento'],
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pl',
    code: 'P.L',
    name: 'Pequi Light',
    description: 'Otimização da sua loja, presença no Instagram e gestão de anúncios para escalar suas vendas de forma consistente.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.L - Pequi Light. Pode me passar mais informações?',
    features: ['Otimização de e-commerce', 'Instagram 10x', 'Escala Ads'],
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pp',
    code: 'P.P',
    name: 'Pequi Prime',
    description: 'Nossa solução mais completa. Loja otimizada, Instagram, anúncios em escala e presença em marketplaces. Para quem quer dominar o mercado.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.P - Pequi Prime. Pode me passar mais informações?',
    features: ['Otimização de e-commerce', 'Instagram 10x', 'Escala Ads', 'Marketplace Pro'],
    color: 'from-slate-500 to-slate-700',
  },
]

export const DIRECT_PRODUCTS = PRODUCTS.filter(p => p.type === 'direct')
export const WHATSAPP_PRODUCTS = PRODUCTS.filter(p => p.type === 'whatsapp')
export const getProduct = (slug: ProductSlug) => PRODUCTS.find(p => p.slug === slug)
