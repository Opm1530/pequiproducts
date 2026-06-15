import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { hasProductAccess } from '@/lib/queries'
import CdeCalculator from './CdeCalculator'

export default async function CdePage() {
  const user = await getSession()
  if (!user) redirect('/login')
  if (!(await hasProductAccess(user.id, 'cde'))) redirect('/dashboard')

  return (
    <div>
      <div className="mb-8">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#FF6803' }}>CDE</span>
        <h1 className="text-2xl font-black mt-1" style={{ color: '#0B0501' }}>Calculadora de Ecom</h1>
        <p className="text-sm mt-1" style={{ color: '#6b6b6b' }}>Precificação, tráfego, lucro e escala — tudo em um lugar</p>
      </div>
      <CdeCalculator />
    </div>
  )
}
