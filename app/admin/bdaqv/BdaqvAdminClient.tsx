'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Trash2, Play, Image as ImageIcon, Check, Loader2, ChevronDown, ChevronUp, Plus } from 'lucide-react'

type Creative = {
  id: string; title: string; description: string | null; niche: string
  type: 'video' | 'image'; url: string; thumbnail_url: string | null
  creative_type_label: string | null; attention_points: string | null; how_to_replicate: string | null
}

type QueueItem = {
  key: string; file: File; localThumb: string | null
  status: 'uploading' | 'capturing' | 'ready' | 'saving' | 'saved' | 'error'
  url: string; thumbnail_url: string
  title: string; niche: string; type: 'video' | 'image'; description: string
  creative_type_label: string; attention_points: string; how_to_replicate: string
  open: boolean
}

type Props = { initialCreatives: Creative[] }

const inp = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
const inpSt = { backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }
const ta = "w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"

async function captureVideoFrame(file: File): Promise<string | null> {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.muted = true
    video.preload = 'metadata'
    video.src = url
    const cleanup = () => URL.revokeObjectURL(url)

    video.addEventListener('loadedmetadata', () => {
      video.currentTime = Math.min(1, video.duration * 0.1)
    }, { once: true })

    video.addEventListener('seeked', () => {
      try {
        const canvas = document.createElement('canvas')
        const w = video.videoWidth || 640
        const h = video.videoHeight || 360
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d')!.drawImage(video, 0, 0, w, h)
        canvas.toBlob(blob => {
          cleanup()
          if (!blob) { resolve(null); return }
          resolve(URL.createObjectURL(blob))
        }, 'image/jpeg', 0.82)
      } catch {
        cleanup()
        resolve(null)
      }
    }, { once: true })

    video.addEventListener('error', () => { cleanup(); resolve(null) }, { once: true })
    setTimeout(() => { cleanup(); resolve(null) }, 8000)
  })
}

async function uploadToR2(file: File | Blob, folder: string, ext: string): Promise<string> {
  const contentType = file instanceof File ? file.type : 'image/jpeg'
  const res = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: `file.${ext}`, contentType, folder }),
  })
  const { uploadUrl, publicUrl } = await res.json()
  await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': contentType } })
  return publicUrl
}

