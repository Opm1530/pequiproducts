'use client'

import { useState } from 'react'
import { Play, Image as ImageIcon, X } from 'lucide-react'

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
  const [selectedNiche, setSelectedNiche] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [preview, setPreview] = useState<Creative | null>(null)

  const filtered = creatives.filter(c => {
    const matchNiche = selectedNiche === 'all' || c.niche === selectedNiche
    const matchType = selectedType === 'all' || c.type === selectedType
    return matchNiche && matchType
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedNiche('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedNiche === 'all' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
          >
            Todos os nichos
          </button>
          {niches.map(n => (
            <button
              key={n}
              onClick={() => setSelectedNiche(n)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedNiche === n ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {(['all', 'image', 'video'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${selectedType === t ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
            >
              {t === 'image' && <ImageIcon size={12} />}
              {t === 'video' && <Play size={12} />}
              {t === 'all' ? 'Todos' : t === 'image' ? 'Imagens' : 'Vídeos'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-center">
          <p className="text-gray-500">Nenhum criativo encontrado para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(creative => (
            <button
              key={creative.id}
              onClick={() => setPreview(creative)}
              className="group relative rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all aspect-square text-left"
            >
              {creative.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={creative.thumbnail_url} alt={creative.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-violet-950/30">
                  {creative.type === 'video' ? <Play size={32} className="text-violet-400" /> : <ImageIcon size={32} className="text-violet-400" />}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold line-clamp-2">{creative.title}</p>
                <span className="text-violet-300 text-xs mt-0.5">{creative.niche}</span>
              </div>
              {creative.type === 'video' && (
                <div className="absolute top-2 left-2 bg-black/60 rounded-full p-1">
                  <Play size={10} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-gray-900 border border-white/10 rounded-2xl max-w-2xl w-full overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <h3 className="text-white font-semibold">{preview.title}</h3>
                <span className="text-violet-400 text-xs">{preview.niche}</span>
              </div>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              {preview.type === 'video' ? (
                <video src={preview.url} controls className="w-full rounded-xl max-h-96" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.url} alt={preview.title} className="w-full rounded-xl max-h-96 object-contain" />
              )}
              {preview.description && (
                <p className="text-gray-400 text-sm mt-4">{preview.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
