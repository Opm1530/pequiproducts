'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, LogOut, ShieldCheck } from 'lucide-react'
import { logout } from '@/app/actions/auth'

type Props = { isAdmin?: boolean }

export default function MemberNav({ isAdmin }: Props) {
  const pathname = usePathname()

  const links = [
    { href: '/dashboard', label: 'Meus Produtos', icon: LayoutDashboard },
    { href: '/loja', label: 'Loja', icon: Store },
  ]

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
      <Link href="/dashboard" className="text-white font-bold text-lg tracking-tight">
        Pequi<span className="text-violet-400">Products</span>
      </Link>

      <div className="flex items-center gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              pathname === href ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}>
            <Icon size={16} />{label}
          </Link>
        ))}

        {isAdmin && (
          <Link href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
            <ShieldCheck size={16} />Admin
          </Link>
        )}

        <form action={logout}>
          <button type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors ml-2">
            <LogOut size={16} />Sair
          </button>
        </form>
      </div>
    </nav>
  )
}
