'use client'

import { DbProduct } from '@/lib/queries'
import { saveProduct, removeProduct } from './actions'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

type Props = { product?: DbProduct }

const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
const inputStyle = { backgroundColor: '#f5f5f5', border: '1.5px solid #e0e0e0', color: '#0B0501' }

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1" style={{ color: '#0B0501' }}>{label}</label>
      {hint && <p className="text-xs mb-1.5" style={{ color: '#9a9a9a' }}>{hint}</p>}
      {children}
    </div>
  )
}

export default function ProductForm({ product }: Props) {
  const [accessType, setAccessType] = useState(product?.access_type ?? 'paid')
  const isEdit = !!product

  return (
    <form action={saveProduct} className="space-y-5">
      {isEdit && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Código" hint="Ex: CDE, BDAQV, P.E">
          <input name="code" defaultValue={product?.code} required className={inputClass} style={inputStyle} />
        </Field>
        <Field label="Slug" hint="Ex: cde, bdaqv (sem espaços)">
          <input name="slug" defaultValue={product?.slug} required className={inputClass} style={inputStyle} />
        </Field>
      </div>

      <Field label="Nome do produto">
        <input name="name" defaultValue={product?.name} required className={inputClass} style={inputStyle} />
      </Field>

      <Field label="Descrição">
        <textarea name="description" defaultValue={product?.description ?? ''} rows={3}
          className={inputClass} style={{ ...inputStyle, resize: 'vertical' }} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo de produto">
          <select name="type" defaultValue={product?.type ?? 'content'} className={inputClass} style={inputStyle}>
            <option value="tool">Ferramenta</option>
            <option value="video">Vídeo / Curso</option>
            <option value="content">Conteúdo</option>
            <option value="service">Serviço</option>
          </select>
        </Field>
        <Field label="Tipo de acesso">
          <select
            name="access_type"
            value={accessType}
            onChange={e => setAccessType(e.target.value as 'free' | 'paid' | 'whatsapp')}
            className={inputClass}
            style={inputStyle}
          >
            <option value="free">Grátis (cadastro)</option>
            <option value="paid">Pago (Stripe)</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </Field>
      </div>

      {accessType === 'paid' && (
        <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: '#fff8f5', border: '1.5px solid #FF680330' }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#FF6803' }}>Configuração Mercado Pago</p>
          <Field label="Preço (R$)" hint="Valor que será cobrado via Mercado Pago">
            <input name="price" type="number" step="0.01" min="0"
              defaultValue={product?.price ?? ''} className={inputClass} style={inputStyle} placeholder="97.00" />
          </Field>
        </div>
      )}

      {accessType === 'whatsapp' && (
        <Field label="Mensagem WhatsApp" hint="Texto pré-preenchido ao clicar no botão">
          <textarea name="whatsapp_message" defaultValue={product?.whatsapp_message ?? ''} rows={2}
            className={inputClass} style={{ ...inputStyle, resize: 'vertical' }} />
        </Field>
      )}

      {accessType !== 'whatsapp' && (
        <input type="hidden" name="whatsapp_message" value="" />
      )}
      {accessType !== 'paid' && (
        <input type="hidden" name="price" value="" />
      )}

      <Field label="Features / Itens inclusos" hint="Uma por linha">
        <textarea
          name="features"
          defaultValue={Array.isArray(product?.features) ? product.features.join('\n') : ''}
          rows={4}
          className={inputClass}
          style={{ ...inputStyle, resize: 'vertical' }}
          placeholder={"Cálculo de margem\nROI e ponto de equilíbrio\nFunciona para qualquer nicho"}
        />
      </Field>

      <Field label="Ordem de exibição">
        <input name="order_index" type="number" defaultValue={product?.order_index ?? 0} className={inputClass} style={inputStyle} />
      </Field>

      <div className="flex items-center justify-between pt-2">
        <button
          type="submit"
          className="px-7 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: '#FF6803', color: '#fff' }}
        >
          {isEdit ? 'Salvar alterações' : 'Criar produto'}
        </button>

        {isEdit && (
          <form action={removeProduct}>
            <input type="hidden" name="id" value={product.id} />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-70"
              style={{ backgroundColor: '#fff0f0', color: '#ef4444' }}
              onClick={e => { if (!confirm('Tem certeza? Isso não pode ser desfeito.')) e.preventDefault() }}
            >
              <Trash2 size={14} />
              Excluir produto
            </button>
          </form>
        )}
      </div>
    </form>
  )
}
