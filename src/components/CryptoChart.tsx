import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CryptoHistoryRecord } from '../types/crypto';
import { X, TrendingUp } from 'lucide-react';

interface CryptoChartProps {
  coin: { id: string; symbol: string; name: string } | null;
  history: CryptoHistoryRecord[];
  loading: boolean;
  onClose: () => void;
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ coin, history, loading, onClose }) => {
  if (!coin) return null;

  const chartData = history.map((record) => ({
    time: new Date(record.created_at!).toLocaleTimeString(),
    price: parseFloat(record.price_usd.toString()),
    fullDate: new Date(record.created_at!).toLocaleString(),
  }));

  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const priceRange = maxPrice - minPrice;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-text">{coin.symbol}</h2>
                <p className="text-textSecondary">{coin.name} Price History</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-background/50 hover:bg-background transition-colors flex items-center justify-center"
            >
              <X className="w-6 h-6 text-text" />
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div className="p-6">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-textSecondary">
              <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-xl">No historical data available yet</p>
              <p className="text-sm mt-2">Data will appear as it's collected over time</p>
            </div>
          ) : (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-sm text-textSecondary mb-1">Current Price</p>
                  <p className="text-2xl font-bold text-text">
                    ${chartData[chartData.length - 1]?.price.toFixed(2)}
                  </p>
                </div>
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-sm text-textSecondary mb-1">Highest</p>
                  <p className="text-2xl font-bold text-success">${maxPrice.toFixed(2)}</p>
                </div>
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-sm text-textSecondary mb-1">Lowest</p>
                  <p className="text-2xl font-bold text-error">${minPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-background/30 rounded-xl p-4">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9E7FFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9E7FFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2F2F2F" />
                    <XAxis
                      dataKey="time"
                      stroke="#A3A3A3"
                      tick={{ fill: '#A3A3A3' }}
                      tickLine={{ stroke: '#2F2F2F' }}
                    />
                    <YAxis
                      stroke="#A3A3A3"
                      tick={{ fill: '#A3A3A3' }}
                      tickLine={{ stroke: '#2F2F2F' }}
                      domain={[minPrice - priceRange * 0.1, maxPrice + priceRange * 0.1]}
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#262626',
                        border: '1px solid #2F2F2F',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.fullDate;
                        }
                        return label;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#9E7FFF"
                      strokeWidth={3}
                      dot={{ fill: '#9E7FFF', r: 4 }}
                      activeDot={{ r: 6, fill: '#f472b6' }}
                      fill="url(#colorPrice)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <p className="text-center text-sm text-textSecondary mt-4">
                Showing {chartData.length} data points • Updates every 5 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
