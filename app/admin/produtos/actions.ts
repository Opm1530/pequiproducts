'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createProduct, updateProduct, deleteProduct } from '@/lib/queries'

export async function toggleProductActive(formData: FormData) {
  const id = formData.get('id') as string
  const is_active = formData.get('is_active') === 'true'
  await updateProduct(id, { is_active })
  revalidatePath('/admin/produtos')
}

export async function saveProduct(formData: FormData) {
  const id = formData.get('id') as string | null
  const features = (formData.get('features') as string)
    .split('\n')
    .map(f => f.trim())
    .filter(Boolean)

  const data = {
    slug: formData.get('slug') as string,
    code: formData.get('code') as string,
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    type: formData.get('type') as string,
    access_type: formData.get('access_type') as string,
    whatsapp_message: formData.get('whatsapp_message') as string || undefined,
    price: parseFloat(formData.get('price') as string) || undefined,
    features,
    order_index: parseInt(formData.get('order_index') as string) || 0,
  }

  if (id) {
    await updateProduct(id, data)
  } else {
    await createProduct(data)
  }

  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
}

export async function removeProduct(formData: FormData) {
  const id = formData.get('id') as string
  await deleteProduct(id)
  revalidatePath('/admin/produtos')
  redirect('/admin/produtos')
}
