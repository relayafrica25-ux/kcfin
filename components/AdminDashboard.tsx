
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Lock,
  Mail,
  User,
  Activity,
  Cpu,
  Zap,
  Radio,
  Home,
  MessageSquare,
  Eye,
  Monitor,
  Edit3,
  Calendar,
  Image as ImageIcon,
  Megaphone,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  ExternalLink,
  ChevronDown,
  Building2,
  Phone,
  Briefcase,
  Bell
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem, CarouselItem } from '../types';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // States
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'applications' | 'inquiries' | 'ticker' | 'carousel'>('overview');
  
  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  
  // Modal States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Edit States
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    category: 'Strategy',
    author: 'Admin',
    imageGradient: 'from-nova-500 to-purple-600',
    date: new Date().toISOString().split('T')[0],
    readTime: '5 min read',
    imageUrl: ''
  });

  const [newTicker, setNewTicker] = useState<Partial<TickerItem>>({
    label: '',
    value: '',
    trend: 'Neutral'
  });

  const [newCarousel, setNewCarousel] = useState<Partial<CarouselItem>>({
    type: 'advert',
    title: '',
    summary: '',
    tag: 'Active',
    linkText: 'Learn More',
    imageGradient: 'from-nova-500 to-purple-600',
    imageUrl: '',
    statLabel: 'Priority',
    statValue: 'High'
  });

  // Auto-refresh logic to show new inquiries as they are made
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const interval = setInterval(refreshData, 5000); // Check for new inquiries every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setArticles(storageService.getArticles());
    setApplications(storageService.getApplications());
    setInquiries(storageService.getInquiries());
    setTickerItems(storageService.getManualTickerItems());
    setCarouselItems(storageService.getCarouselItems());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const isValid = storageService.authenticateUser(staffId, loginPass);
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      setError("SYSTEM REJECTION: Unauthorized Credentials Detected.");
      setIsScanning(false);
    }
  };

  const handleBypass = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsAuthenticated(true);
  };

  const handleGenerateAIImage = async (isForCarousel = false) => {
    const titleToUse = isForCarousel ? newCarousel.title : newArticle.title;
    if (!titleToUse) {
      alert("Please provide a headline first.");
      return;
    }
    setIsGeneratingImage(true);
    const generatedUrl = await generateArticleImage(titleToUse);
    if (generatedUrl) {
      if (isForCarousel) {
        setNewCarousel(prev => ({ ...prev, imageUrl: generatedUrl }));
      } else {
        setNewArticle(prev => ({ ...prev, imageUrl: generatedUrl }));
      }
    } else {
      alert("AI Vision synchronization failed. Proceeding with gradient fallback.");
    }
    setIsGeneratingImage(false);
  };

  const handleEditArticle = (article: Article) => {
    setIsEditingArticle(true);
    setEditingArticleId(article.id);
    setNewArticle({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      author: article.author,
      imageGradient: article.imageGradient,
      date: article.date,
      readTime: article.readTime,
      imageUrl: article.imageUrl
    });
    setIsArticleModalOpen(true);
  };

  const handlePostArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Article = {
      ...(newArticle as Article),
      id: isEditingArticle && editingArticleId ? editingArticleId : Math.random().toString(36).substr(2, 9),
      date: newArticle.date || new Date().toISOString().split('T')[0],
      readTime: newArticle.readTime || '5 min read',
      imageGradient: newArticle.imageGradient || 'from-nova-500 to-purple-600'
    };
    storageService.saveArticle(article);
    refreshData();
    setIsArticleModalOpen(false);
    setIsEditingArticle(false);
    setEditingArticleId(null);
  };

  const handlePostCarousel = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CarouselItem = {
      ...(newCarousel as CarouselItem),
      id: Math.random().toString(36).substr(2, 9),
      type: 'advert'
    };
    storageService.saveCarouselItem(item);
    refreshData();
    setIsCarouselModalOpen(false);
    setNewCarousel({ type: 'advert', title: '', summary: '', tag: 'Active', linkText: 'Learn More', imageGradient: 'from-nova-500 to-purple-600', imageUrl: '' });
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Erase this insight?')) {
      storageService.deleteArticle(id);
      refreshData();
    }
  };

  const handleDeleteCarousel = (id: string) => {
    if (window.confirm('Erase this campaign item?')) {
      storageService.deleteCarouselItem(id);
      refreshData();
    }
  };

  const handlePostTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const item: TickerItem = {
      id: Math.random().toString(36).substr(2, 9),
      label: newTicker.label || '',
      value: newTicker.value || '',
      trend: (newTicker.trend as any) || 'Neutral',
      isManual: true
    };
    storageService.saveTickerItem(item);
    refreshData();
    setIsTickerModalOpen(false);
    setNewTicker({ label: '', value: '', trend: 'Neutral' });
  };

  const handleDeleteTicker = (id: string) => {
    storageService.deleteTickerItem(id);
    refreshData();
  };

  const updateAppStatus = (id: string, status: any) => {
    storageService.updateApplicationStatus(id, status);
    refreshData();
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status });
    }
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    storageService.updateInquiryStatus(id, status);
    refreshData();
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status });
    }
  };

  const unreadInquiries = inquiries.filter(i => i.status === 'Unread').length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nova-500/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        </div>
        <div className="w-full max-w-lg relative z-10">
          <div className="glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-12 text-center">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic mb-8">
                <span className="text-nova-400">CASIEC</span> TERMINAL
              </h1>
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl">{error}</div>}
              <form onSubmit={handleLogin} className="space-y-6">
                <input required type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Authorized ID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-500 hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all">
                  {isScanning ? 'Live Syncing...' : 'Initiate Access'}
                </button>
                <button type="button" onClick={handleBypass} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Emergency Bypass (Demo)</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-72 bg-nova-900 border-r border-white/5 flex flex-col p-8 z-50">
        <div className="flex items-center gap-3 mb-16 px-2 cursor-pointer" onClick={() => onBack()}>
           <div className="flex flex-col leading-[0.8]">
              <span className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-gray-500 tracking-tighter uppercase italic">
                CASIEC
              </span>
              <span className="text-[9px] font-bold text-gray-500 tracking-[0.4em] uppercase mt-1">
                FINANCIALS
              </span>
            </div>
        </div>
        <nav className="space-y-2 flex-grow">
          {[
            { id: 'overview', icon: <TrendingUp size={20} />, label: 'Overview' },
            { id: 'applications', icon: <Users size={20} />, label: 'Applications', badge: pendingApps },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: unreadInquiries },
            { id: 'ticker', icon: <Activity size={20} />, label: 'Live Ticker' },
            { id: 'articles', icon: <FileText size={20} />, label: 'Insights Hub' },
            { id: 'carousel', icon: <Megaphone size={20} />, label: 'Campaigns' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-nova-500 text-white' : 'text-gray-400 hover:bg-white/5'}`}
            >
              <div className="flex items-center gap-4">
                {tab.icon} {tab.label}
              </div>
              {tab.badge ? (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <button onClick={onBack} className="mt-auto flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest">
          <ArrowLeft size={16} /> Exit Terminal
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-12 w-full max-w-7xl mx-auto">
        
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-black uppercase italic">Terminal Analytics</h1>
                <div className="flex items-center gap-3 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Data Sync
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-nova-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <Users className="text-nova-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Loan Applications</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{applications.length}</p>
                    {pendingApps > 0 && <span className="text-amber-500 text-sm font-black mb-2">{pendingApps} PENDING</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <MessageSquare className="text-purple-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Active Inquiries</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{inquiries.length}</p>
                    {unreadInquiries > 0 && <span className="text-red-500 text-sm font-black mb-2">{unreadInquiries} NEW</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                 <Activity className="text-emerald-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Live Ticker Points</p>
                 <p className="text-6xl font-black">{tickerItems.length}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                            <Bell size={16} className="text-nova-400" />
                            Recent Inquiries
                        </h3>
                        <button onClick={() => setActiveTab('inquiries')} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest">View All</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {inquiries.slice(0, 5).map(inq => (
                            <div 
                                key={inq.id} 
                                className="p-6 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between"
                                onClick={() => setSelectedInquiry(inq)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${inq.status === 'Unread' ? 'bg-nova-500 shadow-[0_0_10px_rgba(79,70,229,0.8)]' : 'bg-transparent'}`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{inq.fullName}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">{inq.subject}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{inq.date.split(',')[0]}</span>
                            </div>
                        ))}
                        {inquiries.length === 0 && <div className="p-12 text-center text-gray-600 text-xs italic">No inquiries recorded.</div>}
                    </div>
                </div>

                <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                            <Users size={16} className="text-amber-400" />
                            New Applications
                        </h3>
                        <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest">View All</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {applications.slice(0, 5).map(app => (
                            <div 
                                key={app.id} 
                                className="p-6 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between"
                                onClick={() => setSelectedApplication(app)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${app.status === 'Pending' ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{app.businessName}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold">{app.loanType || app.serviceType}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{app.date}</span>
                            </div>
                        ))}
                        {applications.length === 0 && <div className="p-12 text-center text-gray-600 text-xs italic">No applications recorded.</div>}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-black uppercase italic">Application Database</h1>
             </div>
             <div className="glass-panel rounded-[2rem] overflow-hidden border border-white/5">
                <table className="w-full text-left">
                   <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                      <tr>
                        <th className="px-8 py-6">Identity</th>
                        <th className="px-8 py-6">Business Entity</th>
                        <th className="px-8 py-6">Product</th>
                        <th className="px-8 py-6">Status</th>
                        <th className="px-8 py-6">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {applications.map(app => (
                        <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-8 py-6">
                              <div className="font-bold text-white">{app.fullName}</div>
                              <div className="text-xs text-gray-500">{app.email}</div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="font-bold text-nova-400">{app.businessName}</div>
                              <div className="text-xs text-gray-500">{app.industry} • {app.state}</div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="text-sm text-gray-300">{app.loanType || app.serviceType}</div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {app.status}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <button onClick={() => setSelectedApplication(app)} className="p-3 bg-white/5 rounded-xl hover:bg-nova-500 transition-all">
                                <Eye size={16} />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in-up">
             <h1 className="text-4xl font-black mb-12 uppercase italic">Personnel Inquiries</h1>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inquiries.map(inq => (
                  <div 
                    key={inq.id} 
                    className={`glass-panel p-8 rounded-[2rem] border transition-all cursor-pointer relative overflow-hidden ${
                        inq.status === 'Unread' ? 'border-nova-500/40 hover:border-nova-500 shadow-[0_0_30px_rgba(79,70,229,0.05)]' : 'border-white/5 hover:border-white/20'
                    }`} 
                    onClick={() => setSelectedInquiry(inq)}
                  >
                     {inq.status === 'Unread' && <div className="absolute top-0 right-0 w-24 h-24 bg-nova-500/10 rounded-bl-full -mr-12 -mt-12"></div>}
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inq.status === 'Unread' ? 'bg-nova-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                              <Mail size={18} />
                           </div>
                           <div>
                              <p className="font-bold text-white">{inq.fullName}</p>
                              <p className="text-xs text-gray-500 font-mono">{inq.date}</p>
                           </div>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${inq.status === 'Unread' ? 'bg-nova-500 text-white' : 'text-gray-500'}`}>{inq.status}</span>
                     </div>
                     <h4 className="font-bold text-lg mb-2 text-white line-clamp-1">{inq.subject}</h4>
                     <p className="text-gray-400 text-sm line-clamp-2 italic">"{inq.message}"</p>
                  </div>
                ))}
                {inquiries.length === 0 && (
                    <div className="col-span-full py-40 text-center glass-panel rounded-[3rem] border border-white/5">
                        <MessageSquare size={64} className="mx-auto text-gray-800 mb-6" />
                        <p className="text-gray-500 font-black uppercase tracking-[0.3em]">No Communication Logs Detected</p>
                    </div>
                )}
             </div>
          </div>
        )}

        {/* TAB: TICKER */}
        {activeTab === 'ticker' && (
          <div className="animate-fade-in-up">
             <div className="flex justify-between items-center mb-12">
               <h1 className="text-4xl font-black uppercase italic">Market Live Feed</h1>
               <button onClick={() => setIsTickerModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-nova-500 hover:bg-nova-400 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-nova-500/30">
                 <Plus size={24} /> New Feed Alert
               </button>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                {tickerItems.map(item => (
                  <div key={item.id} className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col justify-between group">
                     <div className="flex justify-between items-start mb-4">
                        <Zap size={20} className="text-nova-400" />
                        <button onClick={() => handleDeleteTicker(item.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                     </div>
                     <div>
                        <p className="text-gray-500 text-[10px] uppercase font-black mb-1">{item.label}</p>
                        <p className={`text-2xl font-black ${item.trend === 'Bullish' ? 'text-emerald-400' : item.trend === 'Bearish' ? 'text-rose-400' : 'text-white'}`}>{item.value}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* TAB: CAROUSEL */}
        {activeTab === 'carousel' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-black uppercase italic">Campaign Management</h1>
              <button onClick={() => setIsCarouselModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-nova-500 hover:bg-nova-400 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-nova-500/30">
                <Plus size={24} /> Post New Advert
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {carouselItems.map(item => (
                <div key={item.id} className="group glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-nova-400/30 transition-all duration-500">
                   <div className="h-48 overflow-hidden relative">
                      {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" /> : <div className={`w-full h-full bg-gradient-to-br ${item.imageGradient} opacity-30`}></div>}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[9px] font-black uppercase tracking-widest rounded-full">{item.tag}</span>
                      </div>
                   </div>
                   <div className="p-8 flex flex-col flex-grow">
                      <h3 className="font-bold text-xl mb-4 text-white line-clamp-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{item.summary}</p>
                      <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-gray-500">{item.statLabel}</span>
                            <span className="text-sm font-bold text-white">{item.statValue}</span>
                         </div>
                         <button onClick={() => handleDeleteCarousel(item.id)} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all text-red-500 hover:text-white">
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-4xl font-black uppercase italic">Insight Injections</h1>
              <button onClick={() => { setIsEditingArticle(false); setNewArticle({ title: '', excerpt: '', category: 'Strategy', author: 'Admin', date: new Date().toISOString().split('T')[0], readTime: '5 min read', imageUrl: '' }); setIsArticleModalOpen(true); }} className="flex items-center gap-3 px-8 py-4 bg-nova-500 hover:bg-nova-400 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-nova-500/30">
                <Plus size={24} /> Upload Article
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="group glass-panel rounded-[2.5rem] border border-white/5 p-8 flex flex-col hover:border-nova-400/30 transition-all duration-500">
                   <div className="h-40 rounded-2xl bg-white/5 mb-6 overflow-hidden relative shadow-2xl">
                      {article.imageUrl ? <img src={article.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" /> : <div className={`w-full h-full bg-gradient-to-br ${article.imageGradient} opacity-30`}></div>}
                   </div>
                   <h3 className="font-bold text-xl mb-4 text-white line-clamp-2">{article.title}</h3>
                   <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-nova-400 bg-nova-400/10 px-3 py-1 rounded-lg">{article.category}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditArticle(article)} 
                          className="p-2 bg-white/5 hover:bg-nova-500 rounded-lg transition-all text-gray-400 hover:text-white"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDeleteArticle(article.id)} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all text-red-500 hover:text-white"><Trash2 size={18} /></button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODALS */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <div className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-in-up">
              <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-nova-900 z-10">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Application_Intel</h3>
                <button onClick={() => setSelectedApplication(null)} className="text-gray-600 hover:text-white"><XCircle size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div>
                       <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Business Entity</label>
                       <p className="text-2xl font-bold text-nova-400">{selectedApplication.businessName}</p>
                    </div>
                    <div>
                       <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">CAC Number</label>
                       <p className="text-xl font-mono text-white">{selectedApplication.cacNumber}</p>
                    </div>
                    <div>
                       <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Primary Contact</label>
                       <p className="text-lg text-white font-bold">{selectedApplication.fullName}</p>
                       <p className="text-xs text-gray-500 italic">{selectedApplication.role}</p>
                    </div>
                    <div>
                       <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Contact Intel</label>
                       <p className="text-sm text-white">{selectedApplication.email}</p>
                       <p className="text-sm text-white">{selectedApplication.phone}</p>
                    </div>
                    <div className="col-span-full pt-6 border-t border-white/5">
                       <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Requirement Summary</label>
                       <p className="text-gray-300 leading-relaxed mt-2">{selectedApplication.description || "No additional comments provided."}</p>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button onClick={() => updateAppStatus(selectedApplication.id, 'Approved')} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">Approve Application</button>
                    <button onClick={() => updateAppStatus(selectedApplication.id, 'Declined')} className="flex-1 py-4 bg-white/5 hover:bg-red-500 text-gray-400 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/10">Decline Application</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <div className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-in-up">
              <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-nova-900 z-10">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Inquiry_Transmission</h3>
                <button onClick={() => setSelectedInquiry(null)} className="text-gray-600 hover:text-white"><XCircle size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">From</label>
                            <p className="text-2xl font-bold text-white">{selectedInquiry.fullName}</p>
                        </div>
                        <div className="text-right">
                            <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Time</label>
                            <p className="text-sm font-mono text-gray-400">{selectedInquiry.date}</p>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Contact Intelligence</label>
                        <p className="text-lg text-nova-400 font-bold">{selectedInquiry.email}</p>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Subject Vector</label>
                        <p className="text-xl font-bold text-white bg-white/5 p-4 rounded-xl border border-white/5">{selectedInquiry.subject}</p>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest block mb-1">Message Content</label>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-gray-300 leading-relaxed italic">
                            "{selectedInquiry.message}"
                        </div>
                    </div>
                 </div>
                 <div className="flex gap-4 pt-8">
                    <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')} className="flex-1 py-4 bg-nova-500 hover:bg-nova-400 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all">Mark as Processed</button>
                    <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'Archived')} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all border border-white/10">Archive Log</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* CAROUSEL MODAL */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <form onSubmit={handlePostCarousel} className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-in-up">
              <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-nova-900 z-10">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Campaign_Injection</h3>
                <button type="button" onClick={() => setIsCarouselModalOpen(false)} className="text-gray-600 hover:text-white"><XCircle size={24} /></button>
              </div>
              <div className="p-10 space-y-8">
                 <div className="space-y-4">
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest">Campaign Visual</label>
                    <div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 aspect-video flex flex-col items-center justify-center bg-white/5">
                       {newCarousel.imageUrl ? <img src={newCarousel.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-600" size={48} />}
                       <button type="button" onClick={() => handleGenerateAIImage(true)} disabled={isGeneratingImage} className="absolute bottom-6 right-6 flex items-center gap-3 px-6 py-3 bg-white text-nova-900 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                         {isGeneratingImage ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                         {isGeneratingImage ? 'Synthesizing...' : 'Generate AI Visual'}
                       </button>
                    </div>
                    <input type="text" value={newCarousel.imageUrl} onChange={e => setNewCarousel({...newCarousel, imageUrl: e.target.value})} placeholder="Direct Image URL (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-[11px] focus:border-nova-400 outline-none" />
                 </div>
                 <div>
                   <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Campaign Title</label>
                   <input required type="text" value={newCarousel.title} onChange={e => setNewCarousel({...newCarousel, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
                 </div>
                 <div>
                   <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Advert Summary</label>
                   <textarea required value={newCarousel.summary} onChange={e => setNewCarousel({...newCarousel, summary: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32 text-white resize-none outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Label (Tag)</label>
                      <input type="text" value={newCarousel.tag} onChange={e => setNewCarousel({...newCarousel, tag: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
                    </div>
                    <div>
                      <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Stat Label</label>
                      <input type="text" value={newCarousel.statLabel} onChange={e => setNewCarousel({...newCarousel, statLabel: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
                    </div>
                 </div>
                 <button type="submit" className="w-full py-6 bg-gradient-to-r from-nova-600 to-purple-600 text-white font-black rounded-3xl uppercase tracking-[0.4em] text-[10px] shadow-2xl">Deploy to Homepage Slider</button>
              </div>
           </form>
        </div>
      )}

      {/* ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <form onSubmit={handlePostArticle} className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center sticky top-0 bg-nova-900 z-10">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">
                {isEditingArticle ? 'Article_Adjustment' : 'Article_Injection'}
              </h3>
              <button type="button" onClick={() => setIsArticleModalOpen(false)} className="text-gray-600 hover:text-white"><XCircle size={24} /></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                 <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest">Visual Anchor</label>
                 <div className="relative group overflow-hidden rounded-[2rem] border-2 border-dashed border-white/10 aspect-video flex flex-col items-center justify-center bg-white/5">
                    {newArticle.imageUrl ? <img src={newArticle.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" /> : <ImageIcon className="text-gray-600" size={48} />}
                    <button type="button" onClick={() => handleGenerateAIImage(false)} disabled={isGeneratingImage} className="absolute bottom-6 right-6 flex items-center gap-3 px-6 py-3 bg-white text-nova-900 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      {isGeneratingImage ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                      {isGeneratingImage ? 'Live Syncing...' : 'Generate AI Image'}
                    </button>
                 </div>
                 <input type="text" value={newArticle.imageUrl} onChange={e => setNewArticle({...newArticle, imageUrl: e.target.value})} placeholder="Direct Image URL (Optional)" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-[11px] focus:border-nova-400 outline-none" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Headline</label>
                <input required type="text" value={newArticle.title} onChange={e => setNewArticle({...newArticle, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Digest Summary</label>
                <textarea required value={newArticle.excerpt} onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32 text-white resize-none outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Category</label>
                  <select value={newArticle.category} onChange={e => setNewArticle({...newArticle, category: e.target.value})} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none">
                    <option value="Strategy">Strategy</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Eco-Finance">Eco-Finance</option>
                    <option value="Guide">Guide</option>
                    <option value="Tech">Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Date</label>
                  <input type="date" value={newArticle.date} onChange={e => setNewArticle({...newArticle, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-mono outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full py-6 bg-gradient-to-r from-nova-600 to-purple-600 text-white font-black rounded-3xl uppercase tracking-[0.4em] text-[10px] shadow-2xl">
                {isEditingArticle ? 'Update Knowledge Base' : 'Sync to Knowledge Base'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TICKER MODAL */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
           <form onSubmit={handlePostTicker} className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-md p-10 animate-fade-in-up shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Ticker_Point_Add</h3>
                 <button type="button" onClick={() => setIsTickerModalOpen(false)} className="text-gray-600 hover:text-white"><XCircle size={24} /></button>
              </div>
              <div className="space-y-6">
                 <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Label (e.g. NGN/USD)</label>
                    <input required type="text" value={newTicker.label} onChange={e => setNewTicker({...newTicker, label: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
                 </div>
                 <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Value (e.g. 750.2 or +2%)</label>
                    <input required type="text" value={newTicker.value} onChange={e => setNewTicker({...newTicker, value: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none" />
                 </div>
                 <div>
                    <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Trend</label>
                    <select value={newTicker.trend} onChange={e => setNewTicker({...newTicker, trend: e.target.value as any})} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none">
                      <option value="Bullish">Bullish (Green)</option>
                      <option value="Bearish">Bearish (Red)</option>
                      <option value="Neutral">Neutral (Grey)</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full py-5 bg-nova-500 text-white font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] mt-4 shadow-xl shadow-nova-500/20 transition-all hover:bg-nova-400">Deploy to Live Feed</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
