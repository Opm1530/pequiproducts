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
      <div className="flex items-center justify-center py-20 text-center">
        <p className="text-gray-500">A calculadora está sendo configurada. Volte em breve.</p>
      </div>
    )
  }

  // Basic ecom calculation: Revenue, Cost, Profit, ROAS, etc.
  const revenue = (values['price'] ?? 0) * (values['quantity'] ?? 0)
  const adSpend = values['ad_spend'] ?? 0
  const productCost = (values['product_cost'] ?? 0) * (values['quantity'] ?? 0)
  const fixedCosts = values['fixed_costs'] ?? 0
  const profit = revenue - adSpend - productCost - fixedCosts
  const roas = adSpend > 0 ? revenue / adSpend : 0
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold mb-2">Dados da operação</h2>
        {params.map(param => (
          <div key={param.key}>
            <label className="block text-sm text-gray-300 mb-1">
              {param.label}
              {param.unit && <span className="text-gray-500 ml-1">({param.unit})</span>}
            </label>
            {param.description && (
              <p className="text-xs text-gray-500 mb-1.5">{param.description}</p>
            )}
            <input
              type="number"
              value={values[param.key] ?? param.default_value}
              onChange={e => setValues(prev => ({ ...prev, [param.key]: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-violet-500 transition-colors text-sm"
            />
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-white font-semibold">Resultados</h2>

        {[
          { label: 'Receita total', value: `R$ ${revenue.toFixed(2)}`, highlight: false },
          { label: 'Lucro líquido', value: `R$ ${profit.toFixed(2)}`, highlight: true },
          { label: 'ROAS', value: `${roas.toFixed(2)}x`, highlight: false },
          { label: 'Margem de lucro', value: `${margin.toFixed(1)}%`, highlight: false },
        ].map(({ label, value, highlight }) => (
          <div
            key={label}
            className={`rounded-2xl border p-5 ${
              highlight
                ? profit >= 0
                  ? 'bg-green-950/30 border-green-500/30'
                  : 'bg-red-950/30 border-red-500/30'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <p className="text-gray-400 text-sm">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${highlight ? (profit >= 0 ? 'text-green-400' : 'text-red-400') : 'text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
