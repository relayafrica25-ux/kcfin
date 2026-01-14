
import React from 'react';
import { Menu, X, ChevronRight, Wallet, Briefcase, BookOpen, Info, Users, LineChart, Lock, ChevronsUpRight } from 'lucide-react';

interface NavbarProps {
  onApplyClick: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'about', label: 'Company', icon: <Info size={14} /> },
    { id: 'team', label: 'Leadership', icon: <Users size={14} /> },
    { id: 'financial-support', label: 'Capital Solutions', icon: <Wallet size={14} /> },
    { id: 'business-support', label: 'Advisory', icon: <Briefcase size={14} /> },
    { id: 'investment', label: 'Wealth', icon: <LineChart size={14} /> },
    { id: 'insights', label: 'Intelligence', icon: <BookOpen size={14} /> },
  ];

  return (
    <nav className="fixed w-full z-50 bg-nova-950/90 backdrop-blur-lg border-b border-white/5 h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {/* Updated CASIEC Logo */}
            <div 
              className="flex-shrink-0 flex items-center gap-1 cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <div className="flex flex-col items-start leading-none">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-white tracking-tighter lowercase group-hover:text-nova-400 transition-colors">
                    casiec
                  </span>
                  <div className="flex flex-col -mb-1 translate-y-[-1px]">
                     <ChevronRight size={14} className="text-nova-accent -rotate-45" strokeWidth={3} />
                     <ChevronRight size={14} className="text-nova-accent -rotate-45 -mt-2.5" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[9px] font-black text-nova-accent tracking-[0.25em] lowercase -mt-0.5 opacity-90">
                  financials
                </span>
              </div>
            </div>
            
            <div className="hidden lg:block ml-10">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all px-3 py-2 rounded-lg flex items-center gap-2 ${
                      currentView === item.id 
                        ? 'text-white bg-white/5 border border-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                currentView === 'admin' 
                  ? 'bg-nova-500 text-white border-nova-500 shadow-lg' 
                  : 'text-gray-400 border-white/10 bg-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              <Lock size={12} /> Staff Terminal
            </button>
            
            <button 
              onClick={onApplyClick}
              className="bg-nova-500 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-nova-400 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-nova-500/20"
            >
              Inquiry <ChevronRight size={14} />
            </button>
          </div>

          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-nova-950 border-b border-white/10 p-6 animate-fade-in-up shadow-2xl overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-4 w-full p-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                   currentView === item.id ? 'bg-nova-500 text-white border-nova-500 shadow-lg' : 'text-gray-400 border-white/5 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            <button
              onClick={() => {
                onNavigate('admin');
                setIsOpen(false);
              }}
              className={`flex items-center gap-4 w-full p-4 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${
                currentView === 'admin' ? 'bg-nova-500 text-white border-nova-500 shadow-lg' : 'text-nova-400 border-nova-500/20 bg-nova-500/5'
              }`}
            >
              <Lock size={14} /> Staff Terminal
            </button>

            <div className="pt-4 grid grid-cols-1 gap-4">
                <button 
                  onClick={() => { setIsOpen(false); onApplyClick(); }}
                  className="w-full py-4 bg-white text-nova-950 font-black text-xs uppercase tracking-widest rounded-xl text-center shadow-xl"
                >
                  Initiate Inquiry
                </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
