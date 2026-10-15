import fs from 'fs';
import path from 'path';

export interface ReportChunk {
  id: number;
  page: number;
  text: string;
}

let cachedChunks: ReportChunk[] | null = null;

function getChunks(): ReportChunk[] {
  if (cachedChunks) return cachedChunks;
  try {
    const chunkPath = path.resolve(process.cwd(), 'server', 'reliance_chunks.json');
    if (fs.existsSync(chunkPath)) {
      const data = fs.readFileSync(chunkPath, 'utf8');
      cachedChunks = JSON.parse(data);
      return cachedChunks || [];
    }
  } catch (err) {
    console.error('Failed to load reliance_chunks.json:', err);
  }
  return [];
}

export function searchAnnualReport(query: string, topK: number = 4): { text: string; citations: { page: number; excerpt: string }[] } {
  try {
    const cleanQuery = (query || '').trim();
    if (!cleanQuery) {
      return {
        text: 'Please provide a search query for the Reliance Industries annual report.',
        citations: []
      };
    }

    const chunks = getChunks();
    if (!chunks.length) {
      return {
        text: 'Reliance annual report data is currently loading or unavailable.',
        citations: []
      };
    }

    // Split query into terms, filter out common stop words
    const stopWords = new Set(['what', 'which', 'who', 'when', 'where', 'why', 'how', 'is', 'are', 'was', 'were', 'the', 'a', 'an', 'and', 'or', 'for', 'in', 'on', 'at', 'to', 'of', 'with', 'about', 'tell', 'me']);
    const rawTerms = cleanQuery.toLowerCase().split(/[\s,?.!;:()"]+/).filter(t => t.length > 2 && !stopWords.has(t));
    const terms = rawTerms.length > 0 ? rawTerms : cleanQuery.toLowerCase().split(/[\s,?.!;:()"]+/).filter(t => t.length > 1);

    // Score chunks
    const scored = chunks.map(chunk => {
      let score = 0;
      const lower = chunk.text.toLowerCase();

      for (const term of terms) {
        // Exact word match has higher weight
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const matches = (lower.match(regex) || []).length;
        if (matches > 0) {
          score += matches * 3;
        } else if (lower.includes(term)) {
          score += 1;
        }
      }

      // Boost if query contains specific financial phrases
      if (cleanQuery.toLowerCase().includes('segment') && lower.includes('segment')) score += 5;
      if (cleanQuery.toLowerCase().includes('revenue') && (lower.includes('revenue') || lower.includes('turnover'))) score += 5;
      if (cleanQuery.toLowerCase().includes('profit') && (lower.includes('profit') || lower.includes('ebitda'))) score += 5;
      if (cleanQuery.toLowerCase().includes('risk') && lower.includes('risk')) score += 5;
      if (cleanQuery.toLowerCase().includes('jio') && lower.includes('jio')) score += 4;
      if (cleanQuery.toLowerCase().includes('retail') && lower.includes('retail')) score += 4;
      if (cleanQuery.toLowerCase().includes('green') && (lower.includes('green') || lower.includes('solar') || lower.includes('hydrogen'))) score += 4;

      return {
        ...chunk,
        score
      };
    });

    const topResults = scored
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (topResults.length === 0) {
      // Fallback: return introductory high-level overview chunks (pages 1 to 5)
      const fallback = chunks.filter(c => c.page >= 1 && c.page <= 3).slice(0, topK);
      const formatted = fallback.map(r => `[Annual Report - Page ${r.page}]:\n${r.text}`).join('\n\n');
      return {
        text: `No exact matches found for query "${cleanQuery}". Relevant background context from Annual Report:\n\n${formatted}`,
        citations: fallback.map(r => ({ page: r.page, excerpt: r.text.slice(0, 160) + '...' }))
      };
    }

    const formatted = topResults.map(r => `[Reliance Annual Report - Page ${r.page}]:\n${r.text}`).join('\n\n');
    return {
      text: formatted,
      citations: topResults.map(r => ({ page: r.page, excerpt: r.text.slice(0, 160) + '...' }))
    };
  } catch (err: any) {
    return {
      text: `Annual report search failed: ${err.message || err}`,
      citations: []
    };
  }
}
