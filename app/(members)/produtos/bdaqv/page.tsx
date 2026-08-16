import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { hasProductAccess, getCreatives } from '@/lib/queries'
import BdaqvClient from './BdaqvClient'

export default async function BdaqvPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (!(await hasProductAccess(user.id, 'bdaqv'))) redirect('/dashboard')

  const creatives = await getCreatives()
  const niches: string[] = [...new Set(creatives.map((c: { niche: string }) => c.niche).filter(Boolean))]

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>BDAQV</span>
        <h1 className="text-2xl font-bold mt-1" style={{ color: '#0B0501' }}>Banco de Criativos que Vendem</h1>
        <p className="text-sm mt-1" style={{ color: '#9a9a9a' }}>Criativos segmentados por nicho prontos para usar</p>
      </div>
      <BdaqvClient creatives={creatives} niches={niches} />
    </div>
  )
}
