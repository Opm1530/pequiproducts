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

const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
const inputStyle = { backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }

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
        <p className="text-sm" style={{ color: '#9a9a9a' }}>{creatives.length} criativos cadastrados</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF6803' }}
        >
          <Plus size={16} />Adicionar criativo
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>Título</label>
            <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>Nicho</label>
            <input required value={form.niche} onChange={e => setForm(p => ({ ...p, niche: e.target.value }))}
              placeholder="ex: moda, beleza, fitness"
              className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>Tipo</label>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as 'image' | 'video' }))}
              className={inputClass} style={inputStyle}>
              <option value="image">Imagem</option>
              <option value="video">Vídeo</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>URL do arquivo</label>
            <input required value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
              className={inputClass} style={inputStyle} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>
              URL da thumbnail <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input value={form.thumbnail_url} onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
              placeholder="https://..."
              className={inputClass} style={inputStyle} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>
              Descrição <span style={{ color: '#9a9a9a', fontWeight: 400 }}>(opcional)</span>
            </label>
            <textarea value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={2} className={inputClass} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ color: '#6b6b6b' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#FF6803' }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {creatives.map(c => (
          <div key={c.id} className="relative group rounded-xl overflow-hidden aspect-square" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {c.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#fff7f0' }}>
                {c.type === 'video'
                  ? <Play size={28} style={{ color: '#FF6803' }} />
                  : <ImageIcon size={28} style={{ color: '#FF6803' }} />}
              </div>
            )}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3" style={{ backgroundColor: 'rgba(11,5,1,0.8)' }}>
              <button onClick={() => handleDelete(c.id)}
                className="self-end p-1.5 rounded-lg text-white transition-colors" style={{ backgroundColor: '#ef4444' }}>
                <Trash2 size={14} />
              </button>
              <div>
                <p className="text-white text-xs font-semibold line-clamp-2">{c.title}</p>
                <span className="text-xs" style={{ color: '#FF6803' }}>{c.niche}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
