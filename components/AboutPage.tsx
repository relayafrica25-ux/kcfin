
import React from 'react';
import { Target, Compass, Zap, Sparkles, Gem, ShieldCheck, Landmark, Network, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <article className="pt-24 min-h-screen bg-nova-900 selection:bg-nova-500">
      {/* Hero Section */}
      <header className="relative py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nova-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nova-500/10 border border-nova-500/30 text-nova-400 text-sm font-semibold mb-8 animate-fade-in-up">
            <Sparkles size={16} />
            <span>Excellence in Finance</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight text-white animate-fade-in-up">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 to-purple-400">Story.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light">
            Setting the global benchmark for financial intermediation and business support.
          </p>
        </div>
      </header>

      {/* Main Narrative */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 md:p-16 rounded-[3rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-nova-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-nova-500/10 transition-colors"></div>
            
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-grow">
                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-nova-500 pl-6 uppercase tracking-tighter italic">Corporate Narrative</h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed font-light">
                  <p>
                    CASIEC Financials focuses on financial intermediation, providing loans to Nano, Micro, Small, and Medium-sized businesses, as well as consumer lending to promote financial inclusion.
                  </p>
                  <p>
                    In partnership with <span className="text-purple-400 font-semibold">GSI STRATEGIC ALLIANCES (Broastreet DyDX)</span>, we offer comprehensive financial and business support services to drive enterprise sustainability. 
                  </p>
                  <p>
                    Our vision is to become the story and the leading benchmark in finance and business support, setting the standard for excellence.
                  </p>
                </div>
              </div>
              
              <div className="w-full md:w-72 flex-shrink-0 space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <Landmark className="text-nova-400 mb-3" size={32} />
                  <h3 className="text-white font-bold mb-1">CASIEC</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Financial Intermediation</p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <Network className="text-purple-400 mb-3" size={32} />
                  <h3 className="text-white font-bold mb-1">GSI (Broastreet DyDX)</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Strategic Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <article className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-nova-500/20 rounded-xl flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                To become the story and the leading benchmark in finance and business support, setting the standard for excellence.
              </p>
            </article>
            <article className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Compass size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Delivering credit, capital and enterprise support to stimulate business growth and drive sustainable impact.
              </p>
            </article>
            <article className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:translate-y-[-5px]">
              <div className="w-12 h-12 bg-nova-accent/20 rounded-xl flex items-center justify-center text-nova-accent mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mandate</h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Fostering economic advancement through financial inclusion across the continent and beyond.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Core Values</h2>
            <div className="h-1 w-20 bg-nova-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Growth & Professionalism", icon: <Gem className="text-nova-400" size={32} /> },
              { title: "Opportunities & Resourcefulness", icon: <Target className="text-purple-400" size={32} /> },
              { title: "Innovation & Integrity", icon: <ShieldCheck className="text-nova-accent" size={32} /> }
            ].map((val, i) => (
              <div key={i} className="flex flex-col items-center p-10 rounded-[2.5rem] bg-white/5 border border-white/5 text-center group hover:bg-nova-900 transition-all duration-500 hover:shadow-[0_0_40px_rgba(79,70,229,0.1)]">
                <div className="mb-6 group-hover:scale-110 transition-transform">{val.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  The foundation of every interaction and the driver of our long-term institutional success.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 bg-nova-800/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] mb-12">Partners in Excellence</h4>
          <div className="flex flex-wrap justify-center items-center gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
             <div className="flex items-center gap-3">
                <div className="bg-nova-500 p-2 rounded-lg"><Landmark className="h-8 w-8 text-white" /></div>
                <span className="text-2xl font-black text-white italic uppercase">CASIEC</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="bg-purple-600 p-2 rounded-lg"><Network className="h-8 w-8 text-white" /></div>
                <span className="text-2xl font-black text-white italic uppercase">GSI STRATEGIC ALLIANCES</span>
             </div>
          </div>
        </div>
      </section>
    </article>
  );
};
