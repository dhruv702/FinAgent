import React, { useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Calendar, DollarSign, Activity, AlertCircle } from 'lucide-react';
import type { StockData } from '../types';

interface StockCardProps {
  stock: StockData | null;
  loading: boolean;
  onRefresh: (ticker?: string) => void;
  onAskAboutStock: (ticker: string) => void;
}

export const StockCard: React.FC<StockCardProps> = ({
  stock,
  loading,
  onRefresh,
  onAskAboutStock,
}) => {
  const [tickerInput, setTickerInput] = useState('');

  const handleSearchTicker = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      onRefresh(tickerInput.trim().toUpperCase());
      setTickerInput('');
    }
  };

  const isPositive = (stock?.change ?? 0) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs border border-emerald-100">
            {stock?.currency === 'INR' ? '₹' : '$'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 tracking-tight text-base">
                {stock?.ticker || 'RELIANCE.NS'}
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                NSE / BSE
              </span>
            </div>
            <p className="text-xs text-slate-500">Reliance Industries Limited</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onRefresh(stock?.ticker || 'RELIANCE.NS')}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh stock quote"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Stock Metrics */}
      <div className="p-5">
        {loading && !stock ? (
          <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            <p className="text-sm">Fetching latest Yahoo Finance quote...</p>
          </div>
        ) : stock ? (
          <div>
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {stock.currency === 'INR' ? '₹' : ''}
                  {stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-xs font-normal text-slate-400 ml-1.5">{stock.currency}</span>
                </div>
                {stock.change !== undefined && (
                  <div className={`flex items-center text-xs font-semibold mt-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
                    <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                    <span className="ml-1">({isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%)</span>
                    <span className="text-slate-400 font-normal ml-2">vs previous close</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                  <span>{stock.tradingDate}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Daily Close</div>
              </div>
            </div>

            {/* Quick Mini Sparkline of Recent 5 Days */}
            {stock.history && stock.history.length > 1 && (
              <div className="mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                <div className="text-[11px] font-medium text-slate-500 mb-2 flex justify-between items-center">
                  <span>Recent 5-Day Trend</span>
                  <span className="text-[10px] text-slate-400">Daily Close</span>
                </div>
                <div className="flex items-end justify-between h-14 space-x-1.5 pt-2">
                  {stock.history.map((h, i) => {
                    const min = Math.min(...stock.history!.map(x => x.close));
                    const max = Math.max(...stock.history!.map(x => x.close));
                    const range = max - min || 1;
                    const heightPercent = Math.max(20, Math.min(100, ((h.close - min) / range) * 80 + 20));

                    return (
                      <div key={i} className="flex-1 flex flex-col items-center group relative">
                        {/* Tooltip on hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10">
                          {h.date}: ₹{h.close.toFixed(1)}
                        </div>
                        <div
                          className={`w-full rounded-t transition-all ${
                            i === stock.history!.length - 1
                              ? 'bg-blue-600'
                              : 'bg-slate-300 group-hover:bg-blue-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                        <span className="text-[9px] text-slate-400 mt-1 truncate max-w-full">
                          {h.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-4">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-slate-400 text-[10px] uppercase font-medium">Prev Close</div>
                <div className="font-semibold text-slate-700 mt-0.5">
                  {stock.previousClose ? `₹${stock.previousClose.toFixed(2)}` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-slate-400 text-[10px] uppercase font-medium">Day Range</div>
                <div className="font-semibold text-slate-700 mt-0.5 truncate">
                  {stock.dayLow && stock.dayHigh ? `₹${stock.dayLow.toFixed(0)} - ₹${stock.dayHigh.toFixed(0)}` : '—'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-slate-400 text-[10px] uppercase font-medium">52-Wk Range</div>
                <div className="font-semibold text-slate-700 mt-0.5 truncate">
                  {stock.fiftyTwoWeekLow && stock.fiftyTwoWeekHigh
                    ? `₹${stock.fiftyTwoWeekLow.toFixed(0)} - ₹${stock.fiftyTwoWeekHigh.toFixed(0)}`
                    : '—'}
                </div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-slate-400 text-[10px] uppercase font-medium">Volume</div>
                <div className="font-semibold text-slate-700 mt-0.5">
                  {stock.volume ? `${(stock.volume / 1000000).toFixed(2)}M` : '—'}
                </div>
              </div>
            </div>

            {/* Note & Action */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 gap-2">
              <div className="flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Valid daily close returned by Yahoo Finance. Not a live tick.</span>
              </div>
              <button
                onClick={() => onAskAboutStock(stock.ticker)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline self-end sm:self-auto"
              >
                Ask FinAgent about {stock.ticker} &rarr;
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-sm">
            Stock information unavailable.
          </div>
        )}

        {/* Ticker Lookup Bar */}
        <form onSubmit={handleSearchTicker} className="mt-4 pt-3 border-t border-slate-100 flex items-center space-x-2">
          <input
            type="text"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            placeholder="Query ticker (e.g. TCS.NS, INFY.NS)"
            className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          <button
            type="submit"
            className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors"
          >
            Fetch
          </button>
        </form>
      </div>
    </div>
  );
};
