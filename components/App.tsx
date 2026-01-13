
import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { NewsTicker } from './NewsTicker';
import { LoanApplicationModal } from './LoanApplicationModal';
import { NewsletterPopup } from './NewsletterPopup';
import { ChatWidget } from './ChatWidget';
import { HomePage } from './HomePage';
import { RealEstatePage } from './RealEstatePage';
import { BusinessFundingPage } from './BusinessFundingPage';
import { BusinessSupportPage } from './BusinessSupportPage';
import { InvestmentPage } from './InvestmentPage';
import { ArticleHubPage } from './ArticleHubPage';
import { AdminDashboard } from './AdminDashboard';
import { AboutPage } from './AboutPage';
import { TeamPage } from './TeamPage';
import { LayoutDashboard, Lock, ShieldCheck, Key, Settings, Activity, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const openLoanModal = () => setIsLoanModalOpen(true);
  const closeLoanModal = () => setIsLoanModalOpen(false);

  // Router logic
  const renderView = () => {
    if (currentView === 'admin') {
      return <AdminDashboard onBack={() => setCurrentView('home')} />;
    }

    switch (currentView) {
      case 'home':
        return <HomePage onApplyClick={openLoanModal} onNavigate={setCurrentView} />;
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'real-estate':
        return <RealEstatePage onApplyClick={openLoanModal} />;
      case 'financial-support':
      case 'business':
        return <BusinessFundingPage onApplyClick={openLoanModal} />;
      case 'business-support':
        return <BusinessSupportPage onInquireClick={openLoanModal} />;
      case 'investment':
        return <InvestmentPage />;
      case 'insights':
        return <ArticleHubPage />;
      default:
        return <HomePage onApplyClick={openLoanModal} onNavigate={setCurrentView} />;
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const isDashboard = currentView === 'admin';

  return (
    <div className="min-h-screen bg-nova-900 text-white selection:bg-nova-500 selection:text-white flex flex-col">
      {!isDashboard && (
        <>
          <Navbar 
            onApplyClick={openLoanModal} 
            currentView={currentView}
            onNavigate={handleNavigate}
          />
          <NewsTicker />
          <LoanApplicationModal isOpen={isLoanModalOpen} onClose={closeLoanModal} />
          <NewsletterPopup />
        </>
      )}

      <main className="flex-grow">
        {renderView()}
      </main>

      {!isDashboard && (
        <>
          <footer className="bg-[#050508] pt-24 pb-12 border-t border-white/5 mt-auto relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-nova-500/5 to-transparent -z-10"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
                {/* Brand Column */}
                <div className="lg:col-span-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-10">
                    {/* CASIEC Logo Rendering */}
                    <div 
                      className="flex items-center gap-3 cursor-pointer group" 
                      onClick={() => handleNavigate('home')}
                    >
                      <img 
                        src="logo.png" 
                        alt="CASIEC Financials" 
                        className="h-12 w-auto invert brightness-200 contrast-125 transition-transform group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <div className="flex flex-col leading-[0.8]">
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-gray-500 tracking-tighter uppercase italic">
                          CASIEC
                        </span>
                        <span className="text-[10px] font-bold text-gray-500 tracking-[0.4em] uppercase mt-1">
                          FINANCIALS
                        </span>
                      </div>
                    </div>

                    <div className="hidden sm:block h-10 w-px bg-white/10"></div>

                    {/* Broastreet DyDX Logo Rendering (SVG implementation to match user image) */}
                    <div className="flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                       <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                         {/* Orange Checkmark */}
                         <path d="M15 20L22 28L45 8" stroke="#F97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                         <path d="M12 22L15 25M42 12L38 16" stroke="#F97316" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                         {/* DyDX Text */}
                         <text x="55" y="28" fill="white" fontSize="22" fontWeight="900" fontFamily="Inter, sans-serif">DyDX</text>
                         <text x="110" y="15" fill="white" fontSize="8" fontWeight="400" opacity="0.3">TM</text>
                       </svg>
                    </div>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-md">
                    CASIEC Financials provides advanced financial intermediation and inclusion. 
                    In synergy with <span className="text-white font-semibold">GSI STRATEGIC ALLIANCES (Broastreet DyDX)</span>, 
                    we deliver institutional-grade credit and business support to stimulate growth across African markets.
                  </p>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-nova-500/10 border border-nova-500/20 rounded-full w-fit">
                    <ShieldCheck size={14} className="text-nova-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-nova-400">Secured Institutional Partnership</span>
                  </div>
                </div>
                
                {/* Links Columns */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px] opacity-30">Discovery</h4>
                    <ul className="space-y-4">
                      <li><button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Home</button></li>
                      <li><button onClick={() => handleNavigate('about')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">About Us</button></li>
                      <li><button onClick={() => handleNavigate('team')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Our Team</button></li>
                      <li><button onClick={() => handleNavigate('insights')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Insights Hub</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px] opacity-30">Pillars</h4>
                    <ul className="space-y-4">
                      <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-left">Funding Programs</button></li>
                      <li><button onClick={() => handleNavigate('business-support')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-left">Advisory Services</button></li>
                      <li><button onClick={() => handleNavigate('investment')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-left">Wealth Architecture</button></li>
                      <li><button onClick={() => handleNavigate('real-estate')} className="text-gray-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-left">Real Estate Bridge</button></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-black mb-8 uppercase tracking-[0.3em] text-[10px] opacity-30">Uplink</h4>
                    <ul className="space-y-6 text-sm text-gray-400">
                      <li className="flex items-start gap-3 group">
                        <Globe size={16} className="text-nova-400 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col gap-1">
                           <a href="http://www.casiecfinancials.com/" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors">casiecfinancials.com</a>
                           <a href="http://www.broastreet.africa/" target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors">broastreet.africa</a>
                        </div>
                      </li>
                      <li className="font-mono text-[10px] space-y-1">
                        <span className="block text-gray-600 uppercase mb-1 font-sans font-black tracking-widest">Contact Lines</span>
                        <span className="block text-white">+234 818-398-7171 (Dl)</span>
                        <span className="block">+234 810-326-0048</span>
                        <span className="block">+234 810-537-5394</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright Area */}
              <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-black">
                  © 2024 CASIEC FINANCIALS & GSI. ALL RIGHTS RESERVED.
                </div>
                
                <div className="flex items-center gap-10">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-nova-500 hover:border-nova-400 transition-all cursor-pointer">
                        <span className="font-black text-[10px]">IN</span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-nova-500 hover:border-nova-400 transition-all cursor-pointer">
                        <span className="font-black text-[10px]">TW</span>
                      </div>
                   </div>
                   <button 
                    onClick={() => handleNavigate('admin')}
                    className="flex items-center gap-2 text-gray-700 hover:text-nova-400 transition-colors"
                   >
                     <Lock size={12} />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminal</span>
                   </button>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {!isDashboard && <ChatWidget />}
    </div>
  );
};

export default App;
