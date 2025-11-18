import React, { useState } from 'react';
import { useCryptoData } from './hooks/useCryptoData';
import { useCryptoHistory } from './hooks/useCryptoHistory';
import { CryptoCard } from './components/CryptoCard';
import { CryptoChart } from './components/CryptoChart';
import { TrendingUp, RefreshCw, Activity } from 'lucide-react';

function App() {
  const { coins, loading, error, changedCoins } = useCryptoData();
  const [selectedCoin, setSelectedCoin] = useState<{
    id: string;
    symbol: string;
    name: string;
  } | null>(null);
  const { history, loading: historyLoading } = useCryptoHistory(selectedCoin?.id || null);

  if (loading && coins.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-xl text-text font-semibold">Loading crypto data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-error">
          <p className="text-xl font-semibold mb-2">Error loading data</p>
          <p className="text-textSecondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 border-b border-border">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&q=80')] opacity-5 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/50">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold text-text mb-2">
                    Crypto Dashboard
                  </h1>
                  <p className="text-xl text-textSecondary">
                    Real-time cryptocurrency market data
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-surface/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border">
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin-slow" />
                  <div>
                    <p className="text-xs text-textSecondary">Auto-refresh</p>
                    <p className="text-sm font-semibold text-text">Every 5s</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-border">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-xs text-textSecondary">Tracking</p>
                    <p className="text-sm font-semibold text-text">{coins.length} Coins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text mb-2">Top 20 Cryptocurrencies</h2>
          <p className="text-textSecondary">
            Click on any coin to view its historical price chart
          </p>
        </div>

        {/* Crypto Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {coins.map((coin) => (
            <CryptoCard
              key={coin.id}
              coin={coin}
              isChanged={changedCoins.has(coin.id)}
              onClick={() =>
                setSelectedCoin({
                  id: coin.id,
                  symbol: coin.symbol,
                  name: coin.name,
                })
              }
            />
          ))}
        </div>
      </div>

      {/* Chart Modal */}
      {selectedCoin && (
        <CryptoChart
          coin={selectedCoin}
          history={history}
          loading={historyLoading}
          onClose={() => setSelectedCoin(null)}
        />
      )}
    </div>
  );
}

export default App;
