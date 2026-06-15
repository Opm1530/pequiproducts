import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import MemberNav from '@/components/MemberNav'

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-950">
      <MemberNav isAdmin={user.role === 'admin'} />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
