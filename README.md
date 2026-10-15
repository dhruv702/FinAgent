# FinAgent

FinAgent is a full-stack financial information assistant powered by React, Node.js, Express, and Gemini API. It is tailored for querying Reliance Industries Limited's Integrated Annual Report and retrieving latest available stock-market data from Yahoo Finance.

## Features

- **Agent Workspace**: Ask natural-language questions about Reliance Industries' business segments, financials, risks, or market price data.
- **search_annual_report Tool**: Indexed against all 147 pages of Reliance Industries Limited Integrated Annual Report with exact citations and page numbers.
- **get_stock_price Tool**: Live quotes, trading dates, currencies, day ranges, and 5-day historical trend for Indian and global equities (e.g., `RELIANCE.NS`, `TCS.NS`, `INFY.NS`).
- **Report Explorer**: Interactive navigation of Reliance's 6 core business segments (Oil to Chemicals, Retail, Jio Platforms, Upstream E&P, Green Energy Giga-factories, Media & Entertainment) and MD&A risk disclosures.
- **Market Card & Sparkline**: Real-time snapshot of `RELIANCE.NS` performance, trading bounds, and volume.
- **Full Transparency**: Inspect intermediate tool invocations, queries, and citations.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Express on Node.js (served via `server.ts` with Vite middlewares)
- **AI Engine**: Google Gemini API (`gemini-3.8-flash`) with function calling and deterministic fallback
- **Financial Data**: Yahoo Finance API & preprocessed Reliance annual report text embeddings
