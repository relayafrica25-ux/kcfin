
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
  Bell,
  LogOut,
  Info,
  Check,
  AlertCircle,
  Linkedin,
  Twitter,
  Upload,
  // Added ShieldCheck to imports
  ShieldCheck
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem, CarouselItem, TeamMember } from '../types';

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
            { id: 'ticker', icon: <Activity size={20} />, label: 'Live Ticker' },
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
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><Bell size={16} /> Recent Inquiries</h3></div>
                    <div className="divide-y divide-white/5">
                        {inquiries.length > 0 ? inquiries.slice(0, 5).map(inq => (
                            <div key={inq.id} className="p-6 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between" onClick={() => setSelectedInquiry(inq)}>
                                <div>
                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        {inq.fullName}
                                        {inq.status === 'Unread' && <span className="w-1.5 h-1.5 bg-nova-500 rounded-full"></span>}
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">{inq.subject}</p>
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{inq.date}</span>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Recent Inquiries</div>
                        )}
                    </div>
                </div>
                <div className="glass-panel rounded-[2rem] border border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between"><h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3"><Users size={16} /> New Apps</h3></div>
                    <div className="divide-y divide-white/5">
                        {applications.length > 0 ? applications.slice(0, 5).map(app => (
                            <div key={app.id} className="p-6 hover:bg-white/[0.02] cursor-pointer transition-colors flex items-center justify-between" onClick={() => setSelectedApplication(app)}>
                                <div>
                                    <p className="text-sm font-bold text-white flex items-center gap-2">
                                        {app.businessName}
                                        {app.status === 'Pending' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>}
                                    </p>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">{app.loanType || app.serviceType}</p>
                                </div>
                                <span className="text-[10px] text-gray-600 font-mono">{app.date}</span>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Recent Applications</div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* TAB: LEADERSHIP */}
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
                            <div className="flex gap-4 border-t border-white/5 pt-4">
                                {member.linkedin && <Linkedin size={14} className="text-gray-600" />}
                                {member.twitter && <Twitter size={14} className="text-gray-600" />}
                                {member.email && <Mail size={14} className="text-gray-600" />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Application Records</h1>
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                        <tr>
                            <th className="px-8 py-6">Date</th>
                            <th className="px-8 py-6">Business</th>
                            <th className="px-8 py-6">Type</th>
                            <th className="px-8 py-6">Status</th>
                            <th className="px-8 py-6 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {applications.length > 0 ? applications.map(app => (
                            <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedApplication(app)}>
                                <td className="px-8 py-6 text-xs text-gray-400 font-mono">{app.date}</td>
                                <td className="px-8 py-6"><p className="text-sm font-bold text-white">{app.businessName}</p><p className="text-[10px] text-gray-500">{app.fullName}</p></td>
                                <td className="px-8 py-6 text-xs text-gray-400">{app.loanType || app.serviceType}</td>
                                <td className="px-8 py-6">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : app.status === 'Declined' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <div className="flex justify-end gap-4">
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedApplication(app); }} className="text-[10px] font-black uppercase text-nova-400 hover:text-white transition-colors">Details</button>
                                        <button onClick={(e) => handleDeleteApplication(app.id, e)} className="text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Applications Logged</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Inquiry Terminal</h1>
            {inquiries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inquiries.map(inq => (
                        <div key={inq.id} className={`group p-8 rounded-3xl border transition-all cursor-pointer relative ${inq.status === 'Unread' ? 'bg-white/5 border-nova-500/30' : 'bg-nova-900 border-white/5 opacity-60'}`} onClick={() => setSelectedInquiry(inq)}>
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[9px] font-mono text-gray-500">{inq.date}</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => handleDeleteInquiry(inq.id, e)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-500/10 text-red-500 rounded-lg"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                    {inq.status === 'Unread' && <span className="w-2.5 h-2.5 rounded-full bg-nova-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>}
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-nova-400 transition-colors">{inq.fullName}</h3>
                            <p className="text-[10px] text-nova-400 font-black uppercase tracking-widest mb-4">{inq.subject}</p>
                            <p className="text-sm text-gray-400 line-clamp-2 italic font-light">"{inq.message}"</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-32 text-center glass-panel rounded-[3rem] border border-white/5">
                    <AlertCircle size={64} className="mx-auto text-gray-800 mb-8" />
                    <h3 className="text-2xl font-bold text-gray-600 uppercase tracking-widest">Log Cache Empty</h3>
                    <p className="text-gray-700 mt-2 font-medium">No incoming inquiries detected in the terminal.</p>
                </div>
            )}
          </div>
        )}

        {/* TAB: TICKER */}
        {activeTab === 'ticker' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Live Feed Override</h1>
                <button onClick={() => setIsTickerModalOpen(true)} className="px-6 py-3 bg-nova-500 rounded-xl text-xs font-black uppercase flex items-center gap-2"><Plus size={16} /> Append Point</button>
            </div>
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <tr><th className="px-8 py-6">Instrument</th><th className="px-8 py-6">Value</th><th className="px-8 py-6">Trend</th><th className="px-8 py-6 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tickerItems.length > 0 ? tickerItems.map(item => (
                            <tr key={item.id} className="hover:bg-white/[0.02]">
                                <td className="px-8 py-6 text-sm font-bold text-white">{item.label}</td>
                                <td className="px-8 py-6 text-sm font-mono text-gray-400">{item.value}</td>
                                <td className={`px-8 py-6 text-[10px] font-black uppercase ${item.trend === 'Bullish' ? 'text-emerald-500' : item.trend === 'Bearish' ? 'text-red-500' : 'text-gray-500'}`}>{item.trend}</td>
                                <td className="px-8 py-6 text-right"><button onClick={() => handleDeleteTicker(item.id)} className="text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={4} className="px-8 py-20 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Manual Overrides Active</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB: ARTICLES */}
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
                        <div className="p-8"><span className="text-[10px] font-black uppercase text-nova-400 tracking-widest">{art.category}</span><h3 className="text-xl font-bold text-white mt-2 line-clamp-1">{art.title}</h3><p className="text-sm text-gray-500 mt-4 line-clamp-2">{art.excerpt}</p></div>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB: CAROUSEL */}
        {activeTab === 'carousel' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Campaign Stream</h1>
                <button onClick={() => setIsCarouselModalOpen(true)} className="px-6 py-3 bg-nova-500 rounded-xl text-xs font-black uppercase flex items-center gap-2"><Plus size={16} /> New Campaign</button>
            </div>
            <div className="space-y-6">
                {carouselItems.map(item => (
                    <div key={item.id} className="glass-panel p-8 rounded-3xl border border-white/5 flex items-center gap-8">
                        <div className="w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover grayscale" alt="" /> : <div className={`w-full h-full bg-gradient-to-br ${item.imageGradient} opacity-20`} />}
                        </div>
                        <div className="flex-grow"><span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{item.tag}</span><h3 className="text-lg font-bold text-white mt-1">{item.title}</h3></div>
                        <button onClick={() => handleDeleteCarousel(item.id)} className="p-3 bg-red-500/10 rounded-xl text-red-500 hover:bg-red-500/20"><Trash2 size={20} /></button>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Team Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTeamModalOpen(false)}></div>
        <form onSubmit={handlePostTeam} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditingTeam ? 'Edit Leader' : 'Add Leader'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTeamMember.name} onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})} />
                <input required type="text" placeholder="Official Role" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTeamMember.role} onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})} />
                <input required type="text" placeholder="Specialization (e.g. Strategic Leadership)" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newTeamMember.specialization} onChange={(e) => setNewTeamMember({...newTeamMember, specialization: e.target.value})} />
                <textarea required placeholder="Short professional bio..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none font-light" value={newTeamMember.bio} onChange={(e) => setNewTeamMember({...newTeamMember, bio: e.target.value})} />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
               <div className="relative group">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="url" placeholder="LinkedIn" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-nova-500" value={newTeamMember.linkedin} onChange={(e) => setNewTeamMember({...newTeamMember, linkedin: e.target.value})} />
               </div>
               <div className="relative group">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="url" placeholder="Twitter" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-nova-500" value={newTeamMember.twitter} onChange={(e) => setNewTeamMember({...newTeamMember, twitter: e.target.value})} />
               </div>
               <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input type="email" placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-xs text-white outline-none focus:border-nova-500" value={newTeamMember.email} onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})} />
               </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {newTeamMember.imageUrl ? <img src={newTeamMember.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" /> : <div className="w-12 h-12 rounded-lg bg-nova-500/20 flex items-center justify-center"><User size={16} className="text-nova-400" /></div>}
                        <span className="text-xs text-gray-500 font-bold">Portrait status</span>
                    </div>
                    <div className="flex gap-2">
                        <label className="px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white/10 cursor-pointer transition-all">
                            <Upload size={14} /> Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setNewTeamMember)} />
                        </label>
                        <button type="button" onClick={() => handleGenerateAIImage('team')} disabled={isGeneratingImage} className="px-4 py-2 bg-nova-500/10 border border-nova-500/20 text-nova-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-nova-500 hover:text-white transition-all disabled:opacity-50">
                            {isGeneratingImage ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} Vision Sync
                        </button>
                    </div>
                </div>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-nova-500/20 hover:bg-nova-400 transition-all">{isEditingTeam ? 'Update Records' : 'Deploy to Leadership'}</button>
        </form></div>
      )}

      {/* Application Details */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedApplication(null)}></div>
        <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 overflow-y-auto max-h-[90vh] animate-fade-in-up">
            <h2 className="text-3xl font-black uppercase italic mb-8">Inquiry Brief</h2>
            <div className="grid grid-cols-2 gap-8 mb-10 text-sm">
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-2 tracking-widest">Entity</p><p className="font-bold text-white text-lg">{selectedApplication.businessName}</p></div>
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-2 tracking-widest">Representative</p><p className="font-bold text-white text-lg">{selectedApplication.fullName}</p><p className="text-xs text-nova-400">{selectedApplication.role}</p></div>
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-2 tracking-widest">Product</p><p className="font-bold text-nova-400">{selectedApplication.loanType || selectedApplication.serviceType}</p></div>
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-2 tracking-widest">Contact</p><p className="font-mono text-gray-300">{selectedApplication.email}</p><p className="font-mono text-gray-300">{selectedApplication.phone}</p></div>
                <div className="col-span-2"><p className="text-gray-500 uppercase font-black text-[10px] mb-2 tracking-widest">Requirements Brief</p><p className="text-gray-300 leading-relaxed p-6 bg-white/5 rounded-2xl italic font-light">"{selectedApplication.description || 'No specific requirements provided.'}"</p></div>
                <div className="col-span-2 grid grid-cols-3 gap-4">
                    <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">State</p><p className="text-white font-bold">{selectedApplication.state}</p></div>
                    <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">Industry</p><p className="text-white font-bold">{selectedApplication.industry}</p></div>
                    <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">CAC Status</p><p className={`font-bold ${selectedApplication.cacNumber ? 'text-emerald-400' : 'text-amber-400'}`}>{selectedApplication.cacNumber || 'Unregistered'}</p></div>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/5">
                <button onClick={() => updateAppStatus(selectedApplication.id, 'Approved')} className="flex-grow py-4 bg-emerald-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"><Check size={16} /> Authorize</button>
                <button onClick={() => updateAppStatus(selectedApplication.id, 'Declined')} className="flex-grow py-4 bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600 hover:text-white transition-all">Decline</button>
                <button onClick={() => setSelectedApplication(null)} className="flex-grow py-4 border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Close</button>
            </div>
        </div></div>
      )}

      {/* Inquiry Details */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}></div>
        <div className="relative w-full max-w-xl glass-panel rounded-[3rem] border border-white/10 p-12 animate-fade-in-up">
            <h2 className="text-3xl font-black uppercase italic mb-8">Transmission Brief</h2>
            <div className="space-y-6 mb-10">
                <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">From</p><p className="font-bold text-white">{selectedInquiry.fullName}</p></div>
                    <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">Email</p><p className="font-mono text-gray-400 text-xs">{selectedInquiry.email}</p></div>
                </div>
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">Subject</p><p className="font-bold text-nova-400 text-xl">{selectedInquiry.subject}</p></div>
                <div><p className="text-gray-500 uppercase font-black text-[10px] mb-1 tracking-widest">Message</p><p className="text-gray-300 leading-relaxed p-6 bg-white/5 rounded-2xl italic font-light">"{selectedInquiry.message}"</p></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')} className="flex-grow py-4 bg-nova-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-nova-400 transition-all shadow-lg shadow-nova-500/20">Mark Handled</button>
                <button onClick={() => handleDeleteInquiry(selectedInquiry.id)} className="flex-grow py-4 bg-red-600/10 text-red-500 border border-red-500/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all">Delete Log</button>
                <button onClick={() => setSelectedInquiry(null)} className="flex-grow py-4 border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">Close</button>
            </div>
        </div></div>
      )}

      {/* Add Ticker Point */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTickerModalOpen(false)}></div>
        <form onSubmit={handlePostTicker} className="relative w-full max-w-md glass-panel rounded-[2.5rem] border border-white/10 p-10 space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Append Point</h2>
            <input required type="text" placeholder="Instrument Label" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTicker.label} onChange={(e) => setNewTicker({...newTicker, label: e.target.value})} />
            <input required type="text" placeholder="Value (e.g. +1.4%)" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTicker.value} onChange={(e) => setNewTicker({...newTicker, value: e.target.value})} />
            <select className="w-full bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-nova-500" value={newTicker.trend} onChange={(e) => setNewTicker({...newTicker, trend: e.target.value as any})}>
                <option value="Neutral">Neutral</option><option value="Bullish">Bullish</option><option value="Bearish">Bearish</option>
            </select>
            <button type="submit" className="w-full py-4 bg-nova-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-nova-400 transition-all shadow-lg shadow-nova-500/20">Deploy Point</button>
        </form></div>
      )}

      {/* Article Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsArticleModalOpen(false)}></div>
        <form onSubmit={handlePostArticle} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditingArticle ? 'Edit Insight' : 'Curate Insight'}</h2>
            <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Headline" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} />
                <textarea required placeholder="Short summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none" value={newArticle.excerpt} onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})} />
                <select className="bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-nova-500" value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})}>
                    <option value="Strategy">Strategy</option><option value="Real Estate">Real Estate</option><option value="Guide">Guide</option><option value="Tech">Tech</option><option value="Eco-Finance">Eco-Finance</option>
                </select>
                <input type="text" placeholder="Author Name" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newArticle.author} onChange={(e) => setNewArticle({...newArticle, author: e.target.value})} />
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {newArticle.imageUrl ? <img src={newArticle.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" /> : <div className="w-12 h-12 rounded-lg bg-nova-500/20 flex items-center justify-center"><ImageIcon size={16} className="text-nova-400" /></div>}
                    <span className="text-xs text-gray-500 font-bold">Visual synchronization status</span>
                </div>
                <button type="button" onClick={() => handleGenerateAIImage('article')} disabled={isGeneratingImage} className="px-4 py-2 bg-nova-500/10 border border-nova-500/20 text-nova-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-nova-500 hover:text-white transition-all disabled:opacity-50">{isGeneratingImage ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} Vision Sync</button>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-nova-500/20 hover:bg-nova-400 transition-all">{isEditingArticle ? 'Update Hub' : 'Post to Hub'}</button>
        </form></div>
      )}

      {/* Carousel Modal */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCarouselModalOpen(false)}></div>
        <form onSubmit={handlePostCarousel} className="relative w-full max-w-xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">New Campaign</h2>
            <input required type="text" placeholder="Campaign Headline" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.title} onChange={(e) => setNewCarousel({...newCarousel, title: e.target.value})} />
            <textarea required placeholder="Short pitch summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white h-24 resize-none focus:border-nova-500 outline-none" value={newCarousel.summary} onChange={(e) => setNewCarousel({...newCarousel, summary: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Tag (e.g. Active)" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.tag} onChange={(e) => setNewCarousel({...newCarousel, tag: e.target.value})} />
                <input type="text" placeholder="Button Label" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.linkText} onChange={(e) => setNewCarousel({...newCarousel, linkText: e.target.value})} />
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">{newCarousel.imageUrl ? <img src={newCarousel.imageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" /> : <div className="w-12 h-12 rounded-lg bg-nova-500/20 flex items-center justify-center"><ImageIcon size={16} className="text-nova-400" /></div>}<span className="text-xs text-gray-500 font-bold">Campaign visual</span></div>
                <button type="button" onClick={() => handleGenerateAIImage('carousel')} disabled={isGeneratingImage} className="px-4 py-2 bg-nova-500/10 border border-nova-500/20 text-nova-400 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 hover:bg-nova-500 hover:text-white transition-all disabled:opacity-50">{isGeneratingImage ? <Loader2 className="animate-spin" size={14} /> : <Zap size={14} />} Vision Sync</button>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-nova-500/20 hover:bg-nova-400 transition-all">Deploy Campaign</button>
        </form></div>
      )}
    </div>
  );
};
