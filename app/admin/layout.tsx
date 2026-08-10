import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Image, Users, Package, ArrowLeft, BookOpen } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')

  const navLinks = [
    { href: '/admin/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/admin/produtos', label: 'Produtos', icon: Package },
    { href: '/admin/bdaqv', label: 'BDAQV - Criativos', icon: Image },
    { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
    { href: '/admin/bdi', label: 'BDI - Influenciadoras', icon: Users },
  ]

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#E8E8E8' }}>
      <aside
        className="w-56 flex flex-col p-4 sticky top-0 h-screen shrink-0"
        style={{ backgroundColor: '#0B0501' }}
      >
        <div className="mb-8 px-2 pt-2">
          <span className="font-black text-lg" style={{ color: '#fff' }}>
            Pequi<span style={{ color: '#FF6803' }}>Admin</span>
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ color: '#BFBFBF' }}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ color: '#6b6b6b' }}
        >
          <ArrowLeft size={15} />
          Área de membros
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
