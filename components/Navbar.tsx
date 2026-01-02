
import React from 'react';
import { Activity, Menu, X, ChevronRight, Wallet, Briefcase, BookOpen } from 'lucide-react';

interface NavbarProps {
  onApplyClick: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApplyClick, currentView, onNavigate }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'financial-support', label: 'Financial Support', icon: <Wallet size={16} /> },
    { id: 'business-support', label: 'Business Support', icon: <Briefcase size={16} /> },
    { id: 'investment', label: 'Investment', icon: null },
    { id: 'insights', label: 'Insights', icon: <BookOpen size={16} /> },
  ];

  return (
    <nav className="fixed w-full z-50 glass-panel border-b border-white/10 bg-nova-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-2 cursor-pointer group" 
              onClick={() => onNavigate('home')}
            >
              <div className="bg-nova-500 p-2 rounded-lg group-hover:bg-nova-400 transition-colors">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                CASIEC
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`text-sm font-medium transition-all px-3 py-2 rounded-lg flex items-center gap-2 ${
                      currentView === item.id 
                        ? 'text-white bg-white/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
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
              onClick={onApplyClick}
              className="bg-white text-nova-900 px-6 py-2.5 rounded-full font-semibold hover:bg-nova-400 hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              Start Application <ChevronRight size={16} />
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-3 ${
                   currentView === item.id ? 'bg-nova-700 text-white' : 'text-gray-300 hover:bg-nova-800'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                onApplyClick();
              }}
              className="w-full text-left px-3 py-2 text-nova-900 font-bold bg-white mt-4 rounded-md flex items-center gap-2 justify-center"
            >
              Start Application <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
