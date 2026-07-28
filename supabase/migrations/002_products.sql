-- Tabela de produtos dinâmicos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'content' CHECK (type IN ('tool', 'video', 'content', 'service')),
  access_type TEXT NOT NULL DEFAULT 'paid' CHECK (access_type IN ('free', 'paid', 'whatsapp')),
  is_active BOOLEAN DEFAULT true,
  whatsapp_message TEXT,
  stripe_price_id TEXT,
  kiwify_url TEXT,
  features JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Migrar produtos hardcoded
INSERT INTO products (slug, code, name, description, type, access_type, features, order_index) VALUES
  ('cde',   'CDE',   'Calculadora de Ecom',          'Saiba exatamente quanto investir, qual margem praticar e quando escalar — antes de gastar R$1 em anúncio.', 'tool',    'free',     '["Cálculo de margem e ticket médio","ROI e ponto de equilíbrio","Projeção de faturamento","Funciona para qualquer nicho"]', 0),
  ('bdaqv', 'BDAQV', 'Banco de Criativos que Vendem', 'Centenas de criativos testados e aprovados, organizados por nicho. Pare de criar do zero.',                  'content', 'paid',     '["Criativos segmentados por nicho","Formatos para feed, stories e reels","Prontos para veicular"]',                        1),
  ('bdi',   'BDI',   'Lista de Influenciadores',      'Base curada de influenciadores prontos para fechar parceria.',                                                'content', 'paid',     '["Influenciadores por nicho e segmento","Dados de contato e perfil","Filtros por tamanho de audiência"]',                  2);

INSERT INTO products (slug, code, name, description, type, access_type, whatsapp_message, order_index) VALUES
  ('atq', 'ATQ',  'Autoqui',       'A solução ideal para quem está começando ou quer automatizar processos de venda.',                                     'service', 'whatsapp', 'Olá! Tenho interesse no ATQ - Autoqui. Pode me passar mais informações?',        3),
  ('cdl', 'CDL',  'Criação de Loja','Sua loja online do zero, pronta para vender.',                                                                        'service', 'whatsapp', 'Olá! Tenho interesse na CDL - Criação de Loja. Pode me passar mais informações?', 4);

INSERT INTO products (slug, code, name, description, type, access_type, whatsapp_message, features, order_index) VALUES
  ('pe', 'P.E', 'Pequi Express', 'Loja criada ou otimizada, Instagram profissional e 2 meses de acompanhamento.',      'service', 'whatsapp', 'Olá! Tenho interesse no P.E - Pequi Express. Pode me passar mais informações?', '["Criação ou otimização de e-commerce","Instagram 10x","2 meses de acompanhamento"]', 5),
  ('pl', 'P.L', 'Pequi Light',   'Otimização da sua loja, presença no Instagram e gestão de anúncios.',               'service', 'whatsapp', 'Olá! Tenho interesse no P.L - Pequi Light. Pode me passar mais informações?',   '["Otimização de e-commerce","Instagram 10x","Escala Ads"]',                          6),
  ('pp', 'P.P', 'Pequi Prime',   'Nossa solução mais completa. Loja, Instagram, anúncios e marketplaces.',            'service', 'whatsapp', 'Olá! Tenho interesse no P.P - Pequi Prime. Pode me passar mais informações?',   '["Otimização de e-commerce","Instagram 10x","Escala Ads","Marketplace Pro"]',        7);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
