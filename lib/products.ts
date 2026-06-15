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
  color: string
}

export const PRODUCTS: Product[] = [
  {
    slug: 'cde',
    code: 'CDE',
    name: 'Calculadora de Ecom',
    description: 'Serve para todos os públicos e nichos. É a base da captação.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_CDE_URL,
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'bdaqv',
    code: 'BDAQV',
    name: 'Banco de Criativos que vendem',
    description: 'Precisa ser segmentado conforme os mercados do nicho.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_BDAQV_URL,
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'bdi',
    code: 'BDI',
    name: 'Lista de Influenciadores',
    description: 'Pode ou não segmentar... depende da quantidade que queremos colocar.',
    type: 'direct',
    kiwifyUrl: process.env.NEXT_PUBLIC_KIWIFY_BDI_URL,
    color: 'from-violet-500 to-purple-600',
  },
  {
    slug: 'atq',
    code: 'ATQ',
    name: 'Autoqui',
    description: 'Serve como upsell ou produto de transição para leads menos qualificados.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no produto ATQ - Autoqui.',
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'cdl',
    code: 'CDL',
    name: 'Criação de Loja',
    description: 'Serve como gancho para o P.E e também como serviço pontual.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no produto CDL - Criação de Loja.',
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pe',
    code: 'P.E',
    name: 'Pequi Express',
    description: 'Criação ou otimização de e-commerce, Instagram 10x e 2 meses de acompanhamento.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.E - Pequi Express.',
    features: ['Criação ou otimização de e-commerce', 'Instagram 10x', '2 meses de acompanhamento'],
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pl',
    code: 'P.L',
    name: 'Pequi Light',
    description: 'Otimização de e-commerce, Instagram 10x e Escala Ads.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.L - Pequi Light.',
    features: ['Otimização de e-commerce', 'Instagram 10x', 'Escala Ads'],
    color: 'from-slate-500 to-slate-700',
  },
  {
    slug: 'pp',
    code: 'P.P',
    name: 'Pequi Prime',
    description: 'Otimização de e-commerce, Instagram 10x, Escala Ads e Marketplace Pro.',
    type: 'whatsapp',
    whatsappMessage: 'Olá! Tenho interesse no P.P - Pequi Prime.',
    features: ['Otimização de e-commerce', 'Instagram 10x', 'Escala Ads', 'Marketplace Pro'],
    color: 'from-slate-500 to-slate-700',
  },
]

export const DIRECT_PRODUCTS = PRODUCTS.filter(p => p.type === 'direct')
export const WHATSAPP_PRODUCTS = PRODUCTS.filter(p => p.type === 'whatsapp')
export const getProduct = (slug: ProductSlug) => PRODUCTS.find(p => p.slug === slug)
