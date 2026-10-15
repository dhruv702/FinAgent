export interface Citation {
  page: number;
  excerpt: string;
}

export interface StockData {
  ticker: string;
  price: number;
  currency: string;
  tradingDate: string;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  dayHigh?: number;
  dayLow?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  volume?: number;
  history?: { date: string; close: number }[];
  rawText: string;
}

export interface ToolExecutionRecord {
  tool: 'search_annual_report' | 'get_stock_price';
  query?: string;
  ticker?: string;
  result: string;
  citations?: Citation[];
  stockData?: StockData;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  toolCalls?: ToolExecutionRecord[];
  stockSnapshot?: StockData;
  isLoading?: boolean;
  error?: boolean;
}
