/*
  # Create crypto history table
  
  1. New Tables
    - `crypto_history`
      - `id` (uuid, primary key)
      - `coin_id` (text) - Cryptocurrency ID from API
      - `symbol` (text) - Coin symbol
      - `name` (text) - Coin name
      - `price_usd` (numeric) - Price in USD
      - `percent_change_24h` (numeric) - 24h price change
      - `percent_change_1h` (numeric) - 1h price change
      - `percent_change_7d` (numeric) - 7d price change
      - `market_cap_usd` (numeric) - Market cap
      - `volume24` (numeric) - 24h volume
      - `rank` (integer) - Market cap rank
      - `created_at` (timestamptz) - Record timestamp
  
  2. Security
    - Enable RLS on `crypto_history` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS crypto_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coin_id text NOT NULL,
  symbol text NOT NULL,
  name text NOT NULL,
  price_usd numeric NOT NULL,
  percent_change_24h numeric,
  percent_change_1h numeric,
  percent_change_7d numeric,
  market_cap_usd numeric,
  volume24 numeric,
  rank integer,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_crypto_history_coin_id ON crypto_history(coin_id);
CREATE INDEX IF NOT EXISTS idx_crypto_history_created_at ON crypto_history(created_at DESC);

-- Enable RLS
ALTER TABLE crypto_history ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON crypto_history
  FOR SELECT TO anon
  USING (true);

-- Allow public insert access
CREATE POLICY "Allow public insert access" ON crypto_history
  FOR INSERT TO anon
  WITH CHECK (true);