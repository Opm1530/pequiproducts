-- Add 'course' to product types
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_type_check;
ALTER TABLE products ADD CONSTRAINT products_type_check
  CHECK (type IN ('tool', 'video', 'content', 'service', 'course'));

-- Course modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL REFERENCES products(slug) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course lessons
CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT,
  duration_minutes INTEGER,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Lesson progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Lesson comments
CREATE TABLE IF NOT EXISTS lesson_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add creative details to creatives table
ALTER TABLE creatives
  ADD COLUMN IF NOT EXISTS creative_type_label TEXT,
  ADD COLUMN IF NOT EXISTS attention_points TEXT,
  ADD COLUMN IF NOT EXISTS how_to_replicate TEXT;
