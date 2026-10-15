import React from 'react';
import { TrendingUp, FileText, Database, ShieldCheck, Info } from 'lucide-react';

interface HeaderProps {
  onOpenPromptInfo: () => void;
  activeTab: 'agent' | 'report' | 'stock';
  setActiveTab: (tab: 'agent' | 'report' | 'stock') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPromptInfo,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">FinAgent</h1>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  RIL Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Reliance Industries Annual Report Analysis & Market Data
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-sm font-medium">
            <button
              onClick={() => setActiveTab('agent')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'agent'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Agent Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'stock'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>RELIANCE.NS</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'report'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report Explorer</span>
            </button>
          </div>

          {/* Right Action buttons / Tool indicators */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenPromptInfo}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              title="View Agent System Prompt and Tool Configuration"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden md:inline">System Spec</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
