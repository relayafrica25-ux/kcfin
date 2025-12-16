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

const App: React.FC = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');

  const openLoanModal = () => setIsLoanModalOpen(true);
  const closeLoanModal = () => setIsLoanModalOpen(false);

  // Router logic
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onApplyClick={openLoanModal} onNavigate={setCurrentView} />;
      case 'real-estate':
        return <RealEstatePage onApplyClick={openLoanModal} />;
      case 'financial-support':
      case 'business': // fallback for old links
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

  // Scroll to top on navigation
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-nova-900 text-white selection:bg-nova-500 selection:text-white flex flex-col">
      <Navbar 
        onApplyClick={openLoanModal} 
        currentView={currentView}
        onNavigate={handleNavigate}
      />
      <NewsTicker />
      
      <LoanApplicationModal isOpen={isLoanModalOpen} onClose={closeLoanModal} />
      <NewsletterPopup />

      <main className="flex-grow">
        {renderView()}
      </main>

      <footer className="bg-nova-900 py-12 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="bg-white/10 p-2 rounded-lg">
                <div className="h-4 w-4 bg-nova-500 rounded-sm"></div>
             </div>
             <div className="flex flex-col">
               <span className="font-bold text-lg">KC Financial Group</span>
               <span className="text-xs text-gray-500">New York • London • Singapore</span>
             </div>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 KC Financial Group. All rights reserved.
          </div>
          <div className="flex gap-6">
             <button onClick={() => handleNavigate('real-estate')} className="text-gray-500 hover:text-white transition-colors">Real Estate</button>
             <button onClick={() => handleNavigate('financial-support')} className="text-gray-500 hover:text-white transition-colors">Business</button>
             <button onClick={() => handleNavigate('investment')} className="text-gray-500 hover:text-white transition-colors">Invest</button>
             <button onClick={() => handleNavigate('insights')} className="text-gray-500 hover:text-white transition-colors">Insights</button>
          </div>
        </div>
      </footer>

      {/* Global Widgets placed at the end to ensure they float above everything */}
      <ChatWidget />
    </div>
  );
};

export default App;