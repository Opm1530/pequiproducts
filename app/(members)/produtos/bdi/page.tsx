import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { hasProductAccess, getInfluencers } from '@/lib/queries'
import BdiClient from './BdiClient'

export default async function BdiPage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (!(await hasProductAccess(user.id, 'bdi'))) redirect('/dashboard')

  const influencers = await getInfluencers()
  const niches: string[] = [...new Set(influencers.map((i: { niche: string }) => i.niche).filter(Boolean))]

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>BDI</span>
        <h1 className="text-2xl font-bold mt-1" style={{ color: '#0B0501' }}>Lista de Influenciadores</h1>
        <p className="text-sm mt-1" style={{ color: '#9a9a9a' }}>Influenciadoras segmentadas por nicho com links diretos</p>
      </div>
      <BdiClient influencers={influencers} niches={niches} />
    </div>
  )
}
