'use client'

import { useState } from 'react'
import { Plus, Trash2, Play, Image as ImageIcon } from 'lucide-react'

type Creative = {
  id: string
  title: string
  description: string | null
  niche: string
  type: 'video' | 'image'
  url: string
  thumbnail_url: string | null
}

type Props = { initialCreatives: Creative[] }

const EMPTY = { title: '', description: '', niche: '', type: 'image' as 'image' | 'video', url: '', thumbnail_url: '' }

export default function BdaqvAdminClient({ initialCreatives }: Props) {
  const [creatives, setCreatives] = useState(initialCreatives)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/creatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setCreatives(prev => [data, ...prev])
      setForm(EMPTY)
      setShowForm(false)
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este criativo?')) return
    await fetch('/api/admin/creatives', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setCreatives(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{creatives.length} criativos cadastrados</p>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
          <Plus size={16} />Adicionar criativo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Título</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Nicho</label>
            <input required value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
              placeholder="ex: moda, beleza, fitness"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Tipo</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'image' | 'video' }))}
              className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors">
              <option value="image">Imagem</option>
              <option value="video">Vídeo</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">URL do arquivo</label>
            <input required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">URL da thumbnail <span className="text-gray-600">(opcional)</span></label>
            <input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
              placeholder="https://..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-300 mb-1">Descrição <span className="text-gray-600">(opcional)</span></label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none" />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white text-sm transition-colors">Cancelar</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {creatives.map(c => (
          <div key={c.id} className="relative group rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
            {c.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-violet-950/30">
                {c.type === 'video' ? <Play size={28} className="text-violet-400" /> : <ImageIcon size={28} className="text-violet-400" />}
              </div>
            )}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <button onClick={() => handleDelete(c.id)}
                className="self-end p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors">
                <Trash2 size={14} />
              </button>
              <div>
                <p className="text-white text-xs font-semibold line-clamp-2">{c.title}</p>
                <span className="text-violet-300 text-xs">{c.niche}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
