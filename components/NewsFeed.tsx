
import React, { useEffect, useState } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { TrendingUp, TrendingDown, Minus, ExternalLink, RefreshCw, Globe } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    const data = await fetchFinancialNews();
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'Bullish': return <TrendingUp className="text-nova-accent" size={20} />;
      case 'Bearish': return <TrendingDown className="text-rose-500" size={20} />;
      default: return <Minus className="text-gray-400" size={20} />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Bullish': return 'text-nova-accent border-nova-accent/20 bg-nova-accent/10';
      case 'Bearish': return 'text-rose-500 border-rose-500/20 bg-rose-500/10';
      default: return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={24} className="text-nova-400" />
            <h2 className="text-3xl font-bold text-white">Market Pulse</h2>
          </div>
          <p className="text-gray-400 text-sm">Real-time financial intelligence stream with focus on African Markets.</p>
        </div>
        <button 
          onClick={loadNews}
          disabled={loading}
          className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`text-nova-400 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-6 h-[300px] flex flex-col justify-between animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-full"></div>
              </div>
            </div>
          ))
        ) : (
          news.slice(0, 3).map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:translate-y-[-5px] transition-transform duration-300 group">
              <div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getImpactColor(item.impact)} mb-4`}>
                  {getImpactIcon(item.impact)}
                  {item.impact.toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-nova-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.summary}
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5">
                 {item.sources && item.sources.length > 0 && (
                   <div className="flex flex-wrap gap-2">
                     {item.sources.map((source, idx) => (
                       <a 
                         key={idx} 
                         href={source.uri} 
                         target="_blank" 
                         rel="noreferrer"
                         className="flex items-center gap-1 text-xs text-nova-400 hover:text-white transition-colors"
                       >
                         <ExternalLink size={10} />
                         {source.title.length > 20 ? source.title.substring(0, 20) + '...' : source.title}
                       </a>
                     ))}
                   </div>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
