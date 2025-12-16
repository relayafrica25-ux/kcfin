import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const NewsTicker: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      // In a real app, you might want a lighter weight API call for just headlines
      // For now, we reuse the service but fallback to mock data immediately for the visual
      try {
        const data = await fetchFinancialNews();
        setNews([...data, ...data]); // Duplicate for seamless scrolling loop
      } catch (e) {
        setNews(getMockTickerData());
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Bullish': return <TrendingUp size={14} className="text-emerald-400" />;
      case 'Bearish': return <TrendingDown size={14} className="text-rose-400" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Bullish': return 'text-emerald-400';
      case 'Bearish': return 'text-rose-400';
      default: return 'text-gray-300';
    }
  };

  const displayNews = news.length > 0 ? news : getMockTickerData();

  return (
    <div className="fixed top-20 left-0 w-full z-40 bg-nova-900/80 backdrop-blur-md border-b border-white/5 h-10 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-4 bg-nova-900/90 z-20 h-full border-r border-white/10 shadow-lg">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Live Market</span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {displayNews.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center mx-6 gap-2">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{item.title}</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${getImpactColor(item.impact)}`}>
               {getImpactIcon(item.impact)}
               {item.impact === 'Bullish' ? '+0.4%' : item.impact === 'Bearish' ? '-1.2%' : '0.0%'}
            </span>
            <span className="text-gray-600 mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fallback data for immediate render
const getMockTickerData = (): NewsItem[] => {
  const baseItems = [
    { id: 't1', title: 'S&P 500', summary: '', impact: 'Bullish' },
    { id: 't2', title: 'NASDAQ', summary: '', impact: 'Bullish' },
    { id: 't3', title: 'BTC/USD', summary: '', impact: 'Bearish' },
    { id: 't4', title: '10Y Treasury', summary: '', impact: 'Neutral' },
    { id: 't5', title: 'Gold Spot', summary: '', impact: 'Bullish' },
    { id: 't6', title: 'EUR/USD', summary: '', impact: 'Bearish' },
  ] as NewsItem[];
  
  return [...baseItems, ...baseItems, ...baseItems]; // Triple it for smooth loop
};