import React, { useState, useEffect } from 'react';
import { Hero } from './Hero';
import { FuturisticCarousel } from './FuturisticCarousel';
import { FAQSection } from './FAQSection';
import { Wallet, Network, CheckCircle, Target, Compass, Zap, Gem, ShieldCheck, Mail, Globe, Phone, Send, Clock, ChevronRight, ArrowRight, Database, Landmark, Briefcase, ChevronsUpRight, Check } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ContactInquiry, Article } from '../types';

interface HomePageProps {
  onApplyClick: () => void;
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onApplyClick, onNavigate }) => {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [latestInsights, setLatestInsights] = useState<Article[]>([]);

  useEffect(() => {
    const loadLatestInsights = () => {
      const stored = storageService.getArticles();
      setLatestInsights(stored.slice(0, 3));
    };
    loadLatestInsights();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const inquiry: ContactInquiry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      ...contactForm,
      status: 'Unread'
    };

    storageService.saveInquiry(inquiry);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSubmitted(true);
    setContactForm({ fullName: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <article className="bg-nova-950 overflow-hidden">
      <Hero onGetFundedClick={onApplyClick} />

      {/* Strategic Alliances Banner - Updated Logos */}
      <section className="py-16 bg-white/[0.02] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-32 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
              {/* CASIEC Logo Component */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <span className="text-3xl font-black text-white tracking-tighter lowercase">casiec</span>
                  <div className="flex flex-col -mb-1 translate-y-[-1px]">
                     <ChevronRight size={16} className="text-nova-accent -rotate-45" strokeWidth={3} />
                     <ChevronRight size={16} className="text-nova-accent -rotate-45 -mt-3" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[10px] font-black text-nova-accent tracking-[0.3em] lowercase -mt-1">financials</span>
              </div>

              <div className="h-10 w-px bg-white/10 hidden md:block"></div>

              {/* Broastreet DyDX Logo Component - Updated to Orange Checkmark */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-white tracking-tighter lowercase">broastreet</span>
                  <div className="bg-orange-500 rounded-sm p-0.5">
                     <Check size={20} className="text-white" strokeWidth={4} />
                  </div>
                </div>
                <span className="text-[10px] font-black text-orange-500 tracking-[0.3em] uppercase -mt-1 italic">DyDX alliance</span>
              </div>
           </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Financial Support (CASIEC) */}
            <div className="group relative bg-white/[0.03] border border-white/5 p-10 md:p-14 rounded-[3rem] hover:border-nova-500/40 transition-all duration-500 flex flex-col">
               <div className="w-16 h-16 bg-nova-500/10 rounded-2xl flex items-center justify-center text-nova-500 mb-10 group-hover:scale-110 transition-transform">
                  <Wallet size={32} />
               </div>
               <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">Institutional Capital</h2>
               <p className="text-gray-400 mb-8 leading-relaxed font-light">Lending solutions managed by CASIEC Financials, focused on financial intermediation and NMSE stimulation.</p>
               <ul className="space-y-4 mb-12 flex-grow">
                 {["Strategic Asset Finance", "NMSE Development Credit", "Corporate Refinancing", "Supply Chain Liquidity"].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-nova-500"></div>
                      {item}
                   </li>
                 ))}
               </ul>
               <button onClick={() => onNavigate('financial-support')} className="w-full py-4 bg-nova-500 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-nova-400 transition-all shadow-xl shadow-nova-500/20">
                  Access Portfolio
               </button>
            </div>

            {/* Strategic Support (GSI) - Updated to Orange */}
            <div className="group relative bg-white/[0.03] border border-white/5 p-10 md:p-14 rounded-[3rem] hover:border-orange-500/40 transition-all duration-500 flex flex-col">
               <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-10 group-hover:scale-110 transition-transform">
                  <Briefcase size={32} />
               </div>
               <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">Enterprise Advisory</h2>
               <p className="text-gray-400 mb-8 leading-relaxed font-light">Global Strategic Alliances powered by Broastreet DyDX, delivering corporate research and logistics architecture.</p>
               <ul className="space-y-4 mb-12 flex-grow">
                 {["Corporate Finance Research", "Market Entry Intelligence", "Commodity Trading Distribution", "Logistics Architecture"].map((item, i) => (
                   <li key={i} className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                      {item}
                   </li>
                 ))}
               </ul>
               <button onClick={() => onNavigate('business-support')} className="w-full py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-500/20">
                  Explore Advisory
               </button>
            </div>

          </div>
        </div>
      </section>

      {/* Corporate Identity Section */}
      <section className="py-32 bg-nova-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="max-w-3xl mb-24">
              <h2 className="text-xs font-black text-nova-500 uppercase tracking-[0.4em] mb-6">Our Mandate</h2>
              <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[1.1]">
                Fostering <span className="text-gray-500">Growth</span> <br/> 
                Through <span className="text-nova-500">Inclusion.</span>
              </h3>
           </div>

           <div className="grid md:grid-cols-3 gap-10">
              <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                 <Target className="text-nova-500 mb-8" size={32} />
                 <h4 className="text-xl font-bold text-white mb-4 italic uppercase">Vision</h4>
                 <p className="text-gray-500 text-sm leading-relaxed font-light">To become the benchmark in finance and business support, setting the standard for institutional excellence.</p>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                 <Compass className="text-nova-500 mb-8" size={32} />
                 <h4 className="text-xl font-bold text-white mb-4 italic uppercase">Mission</h4>
                 <p className="text-gray-500 text-sm leading-relaxed font-light">Delivering credit, capital and enterprise support to stimulate business growth and drive sustainable impact.</p>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                 <Zap className="text-nova-500 mb-8" size={32} />
                 <h4 className="text-xl font-bold text-white mb-4 italic uppercase">Factor</h4>
                 <p className="text-gray-500 text-sm leading-relaxed font-light">"God’s Own Institution (GOI factor)" - A commitment to integrity and resourcefulness in all transactions.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Campaign Showcase */}
      <section className="py-32 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-xs font-black text-nova-500 uppercase tracking-[0.5em] mb-6">Strategic Focus</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Institutional Showcase.</h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black tracking-widest border border-white/10 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span> Live Update Stream
            </div>
          </div>
          <FuturisticCarousel />
        </div>
      </section>

      {/* Market Intelligence Feed */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div>
              <h2 className="text-xs font-black text-nova-500 uppercase tracking-[0.5em] mb-6">Knowledge Base</h2>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Market Intel.</h3>
            </div>
            <button onClick={() => onNavigate('insights')} className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all">
              All Insights <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {latestInsights.map((article) => (
              <div 
                key={article.id}
                onClick={() => onNavigate('insights')}
                className="group cursor-pointer flex flex-col"
              >
                <div className="h-64 rounded-3xl overflow-hidden mb-8 relative">
                   {article.imageUrl ? (
                     <img 
                      src={article.imageUrl} 
                      className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                      alt={article.title}
                      loading="lazy"
                    />
                   ) : (
                     <div className={`w-full h-full bg-gradient-to-br ${article.imageGradient} opacity-30`}></div>
                   )}
                   <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-widest rounded-full">{article.category}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">
                  <Clock size={12} /> {article.date}
                </div>
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-nova-500 transition-colors leading-tight">{article.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">{article.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />

      {/* Global Uplink / Contact */}
      <section className="py-32 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic mb-8">Consultancy Uplink.</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-12 font-light">
                    Direct communication lines for institutional partners and enterprise clients. Professional responses within 24 hours.
                </p>
                <div className="space-y-10">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"><Mail size={24} /></div>
                        <div>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Electronic Mail</p>
                            <a href="mailto:info@casiecfinancials.com" className="text-lg font-bold text-white hover:text-nova-500 transition-colors">info@casiecfinancials.com</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"><Globe size={24} /></div>
                        <div>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Global Presence</p>
                            <div className="flex gap-4">
                              <a href="http://www.casiecfinancials.com" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">casiecfinancials.com</a>
                              <span className="text-gray-800">|</span>
                              <a href="http://www.broastreet.africa" target="_blank" rel="noreferrer" className="text-sm font-bold text-gray-300 hover:text-white transition-colors">broastreet.africa</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"><Phone size={24} /></div>
                        <div>
                            <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Secure Lines</p>
                            <div className="flex flex-col text-sm text-gray-300 font-mono">
                               <span>+234 818-398-7171</span>
                               <span>+234 810-326-0048</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-1 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-[3rem]">
              <div className="bg-nova-900 rounded-[2.8rem] p-10 md:p-14 shadow-2xl">
                  {submitted ? (
                      <div className="text-center py-16 animate-fade-in-up">
                          <CheckCircle size={64} className="mx-auto text-orange-500 mb-6" />
                          <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Transmission Complete</h3>
                          <p className="text-gray-500 font-light">Your inquiry has been logged in our secure system.</p>
                      </div>
                  ) : (
                      <form onSubmit={handleContactSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-[10px] text-gray-600 uppercase font-black tracking-widest mb-3 ml-2">Identity</label>
                                  <input required type="text" value={contactForm.fullName} onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold" placeholder="Name" />
                              </div>
                              <div>
                                  <label className="block text-[10px] text-gray-600 uppercase font-black tracking-widest mb-3 ml-2">Email Address</label>
                                  <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold" placeholder="Corporate Email" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] text-gray-600 uppercase font-black tracking-widest mb-3 ml-2">Subject of Inquiry</label>
                              <input required type="text" value={contactForm.subject} onChange={(e) => setContactForm({...contactForm, subject: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-bold" placeholder="e.g. Asset Finance Inquiry" />
                          </div>
                          <div>
                              <label className="block text-[10px] text-gray-600 uppercase font-black tracking-widest mb-3 ml-2">Detailed Brief</label>
                              <textarea required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all resize-none text-sm font-light" placeholder="Describe your requirements..." />
                          </div>
                          <button type="submit" disabled={isSubmitting} className="w-full bg-white text-nova-950 font-black py-5 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] active:scale-95">
                              {isSubmitting ? 'Transmitting...' : 'Send Inquiry'} <Send size={18} />
                          </button>
                      </form>
                  )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
};