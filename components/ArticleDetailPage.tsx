
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2, ChevronRight, Newspaper, Sparkles, Facebook, Twitter, Linkedin, CheckCircle2, Send } from 'lucide-react';
import { Article } from '../types';
import { storageService } from '../services/storageService';

interface ArticleDetailPageProps {
  article: Article;
  onBack: () => void;
  onOpenArticle: (article: Article) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({ article, onBack, onOpenArticle }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const allArticles = useMemo(() => storageService.getArticles(), []);
  
  // Filter related articles (same category, excluding current)
  const relatedArticles = useMemo(() => {
    const related = allArticles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3);

    // Fill with others if category is empty
    if (related.length < 3) {
      const others = allArticles.filter(a => a.id !== article.id && a.category !== article.category);
      related.push(...others.slice(0, 3 - related.length));
    }
    return related;
  }, [article.id, allArticles]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article.id]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      storageService.saveNewsletterSubscription(email);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-nova-950 selection:bg-nova-500">
      {/* Article Header / Hero */}
      <header className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          {article.imageUrl ? (
            <>
              <img src={article.imageUrl} className="w-full h-full object-cover opacity-10 grayscale" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-nova-950/90 via-nova-950 to-nova-950"></div>
            </>
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${article.imageGradient} opacity-5`}></div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em] mb-12"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Archives
          </button>

          <div className="flex items-center gap-4 mb-8">
             <span className="px-4 py-1.5 bg-nova-500/10 border border-nova-500/20 text-nova-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                {article.category}
             </span>
             <div className="h-px w-12 bg-white/10"></div>
             <span className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                <Clock size={12} /> {article.readTime}
             </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tighter leading-tight uppercase italic animate-fade-in-up">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden">
                 <User size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">By {article.author}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                   <Calendar size={10} /> {article.date}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
               {[Twitter, Facebook, Linkedin].map((Icon, idx) => (
                 <button key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-500 hover:text-white transition-colors">
                    <Icon size={16} />
                 </button>
               ))}
            </div>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <main className="py-24 max-w-3xl mx-auto px-4">
        <article className="prose prose-invert prose-p:text-gray-100 prose-p:text-xl prose-p:leading-relaxed prose-p:font-medium prose-p:mb-10">
          {/* Large Lead Paragraph */}
          <p className="text-2xl md:text-3xl text-gray-200 font-bold leading-snug tracking-tight mb-16 italic border-l-4 border-nova-500 pl-8">
            {article.excerpt}
          </p>
          
          <div className="space-y-10 text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            {!article.content ? (
              <>
                <p>
                  In the rapidly shifting landscape of continental finance, the ability to architect structured capital remains the primary differentiator for sustainable growth. As we move into the current fiscal cycle, the integration of institutional-grade intermediation is no longer just an advantage—it is a mandatory requirement for NMSE scaling.
                </p>
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mt-16 mb-8">The Infrastructure of Inclusion</h2>
                <p>
                  True economic empowerment is built on the foundation of accessible liquidity. At CASIEC, our mandate focuses on bridging the gap between local enterprise potential and the global institutional capital required to realize that vision. Through specialized asset finance and working capital facilities, we are redefining the standards of financial inclusion.
                </p>
                <div className="my-16 p-12 bg-white/[0.02] border border-nova-500/20 rounded-[3rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-nova-500/10 rounded-full blur-3xl"></div>
                  <Sparkles className="text-nova-500 mb-6" size={32} />
                  <p className="text-2xl font-black text-white italic tracking-tight leading-snug">
                    "Growth is the byproduct of strategic precision and ethical integrity. We don't just provide funding; we build the corporate backbone for the next generation of African giants."
                  </p>
                  <p className="mt-8 text-[10px] font-black uppercase text-gray-500 tracking-[0.4em]">Corporate Directive — 2024</p>
                </div>
                <p>
                  Looking ahead, our strategic alliances with partners like Broastreet DyDX will continue to provide the logistics and research backbone necessary for enterprise sustainability. The future of finance is collaborative, data-driven, and radically committed to excellence.
                </p>
              </>
            ) : (
              article.content.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            )}
          </div>
        </article>

        {/* Newsletter / CTA */}
        <div className="mt-32 p-12 bg-nova-500/10 border border-nova-500/20 rounded-[3rem] text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-nova-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <Newspaper size={40} className="text-nova-500 mx-auto mb-8" />
           <h3 className="text-3xl font-black text-white mb-6 uppercase italic tracking-tighter">Join the Intelligence Feed.</h3>
           <p className="text-gray-400 mb-10 max-w-lg mx-auto font-medium">Receive institutional-grade market briefs and deal flow alerts directly in your terminal.</p>
           
           {subscribed ? (
             <div className="flex flex-col items-center animate-fade-in-up">
                <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                <p className="text-white font-black uppercase tracking-widest text-sm">Transmission Confirmed. You're on the list.</p>
             </div>
           ) : (
             <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative group">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                   <div className="relative flex-grow w-full">
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Institutional Email" 
                        className="w-full bg-black/40 border border-white/10 rounded-full py-5 px-8 text-white text-sm font-bold focus:outline-none focus:border-nova-500 transition-all placeholder:text-gray-600"
                      />
                   </div>
                   <button 
                     type="submit"
                     className="px-10 py-5 bg-white text-nova-900 font-black uppercase tracking-widest text-xs rounded-full hover:bg-nova-500 hover:text-white transition-all shadow-2xl flex items-center gap-2 active:scale-95 flex-shrink-0"
                   >
                      Subscribe <Send size={14} />
                   </button>
                </div>
             </form>
           )}
        </div>
      </main>

      {/* Related Articles Section */}
      <section className="py-24 bg-white/[0.01] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-[10px] font-black text-nova-500 uppercase tracking-[0.5em] mb-4">Discovery Engine</h2>
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Related Insights.</h3>
            </div>
            <button 
              onClick={onBack}
              className="hidden md:flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all"
            >
              Back to Hub <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {relatedArticles.map((rel) => (
              <div 
                key={rel.id}
                onClick={() => onOpenArticle(rel)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="h-64 rounded-[2.5rem] overflow-hidden mb-8 relative">
                   {rel.imageUrl ? (
                     <img 
                      src={rel.imageUrl} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                      alt={rel.title}
                      loading="lazy"
                    />
                   ) : (
                     <div className={`w-full h-full bg-gradient-to-br ${rel.imageGradient} opacity-30`}></div>
                   )}
                   <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full">{rel.category}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  <Calendar size={12} /> {rel.date}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-nova-400 transition-colors leading-tight line-clamp-2 tracking-tight">{rel.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">{rel.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
