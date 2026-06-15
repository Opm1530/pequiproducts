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
    <nav
      className="flex items-center justify-between px-8 py-4 sticky top-0 z-10"
      style={{ backgroundColor: '#E8E8E8', borderBottom: '1px solid #d0d0d0' }}
    >
      <Link href="/dashboard" className="font-black text-lg tracking-tight" style={{ color: '#0B0501' }}>
        Pequi<span style={{ color: '#FF6803' }}>Products</span>
      </Link>

      <div className="flex items-center gap-1 rounded-full px-2 py-2" style={{ backgroundColor: '#0B0501' }}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={pathname === href
              ? { backgroundColor: '#FF6803', color: '#fff' }
              : { color: '#BFBFBF' }
            }
          >
            <Icon size={15} />{label}
          </Link>
        ))}

        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{ color: '#BFBFBF' }}
          >
            <ShieldCheck size={15} />Admin
          </Link>
        )}

        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ml-1"
            style={{ color: '#BFBFBF' }}
          >
            <LogOut size={15} />Sair
          </button>
        </form>
      </div>
    </nav>
  )
}
