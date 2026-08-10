'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

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

type Props = { influencers: Influencer[]; niches: string[] }

export default function BdiClient({ influencers, niches }: Props) {
  const [selectedNiche, setSelectedNiche] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = influencers.filter(inf => {
    const matchNiche = selectedNiche === 'all' || inf.niche === selectedNiche
    const matchSearch = inf.name.toLowerCase().includes(search.toLowerCase())
    return matchNiche && matchSearch
  })

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#BFBFBF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar influenciadora..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ backgroundColor: '#fff', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
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
              {n === 'all' ? 'Todos' : n}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs mb-4" style={{ color: '#9a9a9a' }}>{filtered.length} influenciadoras encontradas</p>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p style={{ color: '#9a9a9a' }}>Nenhuma influenciadora encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(inf => (
            <div key={inf.id}
              className="rounded-2xl p-5 flex flex-col items-center text-center transition-all hover:-translate-y-1"
              style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {inf.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={inf.photo_url} alt={inf.name} className="w-20 h-20 rounded-full object-cover mb-3"
                  style={{ border: '2px solid #FF680330' }} />
              ) : (
                <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#fff7f0', border: '2px solid #FF680330' }}>
                  <span className="text-2xl font-black" style={{ color: '#FF6803' }}>{inf.name[0]}</span>
                </div>
              )}
              <h3 className="font-black text-sm" style={{ color: '#0B0501' }}>{inf.name}</h3>
              <span className="text-xs mt-0.5" style={{ color: '#FF6803' }}>{inf.niche}</span>
              {inf.followers && (
                <span className="text-xs mt-0.5" style={{ color: '#9a9a9a' }}>{inf.followers} seguidores</span>
              )}
              <div className="flex gap-2 mt-3">
                {inf.instagram_url && (
                  <a href={inf.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: '#fff7f0', color: '#FF6803' }}>IG</a>
                )}
                {inf.tiktok_url && (
                  <a href={inf.tiktok_url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: '#f5f5f5', color: '#0B0501' }}>TT</a>
                )}
                {inf.youtube_url && (
                  <a href={inf.youtube_url} target="_blank" rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-80"
                    style={{ backgroundColor: '#fff0f0', color: '#ef4444' }}>YT</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
