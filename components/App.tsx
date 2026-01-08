
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
          <footer className="bg-nova-900 pt-20 pb-10 border-t border-white/5 mt-auto relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-nova-500/5 to-transparent -z-10"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Brand Column */}
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-nova-500 p-2 rounded-lg shadow-lg shadow-nova-500/20">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col leading-[0.8]">
                      <span className="font-bold text-lg tracking-tight text-white uppercase italic">CASIEC</span>
                      <span className="text-[8px] font-bold text-gray-500 tracking-[0.3em] uppercase mt-1">FINANCIALS</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">
                    CASIEC Financials focuses on financial intermediation and inclusion. In partnership with GSI STRATEGIC ALLIANCES (Broastreet DyDX), we drive enterprise sustainability and growth.
                  </p>
                  <p className="text-nova-400 font-bold italic text-sm">
                    We lend, we support, You succeed.
                  </p>
                </div>
                
                {/* Links Column 1 */}
                <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-50">Discovery</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white transition-colors text-sm">Home</button></li>
                    <li><button onClick={() => handleNavigate('about')} className="text-gray-400 hover:text-white transition-colors text-sm">About Us</button></li>
                    <li><button onClick={() => handleNavigate('team')} className="text-gray-400 hover:text-white transition-colors text-sm">Our Team</button></li>
                    <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-sm">Funding Programs</button></li>
                    <li><button onClick={() => handleNavigate('insights')} className="text-gray-400 hover:text-white transition-colors text-sm">Insights Hub</button></li>
                  </ul>
                </div>

                {/* Links Column 2 */}
                <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-50">Communication</h4>
                  <ul className="space-y-4 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                       <Globe size={14} className="mt-1 text-nova-400" />
                       <div className="flex flex-col gap-1">
                          <a href="http://www.casiecfinancials.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">casiecfinancials.com</a>
                          <a href="http://www.broastreet.africa/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">broastreet.africa</a>
                       </div>
                    </li>
                    <li>
                      <div className="flex flex-col gap-1">
                        <a href="mailto:info@casiecfinancials.com" className="hover:text-white transition-colors">info@casiecfinancials.com</a>
                        <a href="mailto:info@broastreet.africa" className="hover:text-white transition-colors">info@broastreet.africa</a>
                      </div>
                    </li>
                    <li className="font-mono text-xs pt-2">
                      <div className="flex flex-col gap-1">
                        <span>+234 818-398-7171 (Dl)</span>
                        <span>+234 810-326-0048</span>
                        <span>+234 810-537-5394</span>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Staff Access Column */}
                <div className="flex flex-col">
                  <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-50">Operations</h4>
                  <button 
                    onClick={() => handleNavigate('admin')}
                    className="group relative flex items-center justify-between gap-4 px-6 py-5 bg-white/5 border border-white/10 hover:border-nova-500 hover:bg-nova-500/5 rounded-[2rem] transition-all duration-500 shadow-2xl overflow-hidden hover:shadow-nova-500/20"
                  >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-nova-500/20 rounded-2xl text-nova-400 group-hover:bg-nova-500 group-hover:text-white transition-all shadow-lg">
                            <Lock size={20} />
                        </div>
                        <div className="text-left">
                            <div className="text-base font-black text-white uppercase tracking-tight">Staff Portal</div>
                            <div className="text-[9px] text-gray-500 group-hover:text-nova-400 transition-colors uppercase tracking-[0.3em] font-bold">Secure Authorization</div>
                        </div>
                    </div>
                    <Settings size={20} className="text-gray-600 group-hover:rotate-180 group-hover:text-nova-400 transition-all duration-700" />
                  </button>
                  <p className="mt-4 text-[10px] text-gray-600 italic px-2">Institutional access only. Personnel ID required.</p>
                </div>
              </div>

              {/* Bottom Copyright Area */}
              <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
                  © 2024 CASIEC FINANCIALS & GSI. ALL RIGHTS RESERVED.
                </div>
                
                <div className="flex items-center gap-8">
                   <button 
                    onClick={() => handleNavigate('admin')}
                    className="text-[9px] font-black uppercase tracking-widest text-gray-600 hover:text-nova-400 transition-colors flex items-center gap-2"
                   >
                     <ShieldCheck size={12} /> Personnel Login
                   </button>
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                        <span className="font-bold text-[10px]">IN</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer">
                        <span className="font-bold text-[10px]">TW</span>
                      </div>
                   </div>
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
