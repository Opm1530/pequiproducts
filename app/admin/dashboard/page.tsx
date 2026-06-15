import pool from '@/lib/db'

export default async function AdminDashboardPage() {
  const [{ rows: [up] }, { rows: [cr] }, { rows: [inf] }] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM user_products'),
    pool.query('SELECT COUNT(*) FROM creatives'),
    pool.query('SELECT COUNT(*) FROM influencers'),
  ])

  const stats = [
    { label: 'Acessos a produtos', value: up.count },
    { label: 'Criativos (BDAQV)', value: cr.count },
    { label: 'Influenciadoras (BDI)', value: inf.count },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Visão Geral</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-2">Acesso rápido</h2>
        <p className="text-gray-400 text-sm">Use o menu lateral para gerenciar o conteúdo de cada produto.</p>
      </div>
    </div>
  )
}