export default function BdaqvAdminClient({ initialCreatives }: Props) {
  const [creatives, setCreatives] = useState(initialCreatives)
  const [queue, setQueue] = useState<QueueItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateItem = useCallback((key: string, patch: Partial<QueueItem>) => {
    setQueue(q => q.map(item => item.key === key ? { ...item, ...patch } : item))
  }, [])

  async function processFile(file: File) {
    const key = `${Date.now()}-${Math.random()}`
    const isVideo = file.type.startsWith('video/')
    const newItem: QueueItem = {
      key, file, localThumb: null, status: 'uploading',
      url: '', thumbnail_url: '',
      title: file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
      niche: '', type: isVideo ? 'video' : 'image', description: '',
      creative_type_label: '', attention_points: '', how_to_replicate: '',
      open: true,
    }
    setQueue(q => [...q, newItem])

    try {
      // Upload the main file
      const ext = file.name.split('.').pop() ?? (isVideo ? 'mp4' : 'jpg')
      const url = await uploadToR2(file, 'bdaqv', ext)
      updateItem(key, { url, status: isVideo ? 'capturing' : 'ready' })

      // Auto-capture thumbnail from video
      if (isVideo) {
        const localThumb = await captureVideoFrame(file)
        if (localThumb) {
          // Convert local blob URL to actual blob for R2 upload
          const thumbBlob = await fetch(localThumb).then(r => r.blob())
          URL.revokeObjectURL(localThumb)
          const thumbUrl = await uploadToR2(thumbBlob, 'bdaqv/thumbs', 'jpg')
          updateItem(key, { thumbnail_url: thumbUrl, localThumb: thumbUrl, status: 'ready' })
        } else {
          updateItem(key, { status: 'ready' })
        }
      }
    } catch {
      updateItem(key, { status: 'error' })
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return
    await Promise.all(Array.from(files).map(processFile))
  }

  async function saveItem(key: string) {
    const item = queue.find(i => i.key === key)
    if (!item || !item.url) return
    updateItem(key, { status: 'saving' })
    const res = await fetch('/api/admin/creatives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: item.title || item.file.name,
        niche: item.niche, type: item.type,
        url: item.url, thumbnail_url: item.thumbnail_url || null,
        description: item.description || null,
        creative_type_label: item.creative_type_label || null,
        attention_points: item.attention_points || null,
        how_to_replicate: item.how_to_replicate || null,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setCreatives(prev => [data, ...prev])
      updateItem(key, { status: 'saved' })
      setTimeout(() => setQueue(q => q.filter(i => i.key !== key)), 1200)
    } else {
      updateItem(key, { status: 'error' })
    }
  }

  async function saveAll() {
    const ready = queue.filter(i => i.status === 'ready')
    await Promise.all(ready.map(i => saveItem(i.key)))
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este criativo?')) return
    await fetch('/api/admin/creatives', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setCreatives(prev => prev.filter(c => c.id !== id))
  }

  const hasReady = queue.some(i => i.status === 'ready')

  // Editing existing creatives
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Creative | null>(null)
  const [editSaving, setEditSaving] = useState(false)

  function openEdit(c: Creative) {
    setEditId(c.id)
    setEditForm({ ...c })
  }

  async function saveEdit() {
    if (!editForm) return
    setEditSaving(true)
    const res = await fetch('/api/admin/creatives', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    const updated = await res.json()
    if (res.ok) {
      setCreatives(prev => prev.map(c => c.id === updated.id ? updated : c))
      setEditId(null)
      setEditForm(null)
    }
    setEditSaving(false)
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-sm" style={{ color: '#9a9a9a' }}>{creatives.length} criativos cadastrados</p>
        <div className="flex gap-2">
          {hasReady && (
            <button onClick={saveAll}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#22c55e', color: '#fff' }}>
              <Check size={15} /> Salvar todos
            </button>
          )}
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#FF6803' }}>
            <Upload size={15} /> Subir vídeos / imagens
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef} type="file" multiple
        accept="video/*,image/*"
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />

      {/* Drop zone (shown when empty queue) */}
      {queue.length === 0 && (
        <div
          className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-14 mb-6 cursor-pointer transition-all hover:opacity-80"
          style={{ borderColor: '#FF680340', backgroundColor: '#fff7f0' }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
        >
          <Upload size={28} style={{ color: '#FF6803', marginBottom: 10 }} />
          <p className="text-sm font-semibold" style={{ color: '#0B0501' }}>Arraste vídeos e imagens aqui</p>
          <p className="text-xs mt-1" style={{ color: '#9a9a9a' }}>ou clique para selecionar • vários de uma vez</p>
        </div>
      )}

      {/* Upload queue */}
      {queue.length > 0 && (
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#FF6803' }}>
              Fila de upload ({queue.length})
            </p>
            <button onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: '#FF6803' }}>
              <Plus size={13} /> Adicionar mais
            </button>
          </div>

          {queue.map(item => (
            <div key={item.key} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* Item header */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Thumb preview */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
                  {item.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : item.status === 'uploading' || item.status === 'capturing' ? (
                    <Loader2 size={20} className="animate-spin" style={{ color: '#FF6803' }} />
                  ) : item.type === 'video' ? (
                    <Play size={20} style={{ color: '#FF6803' }} />
                  ) : (
                    <ImageIcon size={20} style={{ color: '#FF6803' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#0B0501' }}>{item.title || item.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.status === 'uploading' && <span className="text-xs" style={{ color: '#9a9a9a' }}>Enviando...</span>}
                    {item.status === 'capturing' && <span className="text-xs" style={{ color: '#FF6803' }}>Gerando thumbnail...</span>}
                    {item.status === 'ready' && <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>Pronto para salvar</span>}
                    {item.status === 'saving' && <span className="text-xs" style={{ color: '#9a9a9a' }}>Salvando...</span>}
                    {item.status === 'saved' && <span className="text-xs font-semibold flex items-center gap-1" style={{ color: '#22c55e' }}><Check size={11} /> Salvo!</span>}
                    {item.status === 'error' && <span className="text-xs" style={{ color: '#ef4444' }}>Erro</span>}
                    <span className="text-xs" style={{ color: '#BFBFBF' }}>{(item.file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {item.status === 'ready' && (
                    <button onClick={() => saveItem(item.key)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: '#FF6803' }}>
                      Salvar
                    </button>
                  )}
                  <button onClick={() => updateItem(item.key, { open: !item.open })}
                    className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#9a9a9a' }}>
                    {item.open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                  <button onClick={() => setQueue(q => q.filter(i => i.key !== item.key))}
                    className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#ef4444' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expandable fields */}
              {item.open && (
                <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t" style={{ borderColor: '#F2F2F2' }}>
                  <div className="sm:col-span-2 pt-3">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Título *</label>
                    <input value={item.title} onChange={e => updateItem(item.key, { title: e.target.value })}
                      className={inp} style={inpSt} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Nicho *</label>
                    <input value={item.niche} onChange={e => updateItem(item.key, { niche: e.target.value })}
                      placeholder="ex: moda fitness" className={inp} style={inpSt} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Tipo de criativo</label>
                    <input value={item.creative_type_label} onChange={e => updateItem(item.key, { creative_type_label: e.target.value })}
                      placeholder="ex: Vídeo conceitual, UGC" className={inp} style={inpSt} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Pontos de atenção</label>
                    <textarea value={item.attention_points} onChange={e => updateItem(item.key, { attention_points: e.target.value })}
                      rows={3} placeholder="Descreva os pontos de atenção deste criativo..." className={ta} style={inpSt} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Como replicar</label>
                    <textarea value={item.how_to_replicate} onChange={e => updateItem(item.key, { how_to_replicate: e.target.value })}
                      rows={4} placeholder="Explique como replicar este criativo..." className={ta} style={inpSt} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Descrição (opcional)</label>
                    <textarea value={item.description} onChange={e => updateItem(item.key, { description: e.target.value })}
                      rows={2} className={ta} style={inpSt} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Saved creatives list */}
      <div className="space-y-3">
        {creatives.map(c => (
          <div key={c.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            {/* Row header */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
                {c.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />
                ) : c.type === 'video' ? (
                  <Play size={20} style={{ color: '#FF6803' }} />
                ) : (
                  <ImageIcon size={20} style={{ color: '#FF6803' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: '#0B0501' }}>{c.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9a9a9a' }}>{c.niche}{c.creative_type_label ? ` · ${c.creative_type_label}` : ''}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => editId === c.id ? setEditId(null) : openEdit(c)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{ backgroundColor: editId === c.id ? '#0B0501' : '#F2F2F2', color: editId === c.id ? '#fff' : '#0B0501' }}>
                  {editId === c.id ? 'Fechar' : 'Editar'}
                </button>
                <button onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#ef4444' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Edit panel */}
            {editId === c.id && editForm && (
              <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t" style={{ borderColor: '#F2F2F2' }}>
                <div className="sm:col-span-2 pt-3">
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Título</label>
                  <input value={editForm.title} onChange={e => setEditForm(f => f && { ...f, title: e.target.value })}
                    className={inp} style={inpSt} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Nicho</label>
                  <input value={editForm.niche} onChange={e => setEditForm(f => f && { ...f, niche: e.target.value })}
                    className={inp} style={inpSt} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Tipo de criativo</label>
                  <input value={editForm.creative_type_label ?? ''} onChange={e => setEditForm(f => f && { ...f, creative_type_label: e.target.value })}
                    placeholder="ex: Vídeo conceitual, UGC" className={inp} style={inpSt} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Pontos de atenção</label>
                  <textarea value={editForm.attention_points ?? ''} onChange={e => setEditForm(f => f && { ...f, attention_points: e.target.value })}
                    rows={3} className={ta} style={inpSt} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Como replicar</label>
                  <textarea value={editForm.how_to_replicate ?? ''} onChange={e => setEditForm(f => f && { ...f, how_to_replicate: e.target.value })}
                    rows={4} className={ta} style={inpSt} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold mb-1" style={{ color: '#0B0501' }}>Descrição (opcional)</label>
                  <textarea value={editForm.description ?? ''} onChange={e => setEditForm(f => f && { ...f, description: e.target.value })}
                    rows={2} className={ta} style={inpSt} />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <button onClick={saveEdit} disabled={editSaving}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: '#FF6803' }}>
                    {editSaving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
