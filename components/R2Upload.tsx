'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'

type Props = {
  folder: string
  accept?: string
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function R2Upload({ folder, accept = 'image/*', value, onChange, label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setError('')
    try {
      const res = await fetch('/api/upload/presign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type, folder }),
      })
      const { uploadUrl, publicUrl } = await res.json()
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      onChange(publicUrl)
    } catch {
      setError('Erro no upload. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-semibold" style={{ color: '#0B0501' }}>{label}</p>}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Cole uma URL ou faça upload →"
          className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
          style={{ backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
          style={{ backgroundColor: '#0B0501', color: '#fff' }}
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? 'Enviando...' : 'Upload'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
      </div>
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt="" className="h-12 w-12 rounded-lg object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
          <button type="button" onClick={() => onChange('')} className="text-xs flex items-center gap-1" style={{ color: '#9a9a9a' }}>
            <X size={12} /> Remover
          </button>
        </div>
      )}
      {error && <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>}
    </div>
  )
}
