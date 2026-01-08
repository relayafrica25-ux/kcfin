
import React from 'react';
import { Activity, Menu, X, ChevronRight, Wallet, Briefcase, BookOpen, Info, Users, LineChart, Lock } from 'lucide-react';

interface NavbarProps {
  onApplyClick: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'about', label: 'About', icon: <Info size={14} /> },
    { id: 'team', label: 'Team', icon: <Users size={14} /> },
    { id: 'financial-support', label: 'Funding', icon: <Wallet size={14} /> },
    { id: 'business-support', label: 'Support', icon: <Briefcase size={14} /> },
    { id: 'investment', label: 'Investment', icon: <LineChart size={14} /> },
    { id: 'insights', label: 'Insights', icon: <BookOpen size={14} /> },
  ];

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/10 bg-nova-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <div className="bg-nova-500 p-2 rounded-lg group-hover:bg-nova-400 transition-colors shadow-lg shadow-nova-500/20">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col leading-[0.8]">
                <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-gray-500 tracking-tighter uppercase italic">
                  CASIEC
                </span>
                <span className="text-[9px] font-bold text-gray-500 tracking-[0.4em] uppercase mt-1">
                  FINANCIALS
                </span>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2.5 rounded-xl flex items-center gap-2 border border-transparent ${
                      currentView === item.id 
                        ? 'text-white bg-white/10 border-white/5' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10 group"
              title="Staff Access"
            >
              <Lock size={14} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Staff</span>
            </button>
            <button 
              onClick={onApplyClick}
              className="bg-white text-nova-900 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-nova-400 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-xl shadow-white/5"
            >
              Inquiry <ChevronRight size={14} />
            </button>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden glass-panel border-t border-white/10 animate-fade-in-up">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-4 border ${
                   currentView === item.id ? 'bg-nova-500 text-white border-nova-400' : 'text-gray-400 border-transparent hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('admin');
                }}
                className="px-4 py-4 text-gray-400 border border-white/10 rounded-xl flex items-center gap-2 justify-center text-xs font-black uppercase tracking-widest hover:bg-white/5"
              >
                <Lock size={14} /> Staff
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onApplyClick();
                }}
                className="px-4 py-4 text-nova-900 font-black text-xs uppercase tracking-widest bg-white rounded-xl flex items-center gap-2 justify-center shadow-2xl"
              >
                Inquiry <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
