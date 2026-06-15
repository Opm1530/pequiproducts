'use client'

import { useState } from 'react'
import { login, signup } from '@/app/actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const result = await (mode === 'login' ? login(formData) : signup(formData))
    if (result?.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E8E8E8' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-black text-2xl tracking-tight" style={{ color: '#0B0501' }}>
            Pequi<span style={{ color: '#FF6803' }}>Products</span>
          </Link>
          <p className="text-sm mt-2" style={{ color: '#6b6b6b' }}>
            {mode === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-8 space-y-4"
          style={{ backgroundColor: '#fff' }}
        >
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#0B0501' }}>Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1.5px solid #e0e0e0',
                color: '#0B0501',
              }}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: '#0B0501' }}>Senha</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1.5px solid #e0e0e0',
                color: '#0B0501',
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-center rounded-lg px-4 py-2" style={{ color: '#c0392b', backgroundColor: '#fdecea' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
            style={{ backgroundColor: '#FF6803' }}
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          <p className="text-center text-sm" style={{ color: '#6b6b6b' }}>
            {mode === 'login' ? 'Ainda não tem conta?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
              className="font-semibold"
              style={{ color: '#FF6803' }}
            >
              {mode === 'login' ? 'Cadastre-se' : 'Entrar'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
