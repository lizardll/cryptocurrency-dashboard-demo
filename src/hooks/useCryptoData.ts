import { useState, useEffect, useCallback, useRef } from 'react';
import { CryptoTicker, CryptoApiResponse } from '../types/crypto';
import { supabase } from '../lib/supabase';

const API_BASE_URL = 'https://api.coinlore.net/api';
const REFRESH_INTERVAL = 5000; // 5 seconds

export const useCryptoData = () => {
  const [coins, setCoins] = useState<CryptoTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [changedCoins, setChangedCoins] = useState<Set<string>>(new Set());
  const previousDataRef = useRef<Map<string, string>>(new Map());

  const saveToDatabase = async (coin: CryptoTicker) => {
    try {
      const { error } = await supabase.from('crypto_history').insert({
        coin_id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price_usd: parseFloat(coin.price_usd),
        percent_change_24h: coin.percent_change_24h ? parseFloat(coin.percent_change_24h) : null,
        percent_change_1h: coin.percent_change_1h ? parseFloat(coin.percent_change_1h) : null,
        percent_change_7d: coin.percent_change_7d ? parseFloat(coin.percent_change_7d) : null,
        market_cap_usd: coin.market_cap_usd ? parseFloat(coin.market_cap_usd) : null,
        volume24: coin.volume24 || null,
        rank: coin.rank,
      });

      if (error) {
        console.error('Error saving to database:', error);
      }
    } catch (err) {
      console.error('Error saving to database:', err);
    }
  };

  const fetchCryptoData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tickers/?start=0&limit=20`);
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }

      const data: CryptoApiResponse = await response.json();
      const newCoins = data.data;

      // Detect changes
      const changed = new Set<string>();
      newCoins.forEach((coin) => {
        const previousPrice = previousDataRef.current.get(coin.id);
        if (previousPrice && previousPrice !== coin.price_usd) {
          changed.add(coin.id);
          // Save to database when price changes
          saveToDatabase(coin);
        } else if (!previousPrice) {
          // First time seeing this coin, save it
          saveToDatabase(coin);
        }
        previousDataRef.current.set(coin.id, coin.price_usd);
      });

      if (changed.size > 0) {
        setChangedCoins(changed);
        // Clear the changed state after animation
        setTimeout(() => {
          setChangedCoins(new Set());
        }, 1000);
      }

      setCoins(newCoins);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchCryptoData]);

  return { coins, loading, error, changedCoins };
};
