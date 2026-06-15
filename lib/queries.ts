import pool from './db'

async function query(sql: string, params?: unknown[]) {
  try {
    return await pool.query(sql, params)
  } catch (err: unknown) {
    const e = err as NodeJS.ErrnoException & { code?: string }
    throw new Error(`DB error [${e.code ?? 'UNKNOWN'}]: ${e.message ?? String(e)}`)
  }
}

export async function getUserByEmail(email: string) {
  const { rows } = await query(
    'SELECT id, email, password_hash, role FROM users WHERE email = $1',
    [email]
  )
  return rows[0] ?? null
}

export async function createUser(email: string, passwordHash: string) {
  const { rows } = await query(
    `INSERT INTO users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING
     RETURNING id, email, role`,
    [email, passwordHash]
  )
  return rows[0] ?? null
}

export async function getUserProducts(userId: string): Promise<string[]> {
  const { rows } = await query(
    'SELECT product_slug FROM user_products WHERE user_id = $1',
    [userId]
  )
  return rows.map(r => r.product_slug)
}

export async function hasProductAccess(userId: string, slug: string): Promise<boolean> {
  const { rows } = await query(
    'SELECT 1 FROM user_products WHERE user_id = $1 AND product_slug = $2',
    [userId, slug]
  )
  return rows.length > 0
}

export async function grantProductAccess(userId: string, slug: string, orderId?: string) {
  await query(
    `INSERT INTO user_products (user_id, product_slug, kiwify_order_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_slug) DO NOTHING`,
    [userId, slug, orderId ?? null]
  )
}

export async function getCdeParams() {
  const { rows } = await query(
    'SELECT * FROM cde_params ORDER BY order_index'
  )
  return rows
}

export async function getCreatives() {
  const { rows } = await query(
    'SELECT * FROM creatives ORDER BY created_at DESC'
  )
  return rows
}

export async function getInfluencers() {
  const { rows } = await query(
    'SELECT * FROM influencers ORDER BY name'
  )
  return rows
}
