export interface CryptoTicker {
  id: string;
  symbol: string;
  name: string;
  nameid: string;
  rank: number;
  price_usd: string;
  percent_change_24h: string;
  percent_change_1h: string;
  percent_change_7d: string;
  price_btc: string;
  market_cap_usd: string;
  volume24: number;
  volume24a: number;
  csupply: string;
  tsupply: string;
  msupply: string;
}

export interface CryptoApiResponse {
  data: CryptoTicker[];
  info: {
    coins_num: number;
    time: number;
  };
}

export interface CryptoHistoryRecord {
  id?: string;
  coin_id: string;
  symbol: string;
  name: string;
  price_usd: number;
  percent_change_24h: number | null;
  percent_change_1h: number | null;
  percent_change_7d: number | null;
  market_cap_usd: number | null;
  volume24: number | null;
  rank: number;
  created_at?: string;
}
