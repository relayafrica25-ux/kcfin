
import React from 'react';
import { Rocket, Zap, Clock, ArrowRight, ShieldCheck, PieChart, Landmark, Coins, TrendingUp, HandCoins, Building, Palette, Users, Layers, Briefcase, FileCheck } from 'lucide-react';

interface BusinessFundingPageProps {
  onApplyClick: () => void;
}

export const BusinessFundingPage: React.FC<BusinessFundingPageProps> = ({ onApplyClick }) => {
  const offerings = [
    {
      title: "Asset Finance",
      desc: "Strategic financing for heavy machinery, vehicles, and essential business equipment to scale your operations.",
      icon: <Building className="text-nova-400" />
    },
    {
      title: "Consumer Loan",
      desc: "Flexible personal credit facilities and salary advance solutions for individuals and professional employees.",
      icon: <Coins className="text-purple-400" />
    },
    {
      title: "Working Capital Loans",
      desc: "Optimized liquidity solutions to bridge operational gaps, manage inventory, and fuel day-to-day expansion.",
      icon: <TrendingUp className="text-nova-accent" />
    },
    {
      title: "Group Loans",
      desc: "Community-based micro-credit solutions designed for collaborative enterprise development and mutual growth.",
      icon: <Users className="text-emerald-400" />
    },
    {
      title: "Gender Credit",
      desc: "Specialized financing designed to empower female entrepreneurs and narrow the gender funding gap in business.",
      icon: <Zap className="text-pink-400" />
    },
    {
      title: "Refinancing Credit",
      desc: "Restructuring existing debt to optimize your business cash flow and reduce overall long-term capital costs.",
      icon: <ShieldCheck className="text-orange-400" />
    },
    {
      title: "Creative Economy Loans",
      desc: "Supporting the arts, media, and digital entertainment sectors with tailored credit for talent and production.",
      icon: <Palette className="text-indigo-400" />
    },
    {
      title: "TOP Onlending Loans",
      desc: "Wholesale capital for microfinance institutions and cooperatives to stimulate the economy from the top down.",
      icon: <Layers className="text-amber-400" />
    },
    {
      title: "Proof of Funds",
      desc: "Verifiable capital documentation and financial guarantees for high-stakes trade and strategic investments.",
      icon: <FileCheck className="text-blue-400" />
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-nova-900">
      {/* Hero */}
      <div className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nova-500/10 border border-nova-500/30 text-nova-400 text-sm font-semibold mb-8">
            <Landmark size={16} />
            <span>CASIEC Financial Solutions</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight text-white">
            Capital that <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 via-white to-nova-accent animate-pulse-slow">
              Empowers
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            From Asset Finance to Creative Economy support, CASIEC provides the specialized 
            liquidity required to drive continental success and individual empowerment.
          </p>
          <button 
            onClick={onApplyClick}
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Start Inquiry
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item, i) => (
            <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-nova-500/50 transition-all group">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Highlight */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
         <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-nova-900 to-indigo-900 border border-white/10 p-12 lg:p-20 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10"></div>
            <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Inclusive Credit Mandate</h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                  Fostering economic advancement through financial inclusion. Our diverse credit products are 
                  architected to stimulate every sector of the emerging African market.
                </p>
                <button onClick={onApplyClick} className="text-nova-400 font-bold flex items-center gap-2 mx-auto hover:text-white transition-colors">
                  Consult a Specialist <ArrowRight size={20} />
                </button>
            </div>
         </div>
      </div>
    </div>
  );
};
