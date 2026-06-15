'use client'

import { useState } from 'react'

type Param = {
  id: string
  key: string
  label: string
  description: string | null
  default_value: number
  unit: string | null
  order_index: number
}

type Props = { params: Param[] }

export default function CdeCalculator({ params }: Props) {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(params.map(p => [p.key, p.default_value]))
  )

  if (params.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-center rounded-2xl" style={{ backgroundColor: '#fff' }}>
        <p className="text-sm" style={{ color: '#6b6b6b' }}>A calculadora está sendo configurada. Volte em breve.</p>
      </div>
    )
  }

  const revenue = (values['price'] ?? 0) * (values['quantity'] ?? 0)
  const adSpend = values['ad_spend'] ?? 0
  const productCost = (values['product_cost'] ?? 0) * (values['quantity'] ?? 0)
  const fixedCosts = values['fixed_costs'] ?? 0
  const profit = revenue - adSpend - productCost - fixedCosts
  const roas = adSpend > 0 ? revenue / adSpend : 0
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  const isProfit = profit >= 0

  const fmt = (n: number) =>
    n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="rounded-2xl p-7 space-y-5" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h2 className="font-black text-base" style={{ color: '#0B0501' }}>Dados da operação</h2>
        {params.map(param => (
          <div key={param.key}>
            <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>
              {param.label}
              {param.unit && <span className="font-normal ml-1" style={{ color: '#BFBFBF' }}>({param.unit})</span>}
            </label>
            {param.description && (
              <p className="text-xs mb-1.5" style={{ color: '#9a9a9a' }}>{param.description}</p>
            )}
            <input
              type="number"
              value={values[param.key] ?? param.default_value}
              onChange={e => setValues(prev => ({ ...prev, [param.key]: parseFloat(e.target.value) || 0 }))}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1.5px solid #e0e0e0',
                color: '#0B0501',
              }}
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="font-black text-base" style={{ color: '#0B0501' }}>Resultados</h2>

        {/* Lucro em destaque */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: isProfit ? '#0B0501' : '#fff0f0',
            border: isProfit ? 'none' : '1.5px solid #fca5a5',
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: isProfit ? '#BFBFBF' : '#ef4444' }}>
            Lucro líquido
          </p>
          <p className="font-black" style={{ fontSize: 40, color: isProfit ? '#FF6803' : '#ef4444', lineHeight: 1.1 }}>
            {fmt(profit)}
          </p>
          {!isProfit && (
            <p className="text-xs mt-2" style={{ color: '#ef4444' }}>⚠ Você está operando no prejuízo</p>
          )}
        </div>

        {/* Métricas secundárias */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Receita total', value: fmt(revenue) },
            { label: 'ROAS', value: `${roas.toFixed(2)}x` },
            { label: 'Margem de lucro', value: `${margin.toFixed(1)}%` },
            { label: 'Total de custos', value: fmt(adSpend + productCost + fixedCosts) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
            >
              <p className="text-xs font-medium mb-1" style={{ color: '#9a9a9a' }}>{label}</p>
              <p className="font-black text-lg" style={{ color: '#0B0501' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
