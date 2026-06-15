'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, BarChart3, Zap, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

const fmt = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const pct = (n: number) => `${n.toFixed(1)}%`

function Input({
  label, hint, value, onChange, prefix, suffix, step = 1,
}: {
  label: string; hint?: string; value: number; onChange: (v: number) => void
  prefix?: string; suffix?: string; step?: number
}) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-0.5" style={{ color: '#0B0501' }}>{label}</label>
      {hint && <p className="text-xs mb-1.5" style={{ color: '#9a9a9a' }}>{hint}</p>}
      <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid #e0e0e0', backgroundColor: '#f5f5f5' }}>
        {prefix && <span className="px-3 text-sm font-medium" style={{ color: '#9a9a9a' }}>{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
          style={{ color: '#0B0501' }}
        />
        {suffix && <span className="px-3 text-sm font-medium" style={{ color: '#9a9a9a' }}>{suffix}</span>}
      </div>
    </div>
  )
}

function ResultCard({ label, value, sub, highlight, danger }: {
  label: string; value: string; sub?: string; highlight?: boolean; danger?: boolean
}) {
  const bg = highlight ? '#0B0501' : danger ? '#fff0f0' : '#fff'
  const border = danger ? '1.5px solid #fca5a5' : 'none'
  const labelColor = highlight ? '#BFBFBF' : '#9a9a9a'
  const valueColor = highlight ? '#FF6803' : danger ? '#ef4444' : '#0B0501'

  return (
    <div className="rounded-2xl p-5" style={{ backgroundColor: bg, border, boxShadow: highlight ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: labelColor }}>{label}</p>
      <p className="font-black text-2xl leading-tight" style={{ color: valueColor }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: highlight ? '#6b6b6b' : '#9a9a9a' }}>{sub}</p>}
    </div>
  )
}

