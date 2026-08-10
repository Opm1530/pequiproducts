'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ResetForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token') ?? ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('As senhas não coincidem'); return }
    if (password.length < 6) { setError('Mínimo 6 caracteres'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? 'Erro ao redefinir senha'); return }
    setDone(true)
    setTimeout(() => router.push('/login'), 2500)
  }

  if (!token) return (
    <p className="text-center text-sm" style={{ color: '#ef4444' }}>Link inválido. <Link href="/esqueci-senha" style={{ color: '#FF6803' }}>Solicite um novo.</Link></p>
  )

  return done ? (
    <div className="text-center py-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdf4' }}>
        <span className="text-2xl">✅</span>
      </div>
      <h2 className="font-black text-xl mb-2" style={{ color: '#0B0501' }}>Senha redefinida!</h2>
      <p className="text-sm" style={{ color: '#6b6b6b' }}>Redirecionando para o login...</p>
    </div>
  ) : (
    <>
      <h1 className="font-black text-2xl mb-1" style={{ color: '#0B0501' }}>Nova senha</h1>
      <p className="text-sm mb-6" style={{ color: '#6b6b6b' }}>Escolha uma senha segura para sua conta.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>Nova senha</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
            placeholder="Mínimo 6 caracteres" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>Confirmar senha</label>
          <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none"
            style={{ backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
            placeholder="Repita a senha" />
        </div>
        {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: '#FF6803' }}>
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </button>
      </form>
    </>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#E8E8E8' }}>
      <div className="w-full max-w-sm">
        <div className="rounded-3xl p-8" style={{ backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div className="mb-6">
            <span className="font-black text-xl" style={{ color: '#0B0501' }}>
              Pequi<span style={{ color: '#FF6803' }}>Digital</span>
            </span>
          </div>
          <Suspense>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
