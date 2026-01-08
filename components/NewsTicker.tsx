
import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { NewsItem, TickerItem } from '../types';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

export const NewsTicker: React.FC = () => {
  const [tickerContent, setTickerContent] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickerData = async () => {
      try {
        // 1. Get Manual items from storage
        const manualItems = storageService.getManualTickerItems();
        
        // 2. Get AI News from Gemini Webcrawler
        let crawledItems: TickerItem[] = [];
        try {
          const newsData = await fetchFinancialNews();
          crawledItems = newsData.map(news => ({
            id: news.id,
            label: news.title.length > 25 ? news.title.substring(0, 25) + '...' : news.title,
            value: news.impact === 'Bullish' ? '+0.4%' : news.impact === 'Bearish' ? '-1.2%' : 'STABLE',
            trend: news.impact,
            isManual: false
          }));
        } catch (e) {
          console.error("AI Crawler error:", e);
        }

        // Interleave: Manual -> AI -> Manual...
        const mixed: TickerItem[] = [];
        const maxLength = Math.max(manualItems.length, crawledItems.length);
        for (let i = 0; i < maxLength; i++) {
          if (manualItems[i]) mixed.push(manualItems[i]);
          if (crawledItems[i]) mixed.push(crawledItems[i]);
        }

        // If empty, use fallback
        if (mixed.length === 0) {
          setTickerContent(getMockTickerItems());
        } else {
          // Double for seamless marquee loop
          setTickerContent([...mixed, ...mixed]);
        }
      } catch (err) {
        setTickerContent(getMockTickerItems());
      } finally {
        setLoading(false);
      }
    };

    loadTickerData();
    // Refresh ticker data every 5 minutes
    const interval = setInterval(loadTickerData, 300000);
    return () => clearInterval(interval);
  }, []);

  const getImpactIcon = (trend: string) => {
    switch (trend) {
      case 'Bullish': return <TrendingUp size={14} className="text-emerald-400" />;
      case 'Bearish': return <TrendingDown size={14} className="text-rose-400" />;
      default: return <Minus size={14} className="text-gray-400" />;
    }
  };

  const getImpactColor = (trend: string) => {
    switch (trend) {
      case 'Bullish': return 'text-emerald-400';
      case 'Bearish': return 'text-rose-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="fixed top-20 left-0 w-full z-40 bg-nova-900/80 backdrop-blur-md border-b border-white/5 h-10 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-4 bg-nova-900/90 z-20 h-full border-r border-white/10 shadow-lg">
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-[10px] font-black text-white uppercase tracking-widest whitespace-nowrap">Market Live</span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {tickerContent.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center mx-8 gap-3">
            {item.isManual && <Zap size={10} className="text-nova-400 animate-pulse" />}
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.label}</span>
            <span className={`text-[10px] font-black flex items-center gap-1.5 ${getImpactColor(item.trend)}`}>
               {getImpactIcon(item.trend)}
               {item.value}
            </span>
            <span className="text-gray-800 ml-4 font-light opacity-50">/</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getMockTickerItems = (): TickerItem[] => {
  const base = [
    { id: 'm1', label: 'NGN/USD', value: '750.2', trend: 'Bearish', isManual: false },
    { id: 'm2', label: 'ZAR/USD', value: '+2.1%', trend: 'Bullish', isManual: false },
    { id: 'm3', label: 'S&P 500', value: '4508', trend: 'Bullish', isManual: false },
    { id: 'm4', label: 'BTC', value: '-0.4%', trend: 'Bearish', isManual: false }
  ] as TickerItem[];
  return [...base, ...base];
};
