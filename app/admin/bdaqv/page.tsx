import { getCreatives } from '@/lib/queries'
import BdaqvAdminClient from './BdaqvAdminClient'

export default async function BdaqvAdminPage() {
  const creatives = await getCreatives()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">BDAQV — Criativos</h1>
      <BdaqvAdminClient initialCreatives={creatives} />
    </div>
  )
}
