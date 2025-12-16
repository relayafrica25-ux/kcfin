export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  sources?: Array<{ uri: string; title: string }>;
  imageUrl?: string;
}

export interface MarketData {
  name: string;
  value: number;
  change: number;
  history: { time: string; value: number }[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}