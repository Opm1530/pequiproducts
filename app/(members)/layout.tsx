import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import MemberNav from '@/components/MemberNav'

export default async function MembersLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/login')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8E8E8' }}>
      <MemberNav isAdmin={user.role === 'admin'} />
      <main className="max-w-7xl mx-auto px-8 py-10">{children}</main>
    </div>
  )
}
