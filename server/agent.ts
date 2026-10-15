import { Type, type FunctionDeclaration } from '@google/genai';
import { getGeminiClient } from './gemini.ts';
import { searchAnnualReport } from './tools/annualReportTool.ts';
import { getStockPrice, type StockData } from './tools/stockPriceTool.ts';

export const SYSTEM_PROMPT = `You are FinAgent, a financial information assistant.

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
  investment advice.`;

export interface ToolExecutionRecord {
  tool: 'search_annual_report' | 'get_stock_price';
  query?: string;
  ticker?: string;
  result: string;
  citations?: { page: number; excerpt: string }[];
  stockData?: StockData;
}

export interface AgentResponse {
  answer: string;
  toolCalls: ToolExecutionRecord[];
  stockSnapshot?: StockData;
}

const searchAnnualReportDeclaration: FunctionDeclaration = {
  name: 'search_annual_report',
  description: 'Search the Reliance Industries annual report for historical financial results, revenue, profit, business segments, risks, and other company information.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: 'Specific financial, operational, or business topic to search in the annual report.',
      },
    },
    required: ['query'],
  },
};

const getStockPriceDeclaration: FunctionDeclaration = {
  name: 'get_stock_price',
  description: 'Retrieve the latest available valid daily closing price and recent trading data using a Yahoo Finance ticker. Use RELIANCE.NS for Reliance Industries listed in India.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      ticker: {
        type: Type.STRING,
        description: 'Yahoo Finance stock ticker symbol (e.g., RELIANCE.NS, TCS.NS, INFY.NS).',
      },
    },
    required: ['ticker'],
  },
};

