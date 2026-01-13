
import React, { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';
import { CarouselItem, CarouselItemType } from '../types';
import { ChevronRight, ChevronLeft, Zap, Leaf, Megaphone, ArrowUpRight, Sparkles, Globe, Cpu, Users, Star, ShoppingBag, ShieldCheck } from 'lucide-react';

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
        const managedItems = storageService.getCarouselItems();
        // Ensure we handle the "3 carousel" request by taking up to 3 or cycling as available
        setItems(managedItems);
      } catch (e) {
        console.error("Carousel load error:", e);
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
      case 'news': return 'bg-blue-500 text-blue-100 shadow-blue-500/50';
      case 'eco': return 'bg-emerald-500 text-emerald-100 shadow-emerald-500/50';
      case 'product': return 'bg-nova-500 text-white shadow-nova-500/50';
      case 'customer': return 'bg-purple-500 text-purple-100 shadow-purple-500/50';
      case 'advert': return 'bg-amber-500 text-amber-100 shadow-amber-500/50';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[550px] glass-panel rounded-[3rem] animate-pulse flex flex-col items-center justify-center gap-4">
        <Cpu className="text-nova-400 animate-spin" size={48} />
        <span className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">Syncing Intelligence...</span>
      </div>
    );
  }

  if (items.length === 0) return null;

  const currentItem = items[activeIndex];

  return (
    <div 
      className="relative w-full h-[550px] overflow-hidden rounded-[3rem] bg-nova-900 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Section */}
      <div className="absolute inset-0 transition-all duration-1000">
        {currentItem.imageUrl ? (
            <div className="absolute inset-0 z-0">
               <img src={currentItem.imageUrl} className="w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:opacity-40 transition-opacity duration-1000" alt="" />
               <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.imageGradient} opacity-40 mix-blend-multiply`}></div>
            </div>
        ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${currentItem.imageGradient} opacity-20`}></div>
        )}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-nova-500/5 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-purple-500/5 rounded-full blur-[120px] animate-float"></div>
      </div>

      <div className="relative z-10 grid lg:grid-cols-12 h-full">
        <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-center relative">
           <div className="mb-8 flex items-center gap-4 animate-fade-in-up">
              <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ${getTypeColor(currentItem.type)}`}>
                {getTypeIcon(currentItem.type)}
                {currentItem.tag}
              </span>
              <div className="h-1 w-12 bg-white/10 rounded-full"></div>
           </div>

           <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-[1.1] animate-fade-in-up tracking-tighter">
             {currentItem.title}
           </h2>

           <p className="text-xl text-gray-400 mb-10 max-w-xl leading-relaxed animate-fade-in-up font-light">
             {currentItem.summary}
           </p>

           <div className="flex flex-wrap items-center gap-6 animate-fade-in-up">
              <div className="group/btn flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-nova-900 font-black uppercase tracking-widest text-[11px] hover:bg-nova-400 hover:text-white transition-all shadow-2xl shadow-white/10 active:scale-95 cursor-pointer">
                {currentItem.linkText || 'Learn More'}
                <ArrowUpRight size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
              </div>

              {currentItem.statValue && (
                <div className="flex flex-col border-l border-white/10 pl-6">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{currentItem.statLabel}</span>
                   <span className="text-2xl font-black text-white">{currentItem.statValue}</span>
                </div>
              )}
           </div>
        </div>

        <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center p-12">
            <div className="relative w-full aspect-square max-w-[400px]">
                <div className={`absolute inset-0 rounded-[3rem] bg-gradient-to-br ${currentItem.imageGradient} opacity-20 blur-2xl animate-pulse-slow`}></div>
                <div className="relative h-full w-full glass-panel border border-white/10 rounded-[3rem] overflow-hidden flex items-center justify-center group-hover:border-white/20 transition-colors shadow-inner">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10"></div>
                    
                    <div className="flex flex-col items-center gap-6 p-8 text-center animate-float relative z-10">
                        {currentItem.imageUrl ? (
                           <div className="w-56 h-56 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-700">
                              <img src={currentItem.imageUrl} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                           </div>
                        ) : (
                           <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
                              {getTypeIcon(currentItem.type)}
                           </div>
                        )}
                        
                        <div className="flex flex-col items-center gap-2">
                           <h4 className="text-lg font-bold text-white uppercase tracking-tighter italic">Strategic <br/> Campaign</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5">
        <div 
          ref={progressRef}
          className="h-full bg-white shadow-[0_0_15px_white] transition-all duration-100 ease-linear"
          style={{ width: '0%' }}
        ></div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-12 left-10 md:left-16 flex items-center gap-4">
        <div className="flex gap-2">
            {items.map((_, idx) => (
            <button 
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-12 bg-white' : 'w-4 bg-white/20 hover:bg-white/40'}`}
            />
            ))}
        </div>
      </div>

      <div className="absolute bottom-12 right-10 md:right-16 flex gap-4">
        <button 
          onClick={() => handleManualNav('prev')}
          className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={() => handleManualNav('next')}
          className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};
