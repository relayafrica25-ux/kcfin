
import React from 'react';
import { Network, BrainCircuit, FileText, Scale, ArrowRight, Lightbulb, Users, Globe, Coins, LineChart, ShieldCheck, Database, Truck, BarChart3 } from 'lucide-react';

interface BusinessSupportPageProps {
  onInquireClick: () => void;
}

export const BusinessSupportPage: React.FC<BusinessSupportPageProps> = ({ onInquireClick }) => {
  const sections = [
    {
      title: "Business Support Services",
      icon: <Users className="text-purple-400" />,
      items: [
        { label: "Business Development", desc: "Strategic growth mapping and pipeline optimization." },
        { label: "Strategic Outsourcing", desc: "E-Management system optimization for leaner operations." },
        { label: "Expert Advisory", desc: "Network management of high-tier industrial specialists." }
      ]
    },
    {
      title: "Corporate Finance (CFRA)",
      icon: <BarChart3 className="text-emerald-400" />,
      items: [
        { label: "Credit & Capital Raise", desc: "Comprehensive financing solutions for scale." },
        { label: "Capital Mapping", desc: "Identification and qualification of strategic investors." },
        { label: "Investment Advisory", desc: "Data-backed guidance for institutional deployments." }
      ]
    },
    {
      title: "Supply Chain & Trading",
      icon: <Truck className="text-orange-400" />,
      items: [
        { label: "Supply Chain Advisory", desc: "End-to-end logistics and procurement strategy." },
        { label: "Commodity Trading", desc: "Global distribution networks for essential goods." }
      ]
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-nova-900">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-semibold mb-8 backdrop-blur-md">
            <Network size={16} />
            <span>GSI STRATEGIC ALLIANCES</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-white">
            Architecture for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-white to-emerald-400">
              Corporate Alpha.
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Beyond capital, we provide the strategic infrastructure. GSI Strategic Alliances integrates 
            Business Support, Corporate Finance, and Global Commodity Distribution.
          </p>
          
          <button 
            onClick={onInquireClick}
            className="px-10 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-xl shadow-purple-600/20"
          >
            Start Your Raise
          </button>
        </div>
      </div>

      {/* Main Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="glass-panel p-10 rounded-[3rem] border border-white/5 flex flex-col hover:border-purple-500/30 transition-all duration-500">
               <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8">
                  {section.icon}
               </div>
               <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/5 pb-4">{section.title}</h3>
               <div className="space-y-8 flex-grow">
                 {section.items.map((item, i) => (
                    <div key={i} className="group cursor-default">
                       <div className="text-white font-bold mb-1 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-purple-500"></div>
                          {item.label}
                       </div>
                       <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                 ))}
               </div>
               <div className="mt-12 pt-6 border-t border-white/5">
                  <button onClick={onInquireClick} className="text-sm font-bold text-purple-400 hover:text-white flex items-center gap-2">
                     Learn More <ArrowRight size={14} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* CFRA Specific Section */}
      <section className="bg-black/40 py-24 border-t border-white/5">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Corporate Finance, <br/> Research & Advisory (CFRA)</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    Our CFRA pillar is the intelligence core of GSI. We identify capital gaps, map potential 
                    investor interest, and structure financing solutions that align with long-term enterprise goals.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <ShieldCheck className="text-emerald-400 mb-2" size={20} />
                        <div className="text-white font-bold text-sm">Capital Mapping</div>
                     </div>
                     <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <LineChart className="text-emerald-400 mb-2" size={20} />
                        <div className="text-white font-bold text-sm">Investment Analysis</div>
                     </div>
                  </div>
               </div>
               <div className="flex-1 w-full">
                  <div className="glass-panel p-8 rounded-[2.5rem] bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                     <Database className="absolute -bottom-10 -right-10 text-white/5 w-60 h-60" />
                     <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">Strategic Impact</h4>
                     <p className="text-2xl text-white italic mb-10 leading-relaxed">
                       "Bridging the identification gap between ambitious African ventures and institutional capital."
                     </p>
                     <button onClick={onInquireClick} className="bg-white text-black px-8 py-3 rounded-full font-bold">Request Advisory</button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
