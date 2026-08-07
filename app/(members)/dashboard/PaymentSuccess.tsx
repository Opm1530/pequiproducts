'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Loader2 } from 'lucide-react'

export default function PaymentSuccess({ initialSlugs }: { initialSlugs: string[] }) {
  const params = useSearchParams()
  const router = useRouter()
  const isSuccess = params.get('success') === '1'
  const [checking, setChecking] = useState(isSuccess)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!isSuccess) return

    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch('/api/me/products')
        const { slugs } = await res.json()
        const hasNew = slugs.some((s: string) => !initialSlugs.includes(s))
        if (hasNew || attempts >= 10) {
          clearInterval(interval)
          setChecking(false)
          setDone(true)
          setTimeout(() => router.replace('/dashboard'), 2000)
        }
      } catch {
        if (attempts >= 10) clearInterval(interval)
      }
    }, 1500)

    return () => clearInterval(interval)
  }, [isSuccess, initialSlugs, router])

  if (!isSuccess) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(11,5,1,0.7)' }}>
      <div className="rounded-3xl p-10 text-center max-w-sm w-full mx-4" style={{ backgroundColor: '#fff' }}>
        {done ? (
          <>
            <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: '#22c55e' }} />
            <h2 className="font-black text-xl mb-2" style={{ color: '#0B0501' }}>Acesso liberado!</h2>
            <p className="text-sm" style={{ color: '#6b6b6b' }}>Redirecionando para seus produtos...</p>
          </>
        ) : (
          <>
            <Loader2 size={48} className="mx-auto mb-4 animate-spin" style={{ color: '#FF6803' }} />
            <h2 className="font-black text-xl mb-2" style={{ color: '#0B0501' }}>Confirmando pagamento...</h2>
            <p className="text-sm" style={{ color: '#6b6b6b' }}>Aguarde enquanto liberamos seu acesso.</p>
          </>
        )}
      </div>
    </div>
  )
}
