import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { hasProductAccess, getCdeParams } from '@/lib/queries'
import CdeCalculator from './CdeCalculator'

export default async function CdePage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (!(await hasProductAccess(user.id, 'cde'))) redirect('/dashboard')

  const params = await getCdeParams()

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold text-violet-400 tracking-widest uppercase">CDE</span>
        <h1 className="text-2xl font-bold text-white mt-1">Calculadora de Ecom</h1>
        <p className="text-gray-400 text-sm mt-1">Calcule seus indicadores de e-commerce</p>
      </div>
      <CdeCalculator params={params} />
    </div>
  )
}
