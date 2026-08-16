'use client'

import { useState, useRef } from 'react'
import { Plus, Trash2, ChevronDown, ChevronRight, Pencil, Check, X, GripVertical, Upload } from 'lucide-react'
import { CourseModule, CourseLesson } from '@/lib/queries'

type Props = { slug: string; initialModules: CourseModule[] }

const inp = "w-full rounded-xl px-4 py-2.5 text-sm outline-none"
const inpStyle = { backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }
const ta = "w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"

async function uploadVideoToR2(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const res = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type, folder: 'lessons' }),
  })
  const { uploadUrl, publicUrl } = await res.json()

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', e => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    })
    xhr.addEventListener('load', () => (xhr.status < 300 ? resolve() : reject(new Error('Upload failed'))))
    xhr.addEventListener('error', reject)
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.send(file)
  })

  return publicUrl
}

function VideoUploadField({
  value, onChange,
}: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadVideoToR2(file, setProgress)
      onChange(url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="URL do vídeo (YouTube, Vimeo, MP4...) ou faça upload abaixo"
        className={inp}
        style={inpStyle}
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-all hover:opacity-80"
          style={{ backgroundColor: '#0B0501', color: '#fff' }}
        >
          <Upload size={13} />
          {uploading ? `Enviando... ${progress}%` : 'Upload de vídeo'}
        </button>
        {uploading && (
          <div className="flex-1 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0', height: 6 }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: '#FF6803' }} />
          </div>
        )}
        {value && !uploading && (
          <span className="text-xs truncate max-w-[200px]" style={{ color: '#9a9a9a' }} title={value}>
            ✓ vídeo definido
          </span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
    </div>
  )
}

function LessonRow({
  lesson, onUpdate, onDelete,
}: { lesson: CourseLesson; onUpdate: (l: CourseLesson) => void; onDelete: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: lesson.title,
    video_url: lesson.video_url ?? '',
    duration_minutes: lesson.duration_minutes ?? '',
    description: lesson.description ?? '',
  })
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    const res = await fetch('/api/admin/course', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lesson', id: lesson.id, ...form, duration_minutes: form.duration_minutes || null }),
    })
    const updated = await res.json()
    onUpdate(updated)
    setSaving(false)
    setEditing(false)
  }

  async function del() {
    if (!confirm('Remover esta aula?')) return
    await fetch('/api/admin/course', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'lesson', id: lesson.id }),
    })
    onDelete()
  }

  if (editing) return (
    <div className="ml-6 p-4 rounded-xl space-y-3" style={{ backgroundColor: '#fff7f0', border: '1.5px solid #FF680330' }}>
      <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
        placeholder="Título da aula" className={inp} style={inpStyle} />
      <VideoUploadField value={form.video_url} onChange={url => setForm(p => ({ ...p, video_url: url }))} />
      <div className="grid grid-cols-2 gap-3">
        <input type="number" value={form.duration_minutes} onChange={e => setForm(p => ({ ...p, duration_minutes: e.target.value }))}
          placeholder="Duração (min)" className={inp} style={inpStyle} />
      </div>
      <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        placeholder="Descrição da aula (opcional)" rows={3} className={ta} style={inpStyle} />
      <div className="flex gap-2 justify-end">
        <button onClick={() => setEditing(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#6b6b6b' }}>Cancelar</button>
        <button onClick={save} disabled={saving}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
          style={{ backgroundColor: '#FF6803' }}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="ml-6 flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <GripVertical size={14} style={{ color: '#BFBFBF' }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ color: '#0B0501' }}>{lesson.title}</p>
        {lesson.duration_minutes && <p className="text-xs" style={{ color: '#9a9a9a' }}>{lesson.duration_minutes} min</p>}
      </div>
      <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#6b6b6b' }}><Pencil size={13} /></button>
      <button onClick={del} className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
    </div>
  )
}

function ModuleBlock({
  mod, onUpdate, onDelete,
}: { mod: CourseModule; onUpdate: (m: CourseModule) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(true)
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(mod.title)
  const [addingLesson, setAddingLesson] = useState(false)
  const [newLesson, setNewLesson] = useState({ title: '', video_url: '', duration_minutes: '', description: '' })
  const [saving, setSaving] = useState(false)

  async function saveTitle() {
    await fetch('/api/admin/course', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'module', id: mod.id, title }),
    })
    onUpdate({ ...mod, title })
    setEditingTitle(false)
  }

  async function addLesson() {
    if (!newLesson.title.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'lesson', module_id: mod.id,
        ...newLesson,
        duration_minutes: newLesson.duration_minutes || null,
        order_index: mod.lessons.length,
      }),
    })
    const lesson = await res.json()
    onUpdate({ ...mod, lessons: [...mod.lessons, lesson] })
    setNewLesson({ title: '', video_url: '', duration_minutes: '', description: '' })
    setAddingLesson(false)
    setSaving(false)
  }

  async function del() {
    if (!confirm(`Remover módulo "${mod.title}" e todas as aulas?`)) return
    await fetch('/api/admin/course', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'module', id: mod.id }),
    })
    onDelete()
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" style={{ backgroundColor: '#0B0501' }}>
        <button onClick={() => setOpen(o => !o)} className="text-white">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {editingTitle ? (
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="flex-1 bg-white/10 rounded-lg px-3 py-1 text-sm text-white outline-none"
            onKeyDown={e => e.key === 'Enter' && saveTitle()} autoFocus />
        ) : (
          <span className="flex-1 font-black text-sm text-white">{mod.title}</span>
        )}
        <span className="text-xs" style={{ color: '#BFBFBF' }}>{mod.lessons.length} aulas</span>
        {editingTitle ? (
          <>
            <button onClick={saveTitle} className="p-1.5 rounded text-white"><Check size={13} /></button>
            <button onClick={() => setEditingTitle(false)} className="p-1.5 rounded" style={{ color: '#BFBFBF' }}><X size={13} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setEditingTitle(true)} className="p-1.5 rounded" style={{ color: '#BFBFBF' }}><Pencil size={13} /></button>
            <button onClick={del} className="p-1.5 rounded" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
          </>
        )}
      </div>

      {open && (
        <div className="p-4 space-y-2" style={{ backgroundColor: '#f9f9f9' }}>
          {mod.lessons.map(lesson => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              onUpdate={updated => onUpdate({ ...mod, lessons: mod.lessons.map(l => l.id === updated.id ? updated : l) })}
              onDelete={() => onUpdate({ ...mod, lessons: mod.lessons.filter(l => l.id !== lesson.id) })}
            />
          ))}

          {addingLesson ? (
            <div className="ml-6 p-4 rounded-xl space-y-3" style={{ backgroundColor: '#fff', border: '1.5px solid #e0e0e0' }}>
              <input value={newLesson.title} onChange={e => setNewLesson(p => ({ ...p, title: e.target.value }))}
                placeholder="Título da aula *" className={inp} style={inpStyle} autoFocus />
              <VideoUploadField value={newLesson.video_url} onChange={url => setNewLesson(p => ({ ...p, video_url: url }))} />
              <input type="number" value={newLesson.duration_minutes} onChange={e => setNewLesson(p => ({ ...p, duration_minutes: e.target.value }))}
                placeholder="Duração (min)" className={inp} style={inpStyle} />
              <textarea value={newLesson.description} onChange={e => setNewLesson(p => ({ ...p, description: e.target.value }))}
                placeholder="Descrição (opcional)" rows={2} className={ta} style={inpStyle} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setAddingLesson(false)} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: '#6b6b6b' }}>Cancelar</button>
                <button onClick={addLesson} disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#FF6803' }}>
                  {saving ? 'Adicionando...' : 'Adicionar aula'}
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingLesson(true)}
              className="ml-6 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ color: '#FF6803' }}>
              <Plus size={13} /> Adicionar aula
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function CourseEditor({ slug, initialModules }: Props) {
  const [modules, setModules] = useState(initialModules)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [saving, setSaving] = useState(false)

  async function addModule() {
    if (!newModuleTitle.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'module', slug, title: newModuleTitle, order_index: modules.length }),
    })
    const mod = await res.json()
    setModules(prev => [...prev, { ...mod, lessons: [] }])
    setNewModuleTitle('')
    setAddingModule(false)
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      {modules.map(mod => (
        <ModuleBlock
          key={mod.id}
          mod={mod}
          onUpdate={updated => setModules(prev => prev.map(m => m.id === updated.id ? updated : m))}
          onDelete={() => setModules(prev => prev.filter(m => m.id !== mod.id))}
        />
      ))}

      {addingModule ? (
        <div className="rounded-2xl p-5 flex gap-3" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)}
            placeholder="Nome do módulo" className={`${inp} flex-1`} style={inpStyle} autoFocus
            onKeyDown={e => e.key === 'Enter' && addModule()} />
          <button onClick={addModule} disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#FF6803' }}>
            {saving ? '...' : 'Criar'}
          </button>
          <button onClick={() => setAddingModule(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: '#6b6b6b' }}>Cancelar</button>
        </div>
      ) : (
        <button onClick={() => setAddingModule(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 w-full justify-center"
          style={{ backgroundColor: '#fff', color: '#FF6803', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px dashed #FF680350' }}>
          <Plus size={16} /> Novo módulo
        </button>
      )}
    </div>
  )
}
