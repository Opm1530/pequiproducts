import { getCdeParams } from '@/lib/queries'
import CdeAdminClient from './CdeAdminClient'

export default async function CdeAdminPage() {
  const params = await getCdeParams()

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">CDE — Calculadora de Ecom</h1>
      <p className="text-gray-400 text-sm mb-8">Configure os campos e valores padrão da calculadora.</p>
      <CdeAdminClient initialParams={params} />
    </div>
  )
}
