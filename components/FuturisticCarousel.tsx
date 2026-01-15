import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { CarouselItem, CarouselItemType } from '../types';
import { ChevronRight, ChevronLeft, Zap, Leaf, Megaphone, ArrowUpRight, Sparkles, Globe, Cpu, Users, ShoppingBag } from 'lucide-react';

export const FuturisticCarousel: React.FC = () => {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadContent = () => {
      setLoading(true);
      try {
        setItems(storageService.getCarouselItems());
      } catch (e) {
        console.error("Transmission error:", e);
      }
      setLoading(false);
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (loading || isPaused || items.length === 0) return;
    const duration = 7000; 
    const startTime = Date.now();

    const animate = () => {
      if (isPaused) return;
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      if (progressRef.current) progressRef.current.style.width = `${progress}%`;
      if (elapsed < duration) requestAnimationFrame(animate);
      else setActiveIndex((prev) => (prev + 1) % items.length);
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [activeIndex, isPaused, loading, items.length]);

  const handleManualNav = (direction: 'next' | 'prev') => {
    setActiveIndex(prev => {
      if (direction === 'next') return (prev + 1) % items.length;
      return (prev - 1 + items.length) % items.length;
    });
  };

  const getTypeIcon = (type: CarouselItemType) => {
    switch (type) {
      case 'news': return <Globe size={16} />;
      case 'eco': return <Leaf size={16} />;
      case 'advert': return <Megaphone size={16} />;
      case 'product': return <ShoppingBag size={16} />;
      case 'customer': return <Users size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const getTypeColor = (type: CarouselItemType) => {
    switch (type) {
      case 'news': return 'bg-blue-500';
      case 'eco': return 'bg-emerald-500';
      case 'product': return 'bg-nova-500';
      case 'customer': return 'bg-purple-500';
      case 'advert': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return (
    <div className="w-full h-[550px] glass-panel rounded-[3rem] flex items-center justify-center">
      <Cpu className="text-nova-400 animate-spin" size={48} />
    </div>
  );

  if (items.length === 0) return null;
  const currentItem = items[activeIndex];

  return (
    <div 
      className="relative w-full h-[550px] overflow-hidden rounded-[3rem] bg-nova-900 border border-white/10 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 transition-all duration-1000">
        {currentItem.imageUrl ? (
            <div className="absolute inset-0 z-0">
               <img 
                src={currentItem.imageUrl} 
                className="w-full h-full object-cover opacity-30 mix-blend-luminosity" 
                alt={currentItem.title}
                fetchpriority={activeIndex === 0 ? "high" : "low"}
              />
               <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.imageGradient} opacity-40`}></div>
            </div>
        ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.imageGradient} opacity-20`}></div>
        )}
      </div>

      <div className="relative z-10 grid lg:grid-cols-12 h-full">
        <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center">
           <div className="mb-8 flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ${getTypeColor(currentItem.type)} text-white`}>
                {getTypeIcon(currentItem.type)}
                {currentItem.tag}
              </span>
           </div>
           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tighter">{currentItem.title}</h2>
           <p className="text-xl text-gray-400 mb-10 max-w-xl font-light">{currentItem.summary}</p>
           <div className="flex flex-wrap items-center gap-6">
              <div className="group/btn flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-nova-900 font-black uppercase tracking-widest text-[11px] hover:bg-nova-400 transition-all active:scale-95 cursor-pointer">
                {currentItem.linkText || 'Learn More'}
                <ArrowUpRight size={20} />
              </div>
           </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
        <div ref={progressRef} className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: '0%' }}></div>
      </div>

      <div className="absolute bottom-12 right-10 md:right-16 flex gap-4">
        <button onClick={() => handleManualNav('prev')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><ChevronLeft size={20} /></button>
        <button onClick={() => handleManualNav('next')} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><ChevronRight size={20} /></button>
      </div>
    </div>
  );
};