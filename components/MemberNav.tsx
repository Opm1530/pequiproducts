'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, LogOut, ShieldCheck, Menu, X } from 'lucide-react'
import { logout } from '@/app/actions/auth'
import { useState } from 'react'

type Props = { isAdmin?: boolean }

export default function MemberNav({ isAdmin }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/dashboard', label: 'Meus Produtos', icon: LayoutDashboard },
    { href: '/loja', label: 'Loja', icon: Store },
  ]

  return (
    <>
      <nav
        className="flex items-center justify-between px-5 py-3 sticky top-0 z-30"
        style={{ backgroundColor: '#E8E8E8', borderBottom: '1px solid #d0d0d0' }}
      >
        <Link href="/dashboard" className="font-black text-lg tracking-tight" style={{ color: '#0B0501' }}>
          Pequi<span style={{ color: '#FF6803' }}>Products</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1 rounded-full px-2 py-2" style={{ backgroundColor: '#0B0501' }}>
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          className="sm:hidden p-2 rounded-xl"
          style={{ backgroundColor: '#0B0501', color: '#fff' }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="sm:hidden fixed inset-0 z-20 flex flex-col pt-20 px-5 gap-2"
          style={{ backgroundColor: '#0B0501' }}
          onClick={() => setOpen(false)}
        >
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-semibold transition-all"
              style={pathname === href
                ? { backgroundColor: '#FF6803', color: '#fff' }
                : { backgroundColor: '#1a1108', color: '#BFBFBF' }
              }
            >
              <Icon size={18} />{label}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-semibold"
              style={{ backgroundColor: '#1a1108', color: '#BFBFBF' }}
            >
              <ShieldCheck size={18} />Admin
            </Link>
          )}

          <form action={logout} className="mt-2">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-semibold"
              style={{ backgroundColor: '#1a1108', color: '#ef4444' }}
            >
              <LogOut size={18} />Sair
            </button>
          </form>
        </div>
      )}
    </>
  )
}
