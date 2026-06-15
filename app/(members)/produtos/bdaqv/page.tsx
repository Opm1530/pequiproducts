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
        <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">BDAQV</span>
        <h1 className="text-2xl font-bold text-white mt-1">Banco de Criativos que Vendem</h1>
        <p className="text-gray-400 text-sm mt-1">Criativos segmentados por nicho prontos para usar</p>
      </div>
      <BdaqvClient creatives={creatives} niches={niches} />
    </div>
  )
}
