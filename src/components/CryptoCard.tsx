import React from 'react';
import { CryptoTicker } from '../types/crypto';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface CryptoCardProps {
  coin: CryptoTicker;
  isChanged: boolean;
  onClick: () => void;
}

export const CryptoCard: React.FC<CryptoCardProps> = ({ coin, isChanged, onClick }) => {
  const priceChange24h = parseFloat(coin.percent_change_24h);
  const isPositive = priceChange24h >= 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-surface/80 
        border border-border p-6 cursor-pointer
        transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/20
        ${isChanged ? 'animate-pulse-glow' : ''}
      `}
    >
      {/* Animated background gradient on change */}
      {isChanged && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 animate-gradient" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text">{coin.symbol}</h3>
              <p className="text-sm text-textSecondary">{coin.name}</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-background/50 text-xs font-semibold text-textSecondary">
            #{coin.rank}
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-text mb-1">
            ${parseFloat(coin.price_usd).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-error" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? 'text-success' : 'text-error'
              }`}
            >
              {isPositive ? '+' : ''}
              {priceChange24h.toFixed(2)}%
            </span>
            <span className="text-xs text-textSecondary">24h</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/30 rounded-lg p-3">
            <p className="text-xs text-textSecondary mb-1">Market Cap</p>
            <p className="text-sm font-semibold text-text">
              ${(parseFloat(coin.market_cap_usd) / 1e9).toFixed(2)}B
            </p>
          </div>
          <div className="bg-background/30 rounded-lg p-3">
            <p className="text-xs text-textSecondary mb-1">Volume 24h</p>
            <p className="text-sm font-semibold text-text">
              ${(coin.volume24 / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>

        {/* Additional Changes */}
        <div className="mt-4 flex gap-4 text-xs">
          <div>
            <span className="text-textSecondary">1h: </span>
            <span
              className={
                parseFloat(coin.percent_change_1h) >= 0 ? 'text-success' : 'text-error'
              }
            >
              {parseFloat(coin.percent_change_1h) >= 0 ? '+' : ''}
              {parseFloat(coin.percent_change_1h).toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-textSecondary">7d: </span>
            <span
              className={
                parseFloat(coin.percent_change_7d) >= 0 ? 'text-success' : 'text-error'
              }
            >
              {parseFloat(coin.percent_change_7d) >= 0 ? '+' : ''}
              {parseFloat(coin.percent_change_7d).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
