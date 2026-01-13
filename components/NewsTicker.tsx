
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { TickerItem } from '../types';
import { TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';

export const NewsTicker: React.FC = () => {
  const [tickerContent, setTickerContent] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickerData = () => {
      try {
        const manualItems = storageService.getManualTickerItems();
        
        if (manualItems.length === 0) {
          setTickerContent(getMockTickerItems());
        } else {
          // Loop twice for seamless marquee
          setTickerContent([...manualItems, ...manualItems]); 
        }
      } catch (err) {
        setTickerContent(getMockTickerItems());
      } finally {
        setLoading(false);
      }
    };

    loadTickerData();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Bullish': return <TrendingUp size={12} className="text-emerald-400" />;
      case 'Bearish': return <TrendingDown size={12} className="text-rose-400" />;
      default: return <Minus size={12} className="text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-20 left-0 w-full z-40 bg-nova-900/90 backdrop-blur-xl border-b border-white/5 h-10 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-6 bg-nova-900 z-20 h-full border-r border-white/10">
        <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
        <span className="text-[9px] font-black text-white uppercase tracking-[0.4em] whitespace-nowrap">Live Feed</span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center py-2">
        {tickerContent.map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center mx-10 gap-3 group">
            <Zap size={10} className="text-nova-400 animate-pulse" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest group-hover:text-white transition-colors">{item.label}</span>
            <span className={`text-[10px] font-black flex items-center gap-1.5 ${
              item.trend === 'Bullish' ? 'text-emerald-400' : item.trend === 'Bearish' ? 'text-rose-400' : 'text-gray-400'
            }`}>
               {getTrendIcon(item.trend)}
               {item.value}
            </span>
            <span className="text-white/5 mx-2 font-light">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const getMockTickerItems = (): TickerItem[] => {
  const base = [
    { id: 'm1', label: 'NGN/USD', value: '750.2', trend: 'Bearish', isManual: true },
    { id: 'm2', label: 'Lagos Index', value: '+1.4%', trend: 'Bullish', isManual: true },
    { id: 'm3', label: 'Brent Crude', value: '$84.1', trend: 'Neutral', isManual: true },
    { id: 'm4', label: 'Fintech Index', value: '+2.1%', trend: 'Bullish', isManual: true }
  ] as TickerItem[];
  return [...base, ...base];
};
