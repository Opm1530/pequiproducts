'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, MessageSquare, Send, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { CourseModule, CourseLesson, LessonComment } from '@/lib/queries'

type Props = {
  productName: string
  modules: CourseModule[]
  initialProgress: string[]
}

function VideoPlayer({ url }: { url: string }) {
  const isYouTube = /youtube\.com|youtu\.be/.test(url)
  const isVimeo = /vimeo\.com/.test(url)

  if (isYouTube) {
    const id = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/)?.[1]
    if (id) return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          className="absolute inset-0 w-full h-full rounded-2xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    )
  }

  if (isVimeo) {
    const id = url.match(/vimeo\.com\/(\d+)/)?.[1]
    if (id) return (
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          className="absolute inset-0 w-full h-full rounded-2xl"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen />
      </div>
    )
  }

  return (
    <video controls className="w-full rounded-2xl" src={url} style={{ maxHeight: '480px', backgroundColor: '#000' }}>
      Seu navegador não suporta vídeo.
    </video>
  )
}

function CommentsSection({ lessonId }: { lessonId: string }) {
  const [comments, setComments] = useState<LessonComment[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/course/comments?lessonId=${lessonId}`)
      .then(r => r.json())
      .then(data => { setComments(Array.isArray(data) ? data : []); setLoading(false) })
  }, [lessonId])

  async function post() {
    if (!text.trim()) return
    setPosting(true)
    const res = await fetch('/api/course/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, content: text.trim() }),
    })
    const comment = await res.json()
    setComments(prev => [...prev, comment])
    setText('')
    setPosting(false)
  }

  return (
    <div className="space-y-5 mt-8">
      <div className="flex items-center gap-2">
        <MessageSquare size={16} style={{ color: '#FF6803' }} />
        <h3 className="font-black text-sm" style={{ color: '#0B0501' }}>Comentários ({comments.length})</h3>
      </div>

      <div className="flex gap-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Deixe um comentário, dúvida ou feedback..."
          rows={3}
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none resize-none"
          style={{ backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }}
        />
        <button
          onClick={post}
          disabled={posting || !text.trim()}
          className="self-end p-3 rounded-xl text-white disabled:opacity-40 transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF6803' }}>
          <Send size={16} />
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: '#9a9a9a' }}>Carregando...</p>
      ) : (
        <div className="space-y-3">
          {comments.map(c => (
            <div key={c.id} className="rounded-xl p-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: '#FF6803' }}>
                  {c.user_email.split('@')[0]}
                </span>
                <span className="text-xs" style={{ color: '#BFBFBF' }}>
                  {new Date(c.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <p className="text-sm" style={{ color: '#0B0501' }}>{c.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CoursePlayer({ productName, modules, initialProgress }: Props) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(initialProgress))
  const [openModules, setOpenModules] = useState<Set<string>>(new Set(modules.map(m => m.id)))
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(
    modules[0]?.lessons[0] ?? null
  )

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = [...completedIds].filter(id =>
    modules.some(m => m.lessons.some(l => l.id === id))
  ).length
  const progressPct = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0

  async function toggleComplete(lessonId: string) {
    const res = await fetch('/api/course/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId }),
    })
    const { completed } = await res.json()
    setCompletedIds(prev => {
      const next = new Set(prev)
      if (completed) next.add(lessonId)
      else next.delete(lessonId)
      return next
    })
  }

  function toggleModule(id: string) {
    setOpenModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function goToNext() {
    if (!activeLesson) return
    for (let mi = 0; mi < modules.length; mi++) {
      const li = modules[mi].lessons.findIndex(l => l.id === activeLesson.id)
      if (li !== -1) {
        if (li + 1 < modules[mi].lessons.length) {
          setActiveLesson(modules[mi].lessons[li + 1])
        } else if (mi + 1 < modules.length && modules[mi + 1].lessons.length) {
          setActiveLesson(modules[mi + 1].lessons[0])
          setOpenModules(prev => new Set([...prev, modules[mi + 1].id]))
        }
        return
      }
    }
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F2F2F2' }}>
      {/* Sidebar */}
      <aside className="w-80 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#fff', boxShadow: '2px 0 8px rgba(0,0,0,0.06)' }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: '#F2F2F2' }}>
          <h2 className="font-black text-sm" style={{ color: '#0B0501' }}>{productName}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#9a9a9a' }}>
              <span>{completedCount}/{totalLessons} aulas</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#F2F2F2' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${progressPct}%`, backgroundColor: '#FF6803' }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {modules.map(mod => (
            <div key={mod.id}>
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-2 px-5 py-3 text-left hover:bg-gray-50 transition-all">
                {openModules.has(mod.id) ? <ChevronDown size={14} style={{ color: '#9a9a9a' }} /> : <ChevronRight size={14} style={{ color: '#9a9a9a' }} />}
                <span className="flex-1 text-xs font-black" style={{ color: '#0B0501' }}>{mod.title}</span>
              </button>

              {openModules.has(mod.id) && (
                <div className="pb-2">
                  {mod.lessons.map(lesson => {
                    const done = completedIds.has(lesson.id)
                    const active = activeLesson?.id === lesson.id
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className="w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all"
                        style={{
                          backgroundColor: active ? '#fff7f0' : 'transparent',
                          borderLeft: active ? '3px solid #FF6803' : '3px solid transparent',
                        }}>
                        {done
                          ? <CheckCircle2 size={15} style={{ color: '#FF6803', flexShrink: 0 }} />
                          : <Circle size={15} style={{ color: '#BFBFBF', flexShrink: 0 }} />}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: active ? '#FF6803' : '#0B0501' }}>
                            {lesson.title}
                          </p>
                          {lesson.duration_minutes && (
                            <p className="text-xs" style={{ color: '#BFBFBF' }}>{lesson.duration_minutes} min</p>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-8">
          {activeLesson ? (
            <>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="font-black text-2xl" style={{ color: '#0B0501' }}>{activeLesson.title}</h1>
                  {activeLesson.duration_minutes && (
                    <p className="text-sm mt-1" style={{ color: '#9a9a9a' }}>{activeLesson.duration_minutes} min</p>
                  )}
                </div>
                <button
                  onClick={() => toggleComplete(activeLesson.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{
                    backgroundColor: completedIds.has(activeLesson.id) ? '#FF6803' : '#fff',
                    color: completedIds.has(activeLesson.id) ? '#fff' : '#FF6803',
                    border: '1.5px solid #FF6803',
                  }}>
                  {completedIds.has(activeLesson.id) ? (
                    <><CheckCircle2 size={15} /> Concluída</>
                  ) : (
                    <><Circle size={15} /> Marcar como concluída</>
                  )}
                </button>
              </div>

              {activeLesson.video_url ? (
                <VideoPlayer url={activeLesson.video_url} />
              ) : (
                <div className="rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#0B0501', height: '300px' }}>
                  <div className="text-center">
                    <Play size={40} style={{ color: '#FF6803', margin: '0 auto 8px' }} />
                    <p className="text-sm" style={{ color: '#BFBFBF' }}>Nenhum vídeo adicionado</p>
                  </div>
                </div>
              )}

              {activeLesson.description && (
                <div className="mt-6 p-5 rounded-2xl" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <h3 className="font-black text-sm mb-2" style={{ color: '#0B0501' }}>Sobre esta aula</h3>
                  <p className="text-sm whitespace-pre-wrap" style={{ color: '#4a4a4a' }}>{activeLesson.description}</p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#0B0501' }}>
                  Próxima aula <ChevronRight size={15} />
                </button>
              </div>

              <CommentsSection key={activeLesson.id} lessonId={activeLesson.id} />
            </>
          ) : (
            <div className="text-center py-24">
              <BookOpenIcon />
              <p className="font-black text-lg mt-4" style={{ color: '#0B0501' }}>Selecione uma aula</p>
              <p className="text-sm mt-1" style={{ color: '#9a9a9a' }}>Escolha uma aula no menu lateral</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function BookOpenIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6803" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto' }}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  )
}
