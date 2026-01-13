
import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { NewsTicker } from './components/NewsTicker';
import { LoanApplicationModal } from './components/LoanApplicationModal';
import { NewsletterPopup } from './components/NewsletterPopup';
import { ChatWidget } from './components/ChatWidget';
import { HomePage } from './components/HomePage';
import { BusinessFundingPage } from './components/BusinessFundingPage';
import { BusinessSupportPage } from './components/BusinessSupportPage';
import { InvestmentPage } from './components/InvestmentPage';
import { ArticleHubPage } from './components/ArticleHubPage';
import { AdminDashboard } from './components/AdminDashboard';
import { RealEstatePage } from './components/RealEstatePage';
import { TeamPage } from './components/TeamPage';
import { AboutPage } from './components/AboutPage';
import { Settings, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const openLoanModal = () => setIsLoanModalOpen(true);
  const closeLoanModal = () => setIsLoanModalOpen(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  // Router logic
  const renderView = () => {
    if (currentView === 'admin') {
      return <AdminDashboard onBack={() => handleNavigate('home')} />;
    }

    switch (currentView) {
      case 'home':
        return <HomePage onApplyClick={openLoanModal} onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'financial-support':
      case 'real-estate':
        return <BusinessFundingPage onApplyClick={openLoanModal} />;
      case 'business-support':
        return <BusinessSupportPage onInquireClick={openLoanModal} />;
      case 'investment':
        return <InvestmentPage />;
      case 'insights':
        return <ArticleHubPage />;
      default:
        return <HomePage onApplyClick={openLoanModal} onNavigate={handleNavigate} />;
    }
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
        <footer className="bg-nova-900 pt-20 pb-10 border-t border-white/5 mt-auto relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-nova-500/5 to-transparent -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-nova-500 p-2.5 rounded-xl shadow-lg shadow-nova-500/20">
                    <div className="h-4 w-4 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-bold text-xl tracking-tight text-white">CASIEC</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  CASIEC FINANCIALS & GSI: The intersection of institutional capital and entrepreneurial vision. Fostering economic advancement through financial inclusion.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-50">Quick Links</h4>
                <ul className="space-y-4">
                  <li><button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white transition-colors text-sm">Home</button></li>
                  <li><button onClick={() => handleNavigate('team')} className="text-gray-400 hover:text-white transition-colors text-sm">Our Team</button></li>
                  <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-sm">Funding Programs</button></li>
                  <li><button onClick={() => handleNavigate('insights')} className="text-gray-400 hover:text-white transition-colors text-sm">Insights Hub</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-[10px] opacity-50">Contact Us</h4>
                <ul className="space-y-4 text-sm text-gray-400">
                  <li>Lagos, Nigeria</li>
                  <li>support@casiec.com</li>
                  <li className="font-mono text-xs">+234 818-398-7171 (Dl)</li>
                  <li className="font-mono text-xs">+234 810-326-0048</li>
                  <li className="font-mono text-xs">+234 810-537-5394</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-gray-600 text-[10px] uppercase tracking-[0.4em] font-bold">
                © 2024 CASIEC FINANCIALS & GSI. ALL RIGHTS RESERVED.
              </div>
            </div>
          </div>
        </footer>
      )}

      {!isDashboard && <ChatWidget />}
    </div>
  );
};

export default App;
