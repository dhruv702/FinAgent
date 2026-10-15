import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Wrench, FileSearch, TrendingUp, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';
import type { ChatMessage, ToolExecutionRecord } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  loading: boolean;
  onSendMessage: (question: string) => void;
  onClearHistory: () => void;
}

const SAMPLE_PROMPTS = [
  "What are Reliance's business segments?",
  "What is the latest stock price of RELIANCE.NS?",
  "What are the major risk factors mentioned in the annual report?",
  "What was Reliance's annual revenue, EBITDA, and net profit?",
  "Tell me about Reliance's Green Energy and Giga-factories in Jamnagar",
  "How is Jio Platforms performing in 5G and subscriber growth?",
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  loading,
  onSendMessage,
  onClearHistory,
}) => {
  const [inputQuestion, setInputQuestion] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim() || loading) return;
    onSendMessage(inputQuestion.trim());
    setInputQuestion('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleToolExpand = (id: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[550px] bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Description Header matching Gradio's title and description */}
      <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>FinAgent Workspace</span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ask questions about Reliance Industries' annual report or its latest available stock-market data.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2.5 py-1 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Clear Conversation
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4 py-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-sm border border-blue-100">
              <Bot className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              What would you like to know about Reliance?
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-md">
              FinAgent has access to two live tools: <span className="font-semibold text-slate-700">search_annual_report</span> (147 pages of audited disclosures) and <span className="font-semibold text-slate-700">get_stock_price</span> (Yahoo Finance).
            </p>

            {/* Quick Sample Questions */}
            <div className="w-full mt-6 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-left mb-2">
                Suggested Financial Queries:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {SAMPLE_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage(prompt)}
                    className="text-xs p-3 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/40 text-slate-700 hover:text-blue-900 transition-all flex items-start space-x-2 group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="line-clamp-2">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start max-w-3xl w-full gap-3">
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-semibold ${
                    msg.role === 'user'
                      ? 'bg-slate-800 text-white order-2 sm:order-2 ml-1'
                      : 'bg-blue-600 text-white order-1 mr-1 shadow-xs'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Body */}
                <div
                  className={`flex-1 rounded-2xl p-4 sm:p-5 text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white shadow-xs order-1 sm:order-1'
                      : 'bg-slate-50 border border-slate-200/90 text-slate-900 order-2'
                  }`}
                >
                  {/* Tool Call Invocation Bar (if agent executed tools) */}
                  {msg.role === 'agent' && msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <Wrench className="w-3 h-3 text-slate-400" />
                        <span>Tools Invoked ({msg.toolCalls.length})</span>
                      </div>

                      <div className="space-y-1.5">
                        {msg.toolCalls.map((tc, idx) => {
                          const toolId = `${msg.id}-tool-${idx}`;
                          const isExpanded = !!expandedTools[toolId];

                          return (
                            <div
                              key={idx}
                              className="rounded-xl border border-slate-200 bg-white text-slate-800 overflow-hidden text-xs"
                            >
                              <button
                                onClick={() => toggleToolExpand(toolId)}
                                className="w-full px-3 py-2 flex items-center justify-between bg-slate-100/70 hover:bg-slate-100 transition-colors text-left"
                              >
                                <div className="flex items-center space-x-2 truncate">
                                  {tc.tool === 'get_stock_price' ? (
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <FileSearch className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                  )}
                                  <span className="font-mono font-semibold text-[11px] text-slate-700">
                                    {tc.tool}
                                  </span>
                                  <span className="text-slate-400 text-[11px] truncate">
                                    {tc.tool === 'get_stock_price' ? `ticker="${tc.ticker}"` : `query="${tc.query}"`}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1 text-slate-400 shrink-0 ml-2">
                                  <span className="text-[10px]">inspect</span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </div>
                              </button>

                              {isExpanded && (
                                <div className="p-3 bg-slate-50 border-t border-slate-100 font-mono text-[11px] text-slate-600 overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                                  {tc.result}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Main Response Content */}
                  <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  {/* Citations block if available */}
                  {msg.role === 'agent' && msg.toolCalls?.some(t => t.citations && t.citations.length > 0) && (
                    <div className="mt-4 pt-3 border-t border-slate-200/80">
                      <div className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider mb-2">
                        Annual Report Citations:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.toolCalls.flatMap(t => t.citations || []).map((c, i) => (
                          <span
                            key={i}
                            title={c.excerpt}
                            className="inline-flex items-center text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md hover:bg-slate-100 transition-colors cursor-help"
                          >
                            Page {c.page}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bottom Footer with Copy and Timestamp */}
                  <div
                    className={`mt-3 pt-2 flex items-center justify-between text-[10px] ${
                      msg.role === 'user' ? 'text-blue-100 border-t border-blue-500/40' : 'text-slate-400 border-t border-slate-100'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className={`inline-flex items-center space-x-1 hover:underline ${
                        msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      {copiedIndex === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start max-w-3xl w-full gap-3">
            <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-blue-600 text-white shadow-xs">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="rounded-2xl p-4 bg-slate-50 border border-slate-200/90 text-slate-600 text-xs flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="font-medium text-slate-700">
                FinAgent is querying tools and synthesizing answer...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Question Input Box matching Gradio controls */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={2}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Example: What are Reliance's business segments?"
              disabled={loading}
              className="w-full text-xs sm:text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all pr-24 disabled:opacity-60"
            />
            <div className="absolute right-2.5 bottom-3.5 flex items-center space-x-1.5">
              <button
                type="submit"
                disabled={!inputQuestion.trim() || loading}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-colors shadow-xs disabled:opacity-50 disabled:pointer-events-none flex items-center space-x-1"
              >
                <span>Ask FinAgent</span>
                <Send className="w-3 h-3 ml-0.5" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Press Enter to ask, Shift+Enter for new line</span>
            <span>Yahoo Finance & Annual Report Tools Active</span>
          </div>
        </form>
      </div>
    </div>
  );
};
