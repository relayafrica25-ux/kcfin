import React from 'react';
import { ArrowUpRight, Shield, Building2, Briefcase } from 'lucide-react';
import { MarketChart } from './MarketChart';

interface HeroProps {
  onGetFundedClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetFundedClick }) => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-nova-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-nova-accent/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-nova-500/30 text-nova-400 text-sm font-semibold mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nova-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nova-500"></span>
              </span>
              Direct Lender & Capital Partner
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Empowering Growth with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 to-nova-accent">
                Strategic Business Funding
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0">
              From commercial real estate to small business expansion. We provide the speed, flexibility, and capital you need to close the deal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetFundedClick}
                className="px-8 py-4 rounded-full bg-white text-nova-900 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                Get Funded
                <ArrowUpRight size={20} />
              </button>
              <button 
                onClick={onGetFundedClick}
                className="px-8 py-4 rounded-full glass-panel text-white font-semibold hover:bg-white/10 transition-colors"
              >
                View Loan Programs
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div className="text-center lg:text-left">
                <h4 className="text-2xl font-bold text-white">$500M+</h4>
                <p className="text-sm text-gray-500">Funded</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-2xl font-bold text-white">48h</h4>
                <p className="text-sm text-gray-500">Approval Time</p>
              </div>
              <div className="text-center lg:text-left">
                <h4 className="text-2xl font-bold text-white">50 States</h4>
                <p className="text-sm text-gray-500">Coverage</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
            <div className="relative glass-card rounded-3xl p-6 md:p-8 animate-float shadow-2xl shadow-nova-500/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-gray-400 text-sm font-medium">Recent Approvals</h3>
                  <div className="text-4xl font-bold text-white mt-1">$2.4M</div>
                </div>
                <div className="bg-nova-accent/20 px-3 py-1 rounded-lg text-nova-accent text-sm font-bold flex items-center gap-1">
                  <ArrowUpRight size={16} />
                  Approved
                </div>
              </div>
              
              <MarketChart />

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                      <Building2 size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">CRE Bridge</span>
                  </div>
                  <div className="text-lg font-bold text-white">$1,250,000</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-sm font-medium text-white">Biz Line</span>
                  </div>
                  <div className="text-lg font-bold text-white">$450,000</div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 glass-panel p-4 rounded-2xl animate-pulse-slow hidden md:block">
              <Shield className="text-nova-accent h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};