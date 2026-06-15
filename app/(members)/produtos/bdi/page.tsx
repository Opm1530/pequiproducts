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
        <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">BDI</span>
        <h1 className="text-2xl font-bold text-white mt-1">Lista de Influenciadores</h1>
        <p className="text-gray-400 text-sm mt-1">Influenciadoras segmentadas por nicho com links diretos</p>
      </div>
      <BdiClient influencers={influencers} niches={niches} />
    </div>
  )
}