// ─── ABA 1: PREÇO ───────────────────────────────────────────────────────────
function TabPreco() {
  const [custo, setCusto] = useState(30)
  const [frete, setFrete] = useState(15)
  const [embalagem, setEmbalagem] = useState(2)
  const [taxas, setTaxas] = useState(5)
  const [impostos, setImpostos] = useState(6)
  const [margem, setMargem] = useState(30)
  const [desconto, setDesconto] = useState(10)

  const custoTotal = custo + frete + embalagem
  const deducoesRate = (taxas + impostos) / 100
  const margemRate = margem / 100
  const preco = custoTotal / (1 - deducoesRate - margemRate)
  const lucroUnit = preco * margemRate
  const markup = custo > 0 ? (preco / custo - 1) * 100 : 0
  const margemReal = preco > 0 ? (lucroUnit / preco) * 100 : 0

  const precoComDesc = preco * (1 - desconto / 100)
  const lucroComDesc = precoComDesc * (1 - deducoesRate) - custoTotal
  const margemComDesc = precoComDesc > 0 ? (lucroComDesc / precoComDesc) * 100 : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl p-7 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Custos do produto</h3>
        <Input label="Custo do produto" prefix="R$" value={custo} onChange={setCusto} step={0.01} />
        <Input label="Frete de envio" prefix="R$" value={frete} onChange={setFrete} step={0.01} />
        <Input label="Embalagem" prefix="R$" value={embalagem} onChange={setEmbalagem} step={0.01} />
        <div className="border-t pt-4" style={{ borderColor: '#f0f0f0' }}>
          <h3 className="font-black text-base mb-4" style={{ color: '#0B0501' }}>Taxas e margem</h3>
          <div className="space-y-4">
            <Input label="Taxas (gateway/marketplace)" suffix="%" value={taxas} onChange={setTaxas} step={0.1} hint="Ex: Kiwify, Mercado Pago, Shopify" />
            <Input label="Impostos" suffix="%" value={impostos} onChange={setImpostos} step={0.1} />
            <Input label="Margem de lucro desejada" suffix="%" value={margem} onChange={setMargem} step={1} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Resultado</h3>
        <ResultCard label="Preço ideal de venda" value={fmt(preco)} highlight />
        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="Lucro por unidade" value={fmt(lucroUnit)} />
          <ResultCard label="Margem real" value={pct(margemReal)} />
          <ResultCard label="Markup" value={`${markup.toFixed(0)}%`} />
          <ResultCard label="Custo total/un." value={fmt(custoTotal)} />
        </div>

        <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h4 className="font-black text-sm" style={{ color: '#0B0501' }}>Simulador de desconto</h4>
          <Input label={`Se eu der ${desconto}% de desconto...`} suffix="%" value={desconto} onChange={setDesconto} step={1} />
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="rounded-xl p-4" style={{ backgroundColor: '#f5f5f5' }}>
              <p className="text-xs" style={{ color: '#9a9a9a' }}>Preço com desconto</p>
              <p className="font-black text-base" style={{ color: '#0B0501' }}>{fmt(precoComDesc)}</p>
            </div>
            <div className="rounded-xl p-4" style={{ backgroundColor: lucroComDesc >= 0 ? '#f5f5f5' : '#fff0f0' }}>
              <p className="text-xs" style={{ color: '#9a9a9a' }}>Lucro restante</p>
              <p className="font-black text-base" style={{ color: lucroComDesc >= 0 ? '#0B0501' : '#ef4444' }}>
                {fmt(lucroComDesc)} ({pct(margemComDesc)})
              </p>
            </div>
          </div>
          {lucroComDesc < 0 && (
            <p className="text-xs flex items-center gap-1.5" style={{ color: '#ef4444' }}>
              <AlertTriangle size={12} /> Este desconto gera prejuízo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── ABA 2: TRÁFEGO ─────────────────────────────────────────────────────────
function TabTrafego() {
  const [preco, setPreco] = useState(100)
  const [custoVenda, setCustoVenda] = useState(45)
  const [cpc, setCpc] = useState(1.5)
  const [conversao, setConversao] = useState(2)
  const [verbaDiaria, setVerbaDiaria] = useState(100)

  const lucroMaximo = preco - custoVenda
  const cpaMaximo = lucroMaximo
  const roasMinimo = preco > 0 ? preco / lucroMaximo : 0

  const cliquesParaVenda = conversao > 0 ? 100 / conversao : 0
  const custoParaVenda = cliquesParaVenda * cpc
  const lucroVenda = preco - custoVenda - custoParaVenda
  const roasAtual = custoParaVenda > 0 ? preco / custoParaVenda : 0

  const vendasDia = verbaDiaria > 0 && custoParaVenda > 0 ? verbaDiaria / custoParaVenda : 0
  const lucroDia = vendasDia * lucroVenda
  const faturamentoDia = vendasDia * preco

  const viavel = lucroVenda > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="rounded-2xl p-7 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Produto</h3>
          <Input label="Preço de venda" prefix="R$" value={preco} onChange={setPreco} step={0.01} />
          <Input label="Custo total por venda" prefix="R$" value={custoVenda} onChange={setCustoVenda} step={0.01} hint="Produto + frete + taxas + impostos" />
        </div>
        <div className="rounded-2xl p-7 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Campanha</h3>
          <Input label="CPC médio" prefix="R$" value={cpc} onChange={setCpc} step={0.01} hint="Custo por clique" />
          <Input label="Taxa de conversão" suffix="%" value={conversao} onChange={setConversao} step={0.1} hint="% de visitantes que compram" />
          <Input label="Verba diária" prefix="R$" value={verbaDiaria} onChange={setVerbaDiaria} step={10} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Análise de tráfego</h3>

        <ResultCard
          label="Lucro por venda (com tráfego)"
          value={fmt(lucroVenda)}
          highlight={viavel}
          danger={!viavel}
          sub={viavel ? `ROAS atual: ${roasAtual.toFixed(2)}x` : 'Tráfego consumindo todo o lucro'}
        />

        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="CPA máximo" value={fmt(cpaMaximo)} sub="Limite sem prejuízo" />
          <ResultCard label="ROAS mínimo" value={`${roasMinimo.toFixed(2)}x`} sub="Break-even" />
          <ResultCard label="Custo por venda" value={fmt(custoParaVenda)} sub={`${cliquesParaVenda.toFixed(0)} cliques`} />
          <ResultCard label="ROAS atual" value={`${roasAtual.toFixed(2)}x`} sub={roasAtual >= roasMinimo ? '✓ Acima do mínimo' : '✗ Abaixo do mínimo'} />
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: '#0B0501' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#FF6803' }}>
            Com R$ {fmt(verbaDiaria).replace('R$ ', '')} por dia
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Vendas/dia', value: vendasDia.toFixed(1) },
              { label: 'Faturamento', value: fmt(faturamentoDia) },
              { label: 'Lucro/dia', value: fmt(lucroDia) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs mb-1" style={{ color: '#6b6b6b' }}>{label}</p>
                <p className="font-black text-sm" style={{ color: lucroDia >= 0 ? '#fff' : '#ef4444' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ABA 3: LUCRO ───────────────────────────────────────────────────────────
function TabLucro() {
  const [visitas, setVisitas] = useState(5000)
  const [conversao, setConversao] = useState(2)
  const [ticket, setTicket] = useState(120)
  const [custoFixo, setCustoFixo] = useState(800)
  const [custoVar, setCustoVar] = useState(45)

  const vendas = visitas * (conversao / 100)
  const faturamento = vendas * ticket
  const custoVariavelTotal = vendas * custoVar
  const lucro = faturamento - custoVariavelTotal - custoFixo
  const margem = faturamento > 0 ? (lucro / faturamento) * 100 : 0

  const breakEvenVendas = (ticket - custoVar) > 0 ? custoFixo / (ticket - custoVar) : 0
  const breakEvenVisitas = conversao > 0 ? (breakEvenVendas / (conversao / 100)) : 0
  const breakEvenFaturamento = breakEvenVendas * ticket

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl p-7 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Funil de vendas</h3>
        <Input label="Visitas no mês" value={visitas} onChange={setVisitas} step={100} hint="Sessões únicas na loja" />
        <Input label="Taxa de conversão" suffix="%" value={conversao} onChange={setConversao} step={0.1} hint="Média e-commerce BR: 1,5% a 3%" />
        <Input label="Ticket médio" prefix="R$" value={ticket} onChange={setTicket} step={1} />
        <div className="border-t pt-4" style={{ borderColor: '#f0f0f0' }}>
          <h3 className="font-black text-base mb-4" style={{ color: '#0B0501' }}>Custos</h3>
          <div className="space-y-4">
            <Input label="Custos fixos/mês" prefix="R$" value={custoFixo} onChange={setCustoFixo} step={10} hint="Plataforma, apps, equipe, etc." />
            <Input label="Custo variável por venda" prefix="R$" value={custoVar} onChange={setCustoVar} step={1} hint="Produto + frete + taxas" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Projeção mensal</h3>

        <ResultCard
          label="Lucro líquido no mês"
          value={fmt(lucro)}
          highlight={lucro >= 0}
          danger={lucro < 0}
          sub={`Margem: ${pct(margem)}`}
        />

        <div className="grid grid-cols-2 gap-4">
          <ResultCard label="Vendas estimadas" value={`${vendas.toFixed(0)}`} sub="pedidos/mês" />
          <ResultCard label="Faturamento" value={fmt(faturamento)} />
          <ResultCard label="Custo variável total" value={fmt(custoVariavelTotal)} />
          <ResultCard label="Custo fixo/venda" value={vendas > 0 ? fmt(custoFixo / vendas) : 'R$ 0'} sub="Diluído por venda" />
        </div>

        <div className="rounded-2xl p-6 space-y-3" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h4 className="font-black text-sm" style={{ color: '#0B0501' }}>Ponto de equilíbrio</h4>
          <p className="text-xs" style={{ color: '#6b6b6b' }}>O mínimo para não ter prejuízo</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Vendas mín.', value: `${breakEvenVendas.toFixed(0)}` },
              { label: 'Visitas mín.', value: `${breakEvenVisitas.toFixed(0)}` },
              { label: 'Faturamento mín.', value: fmt(breakEvenFaturamento) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl p-3 text-center" style={{ backgroundColor: '#f5f5f5' }}>
                <p className="text-xs mb-1" style={{ color: '#9a9a9a' }}>{label}</p>
                <p className="font-black text-sm" style={{ color: '#0B0501' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── ABA 4: ESCALA ──────────────────────────────────────────────────────────
function TabEscala() {
  const [preco, setPreco] = useState(100)
  const [custoVenda, setCustoVenda] = useState(45)
  const [custoTrafego, setCustoTrafego] = useState(20)
  const [custoFixoMes, setCustoFixoMes] = useState(800)

  const lucroUnit = preco - custoVenda - custoTrafego
  const cenarios = [10, 30, 50, 100, 200]

  const margem = preco > 0 ? (lucroUnit / preco) * 100 : 0
  const roasAtual = custoTrafego > 0 ? preco / custoTrafego : 0

  // Score do produto
  const scoreMargem = margem >= 30 ? 2 : margem >= 15 ? 1 : 0
  const scoreRoas = roasAtual >= 3 ? 2 : roasAtual >= 2 ? 1 : 0
  const scoreViavel = lucroUnit > 0 ? 2 : 0
  const scoreTotal = scoreMargem + scoreRoas + scoreViavel
  const scoreMax = 6

  const getViabilidade = () => {
    if (scoreTotal >= 5) return { label: 'Produto viável ✓', color: '#16a34a', bg: '#f0fdf4', icon: 'ok' }
    if (scoreTotal >= 3) return { label: 'Risco moderado', color: '#d97706', bg: '#fffbeb', icon: 'warn' }
    return { label: 'Alto risco ✗', color: '#ef4444', bg: '#fff0f0', icon: 'x' }
  }
  const viab = getViabilidade()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="rounded-2xl p-7 space-y-4" style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Dados por venda</h3>
          <Input label="Preço de venda" prefix="R$" value={preco} onChange={setPreco} step={1} />
          <Input label="Custo por venda" prefix="R$" value={custoVenda} onChange={setCustoVenda} step={1} hint="Produto + frete + taxas" />
          <Input label="Custo de tráfego por venda" prefix="R$" value={custoTrafego} onChange={setCustoTrafego} step={1} hint="Quanto gasta em anúncio por venda" />
          <Input label="Custo fixo mensal" prefix="R$" value={custoFixoMes} onChange={setCustoFixoMes} step={10} />
        </div>

        {/* Validador */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: viab.bg, border: `1.5px solid ${viab.color}40` }}>
          <div className="flex items-center gap-2 mb-3">
            {viab.icon === 'ok' && <CheckCircle2 size={18} style={{ color: viab.color }} />}
            {viab.icon === 'warn' && <AlertTriangle size={18} style={{ color: viab.color }} />}
            {viab.icon === 'x' && <XCircle size={18} style={{ color: viab.color }} />}
            <h4 className="font-black text-sm" style={{ color: viab.color }}>{viab.label}</h4>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Margem', ok: margem >= 30, warn: margem >= 15, value: pct(margem) },
              { label: 'ROAS', ok: roasAtual >= 3, warn: roasAtual >= 2, value: `${roasAtual.toFixed(2)}x` },
              { label: 'Lucrativo', ok: lucroUnit > 0, warn: false, value: fmt(lucroUnit) + '/venda' },
            ].map(({ label, ok, warn, value }) => (
              <div key={label} className="flex items-center justify-between text-xs">
                <span style={{ color: '#6b6b6b' }}>{label}</span>
                <span className="font-bold" style={{ color: ok ? '#16a34a' : warn ? '#d97706' : '#ef4444' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${viab.color}20` }}>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#6b6b6b' }}>Score de viabilidade</span>
              <span className="font-black" style={{ color: viab.color }}>{scoreTotal}/{scoreMax}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e0e0' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(scoreTotal / scoreMax) * 100}%`, backgroundColor: viab.color }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-black text-base" style={{ color: '#0B0501' }}>Simulador de escala</h3>
        <p className="text-xs" style={{ color: '#9a9a9a' }}>Lucro por unidade: <strong style={{ color: lucroUnit >= 0 ? '#0B0501' : '#ef4444' }}>{fmt(lucroUnit)}</strong></p>

        <div className="space-y-3">
          {cenarios.map(qtd => {
            const rec = qtd * preco * 30
            const lucroMes = qtd * lucroUnit * 30 - custoFixoMes
            const invest = qtd * custoTrafego * 30
            const positivo = lucroMes >= 0
            return (
              <div
                key={qtd}
                className="rounded-2xl p-5 flex items-center justify-between gap-4"
                style={{ backgroundColor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <div>
                  <p className="font-black text-lg" style={{ color: '#0B0501' }}>{qtd}/dia</p>
                  <p className="text-xs" style={{ color: '#9a9a9a' }}>{(qtd * 30).toLocaleString('pt-BR')} vendas/mês</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#9a9a9a' }}>Faturamento</p>
                  <p className="font-bold text-sm" style={{ color: '#0B0501' }}>{fmt(rec)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#9a9a9a' }}>Invest. tráfego</p>
                  <p className="font-bold text-sm" style={{ color: '#0B0501' }}>{fmt(invest)}</p>
                </div>
                <div className="text-right min-w-[90px]">
                  <p className="text-xs" style={{ color: '#9a9a9a' }}>Lucro/mês</p>
                  <p className="font-black text-base" style={{ color: positivo ? '#FF6803' : '#ef4444' }}>{fmt(lucroMes)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── TABS ────────────────────────────────────────────────────────────────────
const TABS = [
  { key: 'preco', label: 'Preço', icon: DollarSign, component: TabPreco },
  { key: 'trafego', label: 'Tráfego', icon: TrendingUp, component: TabTrafego },
  { key: 'lucro', label: 'Lucro', icon: BarChart3, component: TabLucro },
  { key: 'escala', label: 'Escala', icon: Zap, component: TabEscala },
]

export default function CdeCalculator() {
  const [tab, setTab] = useState('preco')
  const active = TABS.find(t => t.key === tab)!

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={tab === key
              ? { backgroundColor: '#0B0501', color: '#fff' }
              : { backgroundColor: '#fff', color: '#6b6b6b', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }
            }
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <active.component />
    </div>
  )
}
