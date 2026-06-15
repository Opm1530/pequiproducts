'use client'

import { useState } from 'react'
import { Search, Link as LinkIcon } from 'lucide-react'

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
  const [selectedNiche, setSelectedNiche] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filtered = influencers.filter(inf => {
    const matchNiche = selectedNiche === 'all' || inf.niche === selectedNiche
    const matchSearch = inf.name.toLowerCase().includes(search.toLowerCase())
    return matchNiche && matchSearch
  })

  return (
    <div>
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar influenciadora..."
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedNiche('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${selectedNiche === 'all' ? 'bg-violet-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}
          >
            Todos
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
      </div>

      <p className="text-gray-500 text-xs mb-4">{filtered.length} influenciadoras encontradas</p>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Nenhuma influenciadora encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(inf => (
            <div key={inf.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center hover:border-violet-500/40 transition-colors">
              {inf.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={inf.photo_url} alt={inf.name} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-violet-500/30" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-violet-950/50 border-2 border-violet-500/30 flex items-center justify-center mb-3">
                  <span className="text-2xl font-bold text-violet-400">{inf.name[0]}</span>
                </div>
              )}
              <h3 className="text-white font-semibold text-sm">{inf.name}</h3>
              <span className="text-violet-400 text-xs mt-0.5">{inf.niche}</span>
              {inf.followers && (
                <span className="text-gray-500 text-xs mt-0.5">{inf.followers} seguidores</span>
              )}
              <div className="flex gap-2 mt-3">
                {inf.instagram_url && (
                  <a href={inf.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 text-gray-400 transition-colors text-xs font-bold">
                    IG
                  </a>
                )}
                {inf.youtube_url && (
                  <a href={inf.youtube_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors text-xs font-bold">
                    YT
                  </a>
                )}
                {inf.tiktok_url && (
                  <a href={inf.tiktok_url} target="_blank" rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/20 hover:text-white text-gray-400 transition-colors text-xs font-bold">
                    TT
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
