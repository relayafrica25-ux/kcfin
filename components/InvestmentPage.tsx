import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Crown, TrendingUp, Shield, ArrowRight, Lock } from 'lucide-react';

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
      <div className="relative py-24 text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-600/10 rounded-full blur-[100px] -z-10"></div>
        <Crown className="mx-auto text-yellow-500 h-12 w-12 mb-6" />
        <h1 className="text-5xl md:text-7xl font-serif font-medium text-white mb-6">
          Wealth <span className="text-yellow-500 italic">Architecture</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Exclusive private credit opportunities for accredited investors, family offices, and institutional partners.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Chart Section */}
          <div className="glass-card p-8 rounded-3xl border border-yellow-500/20 bg-gradient-to-b from-gray-900 to-black">
            <div className="flex justify-between items-end mb-8">
               <div>
                 <div className="text-gray-400 text-sm">Target Annual Yield</div>
                 <div className="text-4xl font-bold text-white">12% - 18%</div>
               </div>
               <div className="text-green-400 flex items-center gap-1 text-sm bg-green-900/20 px-3 py-1 rounded-full">
                 <TrendingUp size={14} /> Consistent Alpha
               </div>
            </div>
            
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#4B5563" tick={{fill: '#9CA3AF'}} />
                  <YAxis stroke="#4B5563" tick={{fill: '#9CA3AF'}} unit="%" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: '#EAB308' }}
                    itemStyle={{ color: '#EAB308' }}
                  />
                  <Area type="monotone" dataKey="return" stroke="#EAB308" strokeWidth={2} fill="url(#goldGradient)" />
                </AreaChart>
               </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-600 mt-4 text-center">*Historical performance of our secured first-lien mortgage fund.</p>
          </div>

          {/* Text Content */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="bg-white/5 p-4 rounded-full h-fit">
                <Shield className="text-yellow-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Asset-Backed Security</h3>
                <p className="text-gray-400 leading-relaxed">
                  Your capital is secured by first-position liens on tangible real estate assets with a maximum LTV of 70%. We prioritize principal protection above all else.
                </p>
              </div>
            </div>

             <div className="flex gap-4">
              <div className="bg-white/5 p-4 rounded-full h-fit">
                <Lock className="text-yellow-500" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Short Duration</h3>
                <p className="text-gray-400 leading-relaxed">
                  Our funds typically mature in 12-24 months, providing liquidity and mitigating long-term market interest rate risk.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <a href="mailto:invest@kcfinancial.com" className="inline-flex items-center gap-4 text-yellow-500 hover:text-white transition-colors group cursor-pointer">
                <span className="text-lg font-bold">Request Investor Deck</span>
                <div className="bg-yellow-500/10 p-2 rounded-full group-hover:bg-yellow-500 group-hover:text-black transition-colors">
                  <ArrowRight size={20} />
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Minimum Investment Banner */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border border-white/5 text-center">
           <h3 className="text-2xl text-white mb-2">Minimum Investment</h3>
           <div className="text-5xl font-serif text-yellow-500 mb-4">$50,000</div>
           <p className="text-gray-500 text-sm">For Accredited Investors Only</p>
        </div>
      </div>
    </div>
  );
};