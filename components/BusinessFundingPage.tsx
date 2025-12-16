import React from 'react';
import { Rocket, Zap, Clock, ArrowRight, ShieldCheck, PieChart } from 'lucide-react';

interface BusinessFundingPageProps {
  onApplyClick: () => void;
}

export const BusinessFundingPage: React.FC<BusinessFundingPageProps> = ({ onApplyClick }) => {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative py-20">
         {/* Circuit board pattern overlay could go here */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold mb-8">
            <Zap size={16} />
            <span>Fast-Track Approval Process</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight">
            Fuel for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse-slow">
              Hypergrowth
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Traditional banks are too slow. We provide enterprise-grade capital with the speed of a fintech. 
            Get approved for up to <span className="text-white font-bold">$5,000,000</span> in 24 hours.
          </p>
          <button 
            onClick={onApplyClick}
            className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="border-y border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: "Funding Time", val: "4 Hours" },
                    { label: "Approval Rate", val: "92%" },
                    { label: "Max Amount", val: "$5M" },
                    { label: "Paperwork", val: "Minimal" },
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.val}</div>
                        <div className="text-sm text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Product Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 glass-panel p-10 rounded-3xl border-t-4 border-purple-500">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-3xl font-bold mb-2">Business Term Loans</h3>
                        <p className="text-gray-400">Lump sum capital for expansion, inventory, or acquisition.</p>
                    </div>
                    <Rocket className="text-purple-500 h-10 w-10" />
                </div>
                <div className="space-y-4 mb-8">
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Term</span>
                        <span className="font-semibold">6 Months - 10 Years</span>
                     </div>
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Rate</span>
                        <span className="font-semibold">Starting at 6.99%</span>
                     </div>
                     <div className="flex justify-between border-b border-white/10 pb-2">
                        <span className="text-gray-400">Funding Speed</span>
                        <span className="font-semibold">1 - 3 Days</span>
                     </div>
                </div>
                <button onClick={onApplyClick} className="w-full py-3 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white transition-all font-bold">
                    Check Eligibility
                </button>
            </div>

            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-t-4 border-pink-500">
                <div>
                    <PieChart className="text-pink-500 h-10 w-10 mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Line of Credit</h3>
                    <p className="text-gray-400 text-sm mb-6">Revolving capital. Only pay interest on what you use. Perfect for cash flow management.</p>
                </div>
                <button onClick={onApplyClick} className="w-full py-3 rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white transition-all font-bold">
                    Apply Now
                </button>
            </div>

            <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between border-t-4 border-emerald-500">
                <div>
                    <ShieldCheck className="text-emerald-500 h-10 w-10 mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Equipment Financing</h3>
                    <p className="text-gray-400 text-sm mb-6">100% financing for machinery, vehicles, and software. Tax deductible (Section 179).</p>
                </div>
                <button onClick={onApplyClick} className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all font-bold">
                    Apply Now
                </button>
            </div>

            <div className="col-span-1 md:col-span-2 glass-panel p-10 rounded-3xl flex items-center justify-between bg-gradient-to-r from-gray-900 to-gray-800">
                 <div>
                    <h3 className="text-2xl font-bold mb-2">Need SBA Funding?</h3>
                    <p className="text-gray-400">We specialize in SBA 7(a) and 504 loans with expedited processing.</p>
                 </div>
                 <div className="bg-white rounded-full p-2">
                    <ArrowRight className="text-black" />
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};