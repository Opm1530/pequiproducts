-- Rodar no banco "pequiproducts"
-- Criar banco antes: CREATE DATABASE pequiproducts;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User product access
CREATE TABLE user_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  kiwify_order_id TEXT,
  UNIQUE(user_id, product_slug)
);

-- CDE Calculator params
CREATE TABLE cde_params (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  default_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Default CDE params
INSERT INTO cde_params (key, label, description, default_value, unit, order_index) VALUES
  ('price',        'Preço de venda',      'Preço unitário do produto', 100,  'R$', 0),
  ('quantity',     'Quantidade vendida',  'Número de unidades vendidas', 50, 'un', 1),
  ('product_cost', 'Custo do produto',    'Custo por unidade',           30,  'R$', 2),
  ('ad_spend',     'Verba de anúncios',   'Total gasto em tráfego pago', 1500,'R$', 3),
  ('fixed_costs',  'Custos fixos',        'Plataforma, apps, etc.',       300, 'R$', 4);

-- BDAQV Creatives
CREATE TABLE creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  niche TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BDI Influencers
CREATE TABLE influencers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  photo_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  youtube_url TEXT,
  followers TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
