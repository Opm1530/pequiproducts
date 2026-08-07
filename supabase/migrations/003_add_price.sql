-- Adiciona campo price para Mercado Pago (valor em reais)
ALTER TABLE products ADD COLUMN IF NOT EXISTS price NUMERIC(10,2);

-- Renomeia stripe_price_id para mp_preference_id (já existente via ALTER)
ALTER TABLE products RENAME COLUMN stripe_price_id TO mp_preference_id;