export async function runAgent(userQuestion: string): Promise<AgentResponse> {
  const question = (userQuestion || '').trim();
  if (!question) {
    return {
      answer: 'Please enter a financial question.',
      toolCalls: [],
    };
  }

  const executedTools: ToolExecutionRecord[] = [];
  let latestStockSnapshot: StockData | undefined = undefined;

  const ai = getGeminiClient();

  if (ai) {
    try {
      // Step 1: Initial invocation with tools
      const firstResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: question }],
          },
        ],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations: [searchAnnualReportDeclaration, getStockPriceDeclaration] }],
        },
      });

      const functionCalls = firstResponse.functionCalls;

      if (functionCalls && functionCalls.length > 0) {
        const functionResponseParts: any[] = [];

        for (const call of functionCalls) {
          const fnName = call.name;
          const args = (call.args || {}) as Record<string, any>;

          if (fnName === 'search_annual_report') {
            const queryArg = String(args.query || question);
            const reportResult = searchAnnualReport(queryArg);

            executedTools.push({
              tool: 'search_annual_report',
              query: queryArg,
              result: reportResult.text,
              citations: reportResult.citations,
            });

            functionResponseParts.push({
              functionResponse: {
                name: 'search_annual_report',
                response: { output: reportResult.text },
              },
            });
          } else if (fnName === 'get_stock_price') {
            const tickerArg = String(args.ticker || 'RELIANCE.NS');
            const stockResult = await getStockPrice(tickerArg);
            latestStockSnapshot = stockResult;

            executedTools.push({
              tool: 'get_stock_price',
              ticker: tickerArg,
              result: stockResult.rawText,
              stockData: stockResult,
            });

            functionResponseParts.push({
              functionResponse: {
                name: 'get_stock_price',
                response: { output: stockResult.rawText },
              },
            });
          }
        }

        // Send function responses back to the model for final synthesis
        const secondResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: question }],
            },
            firstResponse.candidates?.[0]?.content || {
              role: 'model',
              parts: functionCalls.map(c => ({ functionCall: c })),
            },
            {
              role: 'user',
              parts: functionResponseParts,
            },
          ],
          config: {
            systemInstruction: SYSTEM_PROMPT,
          },
        });

        const finalAnswer = secondResponse.text || 'No answer generated.';
        return {
          answer: finalAnswer,
          toolCalls: executedTools,
          stockSnapshot: latestStockSnapshot,
        };
      }

      // If no function call was made by the model, return text directly
      return {
        answer: firstResponse.text || 'No response returned.',
        toolCalls: [],
      };
    } catch (err: any) {
      console.warn('Gemini API call encountered an error, falling back to local orchestrator:', err?.message || err);
    }
  }

  // Fallback Deterministic Orchestrator (preserves original behavior seamlessly)
  const lower = question.toLowerCase();
  const needsStock = lower.includes('stock') || lower.includes('price') || lower.includes('share') ||
    lower.includes('ticker') || lower.includes('market') || lower.includes('quote') ||
    lower.includes('reliance.ns') || lower.includes('trading') || lower.includes('close');

  const needsReport = lower.includes('report') || lower.includes('segment') || lower.includes('revenue') ||
    lower.includes('profit') || lower.includes('ebitda') || lower.includes('risk') ||
    lower.includes('annual') || lower.includes('business') || lower.includes('reliance') ||
    lower.includes('o2c') || lower.includes('retail') || lower.includes('jio') ||
    lower.includes('financial') || lower.includes('dividend') || lower.includes('capex') ||
    !needsStock; // default to report search if ambiguous

  if (needsStock) {
    const tickerMatch = question.match(/[A-Z0-9.-]+\.NS/i) || question.match(/\b([A-Z]{3,10})\b/);
    const ticker = tickerMatch ? tickerMatch[0].toUpperCase() : 'RELIANCE.NS';
    const stockData = await getStockPrice(ticker);
    latestStockSnapshot = stockData;

    executedTools.push({
      tool: 'get_stock_price',
      ticker,
      result: stockData.rawText,
      stockData,
    });
  }

  if (needsReport) {
    const reportData = searchAnnualReport(question);
    executedTools.push({
      tool: 'search_annual_report',
      query: question,
      result: reportData.text,
      citations: reportData.citations,
    });
  }

  // Synthesize answer based on executed tools
  let synthesizedAnswer = '';

  if (executedTools.some(t => t.tool === 'get_stock_price') && executedTools.some(t => t.tool === 'search_annual_report')) {
    const stock = executedTools.find(t => t.tool === 'get_stock_price')?.stockData;
    const report = executedTools.find(t => t.tool === 'search_annual_report');

    synthesizedAnswer = `### Reliance Industries Overview & Market Analysis

**1. Current Market Data (${stock?.ticker || 'RELIANCE.NS'}):**
- **Latest Available Daily Close:** ${stock?.price.toFixed(2)} ${stock?.currency}
- **Trading Date:** ${stock?.tradingDate}
- **Day Change:** ${stock?.change !== undefined && stock.change >= 0 ? '+' : ''}${stock?.change?.toFixed(2)} (${stock?.changePercent !== undefined && stock.changePercent >= 0 ? '+' : ''}${stock?.changePercent?.toFixed(2)}%)
- *Note:* Daily closing prices represent the latest valid end-of-day market print and not necessarily a live intraday quote.

**2. Annual Report Insights:**
${report?.result}

*Disclaimer: This information is provided for financial research and information purposes only, not personalized investment advice.*`;
  } else if (executedTools.some(t => t.tool === 'get_stock_price')) {
    const stock = executedTools.find(t => t.tool === 'get_stock_price')?.stockData;
    synthesizedAnswer = `### Stock Price Information for ${stock?.ticker || 'RELIANCE.NS'}

- **Ticker:** ${stock?.ticker}
- **Latest Available Daily Closing Price:** ${stock?.price.toFixed(2)} ${stock?.currency}
- **Trading Date:** ${stock?.tradingDate}
${stock?.change !== undefined ? `- **Change:** ${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent !== undefined && stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%)` : ''}
${stock?.dayHigh && stock?.dayLow ? `- **Day Range:** ${stock.dayLow.toFixed(2)} - ${stock.dayHigh.toFixed(2)} ${stock.currency}` : ''}
${stock?.fiftyTwoWeekHigh && stock?.fiftyTwoWeekLow ? `- **52-Week Range:** ${stock.fiftyTwoWeekLow.toFixed(2)} - ${stock.fiftyTwoWeekHigh.toFixed(2)} ${stock.currency}` : ''}
- **Source:** Yahoo Finance via yfinance.
- **Note:** This represents the latest available daily closing price returned by the market provider, not necessarily a live streaming quote.

*Disclaimer: FinAgent provides financial information, not personalized investment advice.*`;
  } else {
    const report = executedTools.find(t => t.tool === 'search_annual_report');
    synthesizedAnswer = `### Reliance Industries Annual Report Findings

Based on the official Reliance Industries Integrated Annual Report:

${report?.result || 'No specific sections found for this query.'}

*Disclaimer: Information sourced directly from Reliance Industries disclosures. FinAgent provides factual financial information, not personalized investment advice.*`;
  }

  return {
    answer: synthesizedAnswer,
    toolCalls: executedTools,
    stockSnapshot: latestStockSnapshot,
  };
}
