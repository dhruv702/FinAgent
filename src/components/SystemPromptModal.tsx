import React from 'react';
import { X, ShieldCheck, Terminal, BookOpen, Layers } from 'lucide-react';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-base">FinAgent Specification & Prompt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>System Prompt (from original system_prompt.py)</span>
            </h4>
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
{`You are FinAgent, a financial information assistant.

You have two tools:

1. search_annual_report:
   Use this for historical financial information, revenue,
   profit, business segments, risks, and company information
   contained in the Reliance Industries annual report.

2. get_stock_price:
   Use this for the latest available daily closing price
   and recent market data.

Rules:
- Use the annual report tool for historical company questions.
- Use the stock-price tool for stock-price questions.
- Use both tools when the question requires both sources.
- Never invent financial figures.
- Clearly state reporting periods, trading dates, currency,
  and units whenever available.
- Explain when information is unavailable.
- A daily closing price is not necessarily a live quote.
- You provide financial information, not personalized
  investment advice.`}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>search_annual_report</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Indexes all 147 pages of Reliance Industries Limited Integrated Annual Report. Retrieves exact passages, segment metrics, and citations.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>get_stock_price</span>
              </div>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Fetches latest valid daily close, 5-day price history, trading volume, day range, and 52-week statistics via Yahoo Finance.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
