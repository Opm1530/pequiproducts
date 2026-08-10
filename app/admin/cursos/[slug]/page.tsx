import { getCourseModules, getProductBySlug } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import CourseEditor from './CourseEditor'

export default async function AdminCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product || product.type !== 'course') notFound()

  const modules = await getCourseModules(slug)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/produtos"
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: '#fff', color: '#0B0501', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={14} /> Voltar
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen size={18} style={{ color: '#FF6803' }} />
            <div>
              <h1 className="font-black text-xl" style={{ color: '#0B0501' }}>{product.name}</h1>
              <p className="text-xs" style={{ color: '#9a9a9a' }}>Editor de curso · {modules.length} módulos</p>
            </div>
          </div>
        </div>

        <CourseEditor slug={slug} initialModules={modules} />
      </div>
    </div>
  )
}
