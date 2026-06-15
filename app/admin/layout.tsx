import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { LayoutDashboard, Image, Users, Calculator, ArrowLeft } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')

  const navLinks = [
    { href: '/admin/dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { href: '/admin/cde', label: 'CDE - Calculadora', icon: Calculator },
    { href: '/admin/bdaqv', label: 'BDAQV - Criativos', icon: Image },
    { href: '/admin/bdi', label: 'BDI - Influenciadoras', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <aside className="w-64 border-r border-white/10 flex flex-col p-4 sticky top-0 h-screen shrink-0">
        <div className="mb-6 px-2">
          <span className="text-white font-bold text-lg tracking-tight">
            Pequi<span className="text-violet-400">Admin</span>
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft size={16} />
          Voltar à área de membros
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
