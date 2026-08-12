'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BuyButton({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/aqv', { method: 'POST' })
      if (res.status === 401) {
        router.push('/login?redirect=/aqv')
        return
      }
      const { url } = await res.json()
      if (url) window.location.href = url
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleClick} disabled={loading} style={style}>
      {loading ? 'Aguarde...' : children}
    </button>
  )
}
