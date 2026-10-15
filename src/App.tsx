import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { StockCard } from './components/StockCard';
import { ReportExplorer } from './components/ReportExplorer';
import { SystemPromptModal } from './components/SystemPromptModal';
import type { ChatMessage, StockData } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'stock' | 'report'>('agent');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stock, setStock] = useState<StockData | null>(null);
  const [stockLoading, setStockLoading] = useState<boolean>(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  // Fetch initial stock data for RELIANCE.NS on mount
  useEffect(() => {
    fetchStockQuote('RELIANCE.NS');
  }, []);

  const fetchStockQuote = async (ticker: string = 'RELIANCE.NS') => {
    setStockLoading(true);
    try {
      const res = await fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}`);
      if (res.ok) {
        const data = await res.json();
        setStock(data);
      }
    } catch (err) {
      console.error('Failed to fetch stock quote:', err);
    } finally {
      setStockLoading(false);
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: data.answer || 'No response returned from FinAgent.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolCalls: data.toolCalls || [],
        stockSnapshot: data.stockSnapshot,
      };

      setMessages((prev) => [...prev, agentMessage]);

      if (data.stockSnapshot) {
        setStock(data.stockSnapshot);
      }
    } catch (err: any) {
      console.error('Agent query failed:', err);
      const errorMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: `An error occurred while contacting FinAgent: ${err.message || err}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestionFromTab = (question: string) => {
    setActiveTab('agent');
    handleSendMessage(question);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPromptInfo={() => setIsPromptModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'agent' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Primary Chat / Query Workspace */}
            <div className="lg:col-span-8">
              <ChatInterface
                messages={messages}
                loading={loading}
                onSendMessage={handleSendMessage}
                onClearHistory={handleClearHistory}
              />
            </div>

            {/* Side Overview / Live Stock Widget */}
            <div className="lg:col-span-4 space-y-6">
              <StockCard
                stock={stock}
                loading={stockLoading}
                onRefresh={fetchStockQuote}
                onAskAboutStock={(ticker) => handleSendMessage(`What is the latest stock price and trading data for ${ticker}?`)}
              />

              {/* Quick Info Box */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-1">Reliance Industries Factsheet</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Integrated Annual Report disclosures and audited financials at your fingertips.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Headquarters</span>
                    <span className="font-semibold text-slate-700">Mumbai, India</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Chairman & MD</span>
                    <span className="font-semibold text-slate-700">Mukesh D. Ambani</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-400">Core Businesses</span>
                    <span className="font-semibold text-slate-700">O2C, Retail, Jio, New Energy</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Net Carbon Zero</span>
                    <span className="font-semibold text-emerald-600">Target 2035</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('report')}
                  className="w-full mt-4 text-xs font-semibold text-center text-blue-600 hover:text-blue-700 bg-blue-50/60 hover:bg-blue-50 py-2.5 rounded-xl transition-colors border border-blue-100/60 block"
                >
                  Explore All 6 Business Segments &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <StockCard
              stock={stock}
              loading={stockLoading}
              onRefresh={fetchStockQuote}
              onAskAboutStock={(ticker) => handleAskQuestionFromTab(`What is the latest stock price and trading data for ${ticker}?`)}
            />
          </div>
        )}

        {activeTab === 'report' && (
          <ReportExplorer onAskQuestion={handleAskQuestionFromTab} />
        )}
      </main>

      {/* System Prompt & Architecture Modal */}
      <SystemPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
};
