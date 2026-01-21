import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { NewsTicker } from './NewsTicker';
import { LoanApplicationModal } from './LoanApplicationModal';
import { NewsletterPopup } from './NewsletterPopup';
import { ChatWidget } from './ChatWidget';
import { HomePage } from './HomePage';
import { BusinessFundingPage } from './BusinessFundingPage';
import { BusinessSupportPage } from './BusinessSupportPage';
import { InvestmentPage } from './InvestmentPage';
import { ArticleHubPage } from './ArticleHubPage';
import { AdminDashboard } from './AdminDashboard';
import { RealEstatePage } from './RealEstatePage';
import { TeamPage } from './TeamPage';
import { AboutPage } from './AboutPage';
import { ArticleDetailPage } from './ArticleDetailPage';
import { Article } from '../types';
import { Settings, Lock, Globe, ShieldCheck, Linkedin, Twitter, Mail, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'financial' | 'business_support' | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const openLoanModal = (type?: 'financial' | 'business_support') => {
    setModalType(type || null);
    setIsLoanModalOpen(true);
  };
  
  const closeLoanModal = () => {
    setIsLoanModalOpen(false);
    setModalType(null);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSelectedArticle(null);
    window.scrollTo(0, 0);
  };

  const handleOpenArticle = (article: Article) => {
    setSelectedArticle(article);
    setCurrentView('article-detail');
    window.scrollTo(0, 0);
  };

  // Router logic
  const renderView = () => {
    if (currentView === 'admin') {
      return <AdminDashboard onBack={() => handleNavigate('home')} />;
    }

    if (currentView === 'article-detail' && selectedArticle) {
      return (
        <ArticleDetailPage 
          article={selectedArticle} 
          onBack={() => handleNavigate('insights')} 
          onOpenArticle={handleOpenArticle}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <HomePage 
            onApplyClick={() => openLoanModal()} 
            onNavigate={handleNavigate} 
            onOpenArticle={handleOpenArticle}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'team':
        return <TeamPage />;
      case 'financial-support':
      case 'real-estate':
        return <BusinessFundingPage onApplyClick={() => openLoanModal('financial')} />;
      case 'business-support':
        return <BusinessSupportPage onInquireClick={() => openLoanModal('business_support')} />;
      case 'investment':
        return <InvestmentPage />;
      case 'insights':
        return <ArticleHubPage onOpenArticle={handleOpenArticle} />;
      default:
        return (
          <HomePage 
            onApplyClick={() => openLoanModal()} 
            onNavigate={handleNavigate} 
            onOpenArticle={handleOpenArticle}
          />
        );
    }
  };

  const isDashboard = currentView === 'admin';

  return (
    <div className="min-h-screen bg-nova-950 text-white selection:bg-nova-500 selection:text-white flex flex-col">
      {!isDashboard && (
        <>
          <Navbar 
            onApplyClick={() => openLoanModal()} 
            currentView={currentView}
            onNavigate={handleNavigate}
          />
          <NewsTicker />
          <LoanApplicationModal isOpen={isLoanModalOpen} onClose={closeLoanModal} initialType={modalType} />
          <NewsletterPopup />
        </>
      )}

      <main className="flex-grow">
        {renderView()}
      </main>

      {!isDashboard && (
        <footer className="bg-nova-950 pt-32 pb-16 border-t border-white/5 mt-auto relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-nova-500/5 to-transparent -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
              
              {/* Brand & Corporate Ethos - Prominent "evident" branding */}
              <div className="lg:col-span-5">
                <div className="flex flex-col items-start mb-10">
                   <div className="flex items-center gap-1 group cursor-pointer" onClick={() => handleNavigate('home')}>
                     <span className="text-4xl font-black text-white tracking-tighter lowercase group-hover:text-nova-500 transition-colors">casiec financial</span>
                     <div className="flex flex-col -mb-1 translate-y-[-1px]">
                        <ChevronRight size={22} className="text-nova-accent -rotate-45" strokeWidth={3} />
                        <ChevronRight size={22} className="text-nova-accent -rotate-45 -mt-4" strokeWidth={3} />
                     </div>
                   </div>
                   <span className="text-[12px] font-black text-nova-accent tracking-[0.4em] lowercase -mt-1.5 opacity-100">institutional partner</span>
                </div>
                
                <div className="space-y-6">
                  <div className="p-1 bg-gradient-to-r from-nova-500/20 to-transparent rounded-2xl">
                    <p className="text-gray-300 text-base leading-relaxed font-medium bg-nova-950 p-6 rounded-[calc(1rem-1px)]">
                      <span className="text-white font-bold block mb-2 text-xl">CASIEC</span>
                      CASIEC Financials operates with a core focus on financial intermediation, delivering institutional-grade capital to stimulate NMSE and corporate growth. Fostering economic advancement through financial inclusion.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl w-fit">
                    <ShieldCheck size={20} className="text-nova-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Institutional Governance Compliant</span>
                  </div>
                </div>
              </div>
              
              {/* Professional Sitemap */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Quick Links</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => handleNavigate('home')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Global Home</button></li>
                    <li><button onClick={() => handleNavigate('team')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Our Leadership</button></li>
                    <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Funding Programs</button></li>
                    <li><button onClick={() => handleNavigate('insights')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Insights Hub</button></li>
                    {/* Admin Login within Quick Links */}
                    <li className="pt-2 border-t border-white/5">
                      <button 
                        onClick={() => handleNavigate('admin')} 
                        className="text-nova-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group"
                      >
                        <Lock size={12} className="group-hover:scale-110 transition-transform" /> 
                        Admin Login
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Our Pillars</h4>
                  <ul className="space-y-4">
                    <li><button onClick={() => handleNavigate('financial-support')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Capital Solutions</button></li>
                    <li><button onClick={() => handleNavigate('business-support')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Strategic Advisory</button></li>
                    <li><button onClick={() => handleNavigate('investment')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Wealth Architecture</button></li>
                    <li><button onClick={() => handleNavigate('real-estate')} className="text-gray-400 hover:text-white transition-colors text-sm font-medium text-left">Infrastructure Bridge</button></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-white font-black mb-8 uppercase tracking-[0.4em] text-[10px] opacity-30">Electronic Uplink</h4>
                  <ul className="space-y-6 text-sm text-gray-400">
                    <li className="flex items-start gap-3 group">
                      <Globe size={18} className="text-nova-500 mt-0.5" />
                      <div className="flex flex-col gap-1">
                         <a href="mailto:support@casiec.com" className="text-sm font-medium hover:text-white transition-colors">support@casiec.com</a>
                         <span className="text-xs text-gray-600">Lagos, Nigeria</span>
                      </div>
                    </li>
                    <li className="font-mono text-[11px] space-y-2">
                      <span className="block text-white">+234 818-398-7171</span>
                      <span className="block">+234 810-326-0048</span>
                      <span className="block">+234 810-537-5394</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Regulatory Disclosure & Copyright */}
            <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex flex-col gap-2">
                <div className="text-gray-600 text-[10px] uppercase tracking-[0.5em] font-black">
                  © 2024 CASIEC FINANCIALS & GSI. ALL RIGHTS RESERVED.
                </div>
                <div className="text-[9px] text-gray-700 uppercase tracking-widest font-bold">
                  Licensed & Authorized Financial Institution. Global Strategic Alliance Partner.
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-nova-500 hover:border-nova-500 transition-all cursor-pointer">
                      <Linkedin size={16} />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-nova-500 hover:border-nova-500 transition-all cursor-pointer">
                      <Twitter size={16} />
                    </div>
                 </div>
                 {/* Prominent Staff Terminal button in footer bar */}
                 <button 
                  onClick={() => handleNavigate('admin')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-nova-500 text-white rounded-xl shadow-lg shadow-nova-500/20 hover:bg-nova-400 transition-all group"
                 >
                   <Lock size={12} className="text-white" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Staff Terminal</span>
                 </button>
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