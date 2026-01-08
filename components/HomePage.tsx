import React, { useState } from 'react';
import { Hero } from './Hero';
import { FuturisticCarousel } from './FuturisticCarousel';
import { FAQSection } from './FAQSection';
import { Building, Hammer, Banknote, Briefcase, Truck, Landmark, Mail, Phone, MapPin, Wallet, BrainCircuit, Headphones, Sparkles, Target, Compass, ShieldCheck, Zap, Gem, Send, CheckCircle, Network, TrendingUp, BarChart3, Database, Globe } from 'lucide-react';
import { storageService } from '../services/storageService';
import { ContactInquiry } from '../types';

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
    <>
      <div className="pt-10">
          <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 left-0 w-1/2 h-full bg-nova-500/5 blur-[100px]"></div>
               <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-500/5 blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                 <h1 className="text-5xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 via-white to-purple-400">
                     We lend, we support, <br/> You succeed.
                   </span>
                 </h1>
                 <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                   Providing integrated financial services, business funding solutions, and corporate advisory to stimulate enterprise sustainability across continental markets.
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Financial Support Card (CASIEC) */}
                <div className="group relative glass-card p-1 rounded-3xl hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-nova-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-nova-900/80 backdrop-blur-xl rounded-[22px] p-8 h-full flex flex-col items-center text-center border border-white/5 group-hover:border-nova-500/50 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-nova-500/10 flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Wallet size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Financial Funding</h2>
                        <p className="text-nova-400 font-bold mb-4 uppercase tracking-widest text-[10px]">Managed by CASIEC Financials</p>
                        <div className="text-gray-400 mb-8 text-sm space-y-2 text-left w-full">
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-nova-500 flex-shrink-0" /> Credit & Finance</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-nova-500 flex-shrink-0" /> NMSE Lending (Nano, Micro, Small)</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-nova-500 flex-shrink-0" /> Consumer Finance/Credit</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-nova-500 flex-shrink-0" /> Wealth Management Advisory</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-nova-500 flex-shrink-0" /> Supply Chain financing</div>
                        </div>
                        <button 
                            onClick={() => onNavigate('financial-support')}
                            className="mt-auto px-8 py-3 rounded-full bg-nova-500 hover:bg-nova-400 text-white font-bold transition-all w-full"
                        >
                            Access Capital
                        </button>
                    </div>
                </div>

                {/* Business Support Card (GSI) */}
                <div className="group relative glass-card p-1 rounded-3xl hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-nova-900/80 backdrop-blur-xl rounded-[22px] p-8 h-full flex flex-col items-center text-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Network size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Business Support</h2>
                        <p className="text-purple-400 font-bold mb-4 uppercase tracking-widest text-[10px]">GSI STRATEGIC ALLIANCES (Broastreet DyDX)</p>
                        <div className="text-gray-400 mb-8 text-sm space-y-2 text-left w-full">
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500 flex-shrink-0" /> Business Support Services</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500 flex-shrink-0" /> Corporate Finance & Advisory (CFRA)</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500 flex-shrink-0" /> Supply Chain Commodity Trading</div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-purple-500 flex-shrink-0" /> Distribution & Global Logistics</div>
                        </div>
                        <button 
                             onClick={() => onNavigate('business-support')}
                             className="mt-auto px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all w-full"
                        >
                            Explore Advisory
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      <section className="py-24 relative overflow-hidden bg-nova-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           {/* Corporate Overview Section */}
           <div className="mb-24 max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-8 uppercase tracking-tighter italic">Expert Financial Services Overview</h2>
              <p className="text-xl text-gray-300 leading-relaxed font-light">
                CASIEC Financials focuses on financial intermediation, providing loans to Nano, Micro, Small, and Medium-sized businesses, as well as consumer lending to promote financial inclusion. In partnership with GSI STRATEGIC ALLIANCES (Broastreet DyDX), we offer comprehensive business funding and support services to drive enterprise sustainability.
              </p>
           </div>

           <div className="grid lg:grid-cols-3 gap-8 mb-20">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                 <div className="w-12 h-12 bg-nova-500/20 rounded-xl flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform">
                    <Target size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
                 <p className="text-gray-400 leading-relaxed text-sm">
                   To become the story and the leading benchmark in finance and business support, setting the standard for excellence.
                 </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                 <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                    <Compass size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
                 <p className="text-gray-400 leading-relaxed text-sm">
                   Delivering credit, capital and enterprise support to stimulate business growth and drive sustainable impact.
                 </p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                 <div className="w-12 h-12 bg-nova-accent/20 rounded-xl flex items-center justify-center text-nova-accent mb-6 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-3">Our Mandate</h3>
                 <p className="text-gray-400 leading-relaxed text-sm">
                   Fostering economic advancement through financial inclusion across the continent and beyond.
                 </p>
              </div>
           </div>

           <div className="relative max-w-4xl mx-auto mb-24">
              <div className="absolute inset-0 bg-gradient-to-r from-nova-500/10 to-purple-500/10 rounded-[3rem] blur-2xl"></div>
              <div className="relative bg-nova-900 border border-white/10 rounded-[3rem] p-12 text-center overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/marble.png')]"></div>
                <Sparkles className="mx-auto text-nova-400 mb-6 h-8 w-8" />
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">Words on the Marble</h4>
                <blockquote className="text-3xl md:text-5xl font-serif italic text-white leading-tight">
                  "God’s Own Institution <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 to-nova-accent not-italic font-sans font-bold text-xl uppercase tracking-widest mt-4 block">
                    (GOI factor)
                  </span>"
                </blockquote>
              </div>
           </div>

           <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Core Values</h2>
              <div className="h-1 w-20 bg-nova-500 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-3 gap-6">
              {[
                { pair: "Growth & Professionalism", icon: <Gem className="text-nova-400" /> },
                { pair: "Opportunities & Resourcefulness", icon: <Target className="text-purple-400" /> },
                { pair: "Innovation & Integrity", icon: <ShieldCheck className="text-nova-accent" /> }
              ].map((val, i) => (
                <div key={i} className="flex flex-col items-center p-8 rounded-2xl bg-white/5 border border-white/5 text-center group hover:bg-nova-900/50 transition-all">
                  <div className="mb-4 group-hover:scale-110 transition-transform">{val.icon}</div>
                  <span className="text-lg font-bold text-white">{val.pair}</span>
                </div>
              ))}
           </div>
        </div>
      </section>
      
      <section className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-nova-800/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Live Financial Insights & Market Updates</h2>
              <p className="text-gray-400">Breaking news, eco-financial opportunities, and company announcements.</p>
            </div>
            <div className="hidden md:block">
              <span className="flex items-center gap-2 text-xs text-nova-400 uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Feed Active
              </span>
            </div>
          </div>
          <FuturisticCarousel />
        </div>
      </section>

      <FAQSection />

      <section className="py-24 relative overflow-hidden bg-nova-900 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl font-bold mb-6">Contact Our Financial Specialists</h2>
                <p className="text-gray-400 mb-12 leading-relaxed">
                    Have specific questions about our business funding process or commercial loans? 
                    Reach out to our specialists via the official channels below.
                </p>
                <div className="space-y-6">
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-nova-500/10 flex items-center justify-center text-nova-400 group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Corporate Emails</p>
                            <div className="flex flex-col">
                              <a href="mailto:info@casiecfinancials.com" className="text-lg font-bold text-white hover:text-nova-400 transition-colors">info@casiecfinancials.com</a>
                              <a href="mailto:info@broastreet.africa" className="text-lg font-bold text-white hover:text-purple-400 transition-colors">info@broastreet.africa</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                            <Globe size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Websites</p>
                            <div className="flex flex-col">
                              <a href="http://www.casiecfinancials.com/" target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-nova-400 transition-colors">casiecfinancials.com</a>
                              <a href="http://www.broastreet.africa/" target="_blank" rel="noreferrer" className="text-lg font-bold text-white hover:text-purple-400 transition-colors">broastreet.africa</a>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 group">
                        <div className="w-14 h-14 rounded-2xl bg-nova-accent/10 flex items-center justify-center text-nova-accent group-hover:scale-110 transition-transform">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Lines of Communication</p>
                            <div className="flex flex-col font-mono text-sm text-white">
                              <span>+234 818-398-7171 (Dl)</span>
                              <span>+234 810-326-0048</span>
                              <span>+234 810-537-5394</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-10 rounded-[2.5rem] relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-nova-500/10 rounded-full blur-[60px] -z-10"></div>
                {submitted ? (
                    <div className="text-center py-12 animate-fade-in-up">
                        <CheckCircle size={64} className="mx-auto text-emerald-500 mb-6" />
                        <h3 className="text-3xl font-bold text-white mb-4">Message Received</h3>
                        <p className="text-gray-400">A representative will contact you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2 ml-4">Full Identity</label>
                                <input 
                                    required
                                    type="text" 
                                    value={contactForm.fullName}
                                    onChange={(e) => setContactForm({...contactForm, fullName: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2 ml-4">Contact Email</label>
                                <input 
                                    required
                                    type="email" 
                                    value={contactForm.email}
                                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2 ml-4">Subject</label>
                            <input 
                                required
                                type="text" 
                                value={contactForm.subject}
                                onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all"
                                placeholder="What can we help with?"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2 ml-4">Detailed Message</label>
                            <textarea 
                                required
                                value={contactForm.message}
                                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white h-32 focus:outline-none focus:border-nova-500 transition-all resize-none"
                                placeholder="Tell us more about your inquiry..."
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-nova-500 to-purple-600 hover:from-nova-400 hover:to-purple-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                        >
                            {isSubmitting ? 'Transmitting...' : 'Send Inquiry'} <Send size={18} />
                        </button>
                    </form>
                )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};