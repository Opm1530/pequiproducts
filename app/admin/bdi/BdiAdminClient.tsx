'use client'

import { useState } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import R2Upload from '@/components/R2Upload'

type Influencer = {
  id: string
  name: string
  niche: string
  photo_url: string | null
  instagram_url: string | null
  tiktok_url: string | null
  youtube_url: string | null
  followers: string | null
}

type Props = { initialInfluencers: Influencer[] }

const EMPTY = { name: '', niche: '', photo_url: '', instagram_url: '', tiktok_url: '', youtube_url: '', followers: '' }

const FIELDS = [
  { key: 'name', label: 'Nome', required: true, placeholder: '' },
  { key: 'niche', label: 'Nicho', required: true, placeholder: 'ex: moda, beleza, fitness' },
  { key: 'photo_url', label: 'URL da foto', required: false, placeholder: 'https://...' },
  { key: 'instagram_url', label: 'Instagram', required: false, placeholder: 'https://instagram.com/...' },
  { key: 'tiktok_url', label: 'TikTok', required: false, placeholder: 'https://tiktok.com/...' },
  { key: 'youtube_url', label: 'YouTube', required: false, placeholder: 'https://youtube.com/...' },
  { key: 'followers', label: 'Seguidores', required: false, placeholder: 'ex: 150k' },
] as const

const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
const inputStyle = { backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }

export default function BdiAdminClient({ initialInfluencers }: Props) {
  const [influencers, setInfluencers] = useState(initialInfluencers)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const method = editId ? 'PUT' : 'POST'
    const body = editId ? { ...form, id: editId } : form

    const res = await fetch('/api/admin/influencers', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (res.ok) {
      if (editId) {
        setInfluencers(prev => prev.map(i => i.id === editId ? data : i))
      } else {
        setInfluencers(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      }
      setForm(EMPTY)
      setEditId(null)
      setShowForm(false)
    }
    setSaving(false)
  }

  function handleEdit(inf: Influencer) {
    setForm({
      name: inf.name, niche: inf.niche,
      photo_url: inf.photo_url ?? '', instagram_url: inf.instagram_url ?? '',
      tiktok_url: inf.tiktok_url ?? '', youtube_url: inf.youtube_url ?? '',
      followers: inf.followers ?? '',
    })
    setEditId(inf.id)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover esta influenciadora?')) return
    await fetch('/api/admin/influencers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setInfluencers(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm" style={{ color: '#9a9a9a' }}>{influencers.length} influenciadoras cadastradas</p>
        <button
          onClick={() => { setForm(EMPTY); setEditId(null); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF6803' }}
        >
          <Plus size={16} />Adicionar influenciadora
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h2 className="sm:col-span-2 font-black text-base" style={{ color: '#0B0501' }}>
            {editId ? 'Editar influenciadora' : 'Nova influenciadora'}
          </h2>
          {FIELDS.map(({ key, label, required, placeholder }) => (
            <div key={key}>
              {key === 'photo_url' ? (
                <R2Upload
                  folder="bdi"
                  accept="image/*"
                  value={form[key]}
                  onChange={url => setForm(p => ({ ...p, photo_url: url }))}
                  label={`${label} (opcional)`}
                />
              ) : (
                <>
                  <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>
                    {label}{!required && <span className="ml-1" style={{ color: '#9a9a9a', fontWeight: 400 }}>(opcional)</span>}
                  </label>
                  <input
                    required={required}
                    value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className={inputClass}
                    style={inputStyle}
                  />
                </>
              )}
            </div>
          ))}
          <div className="sm:col-span-2 flex gap-3 justify-end">
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
              className="px-4 py-2 rounded-xl text-sm transition-colors" style={{ color: '#6b6b6b' }}>
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: '#FF6803' }}>
              {saving ? 'Salvando...' : editId ? 'Salvar alterações' : 'Adicionar'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {influencers.map(inf => (
          <div key={inf.id} className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {inf.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={inf.photo_url} alt={inf.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#fff7f0' }}>
                <span className="font-black text-sm" style={{ color: '#FF6803' }}>{inf.name[0]}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: '#0B0501' }}>{inf.name}</p>
              <p className="text-xs" style={{ color: '#FF6803' }}>{inf.niche}{inf.followers ? ` · ${inf.followers}` : ''}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(inf)}
                className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#6b6b6b' }}>
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(inf.id)}
                className="p-2 rounded-lg transition-colors hover:bg-red-50" style={{ color: '#6b6b6b' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
