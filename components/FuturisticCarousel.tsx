
import React, { useState, useEffect, useRef } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { ChevronRight, ChevronLeft, Zap, Leaf, Megaphone, ArrowUpRight, ExternalLink, Sparkles, Globe, Cpu } from 'lucide-react';

type CarouselItemType = 'news' | 'eco' | 'advert';

interface CarouselItem {
  id: string;
  type: CarouselItemType;
  title: string;
  summary: string;
  tag: string;
  date?: string;
  link?: string;
  linkText?: string;
  imageGradient?: string;
  imageUrl?: string;
}

export const FuturisticCarousel: React.FC = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  // Static Adverts & Eco News to mix with Live News
  const staticContent: CarouselItem[] = [
    {
      id: 'adv-1',
      type: 'advert',
      title: "Launch: KC Mobile Banking",
      summary: "Experience the future of funding. Manage your loans, view real-time rates, and apply for capital directly from your phone. Available on iOS & Android.",
      tag: "Product Release",
      link: "#",
      linkText: "Download Beta",
      imageGradient: "from-purple-600 via-indigo-500 to-blue-500"
    },
    {
      id: 'eco-1',
      type: 'eco',
      title: "Green Energy Fund 2024",
      summary: "New $50M credit facility available for sustainable manufacturing and renewable energy projects. 0% interest for the first 12 months.",
      tag: "Eco-Financial",
      link: "#",
      linkText: "Check Eligibility",
      imageGradient: "from-emerald-600 via-green-500 to-teal-500"
    },
    {
      id: 'prog-1',
      type: 'advert',
      title: "SME Capacity Workshop",
      summary: "Join our free masterclass on 'Preparing for Institutional Investment' held in Lagos and London. Secure your spot today.",
      tag: "Programme",
      link: "#",
      linkText: "Register Free",
      imageGradient: "from-orange-500 via-red-500 to-pink-500"
    }
  ];

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const newsItems = await fetchFinancialNews();
      
      // Transform news items to carousel format
      const formattedNews: CarouselItem[] = newsItems.slice(0, 3).map(news => ({
        id: news.id,
        type: 'news',
        title: news.title,
        summary: news.summary,
        tag: 'AI News | Africa',
        link: news.sources?.[0]?.uri || '#',
        linkText: 'Read Source',
        imageGradient: news.impact === 'Bearish' ? 'from-red-900 to-red-600' : 'from-blue-900 to-blue-600',
        imageUrl: news.imageUrl
      }));

      // Interleave content
      const mixedContent: CarouselItem[] = [];
      const maxLength = Math.max(formattedNews.length, staticContent.length);
      
      for (let i = 0; i < maxLength; i++) {
        if (formattedNews[i]) mixedContent.push(formattedNews[i]);
        if (staticContent[i]) mixedContent.push(staticContent[i]);
      }

      setItems(mixedContent);
      setLoading(false);
    };

    loadContent();
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (loading || isPaused || items.length === 0) return;

    const duration = 6000; 
    const startTime = Date.now();

    const animate = () => {
      if (isPaused) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      
      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }

      if (elapsed < duration) {
        requestAnimationFrame(animate);
      } else {
        setActiveIndex((prev) => (prev + 1) % items.length);
      }
    };

    const animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [activeIndex, isPaused, loading, items.length]);

  const handleManualNav = (direction: 'next' | 'prev') => {
    setActiveIndex(prev => {
      if (direction === 'next') return (prev + 1) % items.length;
      return (prev - 1 + items.length) % items.length;
    });
    if (progressRef.current) progressRef.current.style.width = '0%';
  };

  const getTypeIcon = (type: CarouselItemType) => {
    switch (type) {
      case 'news': return <Cpu size={16} />;
      case 'eco': return <Leaf size={16} />;
      case 'advert': return <Megaphone size={16} />;
    }
  };

  const getTypeColor = (type: CarouselItemType) => {
    switch (type) {
      case 'news': return 'bg-blue-500 text-blue-100';
      case 'eco': return 'bg-emerald-500 text-emerald-100';
      case 'advert': return 'bg-purple-500 text-purple-100';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[500px] glass-panel rounded-[2.5rem] animate-pulse flex items-center justify-center">
        <Sparkles className="text-nova-400 animate-spin" size={32} />
      </div>
    );
  }

  const currentItem = items[activeIndex];

  return (
    <div 
      className="relative w-full h-[500px] overflow-hidden rounded-[2.5rem] bg-nova-900 border border-white/10 shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {currentItem.imageUrl ? (
        <div className="absolute inset-0">
             <img 
               src={currentItem.imageUrl} 
               alt={currentItem.title} 
               width="1280"
               height="500"
               className="w-full h-full object-cover opacity-60 transition-transform duration-10000 group-hover:scale-105"
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
               }}
             />
             <div className="absolute inset-0 bg-gradient-to-r from-nova-900 via-nova-900/80 to-transparent"></div>
             <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${currentItem.imageGradient}`}></div>
        </div>
      ) : (
        <div className={`absolute inset-0 transition-colors duration-1000 bg-gradient-to-br ${currentItem.imageGradient} opacity-20`}></div>
      )}
      
      {!currentItem.imageUrl && (
         <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-[120px] animate-pulse-slow"></div>
      )}

      <div className="relative z-10 grid lg:grid-cols-12 h-full">
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center relative">
           <div className="absolute top-8 left-8 w-20 h-1 bg-white/20 rounded-full"></div>
           
           <div className="mb-6 flex items-center gap-3 animate-fade-in-up">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${getTypeColor(currentItem.type)}`}>
                {getTypeIcon(currentItem.type)}
                {currentItem.tag}
              </span>
              <span className="text-gray-400 text-xs font-mono">{currentItem.date || 'LIVE CRAWL'}</span>
           </div>

           <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in-up drop-shadow-2xl">
             {currentItem.title}
           </h2>

           <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed animate-fade-in-up drop-shadow-md">
             {currentItem.summary}
           </p>

           <div className="flex items-center gap-4 animate-fade-in-up">
              {currentItem.link && (
                <a 
                  href={currentItem.link}
                  className="group/btn flex items-center gap-2 px-8 py-4 rounded-full bg-white text-nova-900 font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  {currentItem.linkText}
                  <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </a>
              )}
           </div>
        </div>

        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden">
           {!currentItem.imageUrl && (
             <>
                <div className={`absolute inset-0 bg-gradient-to-bl ${currentItem.imageGradient} opacity-60 mix-blend-overlay`}></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                    {currentItem.type === 'eco' && (
                        <Leaf size={200} className="text-white/10 rotate-12 animate-float" />
                    )}
                    {currentItem.type === 'news' && (
                        <Globe size={200} className="text-white/10 -rotate-12 animate-pulse-slow" />
                    )}
                    {currentItem.type === 'advert' && (
                        <Megaphone size={200} className="text-white/10 rotate-6 animate-float" />
                    )}
                </div>
             </>
           )}

           <div className="absolute bottom-8 right-8 text-right max-w-[200px]">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Up Next</div>
              <div className="text-sm font-bold text-white truncate drop-shadow-md">
                {items[(activeIndex + 1) % items.length].title}
              </div>
           </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div 
          ref={progressRef}
          className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-100 ease-linear"
          style={{ width: '0%' }}
        ></div>
      </div>

      <div className="absolute bottom-8 left-8 lg:left-auto lg:bottom-8 lg:right-auto lg:top-1/2 lg:-translate-y-1/2 lg:w-[calc(100%-4rem)] lg:mx-8 flex justify-between pointer-events-none">
        <button 
          onClick={() => handleManualNav('prev')}
          className="pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 group/nav hidden lg:block"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={() => handleManualNav('next')}
          className="pointer-events-auto p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hover:scale-110 active:scale-95 group/nav ml-auto lg:ml-0"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 lg:hidden">
        {items.map((_, idx) => (
          <div 
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'w-8 bg-white' : 'bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};
