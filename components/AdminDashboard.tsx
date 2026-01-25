
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
  X
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { generateArticleImage } from '../services/geminiService';
import { Article, LoanApplication, ContactInquiry, TickerItem, CarouselItem, TeamMember } from '../types';
import { useToast } from './Toast';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { showToast } = useToast();


  // States
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loginPhase, setLoginPhase] = useState<'credentials' | 'otp'>('credentials');
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

  const refreshData = async () => {
    const [arts, apps, inqs, tks, cars, team] = await Promise.all([
      storageService.getArticles(),
      storageService.getApplications(),
      storageService.getInquiries(),
      storageService.getManualTickerItems(),
      storageService.getCarouselItems(),
      storageService.getTeamMembers()
    ]);
    setArticles(arts);
    setApplications(apps);
    setInquiries(inqs);
    setTickerItems(tks);
    setCarouselItems(cars);
    setTeamMembers(team);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);
    try {
      const response = await storageService.loginStep1(staffId, loginPass);
      if (response.success) {
        setLoginPhase('otp');
        showToast('Verification code transmitted to your authorized email.', 'info');
      } else {
        setError(response.message || "SYSTEM REJECTION: Unauthorized Credentials Detected.");
        showToast(response.message || 'Unauthorized Credentials.', 'error');
      }
    } catch (error) {
      showToast('Authentication System Error.', 'error');
    } finally {
      setIsScanning(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);
    try {
      const response = await storageService.verify2FA(staffId, otpCode);
      if (response.success) {
        setIsAuthenticated(true);
        showToast('System Authenticated. Welcome, Administrator.', 'success');
      } else {
        setError(response.message || "INVALID VERIFICATION CODE.");
        showToast(response.message || 'Verification Failed.', 'error');
      }
    } catch (error) {
      showToast('Verification Link Failure.', 'error');
    } finally {
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
      showToast("Please provide the required name/headline first.", 'info');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const generatedUrl = await generateArticleImage(titleToUse);
      if (generatedUrl) {
        if (context === 'carousel') {
          setNewCarousel(prev => ({ ...prev, imageUrl: generatedUrl }));
        } else if (context === 'team') {
          setNewTeamMember(prev => ({ ...prev, imageUrl: generatedUrl }));
        } else {
          setNewArticle(prev => ({ ...prev, imageUrl: generatedUrl }));
        }
        showToast('Visual generated successfully.', 'success');
      } else {
        showToast("Visual synchronization failed. Using fallback.", 'error');
      }
    } catch (err) {
      showToast("AI Generation error.", 'error');
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

  const handlePostArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const article: Article = {
        ...(newArticle as Article),
        id: isEditingArticle && editingArticleId ? editingArticleId : Math.random().toString(36).substr(2, 9),
        date: newArticle.date || new Date().toISOString().split('T')[0],
        readTime: newArticle.readTime || '5 min read',
        imageGradient: newArticle.imageGradient || 'from-nova-500 to-purple-600'
      };
      await storageService.saveArticle(article);
      refreshData();
      setIsArticleModalOpen(false);
      setIsEditingArticle(false);
      setEditingArticleId(null);
      showToast(isEditingArticle ? 'Insight updated.' : 'Insight deployed to hub.', 'success');
    } catch (err) {
      showToast('Failed to save insight.', 'error');
    }
  };

  const handlePostTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const member: TeamMember = {
        ...(newTeamMember as TeamMember),
        id: isEditingTeam && editingTeamId ? editingTeamId : Math.random().toString(36).substr(2, 9),
        imageGradient: newTeamMember.imageGradient || 'from-blue-600 to-indigo-900'
      };
      await storageService.saveTeamMember(member);
      refreshData();
      setIsTeamModalOpen(false);
      setIsEditingTeam(false);
      setEditingTeamId(null);
      showToast(isEditingTeam ? 'Leadership record updated.' : 'New leader added to records.', 'success');
      setNewTeamMember({ name: '', role: '', bio: '', specialization: '', linkedin: '', twitter: '', email: '', imageUrl: '', imageGradient: 'from-blue-600 to-indigo-900' });
    } catch (err) {
      showToast('Failed to save leadership record.', 'error');
    }
  };

  const handlePostCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item: CarouselItem = {
        ...(newCarousel as CarouselItem),
        id: Math.random().toString(36).substr(2, 9),
        type: 'advert'
      };
      await storageService.saveCarouselItem(item);
      refreshData();
      setIsCarouselModalOpen(false);
      showToast('Campaign item saved.', 'success');
      setNewCarousel({ type: 'advert', title: '', summary: '', tag: 'Active', linkText: 'Learn More', imageGradient: 'from-nova-500 to-purple-600', imageUrl: '' });
    } catch (err) {
      showToast('Failed to save campaign.', 'error');
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (window.confirm('Erase this insight?')) {
      try {
        await storageService.deleteArticle(id);
        refreshData();
        showToast('Insight erased.', 'info');
      } catch (err) {
        showToast('Erase operation rejected.', 'error');
      }
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (window.confirm('Remove this member from leadership records?')) {
      try {
        await storageService.deleteTeamMember(id);
        refreshData();
        showToast('Leadership record purged.', 'info');
      } catch (err) {
        showToast('System rejected purge operation.', 'error');
      }
    }
  };

  const handleDeleteCarousel = async (id: string) => {
    if (window.confirm('Erase this campaign item?')) {
      try {
        await storageService.deleteCarouselItem(id);
        refreshData();
        showToast('Campaign item purged.', 'info');
      } catch (err) {
        showToast('Action rejected by system.', 'error');
      }
    }
  };

  const handlePostTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const item: TickerItem = {
        id: Math.random().toString(36).substr(2, 9),
        text: newTicker.text || '',
        category: (newTicker.category as any) || 'Market',
        isManual: true
      };
      await storageService.saveTickerItem(item);
      refreshData();
      setIsTickerModalOpen(false);
      showToast('Headline broadcast success.', 'success');
      setNewTicker({ text: '', category: 'Market' });
    } catch (err) {
      showToast('Broadcast transmission failed.', 'error');
    }
  };

  const handleDeleteTicker = async (id: string) => {
    await storageService.deleteTickerItem(id);
    refreshData();
  };

  const handleDeleteInquiry = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this inquiry from logs?')) {
      try {
        await storageService.deleteInquiry(id);
        refreshData();
        showToast('Inquiry purged from logs.', 'info');
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
      } catch (err) {
        showToast('System rejected log purge.', 'error');
      }
    }
  };

  const handleDeleteApplication = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Erase this application from records?')) {
      try {
        await storageService.deleteApplication(id);
        refreshData();
        showToast('Record purged successfully.', 'info');
        if (selectedApplication?.id === id) setSelectedApplication(null);
      } catch (err) {
        showToast('Record purge failed.', 'error');
      }
    }
  };

  const updateAppStatus = async (id: string, status: any) => {
    try {
      await storageService.updateApplicationStatus(id, status);
      refreshData();
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, status });
      }
      showToast(`Status updated to ${status}.`, 'info');
    } catch (err) {
      showToast('Status sync protocol failed.', 'error');
    }
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    try {
      await storageService.updateInquiryStatus(id, status);
      refreshData();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
      showToast(`Inquiry marked as ${status}.`, 'info');
    } catch (err) {
      showToast('Synchronization error.', 'error');
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
              {loginPhase === 'credentials' ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <input required type="text" value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="Authorized ID" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                  <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Access Key" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg focus:border-nova-500 outline-none" />
                  <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-500 hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all">
                    {isScanning ? 'Syncing...' : 'Initiate Access'}
                  </button>
                  <button type="button" onClick={handleBypass} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Emergency Bypass (Demo)</button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="text-sm text-gray-400 mb-4 uppercase tracking-widest">Enter Secure Link Code</div>
                  <input required type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="6-DIGIT CODE" maxLength={6} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-3xl font-black tracking-[0.5em] text-center focus:border-nova-500 outline-none" />
                  <button type="submit" disabled={isScanning} className="w-full py-5 bg-nova-accent hover:bg-nova-400 text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl transition-all shadow-lg shadow-nova-accent/20">
                    {isScanning ? 'Verifying...' : 'Finalize Uplink'}
                  </button>
                  <button type="button" onClick={() => setLoginPhase('credentials')} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition-colors">Back to Credentials</button>
                </form>
              )}
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
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border border-white/10 ${item.category === 'Urgent' ? 'text-red-500 bg-red-500/10' :
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

        {/* TAB: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Loan Applications</h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Institutional Credit Queue</p>
              </div>
            </div>
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden overflow-x-auto shadow-2xl">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Entity/Name</th>
                    <th className="px-8 py-6">Product</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.length > 0 ? applications.map(app => (
                    <tr key={app.id} onClick={() => setSelectedApplication(app)} className="hover:bg-white/[0.02] cursor-pointer group">
                      <td className="px-8 py-6 text-sm text-gray-400">{app.date}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white uppercase tracking-tight">{app.businessName}</div>
                        <div className="text-[10px] text-gray-500">{app.fullName}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${app.type === 'financial' ? 'text-nova-400 bg-nova-400/10' : 'text-purple-400 bg-purple-400/10'}`}>
                          {app.type === 'financial' ? app.loanType : app.serviceType}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${app.status === 'Pending' ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' :
                          app.status === 'Approved' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                            app.status === 'Declined' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                              'text-blue-500 border-blue-500/20 bg-blue-500/5'
                          }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={(e) => handleDeleteApplication(app.id, e)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Applications Detected</td>
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
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Electronic Inquiries</h1>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-[0.2em]">Consultancy Uplink Logs</p>
              </div>
            </div>
            <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden overflow-x-auto shadow-2xl">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <tr>
                    <th className="px-8 py-6">Date</th>
                    <th className="px-8 py-6">Contact</th>
                    <th className="px-8 py-6">Subject</th>
                    <th className="px-8 py-6">Status</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.length > 0 ? inquiries.map(inq => (
                    <tr key={inq.id} onClick={() => setSelectedInquiry(inq)} className="hover:bg-white/[0.02] cursor-pointer group">
                      <td className="px-8 py-6 text-sm text-gray-400">{inq.date}</td>
                      <td className="px-8 py-6">
                        <div className="font-bold text-white">{inq.fullName}</div>
                        <div className="text-[10px] text-gray-500">{inq.email}</div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-300 font-medium truncate max-w-[200px]">{inq.subject}</td>
                      <td className="px-8 py-6">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${inq.status === 'Unread' ? 'text-red-500 border-red-500/20 bg-red-500/5' :
                          inq.status === 'Replied' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                            'text-gray-500 border-gray-500/20 bg-gray-500/5'
                          }`}>
                          {inq.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={(e) => handleDeleteInquiry(inq.id, e)} className="text-red-500/40 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No Logs Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>


      {/* MODALS */}
      {/* Breaking News Modal */}
      {isTickerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTickerModalOpen(false)}></div>
          <form onSubmit={handlePostTicker} className="relative w-full max-w-lg glass-panel rounded-[2.5rem] border border-white/10 p-10 space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">New Broadcast</h2>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Headline (ALL CAPS RECOMMENDED)</label>
              <textarea required placeholder="ENTER BREAKING NEWS HEADLINE..." className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-red-500 outline-none h-32 resize-none uppercase font-bold" value={newTicker.text} onChange={(e) => setNewTicker({ ...newTicker, text: e.target.value })} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-2">Urgency Category</label>
              <select className="w-full bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-red-500" value={newTicker.category} onChange={(e) => setNewTicker({ ...newTicker, category: e.target.value as any })}>
                <option value="Urgent">Urgent (Red)</option>
                <option value="Corporate">Corporate (Blue)</option>
                <option value="Market">Market (Orange)</option>
              </select>
            </div>
            <button type="submit" className="w-full py-5 bg-red-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-3">
              <Radio size={16} className="animate-pulse" /> Deploy to Feed
            </button>
          </form>
        </div>
      )}

      {/* Intelligence Hub Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsArticleModalOpen(false)}></div>
          <form onSubmit={handlePostArticle} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditingArticle ? 'Edit Insight' : 'Curate Insight'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="Headline" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newArticle.title} onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })} />
              <textarea required placeholder="Short summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none" value={newArticle.excerpt} onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })} />
              <select className="bg-nova-900 border border-white/10 rounded-xl py-4 px-6 text-gray-400 outline-none focus:border-nova-500" value={newArticle.category} onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}>
                <option value="Strategy">Strategy</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Guide">Guide</option>
                <option value="Tech">Tech</option>
                <option value="Eco-Finance">Eco-Finance</option>
              </select>
              <input type="text" placeholder="Author Name" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newArticle.author} onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Image Sourcing</label>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                <div className="flex items-center gap-6">
                  {newArticle.imageUrl ? <img src={newArticle.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" /> : <div className="w-24 h-24 rounded-2xl bg-nova-500/10 flex items-center justify-center"><ImageIcon size={32} /></div>}
                  <input type="text" placeholder="Image URL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newArticle.imageUrl} onChange={(e) => setNewArticle({ ...newArticle, imageUrl: e.target.value })} />
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

      {/* Leadership Modal */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTeamModalOpen(false)}></div>
          <form onSubmit={handlePostTeam} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditingTeam ? 'Update Leader' : 'New Leader'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newTeamMember.name} onChange={(e) => setNewTeamMember({ ...newTeamMember, name: e.target.value })} />
              <input required type="text" placeholder="Institutional Role" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTeamMember.role} onChange={(e) => setNewTeamMember({ ...newTeamMember, role: e.target.value })} />
              <input required type="text" placeholder="Area of Specialization" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newTeamMember.specialization} onChange={(e) => setNewTeamMember({ ...newTeamMember, specialization: e.target.value })} />
              <textarea required placeholder="Professional Biography" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none" value={newTeamMember.bio} onChange={(e) => setNewTeamMember({ ...newTeamMember, bio: e.target.value })} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input type="text" placeholder="LinkedIn URL" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newTeamMember.linkedin} onChange={(e) => setNewTeamMember({ ...newTeamMember, linkedin: e.target.value })} />
              <input type="text" placeholder="Twitter URL" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newTeamMember.twitter} onChange={(e) => setNewTeamMember({ ...newTeamMember, twitter: e.target.value })} />
              <input type="email" placeholder="Institutional Email" className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newTeamMember.email} onChange={(e) => setNewTeamMember({ ...newTeamMember, email: e.target.value })} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Visual ID</label>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                <div className="flex items-center gap-6">
                  {newTeamMember.imageUrl ? <img src={newTeamMember.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" /> : <div className="w-24 h-24 rounded-2xl bg-nova-500/10 flex items-center justify-center"><User size={32} /></div>}
                  <input type="text" placeholder="Image URL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newTeamMember.imageUrl} onChange={(e) => setNewTeamMember({ ...newTeamMember, imageUrl: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-white/10 transition-all"><Upload size={16} /> Upload <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setNewTeamMember)} /></label>
                  <button type="button" onClick={() => handleGenerateAIImage('team')} disabled={isGeneratingImage} className="flex items-center justify-center gap-2 px-6 py-4 bg-nova-500/10 border border-nova-500/20 rounded-xl text-[10px] font-black uppercase"><Zap size={16} /> AI Portrait</button>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Seal Record</button>
          </form>
        </div>
      )}

      {/* Campaign Modal */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsCarouselModalOpen(false)}></div>
          <form onSubmit={handlePostCarousel} className="relative w-full max-w-2xl glass-panel rounded-[3rem] border border-white/10 p-12 space-y-6 my-10 animate-fade-in-up">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">New Campaign Item</h2>
            <div className="grid grid-cols-2 gap-4">
              <input required type="text" placeholder="Campaign Headline" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 focus:border-nova-500 outline-none" value={newCarousel.title} onChange={(e) => setNewCarousel({ ...newCarousel, title: e.target.value })} />
              <textarea required placeholder="Brief summary" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white col-span-2 h-32 resize-none focus:border-nova-500 outline-none" value={newCarousel.summary} onChange={(e) => setNewCarousel({ ...newCarousel, summary: e.target.value })} />
              <input type="text" placeholder="Tag (e.g. Active)" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.tag} onChange={(e) => setNewCarousel({ ...newCarousel, tag: e.target.value })} />
              <input type="text" placeholder="Link Text" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.linkText} onChange={(e) => setNewCarousel({ ...newCarousel, linkText: e.target.value })} />
              <input type="text" placeholder="Stat Label" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.statLabel} onChange={(e) => setNewCarousel({ ...newCarousel, statLabel: e.target.value })} />
              <input type="text" placeholder="Stat Value" className="bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-nova-500 outline-none" value={newCarousel.statValue} onChange={(e) => setNewCarousel({ ...newCarousel, statValue: e.target.value })} />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Campaign Visual</label>
              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
                <div className="flex items-center gap-6">
                  {newCarousel.imageUrl ? <img src={newCarousel.imageUrl} className="w-24 h-24 rounded-2xl object-cover" alt="" /> : <div className="w-24 h-24 rounded-2xl bg-nova-500/10 flex items-center justify-center"><Megaphone size={32} /></div>}
                  <input type="text" placeholder="Image URL" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs text-white" value={newCarousel.imageUrl} onChange={(e) => setNewCarousel({ ...newCarousel, imageUrl: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase cursor-pointer hover:bg-white/10 transition-all"><Upload size={16} /> Upload <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, setNewCarousel)} /></label>
                  <button type="button" onClick={() => handleGenerateAIImage('carousel')} disabled={isGeneratingImage} className="flex items-center justify-center gap-2 px-6 py-4 bg-nova-500/10 border border-nova-500/20 rounded-xl text-[10px] font-black uppercase"><Zap size={16} /> AI Gen</button>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full py-5 bg-nova-500 rounded-2xl font-black uppercase text-[10px] tracking-widest">Deploy Campaign</button>
          </form>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedApplication(null)}></div>
          <div className="relative w-full max-w-2xl glass-panel rounded-[2.5rem] border border-white/10 p-10 animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black uppercase text-nova-400 tracking-[0.2em] mb-2 block">{selectedApplication.type === 'financial' ? 'Loan Application' : 'Business Support Request'}</span>
                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">{selectedApplication.businessName}</h2>
              </div>
              <button onClick={() => setSelectedApplication(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={20} /></button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Contact Person</label>
                  <p className="text-white font-bold">{selectedApplication.fullName}</p>
                  <p className="text-sm text-gray-400">{selectedApplication.role}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Communication</label>
                  <p className="text-sm text-white font-mono">{selectedApplication.email}</p>
                  <p className="text-sm text-white font-mono">{selectedApplication.phone}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Entity Details</label>
                  <p className="text-sm text-white">CAC: {selectedApplication.cacNumber}</p>
                  <p className="text-sm text-white">Industry: {selectedApplication.industry}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Specific Request</label>
                  <p className="text-nova-400 font-bold uppercase">{selectedApplication.type === 'financial' ? selectedApplication.loanType : selectedApplication.serviceType}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Detailed Brief</label>
                  <p className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto pr-2">{selectedApplication.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex gap-2">
                {(['Reviewed', 'Approved', 'Declined'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => updateAppStatus(selectedApplication.id, status)}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedApplication.status === status ? 'bg-nova-500 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <button
                onClick={(e) => { handleDeleteApplication(selectedApplication.id, e); setSelectedApplication(null); }}
                className="flex items-center gap-2 text-red-500/50 hover:text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <Trash2 size={14} /> Purge Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedInquiry(null)}></div>
          <div className="relative w-full max-w-lg glass-panel rounded-[2.5rem] border border-white/10 p-10 animate-fade-in-up">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-[0.2em] mb-2 block">Electronic Inquiry Uplink</span>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">{selectedInquiry.subject}</h2>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500"><X size={20} /></button>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex justify-between items-end">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Transmission From</label>
                  <p className="text-white font-bold">{selectedInquiry.fullName}</p>
                  <p className="text-sm text-gray-400 font-mono">{selectedInquiry.email}</p>
                </div>
                <div className="text-right">
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Timestamp</label>
                  <p className="text-xs text-gray-400">{selectedInquiry.date}</p>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Message Brief</label>
                <p className="text-sm text-gray-200 leading-relaxed italic">"{selectedInquiry.message}"</p>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => updateInquiryStatus(selectedInquiry.id, 'Replied')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedInquiry.status === 'Replied' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'}`}
                >
                  Mark as Replied
                </button>
                <button
                  onClick={() => updateInquiryStatus(selectedInquiry.id, 'Archived')}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${selectedInquiry.status === 'Archived' ? 'bg-gray-700 text-white' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                >
                  Archive
                </button>
              </div>
              <button
                onClick={(e) => { handleDeleteInquiry(selectedInquiry.id, e); setSelectedInquiry(null); }}
                className="p-2 text-red-500/30 hover:text-red-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
