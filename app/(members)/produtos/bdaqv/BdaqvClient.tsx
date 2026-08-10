'use client'

import { useState } from 'react'
import { Play, Image as ImageIcon, X, Download } from 'lucide-react'

type Creative = {
  id: string
  title: string
  description: string | null
  niche: string
  type: 'video' | 'image'
  url: string
  thumbnail_url: string | null
}

type Props = { creatives: Creative[]; niches: string[] }

export default function BdaqvClient({ creatives, niches }: Props) {
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [preview, setPreview] = useState<Creative | null>(null)

  const filtered = creatives.filter(c => {
    const matchNiche = selectedNiche === 'all' || c.niche === selectedNiche
    const matchType = selectedType === 'all' || c.type === selectedType
    return matchNiche && matchType
  })

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2 flex-wrap flex-1">
          {['all', ...niches].map(n => (
            <button
              key={n}
              onClick={() => setSelectedNiche(n)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                backgroundColor: selectedNiche === n ? '#FF6803' : '#fff',
                color: selectedNiche === n ? '#fff' : '#6b6b6b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {n === 'all' ? 'Todos os nichos' : n}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(['all', 'image', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5"
              style={{
                backgroundColor: selectedType === t ? '#0B0501' : '#fff',
                color: selectedType === t ? '#fff' : '#6b6b6b',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {t === 'image' && <ImageIcon size={11} />}
              {t === 'video' && <Play size={11} />}
              {t === 'all' ? 'Todos' : t === 'image' ? 'Imagens' : 'Vídeos'}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs mb-4" style={{ color: '#9a9a9a' }}>{filtered.length} criativos</p>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p style={{ color: '#9a9a9a' }}>Nenhum criativo encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(c => (
            <button
              key={c.id}
              onClick={() => setPreview(c)}
              className="group relative rounded-2xl overflow-hidden aspect-square text-left transition-all hover:-translate-y-1"
              style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              {c.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#fff7f0' }}>
                  {c.type === 'video'
                    ? <Play size={32} style={{ color: '#FF6803' }} />
                    : <ImageIcon size={32} style={{ color: '#FF6803' }} />}
                </div>
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
                style={{ background: 'linear-gradient(to top, rgba(11,5,1,0.85), transparent)' }}>
                <p className="text-white text-xs font-semibold line-clamp-2">{c.title}</p>
                <span className="text-xs mt-0.5" style={{ color: '#FF6803' }}>{c.niche}</span>
              </div>
              {c.type === 'video' && (
                <div className="absolute top-2 left-2 rounded-full p-1.5" style={{ backgroundColor: 'rgba(11,5,1,0.7)' }}>
                  <Play size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(11,5,1,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setPreview(null)}>
          <div className="rounded-2xl overflow-hidden max-w-2xl w-full"
            style={{ backgroundColor: '#fff' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <h3 className="font-black text-base" style={{ color: '#0B0501' }}>{preview.title}</h3>
                <span className="text-xs" style={{ color: '#FF6803' }}>{preview.niche}</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={preview.url} download target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#FF6803', color: '#fff' }}>
                  <Download size={12} /> Baixar
                </a>
                <button onClick={() => setPreview(null)} className="p-2 rounded-lg transition-colors hover:bg-gray-100" style={{ color: '#6b6b6b' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-5">
              {preview.type === 'video'
                ? <video src={preview.url} controls className="w-full rounded-xl max-h-96" />
                // eslint-disable-next-line @next/next/no-img-element
                : <img src={preview.url} alt={preview.title} className="w-full rounded-xl max-h-96 object-contain" />}
              {preview.description && (
                <p className="text-sm mt-4" style={{ color: '#6b6b6b' }}>{preview.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
