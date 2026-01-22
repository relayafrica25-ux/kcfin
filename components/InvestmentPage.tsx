import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Crown, TrendingUp, Shield, ArrowRight, Lock, PieChart, Network } from 'lucide-react';

const mockChartData = [
  { year: '2019', return: 12 },
  { year: '2020', return: 15 },
  { year: '2021', return: 18 },
  { year: '2022', return: 14 },
  { year: '2023', return: 22 },
  { year: '2024', return: 25 },
];

export const InvestmentPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-[#050508]">
      {/* Luxury Header */}
      <div className="relative py-24 text-center px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-600/10 rounded-full blur-[100px] -z-10"></div>
        <Crown className="mx-auto text-yellow-500 h-12 w-12 mb-6" />
        <h1 className="text-4xl md:text-7xl font-serif font-medium text-white mb-6 leading-tight">
          Investment & <span className="text-yellow-500 italic">Partnership Opportunities</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
          Exclusive entry points for institutional partners and accredited investors to participate in our proprietary private credit and equity ecosystem.
        </p>
      </div>

      {/* Highlighted Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <Network size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Professional Linkages</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Facilitating high-value connections for significant value addition across global financial corridors.</p>
          </div>
          
          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <PieChart size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Equity Stakes</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Direct participation in high-potential ventures and infrastructure projects through structured equity.</p>
          </div>

          <div className="group p-10 rounded-[2.5rem] bg-white/[0.02] border border-yellow-500/10 hover:border-yellow-500/40 transition-all duration-500 text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mx-auto mb-8 group-hover:scale-110 transition-transform">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 uppercase italic tracking-tighter">Investment</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Capital deployment into diversified asset-backed portfolios with optimized risk-adjusted yields.</p>
          </div>
        </div>
      </section>

      {/* Performance & Mechanics Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Chart Section */}
          <div className="glass-card p-10 rounded-[3rem] border border-yellow-500/20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-end mb-10 relative z-10">
               <div>
                 <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Target Annual Yield</div>
                 <div className="text-5xl font-black text-white tracking-tighter">12% - 18%</div>
               </div>
               <div className="text-green-400 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-green-900/20 px-4 py-2 rounded-full border border-green-500/20">
                 <TrendingUp size={14} /> Consistent Alpha
               </div>
            </div>
            
            <div className="h-[300px] w-full relative overflow-hidden">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#334155" tick={{fill: '#475569', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="#334155" tick={{fill: '#475569', fontSize: 12}} unit="%" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#050508', borderColor: '#EAB308', borderRadius: '12px', border: '1px solid rgba(234, 179, 8, 0.2)' }}
                    itemStyle={{ color: '#EAB308' }}
                  />
                  <Area type="monotone" dataKey="return" stroke="#EAB308" strokeWidth={3} fill="url(#goldGradient)" />
                </AreaChart>
               </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-600 mt-6 text-center font-black uppercase tracking-[0.2em] italic">Historical performance indicative of secured credit fund mandates.</p>
          </div>

          {/* Core Safeguards */}
          <div className="space-y-12">
            <div className="flex gap-6 group">
              <div className="bg-white/5 p-5 rounded-3xl h-fit border border-white/5 group-hover:border-yellow-500/30 transition-all">
                <Shield className="text-yellow-500" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Asset-Backed Security</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Mandates are secured by institutional-grade first-position liens on tangible assets. We maintain a conservative 70% Maximum LTV to prioritize principal preservation.
                </p>
              </div>
            </div>

             <div className="flex gap-6 group">
              <div className="bg-white/5 p-5 rounded-3xl h-fit border border-white/5 group-hover:border-yellow-500/30 transition-all">
                <Lock className="text-yellow-500" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Optimized Duration</h3>
                <p className="text-gray-400 leading-relaxed font-light">
                  Sovereign liquidity managed through short-duration cycles (12-24 months), effectively mitigating systemic interest rate exposure and enhancing capital agility.
                </p>
              </div>
            </div>

            <div className="pt-8">
              <a href="mailto:info@casiecfinancials.com" className="inline-flex items-center gap-6 text-yellow-500 hover:text-white transition-all group cursor-pointer bg-white/5 px-8 py-5 rounded-2xl border border-white/5 hover:border-yellow-500/40">
                <span className="text-sm font-black uppercase tracking-[0.3em]">Request Investor Deck</span>
                <div className="bg-yellow-500 text-black p-2 rounded-full group-hover:scale-110 transition-all">
                  <ArrowRight size={20} />
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Minimum Investment Banner */}
        <div className="mt-24 p-12 rounded-[3.5rem] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/10 text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-[0.03] pointer-events-none"></div>
           <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Entry Threshold</h3>
           <div className="text-5xl md:text-7xl font-serif text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.2)]">₦10,000,000</div>
        </div>
      </div>
    </div>
  );
};