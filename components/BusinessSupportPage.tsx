import React from 'react';
import { Network, BrainCircuit, FileText, Scale, ArrowRight, Lightbulb, Users, Globe, Coins, LineChart } from 'lucide-react';

interface BusinessSupportPageProps {
  onInquireClick: () => void;
}

export const BusinessSupportPage: React.FC<BusinessSupportPageProps> = ({ onInquireClick }) => {
  const services = [
    {
      id: 'advisory',
      title: "Capital Raise Advisory",
      icon: <Coins className="w-8 h-8 text-nova-accent" />,
      description: "Expert guidance on structuring debt and equity raises. We help you value your business, determine the right capital mix, and negotiate terms.",
      features: ["Valuation & Deal Structuring", "Equity & Debt Strategy", "Investor Roadshows"]
    },
    {
      id: 'bdsp',
      title: "Institutional Funding (BDSP)",
      icon: <FileText className="w-8 h-8 text-purple-400" />,
      description: "Accredited support for accessing Bank of Industry (BOI) loans and other intervention funds. We handle the business plan, documentation, and compliance.",
      features: ["BOI Loan Processing", "Bankable Business Plans", "Grant Applications"]
    },
    {
      id: 'capacity',
      title: "Investor Readiness",
      icon: <LineChart className="w-8 h-8 text-emerald-400" />,
      description: "Prepare your management team and operations for due diligence. We implement the governance structures investors demand.",
      features: ["Financial Modeling", "Corporate Governance", "Operational Audits"]
    },
    {
      id: 'market',
      title: "Strategic Market Access",
      icon: <Globe className="w-8 h-8 text-orange-400" />,
      description: "Unlock growth to attract higher valuations. We connect you with strategic partners and new markets to demonstrate scalability.",
      features: ["Market Expansion Strategy", "Strategic Partnerships", "Export Readiness"]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-nova-900 selection:bg-purple-500">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-300 text-sm font-semibold mb-8 backdrop-blur-md">
            <Coins size={16} />
            <span>Capital Acquisition Specialists</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
            Prepare to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-white to-purple-400">
              Raise Capital.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Securing funding requires more than just a pitch. It requires bankable documentation, 
            solid governance, and a strategic roadmap. We prepare your business to attract 
            institutional investors and secure major loans.
          </p>
          
          <button 
            onClick={onInquireClick}
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-600 to-purple-600 px-8 font-medium text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="mr-2">Start Your Raise</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:200%_0,0_0] hover:duration-[1500ms]"></div>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Funding Ecosystem</h2>
            <p className="text-gray-400">Comprehensive support for every stage of your capital journey.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div 
              key={service.id} 
              className="group relative overflow-hidden rounded-3xl bg-white/5 p-8 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 hover:bg-white/10"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                {service.icon}
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-emerald-500/20 transition-all">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-400 mb-8 leading-relaxed h-20">
                  {service.description}
                </p>

                <ul className="space-y-3 border-t border-white/10 pt-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 pt-4">
                  <button 
                    onClick={onInquireClick}
                    className="text-sm font-bold text-emerald-400 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    Consult an Expert <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capital Sources Stats */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
              <div className="text-center">
                 <div className="text-3xl font-bold text-white mb-1">BOI</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Loan Specialist</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-bold text-white mb-1">₦25B+</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Total Raised</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-bold text-white mb-1">PE/VC</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Network Access</div>
              </div>
              <div className="text-center">
                 <div className="text-3xl font-bold text-white mb-1">95%</div>
                 <div className="text-xs text-gray-500 uppercase tracking-widest">Success Rate</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};