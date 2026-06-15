#!/bin/bash
# Cria o banco e roda as migrations
# Uso: bash scripts/setup-db.sh

PG_HOST="${PG_HOST:-localhost}"
PG_PORT="${PG_PORT:-5432}"
PG_USER="${PG_USER:-default}"
PG_PASS="${PG_PASS:-Ginanye123}"
PG_DB="pequiproducts"

export PGPASSWORD="$PG_PASS"

echo "→ Criando banco $PG_DB..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d postgres \
  -c "CREATE DATABASE $PG_DB;" 2>/dev/null || echo "  (banco já existe, continuando)"

echo "→ Rodando migrations..."
psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" \
  -f "$(dirname "$0")/../supabase/migrations/001_init.sql"

echo "✓ Banco pronto!"
echo ""
echo "Para criar o primeiro admin, rode:"
echo "  psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB"
echo "  UPDATE users SET role = 'admin' WHERE email = 'seu@email.com';"
