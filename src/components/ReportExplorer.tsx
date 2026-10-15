import React, { useState } from 'react';
import { FileText, Layers, ShieldAlert, DollarSign, ChevronRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { RELIANCE_FACTSHEET, type FinancialSegment } from '../data/key_financials';

interface ReportExplorerProps {
  onAskQuestion: (q: string) => void;
}

export const ReportExplorer: React.FC<ReportExplorerProps> = ({ onAskQuestion }) => {
  const [selectedSegment, setSelectedSegment] = useState<FinancialSegment>(RELIANCE_FACTSHEET.segments[0]);
  const [activeTab, setActiveTab] = useState<'segments' | 'risks' | 'highlights'>('segments');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
              {RELIANCE_FACTSHEET.reportingPeriod}
            </span>
            <span className="text-[11px] text-slate-300">
              147 Pages Indexed
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {RELIANCE_FACTSHEET.companyName}
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mb-4">
            Powering Aspirational India: Explore key business segments, historical performance metrics, and official risk disclosures.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Gross Revenue</div>
              <div className="text-base font-bold text-white mt-0.5">{RELIANCE_FACTSHEET.headlineRevenue}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">EBITDA</div>
              <div className="text-base font-bold text-white mt-0.5">{RELIANCE_FACTSHEET.ebitda}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Net Profit</div>
              <div className="text-base font-bold text-white mt-0.5">{RELIANCE_FACTSHEET.netProfit}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 uppercase font-medium">Market Position</div>
              <div className="text-base font-bold text-white mt-0.5">{RELIANCE_FACTSHEET.marketCapRank}</div>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('segments')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'segments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Core Business Segments ({RELIANCE_FACTSHEET.segments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('risks')}
          className={`pb-3 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-all ${
            activeTab === 'risks'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Annual Report Risk Disclosures</span>
        </button>
      </div>

      {activeTab === 'segments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segments List */}
          <div className="space-y-2.5">
            {RELIANCE_FACTSHEET.segments.map((seg) => {
              const isSelected = selectedSegment.name === seg.name;
              return (
                <button
                  key={seg.name}
                  onClick={() => setSelectedSegment(seg)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      {seg.category}
                    </div>
                    <div className="font-semibold text-sm mt-0.5 text-slate-900">
                      {seg.name}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>

          {/* Segment Details Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {selectedSegment.category}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {selectedSegment.name}
                </h3>
              </div>
              <button
                onClick={() => onAskQuestion(`What does the Reliance annual report disclose about ${selectedSegment.name}?`)}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask FinAgent</span>
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Overview</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedSegment.description}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Key Metrics & Scale</h4>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedSegment.keyMetrics}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Annual Report Highlights</h4>
                <ul className="space-y-2">
                  {selectedSegment.highlights.map((h, i) => (
                    <li key={i} className="flex items-start text-xs text-slate-700 space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <span className="text-xs text-slate-400 self-center">Quick prompt queries:</span>
                <button
                  onClick={() => onAskQuestion(`What was the revenue and EBITDA of Reliance's ${selectedSegment.name} segment?`)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Revenue & EBITDA of {selectedSegment.name}
                </button>
                <button
                  onClick={() => onAskQuestion(`What are the future expansion plans for ${selectedSegment.name} in the annual report?`)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Future expansion plans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'risks' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Key Enterprise & Market Risk Factors</h3>
              <p className="text-xs text-slate-500">Disclosed in Management Discussion & Analysis of Reliance Industries Annual Report</p>
            </div>
            <button
              onClick={() => onAskQuestion("What are the major risk factors highlighted in the Reliance Industries annual report?")}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask FinAgent About Risks</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {RELIANCE_FACTSHEET.riskFactors.map((rf, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-2 text-rose-600 font-semibold text-sm mb-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{rf.category}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {rf.description}
                </p>
                <button
                  onClick={() => onAskQuestion(`How does Reliance mitigate ${rf.category}?`)}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-medium mt-2 inline-flex items-center"
                >
                  Query mitigation strategy &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
