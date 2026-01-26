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
  Flame,
  ExternalLink,
  Phone,
  Calendar,
  Layers,
  Globe,
  Briefcase,
  X,
  Landmark,
  CheckCircle2,
  Inbox,
  Eye,
  CheckCircle,
  BrainCircuit
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, TickerItem, CarouselItem, TeamMember } from '../types';
import { Logo } from './Logo';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // States
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'applications' | 'inquiries' | 'ticker' | 'carousel' | 'team'>('overview');
  
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
    setNewArticle({ title: '', excerpt: '', category: 'Strategy', author: 'Admin', imageUrl: '' });
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
    if (window.confirm('Remove this member from our team records?')) {
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
                <Logo size="lg" />
                <span className="text-[12px] font-black text-nova-accent tracking-[0.4em] lowercase mt-2 opacity-80">staff terminal</span>
              </div>
              {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono rounded-xl">{error}</div>}
              <form onSubmit={handleLogin} className="space-y-6">
                <input required type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Authorized ID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none placeholder:text-gray-600" />
                <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none placeholder:text-gray-600" />
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
      <div className="fixed left-0 top-0 h-full w-72 bg-nova-900 border-r border-white/10 flex flex-col p-8 z-50">
        <div className="flex flex-col items-start mb-10 cursor-pointer group" onClick={() => onBack()}>
           <Logo size="sm" className="group-hover:opacity-80 transition-opacity" />
        </div>
        <nav className="space-y-2 flex-grow overflow-y-auto no-scrollbar">
          {[
            { id: 'overview', icon: <TrendingUp size={20} />, label: 'Overview' },
            { id: 'applications', icon: <Users size={20} />, label: 'Applications', badge: pendingApps },
            { id: 'inquiries', icon: <MessageSquare size={20} />, label: 'Inquiries', badge: unreadInquiries },
            { id: 'team', icon: <ShieldCheck size={20} />, label: 'Our Team' },
            { id: 'ticker', icon: <Flame size={20} />, label: 'Breaking News' },
            { id: 'articles', icon: <FileText size={20} />, label: 'Insights Hub' },
            { id: 'carousel', icon: <Megaphone size={20} />, label: 'Campaigns' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-bold text-sm ${activeTab === tab.id ? 'bg-nova-500 text-white shadow-lg shadow-nova-500/20' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <div className="flex items-center gap-4">{tab.icon} {tab.label}</div>
              {tab.badge ? <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{tab.badge}</span> : null}
            </button>
          ))}
        </nav>
        <div className="mt-8 pt-8 border-t border-white/10">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-6 py-4 text-gray-400 hover:text-white transition-all text-xs font-black uppercase tracking-widest group"><LogOut size={16} /> Exit Terminal</button>
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
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Institutional Operations Interface</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                 <Users className="text-nova-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Loan Applications</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{applications.length}</p>
                    {pendingApps > 0 && <span className="text-amber-500 text-xs font-black mb-2 tracking-widest">{pendingApps} PENDING</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                 <MessageSquare className="text-purple-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Active Inquiries</p>
                 <div className="flex items-end gap-3">
                    <p className="text-6xl font-black">{inquiries.length}</p>
                    {unreadInquiries > 0 && <span className="text-red-500 text-xs font-black mb-2 tracking-widest">{unreadInquiries} NEW</span>}
                 </div>
              </div>
              <div className="glass-panel p-10 rounded-[2.5rem] border border-white/10 shadow-xl">
                 <ShieldCheck className="text-emerald-400 mb-6" size={32} />
                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-2">Our Team</p>
                 <p className="text-6xl font-black">{teamMembers.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Loan Inquiries</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Credit Pipeline</p>
                </div>
            </div>
            <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/10 text-[10px] font-black uppercase tracking-widest text-gray-300">
                        <tr>
                          <th className="px-8 py-6">Reference</th>
                          <th className="px-8 py-6">Entity</th>
                          <th className="px-8 py-6">Product</th>
                          <th className="px-8 py-6">Status</th>
                          <th className="px-8 py-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {applications.length > 0 ? applications.map(app => (
                            <tr key={app.id} className="hover:bg-white/[0.04] cursor-pointer group transition-colors" onClick={() => setSelectedApplication(app)}>
                                <td className="px-8 py-6 font-mono text-xs text-gray-400">{app.id}</td>
                                <td className="px-8 py-6">
                                  <div className="font-bold text-white">{app.businessName}</div>
                                  <div className="text-[10px] text-gray-400 uppercase font-black tracking-tight">{app.fullName}</div>
                                </td>
                                <td className="px-8 py-6 text-xs text-nova-400 font-black uppercase">{app.loanType || app.serviceType}</td>
                                <td className="px-8 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                    app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    app.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : 
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                  }`}>
                                    {app.status}
                                  </span>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <button onClick={(e) => handleDeleteApplication(app.id, e)} className="text-gray-500 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="px-8 py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">No Active Applications</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Support Inquiries</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">General Uplink Channel</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.length > 0 ? inquiries.map(inq => (
                <div 
                  key={inq.id} 
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all hover:translate-y-[-5px] ${
                    inq.status === 'Unread' ? 'bg-white/10 border-nova-500 shadow-lg shadow-nova-500/10' : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      inq.status === 'Unread' ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                    }`}>
                      {inq.status}
                    </span>
                    <button onClick={(e) => handleDeleteInquiry(inq.id, e)} className="text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{inq.subject}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 italic">"{inq.message}"</p>
                  <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-nova-500/20 flex items-center justify-center text-nova-400"><User size={14} /></div>
                    <div>
                      <p className="text-xs font-bold text-white">{inq.fullName}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{inq.date}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-40 text-center glass-panel rounded-[3rem] border border-white/5">
                  <Inbox className="mx-auto text-gray-800 mb-6" size={48} />
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">No Incoming Inquiries</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: TEAM */}
        {activeTab === 'team' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Our Team</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Institutional Leadership & Experts</p>
                </div>
                <button onClick={() => { setIsEditingTeam(false); setIsTeamModalOpen(true); }} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                  <Plus size={16} /> New Member
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teamMembers.map(member => (
                <div key={member.id} className="group glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col hover:border-nova-500/30 transition-all">
                  <div className={`h-48 relative bg-gradient-to-br ${member.imageGradient} opacity-60 group-hover:opacity-100 transition-all`}>
                    {member.imageUrl && <img src={member.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt={member.name} />}
                  </div>
                  <div className="p-8">
                    <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-6">{member.role}</p>
                    <div className="flex gap-4">
                      <button onClick={() => handleEditTeam(member)} className="text-nova-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => handleDeleteTeam(member.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: TICKER */}
        {activeTab === 'ticker' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Breaking News</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Global & Local Market Ticker</p>
                </div>
                <button onClick={() => setIsTickerModalOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-red-600/20">
                  <Radio size={16} /> Add Alert
                </button>
            </div>
            <div className="space-y-4">
              {tickerItems.map(item => (
                <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-red-500/30 transition-all">
                  <div className="flex items-center gap-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                      item.category === 'Urgent' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                      item.category === 'Market' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                      'bg-nova-500/10 text-nova-400 border-nova-500/20'
                    }`}>
                      {item.category}
                    </span>
                    <p className="text-white font-bold tracking-tight">{item.text}</p>
                  </div>
                  <button onClick={() => handleDeleteTicker(item.id)} className="text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ARTICLES */}
        {activeTab === 'articles' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Insights Hub</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Strategic Archives Management</p>
                </div>
                <button onClick={() => { setIsEditingArticle(false); setIsArticleModalOpen(true); }} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                  <FileText size={16} /> Create Insight
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(art => (
                <div key={art.id} className="group glass-panel rounded-[3rem] border border-white/5 overflow-hidden flex flex-col hover:border-nova-500/30 transition-all">
                  <div className="h-56 relative overflow-hidden bg-nova-800">
                    {art.imageUrl ? (
                      <img src={art.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={art.title} />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${art.imageGradient} opacity-30`}></div>
                    )}
                    <div className="absolute top-6 left-6"><span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[8px] font-black text-white uppercase tracking-widest rounded-full">{art.category}</span></div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-white mb-3 line-clamp-2">{art.title}</h3>
                    <p className="text-gray-400 text-xs mb-8 line-clamp-2 italic">"{art.excerpt}"</p>
                    <div className="mt-auto pt-6 border-t border-white/5 flex justify-between items-center">
                      <div className="flex gap-4">
                        <button onClick={() => handleEditArticle(art)} className="text-nova-400 hover:text-white transition-colors"><Edit3 size={16} /></button>
                        <button onClick={() => handleDeleteArticle(art.id)} className="text-gray-600 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                      <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{art.date}</span>
                    </div>
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
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">Campaigns</h1>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">Visual Storytelling Interface</p>
                </div>
                <button onClick={() => setIsCarouselModalOpen(true)} className="bg-nova-500 hover:bg-nova-400 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-xl shadow-nova-500/20">
                  <Megaphone size={16} /> New Campaign
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {carouselItems.map(item => (
                <div key={item.id} className="group glass-panel rounded-[3rem] border border-white/10 overflow-hidden flex flex-col h-[300px] hover:border-nova-500/30 transition-all">
                  <div className="absolute inset-0 z-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="w-full h-full object-cover opacity-20" alt={item.title} />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${item.imageGradient} opacity-20`}></div>
                    )}
                  </div>
                  <div className="relative z-10 p-10 flex flex-col h-full">
                    <span className="px-3 py-1 bg-nova-500/20 border border-nova-500/30 text-[9px] font-black text-white uppercase tracking-widest rounded-full w-fit mb-6">{item.tag}</span>
                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm font-medium line-clamp-2 mb-8">{item.summary}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{item.type} module active</span>
                      <button onClick={() => handleDeleteCarousel(item.id)} className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: APPLICATION DETAIL */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedApplication(null)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{selectedApplication.businessName}</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Ref: {selectedApplication.id}</p>
              </div>
              <button onClick={() => setSelectedApplication(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <div className="grid grid-cols-2 gap-8">
                <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Entity Head</p><p className="font-bold">{selectedApplication.fullName}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Role</p><p className="font-bold">{selectedApplication.role}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Product</p><p className="font-black text-nova-400 uppercase italic">{selectedApplication.loanType || selectedApplication.serviceType}</p></div>
                <div><p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Region</p><p className="font-bold">{selectedApplication.state}, {selectedApplication.industry}</p></div>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4">Brief Narrative</p>
                <p className="text-gray-200 leading-relaxed font-medium italic">"{selectedApplication.description}"</p>
              </div>
              <div className="flex gap-4">
                <a href={`tel:${selectedApplication.phone}`} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold text-sm"><Phone size={16} /> Call</a>
                <a href={`mailto:${selectedApplication.email}`} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-bold text-sm"><Mail size={16} /> Email</a>
              </div>
            </div>
            <div className="p-10 border-t border-white/5 bg-white/5 flex justify-between items-center">
              <div className="flex gap-2">
                <button onClick={() => updateAppStatus(selectedApplication.id, 'Approved')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Approve</button>
                <button onClick={() => updateAppStatus(selectedApplication.id, 'Declined')} className="px-6 py-3 bg-red-600/20 text-red-500 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Decline</button>
              </div>
              <span className="text-[10px] text-gray-600 font-mono">{selectedApplication.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INQUIRY DETAIL */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedInquiry(null)}></div>
          <div className="relative w-full max-w-xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Inquiry Review</h2>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Status: {selectedInquiry.status}</p>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-nova-500/20 flex items-center justify-center text-nova-400"><User size={24} /></div>
                <div><p className="text-xl font-bold text-white">{selectedInquiry.fullName}</p><p className="text-gray-500 font-mono text-xs">{selectedInquiry.email}</p></div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">Subject</p>
                <h3 className="text-lg font-bold text-white">{selectedInquiry.subject}</h3>
              </div>
              <div className="p-8 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-gray-200 leading-relaxed font-medium italic">"{selectedInquiry.message}"</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')} className="flex-1 py-4 bg-nova-500 text-white rounded-2xl flex items-center justify-center gap-2 hover:bg-nova-400 transition-all font-black uppercase tracking-widest text-[10px] shadow-lg shadow-nova-500/20"><CheckCircle size={16} /> Mark as Replied</button>
                <button onClick={() => handleDeleteInquiry(selectedInquiry.id)} className="flex-1 py-4 bg-red-600/20 text-red-500 border border-red-500/20 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest text-[10px]"><Trash2 size={16} /> Erase log</button>
              </div>
            </div>
            <div className="p-6 text-center text-[9px] text-gray-600 font-black uppercase tracking-widest opacity-40">Received on {selectedInquiry.date}</div>
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE ENTRY */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsArticleModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{isEditingArticle ? 'Refine Insight' : 'Manifest Insight'}</h2>
              <button onClick={() => setIsArticleModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <form onSubmit={handlePostArticle} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Intel Title*</label>
                    <input required type="text" value={newArticle.title} onChange={(e) => setNewArticle({...newArticle, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" placeholder="e.g. Asset Finance Trends Q3" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Section*</label>
                    <select value={newArticle.category} onChange={(e) => setNewArticle({...newArticle, category: e.target.value})} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                      <option value="Strategy">Strategy</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Eco-Finance">Eco-Finance</option>
                      <option value="Guide">Guide</option>
                      <option value="Tech">Tech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Author Terminal*</label>
                    <input required type="text" value={newArticle.author} onChange={(e) => setNewArticle({...newArticle, author: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                  </div>
                </div>
                <div>
                   <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Executive Summary*</label>
                   <textarea required value={newArticle.excerpt} onChange={(e) => setNewArticle({...newArticle, excerpt: e.target.value})} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none italic font-medium" />
                </div>
                
                {/* Visual Uplink */}
                <div className="space-y-4">
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Visual Synchronization</label>
                  <div className="flex gap-4">
                    <div className="w-40 h-24 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {newArticle.imageUrl ? (
                        <img src={newArticle.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <ImageIcon className="text-gray-700" size={32} />
                      )}
                      {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={24} /></div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                       <button type="button" onClick={() => handleGenerateAIImage('article')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-nova-400 transition-all flex items-center justify-center gap-2">
                          <BrainCircuit size={16} /> {isGeneratingImage ? 'Syncing...' : 'Gemini AI Vision Sync'}
                       </button>
                       <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer">
                          <Upload size={16} /> Manual Upload
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewArticle)} className="hidden" />
                       </label>
                       <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 1200x800px (3:2 ratio)</p>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">
                  {isEditingArticle ? 'Update Intel' : 'Initialize Transmit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TEAM ENTRY */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsTeamModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">{isEditingTeam ? 'Refine Leader Profile' : 'Initialize New Leader'}</h2>
              <button onClick={() => setIsTeamModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
               <form onSubmit={handlePostTeam} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Ident Name*</label>
                      <input required type="text" value={newTeamMember.name} onChange={(e) => setNewTeamMember({...newTeamMember, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Official Designation*</label>
                      <input required type="text" value={newTeamMember.role} onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Specialized Domain*</label>
                    <input required type="text" value={newTeamMember.specialization} onChange={(e) => setNewTeamMember({...newTeamMember, specialization: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none font-bold" placeholder="e.g. Asset Engineering" />
                 </div>
                 <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Leader Intel / Bio*</label>
                    <textarea required value={newTeamMember.bio} onChange={(e) => setNewTeamMember({...newTeamMember, bio: e.target.value})} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none font-medium italic" />
                 </div>
                 <div className="grid md:grid-cols-3 gap-4">
                    <input type="text" value={newTeamMember.linkedin} onChange={(e) => setNewTeamMember({...newTeamMember, linkedin: e.target.value})} placeholder="LinkedIn URI" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                    <input type="text" value={newTeamMember.twitter} onChange={(e) => setNewTeamMember({...newTeamMember, twitter: e.target.value})} placeholder="Twitter URI" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                    <input type="email" value={newTeamMember.email} onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})} placeholder="Terminal Email" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-bold" />
                 </div>
                 <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {newTeamMember.imageUrl ? <img src={newTeamMember.imageUrl} className="w-full h-full object-cover" alt="Headshot" /> : <User className="text-gray-700" size={32} />}
                      {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={16} /></div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                       <button type="button" onClick={() => handleGenerateAIImage('team')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"><BrainCircuit size={14} /> Gemini Portrait Sync</button>
                       <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Upload size={14} /> Headshot Upload <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewTeamMember)} className="hidden" /></label>
                       <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 800x800px (Square)</p>
                    </div>
                  </div>
                </div>
                 <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">
                  {isEditingTeam ? 'Refine Records' : 'Initialize Profile'}
                 </button>
               </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TICKER ENTRY */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsTickerModalOpen(false)}></div>
          <div className="relative w-full max-w-md glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Alert Broadcast</h2>
              <button onClick={() => setIsTickerModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10">
              <form onSubmit={handlePostTicker} className="space-y-6">
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Alert Level*</label>
                  <select value={newTicker.category} onChange={(e) => setNewTicker({...newTicker, category: e.target.value as any})} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                    <option value="Urgent">Urgent Alert</option>
                    <option value="Market">Market Alert</option>
                    <option value="Corporate">Corporate Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Broadcast Text*</label>
                  <textarea required maxLength={120} value={newTicker.text} onChange={(e) => setNewTicker({...newTicker, text: e.target.value})} className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-red-500 outline-none resize-none font-bold uppercase tracking-tight italic" placeholder="MAX 120 CHARS FOR OPTIMAL SCROLL" />
                </div>
                <button type="submit" className="w-full py-5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-red-500 transition-all shadow-xl active:scale-95">Initiate Broadcast</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAROUSEL ENTRY */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCarouselModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Campaign Builder</h2>
              <button onClick={() => setIsCarouselModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"><X size={24} /></button>
            </div>
            <div className="p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <form onSubmit={handlePostCarousel} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Context Type*</label>
                    <select value={newCarousel.type} onChange={(e) => setNewCarousel({...newCarousel, type: e.target.value as any})} className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none font-bold">
                      <option value="advert">Institutional Advert</option>
                      <option value="product">Product Campaign</option>
                      <option value="customer">Client Success</option>
                      <option value="news">Market Intelligence</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Short Tag*</label>
                    <input required type="text" value={newCarousel.tag} onChange={(e) => setNewCarousel({...newCarousel, tag: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold" placeholder="e.g. Active Campaign" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Headline*</label>
                  <input required type="text" value={newCarousel.title} onChange={(e) => setNewCarousel({...newCarousel, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-lg" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 ml-2">Summary*</label>
                  <textarea required value={newCarousel.summary} onChange={(e) => setNewCarousel({...newCarousel, summary: e.target.value})} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:border-nova-500 outline-none resize-none font-medium italic" />
                </div>
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex gap-4">
                    <div className="w-32 h-20 bg-nova-800 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center relative">
                      {newCarousel.imageUrl ? <img src={newCarousel.imageUrl} className="w-full h-full object-cover" alt="Campaign" /> : <ImageIcon className="text-gray-700" size={24} />}
                      {isGeneratingImage && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="animate-spin text-nova-400" size={16} /></div>}
                    </div>
                    <div className="flex flex-col gap-2 flex-grow">
                       <button type="button" onClick={() => handleGenerateAIImage('carousel')} disabled={isGeneratingImage} className="flex-1 bg-nova-500 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2"><BrainCircuit size={14} /> AI Visualization Sync</button>
                       <label className="flex-1 bg-white/5 border border-white/10 text-white font-black text-[9px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 cursor-pointer"><Upload size={14} /> Campaign Asset Upload <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setNewCarousel)} className="hidden" /></label>
                       <p className="text-[9px] text-gray-500 italic mt-1 ml-1 font-medium">Recommended: 1600x800px (2:1 aspect ratio)</p>
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-white text-nova-900 font-black text-[10px] uppercase tracking-[0.4em] rounded-2xl hover:bg-nova-500 hover:text-white transition-all shadow-xl active:scale-95">Initiate Campaign</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
