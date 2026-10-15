import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { runAgent } from './server/agent.ts';
import { getStockPrice } from './server/tools/stockPriceTool.ts';
import { searchAnnualReport } from './server/tools/annualReportTool.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json());

// API: Agent invocation (matches run_agent from original Python agent.py)
app.post('/api/agent', async (req, res) => {
  try {
    const { question } = req.body || {};
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Please enter a financial question.' });
    }

    const response = await runAgent(question);
    return res.json(response);
  } catch (error: any) {
    console.error('Error running agent:', error);
    return res.status(500).json({
      answer: `An error occurred: ${error.message || error}`,
      toolCalls: [],
    });
  }
});

// API: Direct stock price retrieval (matches get_stock_price tool)
app.get('/api/stock', async (req, res) => {
  try {
    const ticker = (req.query.ticker as string) || 'RELIANCE.NS';
    const data = await getStockPrice(ticker);
    return res.json(data);
  } catch (error: any) {
    console.error('Error fetching stock:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch stock data' });
  }
});

// API: Direct annual report search (matches search_annual_report tool)
app.post('/api/report/search', (req, res) => {
  try {
    const { query } = req.body || {};
    const result = searchAnnualReport(query || '');
    return res.json(result);
  } catch (error: any) {
    console.error('Error searching report:', error);
    return res.status(500).json({ error: error.message || 'Failed to search annual report' });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FinAgent API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FinAgent] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
