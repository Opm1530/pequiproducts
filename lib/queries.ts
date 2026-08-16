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

// ─── Courses ───────────────────────────────────────────────────────────────

export type CourseModule = {
  id: string; product_slug: string; title: string; order_index: number
  lessons: CourseLesson[]
}
export type CourseLesson = {
  id: string; module_id: string; title: string; video_url: string | null
  duration_minutes: number | null; description: string | null; order_index: number
}
export type LessonComment = {
  id: string; lesson_id: string; user_id: string; content: string
  created_at: string; user_email: string
}

export async function getCourseModules(slug: string): Promise<CourseModule[]> {
  const { rows: modules } = await query(
    'SELECT * FROM course_modules WHERE product_slug = $1 ORDER BY order_index', [slug]
  )
  const { rows: lessons } = await query(
    `SELECT l.* FROM course_lessons l
     JOIN course_modules m ON l.module_id = m.id
     WHERE m.product_slug = $1 ORDER BY l.order_index`, [slug]
  )
  return modules.map((m: CourseModule) => ({
    ...m,
    lessons: lessons.filter((l: CourseLesson) => l.module_id === m.id),
  }))
}

export async function getLessonComments(lessonId: string): Promise<LessonComment[]> {
  const { rows } = await query(
    `SELECT c.*, u.email as user_email FROM lesson_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.lesson_id = $1 ORDER BY c.created_at`, [lessonId]
  )
  return rows
}

export async function addLessonComment(lessonId: string, userId: string, content: string) {
  const { rows } = await query(
    `INSERT INTO lesson_comments (lesson_id, user_id, content)
     VALUES ($1, $2, $3) RETURNING *`, [lessonId, userId, content]
  )
  return rows[0]
}

export async function getLessonProgress(userId: string, slug: string): Promise<string[]> {
  const { rows } = await query(
    `SELECT lp.lesson_id FROM lesson_progress lp
     JOIN course_lessons l ON lp.lesson_id = l.id
     JOIN course_modules m ON l.module_id = m.id
     WHERE lp.user_id = $1 AND m.product_slug = $2`, [userId, slug]
  )
  return rows.map(r => r.lesson_id)
}

export async function toggleLessonComplete(userId: string, lessonId: string): Promise<boolean> {
  const { rows } = await query(
    'SELECT id FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
    [userId, lessonId]
  )
  if (rows.length > 0) {
    await query('DELETE FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2', [userId, lessonId])
    return false
  } else {
    await query('INSERT INTO lesson_progress (user_id, lesson_id) VALUES ($1, $2)', [userId, lessonId])
    return true
  }
}

export async function createModule(slug: string, title: string, orderIndex: number) {
  const { rows } = await query(
    'INSERT INTO course_modules (product_slug, title, order_index) VALUES ($1,$2,$3) RETURNING *',
    [slug, title, orderIndex]
  )
  return rows[0]
}

export async function updateModule(id: string, data: { title?: string; order_index?: number }) {
  const fields = Object.entries(data).map(([k], i) => `${k} = $${i + 2}`).join(', ')
  const { rows } = await query(
    `UPDATE course_modules SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...Object.values(data)]
  )
  return rows[0]
}

export async function deleteModule(id: string) {
  await query('DELETE FROM course_modules WHERE id = $1', [id])
}

export async function createLesson(moduleId: string, data: {
  title: string; video_url?: string; duration_minutes?: number
  description?: string; order_index: number
}) {
  const { rows } = await query(
    `INSERT INTO course_lessons (module_id, title, video_url, duration_minutes, description, order_index)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [moduleId, data.title, data.video_url ?? null, data.duration_minutes ?? null, data.description ?? null, data.order_index]
  )
  return rows[0]
}

export async function updateLesson(id: string, data: Partial<{
  title: string; video_url: string; duration_minutes: number; description: string; order_index: number
}>) {
  const fields = Object.entries(data).map(([k], i) => `${k} = $${i + 2}`).join(', ')
  const { rows } = await query(
    `UPDATE course_lessons SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...Object.values(data)]
  )
  return rows[0]
}

export async function deleteLesson(id: string) {
  await query('DELETE FROM course_lessons WHERE id = $1', [id])
}

// ─── Products (dynamic) ────────────────────────────────────────────────────

export type DbProduct = {
  id: string
  slug: string
  code: string
  name: string
  description: string | null
  type: 'tool' | 'video' | 'content' | 'service' | 'course'
  access_type: 'free' | 'paid' | 'whatsapp'
  is_active: boolean
  whatsapp_message: string | null
  mp_preference_id: string | null
  price: number | string | null
  kiwify_url: string | null
  landing_page_url: string | null
  whatsapp_url: string | null
  features: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export async function getProducts(): Promise<DbProduct[]> {
  const { rows } = await query(
    'SELECT * FROM products WHERE is_active = true ORDER BY order_index'
  )
  return rows
}

export async function getAllProducts(): Promise<DbProduct[]> {
  const { rows } = await query(
    'SELECT * FROM products ORDER BY order_index'
  )
  return rows
}

export async function getProductBySlug(slug: string): Promise<DbProduct | null> {
  const { rows } = await query(
    'SELECT * FROM products WHERE slug = $1',
    [slug]
  )
  return rows[0] ?? null
}

export async function getProductByMpPreference(prefId: string): Promise<DbProduct | null> {
  const { rows } = await query(
    'SELECT * FROM products WHERE mp_preference_id = $1',
    [prefId]
  )
  return rows[0] ?? null
}

export async function createProduct(data: {
  slug: string; code: string; name: string; description?: string
  type: string; access_type: string; whatsapp_message?: string
  whatsapp_url?: string; landing_page_url?: string
  price?: number; kiwify_url?: string; features?: string[]; order_index?: number
}): Promise<DbProduct> {
  const { rows } = await query(
    `INSERT INTO products (slug, code, name, description, type, access_type, whatsapp_message, whatsapp_url, landing_page_url, price, kiwify_url, features, order_index)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [
      data.slug, data.code, data.name, data.description ?? null,
      data.type, data.access_type, data.whatsapp_message ?? null,
      data.whatsapp_url ?? null, data.landing_page_url ?? null,
      data.price ?? null, data.kiwify_url ?? null,
      JSON.stringify(data.features ?? []), data.order_index ?? 0,
    ]
  )
  return rows[0]
}

export async function updateProduct(id: string, data: Partial<{
  code: string; name: string; description: string; type: string
  access_type: string; whatsapp_message: string; whatsapp_url: string
  landing_page_url: string; price: number
  kiwify_url: string; features: string[]; order_index: number; is_active: boolean
}>): Promise<DbProduct> {
  const fields = Object.entries(data)
    .map(([k, v], i) => `${k} = $${i + 2}`)
    .join(', ')
  const values = Object.values(data).map(v =>
    Array.isArray(v) ? JSON.stringify(v) : v
  )
  const { rows } = await query(
    `UPDATE products SET ${fields} WHERE id = $1 RETURNING *`,
    [id, ...values]
  )
  return rows[0]
}

export async function deleteProduct(id: string): Promise<void> {
  await query('DELETE FROM products WHERE id = $1', [id])
}
