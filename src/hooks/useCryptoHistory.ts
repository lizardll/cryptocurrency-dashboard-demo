import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CryptoHistoryRecord } from '../types/crypto';

export const useCryptoHistory = (coinId: string | null) => {
  const [history, setHistory] = useState<CryptoHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('crypto_history')
          .select('*')
          .eq('coin_id', coinId)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error) throw error;
        setHistory(data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [coinId]);

  return { history, loading };
};
