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
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest block mb-1" style={{ color: '#BFBFBF' }}>PAINEL</span>
        <h1 className="font-black text-3xl" style={{ color: '#0B0501' }}>Visão Geral</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-6" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p className="text-sm" style={{ color: '#9a9a9a' }}>{label}</p>
            <p className="text-3xl font-black mt-1" style={{ color: '#FF6803' }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 className="font-black text-base mb-1" style={{ color: '#0B0501' }}>Acesso rápido</h2>
        <p className="text-sm" style={{ color: '#9a9a9a' }}>Use o menu lateral para gerenciar o conteúdo de cada produto.</p>
      </div>
    </div>
  )
}
