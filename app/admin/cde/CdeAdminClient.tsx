'use client'

import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'

type Param = {
  id: string
  key: string
  label: string
  description: string | null
  default_value: number
  unit: string | null
  order_index: number
}

type Props = { initialParams: Param[] }

const EMPTY = { key: '', label: '', description: '', default_value: 0, unit: '' }

export default function CdeAdminClient({ initialParams }: Props) {
  const [params, setParams] = useState(initialParams)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/cde-params', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order_index: params.length }),
    })
    const data = await res.json()
    if (res.ok) {
      setParams(prev => [...prev, data])
      setForm(EMPTY)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este parâmetro?')) return
    await fetch('/api/admin/cde-params', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setParams(prev => prev.filter(p => p.id !== id))
  }

  async function handleDefaultChange(id: string, value: number) {
    setParams(prev => prev.map(p => p.id === id ? { ...p, default_value: value } : p))
    await fetch('/api/admin/cde-params', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, default_value: value }),
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{params.length} campos configurados</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
          <Plus size={16} />Novo campo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Chave (key)</label>
            <input required value={form.key} onChange={e => setForm(p => ({ ...p, key: e.target.value.replace(/\s/g, '_') }))}
              placeholder="ex: ad_spend"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Rótulo</label>
            <input required value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))}
              placeholder="ex: Verba de anúncios"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Valor padrão</label>
            <input type="number" value={form.default_value} onChange={e => setForm(p => ({ ...p, default_value: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Unidade <span className="text-gray-600">(opcional)</span></label>
            <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
              placeholder="ex: R$, %, unidades"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Descrição <span className="text-gray-600">(opcional)</span></label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Explicação do campo"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-sm transition-colors">Cancelar</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {params.map(p => (
          <div key={p.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <GripVertical size={16} className="text-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <code className="text-violet-400 text-xs bg-violet-950/50 px-1.5 py-0.5 rounded">{p.key}</code>
                <span className="text-white text-sm font-medium">{p.label}</span>
                {p.unit && <span className="text-gray-500 text-xs">({p.unit})</span>}
              </div>
              {p.description && <p className="text-gray-500 text-xs mt-0.5">{p.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">Padrão:</span>
              <input type="number" value={p.default_value}
                onChange={e => handleDefaultChange(p.id, parseFloat(e.target.value) || 0)}
                className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-sm text-right focus:outline-none focus:border-violet-500 transition-colors" />
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
