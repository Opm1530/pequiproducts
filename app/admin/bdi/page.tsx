import { getInfluencers } from '@/lib/queries'
import BdiAdminClient from './BdiAdminClient'

export default async function BdiAdminPage() {
  const influencers = await getInfluencers()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">BDI — Influenciadoras</h1>
      <BdiAdminClient initialInfluencers={influencers} />
    </div>
  )
}
