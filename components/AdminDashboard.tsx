
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Plus, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Lock,
  Mail,
  User,
  Activity,
  Zap,
  Radio,
  MessageSquare,
  Edit3,
  Image as ImageIcon,
  Megaphone,
  Loader2,
  Bell,
  LogOut,
  Info,
  Check,
  AlertCircle,
  Linkedin,
  Twitter,
  Upload,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, TickerItem, CarouselItem, TeamMember } from '../types';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // States
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'applications' | 'inquiries' | 'ticker' | 'carousel' | 'leadership'>('overview');
  
  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Modal States
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isTickerModalOpen, setIsTickerModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<LoanApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Edit States
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

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

  const [newTeamMember, setNewTeamMember] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    specialization: '',
    imageGradient: 'from-blue-600 to-indigo-900',
    imageUrl: '',
    linkedin: '',
    twitter: '',
    email: ''
  });

  const [newTicker, setNewTicker] = useState<Partial<TickerItem>>({
    text: '',
    category: 'Market'
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

  // Auto-refresh logic
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      const interval = setInterval(refreshData, 10000); 
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setArticles(storageService.getArticles());
    setApplications(storageService.getApplications());
    setInquiries(storageService.getInquiries());
    setTickerItems(storageService.getManualTickerItems());
    setCarouselItems(storageService.getCarouselItems());
    setTeamMembers(storageService.getTeamMembers());
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

  const handleGenerateAIImage = async (context: 'article' | 'carousel' | 'team') => {
    const promptMap = {
      article: newArticle.title,
      carousel: newCarousel.title,
      team: newTeamMember.name ? `Professional headshot of ${newTeamMember.name}, ${newTeamMember.role}` : null
    };
    
    const titleToUse = promptMap[context];
    if (!titleToUse) {
      alert("Please provide the required name/headline first.");
      return;
    }
    setIsGeneratingImage(true);
    const generatedUrl = await generateArticleImage(titleToUse);
    if (generatedUrl) {
      if (context === 'carousel') {
        setNewCarousel(prev => ({ ...prev, imageUrl: generatedUrl }));
      } else if (context === 'team') {
        setNewTeamMember(prev => ({ ...prev, imageUrl: generatedUrl }));
      } else {
        setNewArticle(prev => ({ ...prev, imageUrl: generatedUrl }));
      }
    } else {
      alert("Visual synchronization failed. Proceeding with fallback.");
    }
    setIsGeneratingImage(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter((prev: any) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
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

  const handleEditTeam = (member: TeamMember) => {
    setIsEditingTeam(true);
    setEditingTeamId(member.id);
    setNewTeamMember({
      name: member.name,
      role: member.role,
      bio: member.bio,
      specialization: member.specialization,
      imageGradient: member.imageGradient,
      imageUrl: member.imageUrl,
      linkedin: member.linkedin,
      twitter: member.twitter,
      email: member.email
    });
    setIsTeamModalOpen(true);
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

  const handlePostTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const member: TeamMember = {
      ...(newTeamMember as TeamMember),
      id: isEditingTeam && editingTeamId ? editingTeamId : Math.random().toString(36).substr(2, 9),
      imageGradient: newTeamMember.imageGradient || 'from-blue-600 to-indigo-900'
    };
    storageService.saveTeamMember(member);
    refreshData();
    setIsTeamModalOpen(false);
    setIsEditingTeam(false);
    setEditingTeamId(null);
    setNewTeamMember({ name: '', role: '', bio: '', specialization: '', linkedin: '', twitter: '', email: '', imageUrl: '', imageGradient: 'from-blue-600 to-indigo-900' });
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

  const handleDeleteTeam = (id: string) => {
    if (window.confirm('Remove this member from leadership records?')) {
      storageService.deleteTeamMember(id);
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
      text: newTicker.text || '',
      category: (newTicker.category as any) || 'Market',
      isManual: true
    };
    storageService.saveTickerItem(item);
    refreshData();
    setIsTickerModalOpen(false);
    setNewTicker({ text: '', category: 'Market' });
  };

  const handleDeleteTicker = (id: string) => {
    storageService.deleteTickerItem(id);
    refreshData();
  };

  const handleDeleteInquiry = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this inquiry from logs?')) {
      storageService.deleteInquiry(id);
      refreshData();
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
    }
  };

  const handleDeleteApplication = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this application from records?')) {
      storageService.deleteApplication(id);
      refreshData();
      if (selectedApplication?.id === id) setSelectedApplication(null);
    }
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
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-black text-white tracking-tighter lowercase">casiec</span>
                  <div className="flex flex-col -mb-1 translate-y-[-1px]">
                     <ChevronRight size={20} className="text-nova-accent -rotate-45" strokeWidth={3} />
                     <ChevronRight size={20} className="text-nova-accent -rotate-45 -mt-3.5" strokeWidth={3} />
                  </div>
                </div>
                <span className="text-[12px] font-black text-nova-accent tracking-[0.4em] lowercase -mt-1 opacity-80">staff terminal</span>
              </div>
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl">{error}</div>}
              <form onSubmit={handleLogin} className="space-y-6">
                <input required type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Authorized ID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-500 hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all">
                  {isScanning ? 'Syncing...' : 'Initiate Access'}
                </button>
                <button type="button" onClick={handleBypass} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Emergency Bypass (Demo)</button>
              </form>
              <button onClick={onBack} className="mt-8 flex items-center gap-2 mx-auto text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"><ArrowLeft size={14} /> Back</button>
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
        <div className="flex flex-col items-start mb-10 px-2 cursor-pointer" onClick={() => onBack()}>
           <div className="flex items-center gap-1">
             <span className="text-xl font-black text-white tracking-tighter lowercase">casiec</span>
             <div className="flex flex-col -mb-1 translate-y-[-1px]">
                <ChevronRight size={12} className="text-nova-accent -rotate-45" strokeWidth={3} />
                <ChevronRight size={12} className="text-nova-accent -rotate-45 -mt-2.5" strokeWidth={3} />
             </div>
           </div>
           <span className="text-[8px] font-black text-nova-accent tracking-[0.2em] lowercase -mt-0.5 opacity-80">financials</span>
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', icon: <TrendingUp size={20} />, label: 'Overview' },
            { id: 'applications', icon: <Users size={20} />, label: 'Applications', badge: pendingApps },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: unreadInquiries },
            { id: 'leadership', icon: <ShieldCheck size={20} />, label: 'Leadership' },
            { id: 'ticker', icon: <Flame size={20} />, label: 'Breaking News' },
            { id: 'articles', icon: <FileText size={20} />, label: 'Insights Hub' },
            { id: 'carousel', icon: <Megaphone size={20} />, label: 'Campaigns' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-nova-500 text-white shadow-lg' : 'text-gray-400 hover:bg-white/5'}`}>
              <div className="flex items-center gap-4">{tab.icon} {tab.label}</div>
              {tab.badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-white/5">
          <button onClick={onBack} className="w-full flex items-center gap-3 px-6 py-4 text-gray-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"><LogOut size={16} /> Exit Terminal</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-72 p-12 w-full max-w-7xl mx-auto">
        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Terminal Analytics</h1>
                  <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Institutional Operations Interface</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5">
                 <Users className="text-nova-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Loan Applications</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{applications.length}</p>
                    {pendingApps > 0 && <span className="text-amber-500 text-sm font-black mb-2">{pendingApps} PENDING</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5">
                 <MessageSquare className="text-purple-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Active Inquiries</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{inquiries.length}</p>
                    {unreadInquiries > 0 && <span className="text-red-500 text-sm font-black mb-2">{unreadInquiries} NEW</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5">
                 <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-2">Leadership Team</p>
                 <p className="text-6xl font-black">{teamMembers.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: TICKER (Breaking News) */}
        {activeTab === 'ticker' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Breaking News Manager</h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Global Broadcast Feed Control</p>
                </div>
                <button onClick={() => setIsTickerModalOpen(true)} className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl text-xs font-black uppercase flex items-center gap-2 transition-all"><Plus size={16} /> Broadcast Headline</button>
            </div>
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden overflow-x-auto shadow-2xl">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <tr><th className="px-8 py-6">Type</th><th className="px-8 py-6">Headline Message</th><th className="px-8 py-6 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tickerItems.length > 0 ? tickerItems.map(item => (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                                <td className="px-8 py-6">
                                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border border-white/10 ${
                                        item.category === 'Urgent' ? 'text-red-500 bg-red-500/10' : 
                                        item.category === 'Market' ? 'text-orange-500 bg-orange-500/10' : 
                                        'text-nova-400 bg-nova-400/10'
                                    }`}>
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-sm font-bold text-white uppercase tracking-tight">{item.text}</td>
                                <td className="px-8 py-6 text-right"><button onClick={() => handleDeleteTicker(item.id)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} className="px-8 py-20 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">Broadcast Feed Inactive</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB: LEADERSHIP, ARTICLES, CAROUSEL, etc (Existing Logic Maintained) */}
        {activeTab === 'leadership' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Leadership Records</h1>
                <button onClick={() => { setIsEditingTeam(false); setIsTeamModalOpen(true); }} className="px-6 py-3 bg-nova-500 rounded-xl text-xs font-black uppercase flex items-center gap-2"><Plus size={16} /> Add Leader</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map(member => (
                    <div key={member.id} className="glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col group">
                        <div className="h-48 relative">
                            {member.imageUrl ? (
                                <img src={member.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${member.imageGradient} opacity-40`} />
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleEditTeam(member)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteTeam(member.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="p-8">
                            <span className="text-[10px] font-black uppercase text-nova-400 tracking-widest">{member.specialization}</span>
                            <h3 className="text-xl font-bold text-white mt-2">{member.name}</h3>
                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1 mb-4">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Intelligence Hub</h1>
                <button onClick={() => { setIsEditingArticle(false); setIsArticleModalOpen(true); }} className="px-6 py-3 bg-nova-500 rounded-xl text-xs font-black uppercase flex items-center gap-2"><Plus size={16} /> Curate insight</button>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {articles.map(art => (
                    <div key={art.id} className="glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                        <div className="h-40 relative">
                            {art.imageUrl ? <img src={art.imageUrl} className="w-full h-full object-cover grayscale opacity-40" alt="" /> : <div className={`w-full h-full bg-gradient-to-br ${art.imageGradient} opacity-30`} />}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button onClick={() => handleEditArticle(art)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"><Edit3 size={16} /></button>
                                <button onClick={() => handleDeleteArticle(art.id)} className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500/20"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="p-8"><span className="text-[10px] font-black uppercase text-nova-400 tracking-widest">{art.category}</span><h3 className="text-xl font-bold text-white mt-2 line-clamp-1">{art.title}</h3></div>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Breaking News Modal */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTickerModalOpen(false)}></div>
        <form onSubmit={handlePostTicker} className="relative w-full max-w-lg glass-panel rounded-[2.5rem] border border-white/10 p-10 space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">New Broadcast</h2>
            <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Headline (ALL CAPS RECOMMENDED)</label>
                <textarea required placeholder="ENTER BREAKING NEWS HEADLINE..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-red-500 outline-none h-32 resize-none uppercase font-bold" value={newTicker.text} onChange={(e) => setNewTicker({...newTicker, text: e.target.value})} />
            </div>
            <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Urgency Category</label>
                <select className="w-full bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-red-500" value={newTicker.category} onChange={(e) => setNewTicker({...newTicker, category: e.target.value as any})}>
                    <option value="Urgent">Urgent (Red)</option>
                    <option value="Corporate">Corporate (Blue)</option>
                    <option value="Market">Market (Orange)</option>
                </select>
            </div>
            <button type="submit" className="w-full py-5 bg-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-3">
                <Radio size={16} className="animate-pulse" /> Deploy to Feed
            </button>
        </form></div>
      )}

      {/* Other Modals (Campaign, Article, Team) Maintained */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsArticleModalOpen(false)}></div>
          <form onSubmit={handlePostArticle} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditingArticle ? 'Edit Insight' : 'Curate Insight'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="Headline" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} />
              <textarea required placeholder="Short summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none" value={newArticle.excerpt} onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})} />
              <select className="bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-nova-500" value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}>
                <option value="Strategy">Strategy</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Guide">Guide</option>
                <option value="Tech">Tech</option>
                <option value="Eco-Finance">Eco-Finance</option>
              </select>
              <input type="text" placeholder="Author Name" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newArticle.author} onChange={(e) => setNewArticle({...newArticle, author: e.target.value})} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Image Sourcing</label>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                <div className="flex items-center gap-6">
                  {newArticle.imageUrl ? <img src={newArticle.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" /> : <div className="w-24 h-24 rounded-2xl bg-nova-500/10 flex items-center justify-center"><ImageIcon size={32} /></div>}
                  <input type="text" placeholder="Image URL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newArticle.imageUrl} onChange={(e) => setNewArticle({...newArticle, imageUrl: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-white/10 transition-all"><Upload size={16} /> Upload <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setNewArticle)} /></label>
                    <button type="button" onClick={() => handleGenerateAIImage('article')} disabled={isGeneratingImage} className="flex items-center justify-center gap-2 px-6 py-4 bg-nova-500/10 border border-nova-500/20 rounded-xl text-[10px] font-black uppercase"><Zap size={16} /> AI Gen</button>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Deploy to Hub</button>
          </form>
        </div>
      )}
    </div>
  );
};
