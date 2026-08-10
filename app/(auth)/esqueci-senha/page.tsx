'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#E8E8E8' }}>
      <div className="w-full max-w-sm">
        <div className="rounded-3xl p-8" style={{ backgroundColor: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div className="mb-6">
            <span className="font-black text-xl" style={{ color: '#0B0501' }}>
              Pequi<span style={{ color: '#FF6803' }}>Digital</span>
            </span>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#fff7f0' }}>
                <span className="text-2xl">📧</span>
              </div>
              <h1 className="font-black text-xl mb-2" style={{ color: '#0B0501' }}>E-mail enviado!</h1>
              <p className="text-sm mb-6" style={{ color: '#6b6b6b' }}>
                Se esse e-mail estiver cadastrado, você receberá um link para redefinir sua senha em breve.
              </p>
              <Link href="/login" className="text-sm font-semibold" style={{ color: '#FF6803' }}>
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-black text-2xl mb-1" style={{ color: '#0B0501' }}>Esqueceu sua senha?</h1>
              <p className="text-sm mb-6" style={{ color: '#6b6b6b' }}>
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>E-mail</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                    style={{ backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
                    placeholder="seu@email.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: '#FF6803' }}
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
              <p className="text-center text-sm mt-4" style={{ color: '#9a9a9a' }}>
                <Link href="/login" className="font-semibold" style={{ color: '#FF6803' }}>Voltar para o login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
