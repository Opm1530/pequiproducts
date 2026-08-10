import { getSession } from '@/lib/auth'
import { getProductBySlug, hasProductAccess, getCourseModules, getLessonProgress } from '@/lib/queries'
import { redirect, notFound } from 'next/navigation'
import CoursePlayer from './CoursePlayer'

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const user = await getSession()
  if (!user) redirect('/login')

  const product = await getProductBySlug(slug)
  if (!product || product.type !== 'course') notFound()

  const access = user.role === 'admin' || await hasProductAccess(user.id, slug)
  if (!access) redirect('/dashboard')

  const modules = await getCourseModules(slug)
  const progress = await getLessonProgress(user.id, slug)

  return (
    <CoursePlayer
      productName={product.name}
      modules={modules}
      initialProgress={progress}
    />
  )
}
