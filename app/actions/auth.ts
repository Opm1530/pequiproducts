'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { getUserByEmail, createUser, grantProductAccess } from '@/lib/queries'
import { signToken, setSessionCookie, clearSessionCookie } from '@/lib/auth'

export async function login(formData: FormData) {
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string

  const user = await getUserByEmail(email)
  if (!user) return { error: 'Email ou senha incorretos.' }

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return { error: 'Email ou senha incorretos.' }

  const token = await signToken({ id: user.id, email: user.email, role: user.role })
  await setSessionCookie(token)
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const email = (formData.get('email') as string).toLowerCase().trim()
  const password = formData.get('password') as string

  if (password.length < 6) return { error: 'Senha deve ter pelo menos 6 caracteres.' }

  const existing = await getUserByEmail(email)
  if (existing) return { error: 'Este email já está cadastrado.' }

  const hash = await bcrypt.hash(password, 12)
  const user = await createUser(email, hash)
  if (!user) return { error: 'Erro ao criar conta. Tente novamente.' }

  await grantProductAccess(user.id, 'cde')

  const token = await signToken({ id: user.id, email: user.email, role: user.role })
  await setSessionCookie(token)
  redirect('/dashboard')
}

export async function logout() {
  await clearSessionCookie()
  redirect('/')
}
