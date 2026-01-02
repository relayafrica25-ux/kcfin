
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
  Download,
  Lock,
  UserPlus,
  Mail,
  User,
  ShieldCheck,
  AlertCircle,
  Fingerprint,
  Terminal,
  Activity,
  Cpu,
  ShieldAlert,
  Zap,
  Radio,
  Settings,
  ShieldQuestion,
  Home,
  MessageSquare,
  Eye,
  MoreVertical,
  Layers,
  AtSign
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription } from '../types';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isScanning, setIsScanning] = useState(false);
  
  // Login State
  const [staffId, setStaffId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupStaffId, setSignupStaffId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [signupPassConfirm, setSignupPassConfirm] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'articles' | 'applications' | 'inquiries' | 'subscriptions'>('overview');
  const [articles, setArticles] = useState<Article[]>([]);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  const [newArticle, setNewArticle] = useState<Partial<Article>>({
    title: '',
    excerpt: '',
    category: 'Strategy',
    author: 'Admin',
    imageGradient: 'from-nova-500 to-purple-600'
  });

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = () => {
    setArticles(storageService.getArticles());
    setApplications(storageService.getApplications());
    setInquiries(storageService.getInquiries());
    setSubscriptions(storageService.getNewsletterSubscriptions());
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setError(null);
    
    // High-tech scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isValid = storageService.authenticateUser(staffId, loginPass);
    if (isValid) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("SYSTEM REJECTION: Unauthorized Credentials Detected.");
      setIsScanning(false);
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleBypass = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupPass !== signupPassConfirm) {
      setError("CONFLICT: Access Keys do not match.");
      return;
    }
    try {
      storageService.registerUser(signupStaffId, signupEmail, signupPass);
      setSuccess("NODE AUTHORIZED: Staff Credentials Sync Successful.");
      setTimeout(() => {
        setSuccess(null);
        setAuthMode('login');
        setStaffId(signupStaffId);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "UPLINK ERROR: Database sync failed.");
      setTimeout(() => setError(null), 4000);
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Erase this record from the neural database?')) {
      storageService.deleteArticle(id);
      setArticles(storageService.getArticles());
    }
  };

  const handleDeleteSubscription = (id: string) => {
    if (window.confirm('Remove this subscriber?')) {
      storageService.deleteNewsletterSubscription(id);
      setSubscriptions(storageService.getNewsletterSubscriptions());
    }
  };

  const handlePostArticle = (e: React.FormEvent) => {
    e.preventDefault();
    const article: Article = {
      ...(newArticle as Article),
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      readTime: '5 min read'
    };
    storageService.saveArticle(article);
    setArticles(storageService.getArticles());
    setIsArticleModalOpen(false);
    setNewArticle({ title: '', excerpt: '', category: 'Strategy', author: 'Admin', imageGradient: 'from-nova-500 to-purple-600' });
  };

  const handleUpdateStatus = (id: string, status: LoanApplication['status']) => {
    storageService.updateApplicationStatus(id, status);
    setApplications(storageService.getApplications());
    if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status });
  };

  const handleUpdateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    storageService.updateInquiryStatus(id, status);
    setInquiries(storageService.getInquiries());
    if (selectedInquiry?.id === id) setSelectedInquiry({ ...selectedInquiry, status });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#020204] flex items-center justify-center p-4 overflow-hidden relative font-sans">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nova-500/10 rounded-full blur-[150px] animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse"></div>
        </div>

        <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
          {/* Header Status Bar */}
          <div className="flex justify-between items-end px-8 mb-4">
             <div className="flex gap-2">
                <div className="h-1 w-10 bg-nova-500 rounded-full"></div>
                <div className="h-1 w-2 bg-nova-500/20 rounded-full"></div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">
                <Radio className="text-emerald-500 animate-pulse" size={12} /> Secure Tunnel Active
             </div>
          </div>

          <div className="glass-panel rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)] relative">
            
            {/* Top Back Button */}
            <button 
              onClick={onBack}
              className="absolute top-6 left-6 z-30 p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group"
            >
              <Home size={18} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>

            {/* Header / Brand Area */}
            <div className="pt-16 pb-8 text-center bg-white/[0.01] border-b border-white/5">
              <div className="relative inline-block mb-8">
                <div className="absolute inset-0 bg-nova-500 blur-2xl opacity-30"></div>
                <div className={`w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-nova-600 to-nova-400 flex items-center justify-center text-white shadow-2xl relative z-10 transition-all duration-700 ${isScanning ? 'scale-110 shadow-emerald-500/50' : 'hover:scale-105'}`}>
                   {isScanning ? <Cpu size={40} className="animate-spin" /> : <Fingerprint size={40} />}
                   {isScanning && (
                     <div className="absolute inset-0 overflow-hidden rounded-[1.5rem]">
                       <div className="w-full h-1 bg-white/40 absolute animate-scan"></div>
                     </div>
                   )}
                </div>
              </div>
              
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic italic-none">
                <span className="text-nova-400">CASIEC</span> TERMINAL
              </h1>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.6em] mt-3">Personnel Authentication</p>
            </div>

            <div className="p-10 md:p-14">
              {error && (
                <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-xs animate-shake">
                  <ShieldAlert size={20} className="flex-shrink-0" />
                  <span className="font-mono tracking-widest">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-4 text-emerald-400 text-xs">
                  <CheckCircle size={20} className="flex-shrink-0" />
                  <span className="font-mono tracking-widest">{success}</span>
                </div>
              )}

              {authMode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="block text-[9px] text-gray-500 uppercase tracking-[0.4em] font-black mb-3 ml-4">Authorized ID</label>
                      <div className="relative">
                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-nova-400 transition-colors" size={20} />
                        <input 
                          required
                          type="text" 
                          value={staffId}
                          onChange={(e) => setStaffId(e.target.value)}
                          placeholder="CS-8812"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white text-xl placeholder:text-gray-800 focus:outline-none focus:border-nova-500 focus:bg-white/[0.08] transition-all font-mono tracking-widest"
                        />
                      </div>
                    </div>
                    
                    <div className="group">
                      <label className="block text-[9px] text-gray-500 uppercase tracking-[0.4em] font-black mb-3 ml-4">Access Key</label>
                      <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-nova-400 transition-colors" size={20} />
                        <input 
                          required
                          type="password" 
                          value={loginPass}
                          onChange={(e) => setLoginPass(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-white text-xl placeholder:text-gray-800 focus:outline-none focus:border-nova-500 focus:bg-white/[0.08] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <button 
                        type="submit"
                        disabled={isScanning}
                        className="w-full relative group/btn overflow-hidden rounded-2xl"
                    >
                        <div className={`absolute inset-0 transition-all duration-700 ${isScanning ? 'bg-emerald-600' : 'bg-gradient-to-r from-nova-600 to-nova-400 group-hover/btn:scale-105'}`}></div>
                        <div className="relative py-6 flex items-center justify-center gap-4 text-white font-black uppercase tracking-[0.4em] text-[10px]">
                        {isScanning ? 'ESTABLISHING LINK...' : 'INITIATE ACCESS'} 
                        <Zap size={16} className={isScanning ? 'animate-pulse' : 'group-hover/btn:translate-x-1 transition-transform'} />
                        </div>
                    </button>

                    <button 
                        type="button"
                        onClick={handleBypass}
                        disabled={isScanning}
                        className="w-full py-5 rounded-2xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-2"
                    >
                        <Layers size={16} /> Open Now (Demo Mode)
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('signup')}
                      className="text-gray-600 hover:text-nova-400 text-[10px] uppercase tracking-widest font-black transition-all flex items-center gap-2 mx-auto pb-1 border-b border-transparent hover:border-nova-500/30"
                    >
                      Provision New Operator
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                       <label className="block text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 ml-4">Full Identity</label>
                       <input 
                        required
                        type="text" 
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Operator Name"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-medium"
                      />
                    </div>
                    <div>
                       <label className="block text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 ml-4">Personnel ID</label>
                       <input 
                        required
                        type="text" 
                        value={signupStaffId}
                        onChange={(e) => setSignupStaffId(e.target.value)}
                        placeholder="CS-XXXX"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm font-mono"
                      />
                    </div>
                    <div>
                       <label className="block text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 ml-4">Internal Mail</label>
                       <input 
                        required
                        type="email" 
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="staff@casiec.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                       <label className="block text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 ml-4">Access Key</label>
                       <input 
                        required
                        type="password" 
                        value={signupPass}
                        onChange={(e) => setSignupPass(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                       <label className="block text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black mb-2 ml-4">Verify Key</label>
                       <input 
                        required
                        type="password" 
                        value={signupPassConfirm}
                        onChange={(e) => setSignupPassConfirm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-nova-900 hover:bg-nova-100 font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-[10px] mt-6"
                  >
                    Authorize Provisioning <ChevronRight size={18} />
                  </button>

                  <div className="text-center mt-4">
                    <button 
                      type="button" 
                      onClick={() => setAuthMode('login')}
                      className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest font-black transition-colors"
                    >
                      Already Provisioned? Terminal Login
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="px-10 py-5 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-gray-700 uppercase tracking-widest">
                <div className="flex items-center gap-2"><Cpu size={10} /> Node: ALPHA-TERMINAL</div>
                <div className="flex items-center gap-2"><Terminal size={10} /> Encryption: AES-256</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-nova-500 font-sans">
      {/* Sidebar Nav */}
      <div className="fixed left-0 top-0 h-full w-64 bg-nova-900 border-r border-white/5 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-12 text-nova-400 px-2">
          <div className="bg-nova-500 p-2 rounded-lg shadow-lg shadow-nova-500/20">
            <LayoutDashboard size={24} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tighter uppercase italic">Control_Center</span>
        </div>

        <nav className="space-y-1 flex-grow">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'overview' ? 'bg-nova-500 text-white shadow-xl shadow-nova-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <TrendingUp size={20} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'applications' ? 'bg-nova-500 text-white shadow-xl shadow-nova-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> Applications
            {applications.filter(a => a.status === 'Pending').length > 0 && (
              <span className="ml-auto bg-red-500 text-[10px] px-2 py-0.5 rounded-full text-white font-black">{applications.filter(a => a.status === 'Pending').length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('inquiries')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'inquiries' ? 'bg-nova-500 text-white shadow-xl shadow-nova-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare size={20} /> Inquiries
            {inquiries.filter(i => i.status === 'Unread').length > 0 && (
              <span className="ml-auto bg-purple-500 text-[10px] px-2 py-0.5 rounded-full text-white font-black">{inquiries.filter(i => i.status === 'Unread').length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('subscriptions')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'subscriptions' ? 'bg-nova-500 text-white shadow-xl shadow-nova-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <AtSign size={20} /> Subscriptions
            {subscriptions.length > 0 && (
              <span className="ml-auto bg-nova-accent text-[10px] px-2 py-0.5 rounded-full text-white font-black">{subscriptions.length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('articles')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === 'articles' ? 'bg-nova-500 text-white shadow-xl shadow-nova-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <FileText size={20} /> Articles
          </button>
        </nav>

        <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500/70 hover:text-red-400 transition-colors text-xs font-black uppercase tracking-widest"
          >
            <XCircle size={16} /> Sign Out
          </button>

          <button 
            onClick={onBack} 
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Exit Terminal
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-64 p-12">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">System Analytics</h1>
                <p className="text-gray-500 font-mono text-sm">Real-time throughput & performance metrics.</p>
              </div>
              <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Global Uptime</p>
                  <p className="text-emerald-400 font-mono font-bold">99.998%</p>
                </div>
                <Activity className="text-emerald-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="group glass-panel p-8 rounded-3xl border border-white/5 hover:border-nova-500/30 transition-all duration-500">
                <p className="text-gray-500 text-[9px] mb-2 uppercase tracking-[0.2em] font-black">Capital Inquiries</p>
                <h3 className="text-5xl font-black text-white group-hover:text-nova-400 transition-colors">{applications.length}</h3>
              </div>
              <div className="group glass-panel p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                <p className="text-gray-500 text-[9px] mb-2 uppercase tracking-[0.2em] font-black">Quick Contacts</p>
                <h3 className="text-5xl font-black text-white group-hover:text-purple-400 transition-colors">{inquiries.length}</h3>
              </div>
              <div className="group glass-panel p-8 rounded-3xl border border-white/5 hover:border-nova-accent/30 transition-all duration-500">
                <p className="text-gray-500 text-[9px] mb-2 uppercase tracking-[0.2em] font-black">Subscribers</p>
                <h3 className="text-5xl font-black text-white group-hover:text-nova-accent transition-colors">{subscriptions.length}</h3>
              </div>
              <div className="group glass-panel p-8 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500">
                <p className="text-gray-500 text-[9px] mb-2 uppercase tracking-[0.2em] font-black">Node Health</p>
                <h3 className="text-5xl font-black text-white group-hover:text-emerald-400 transition-colors">Optimal</h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-panel rounded-[3rem] border border-white/5 p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black flex items-center gap-4 uppercase italic">
                        <Zap className="text-nova-400" size={24} /> Deal Stream
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {applications.slice(0, 4).map(app => (
                        <div key={app.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nova-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-xl group-hover:scale-110 transition-transform">
                                {app.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-100 group-hover:text-white transition-colors">{app.businessName}</p>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mt-1">{app.loanType || app.serviceType}</p>
                            </div>
                            </div>
                            <ChevronRight className="text-gray-700 group-hover:text-nova-400 transition-colors" size={18} />
                        </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel rounded-[3rem] border border-white/5 p-10">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-black flex items-center gap-4 uppercase italic">
                        <MessageSquare className="text-purple-400" size={24} /> Recent Inquiries
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {inquiries.slice(0, 4).map(inq => (
                        <div key={inq.id} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all cursor-pointer group">
                            <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform">
                                {inq.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-100 group-hover:text-white transition-colors">{inq.fullName}</p>
                                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black mt-1 line-clamp-1">{inq.subject}</p>
                            </div>
                            </div>
                            <ChevronRight className="text-gray-700 group-hover:text-purple-400 transition-colors" size={18} />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* APPLICATIONS TAB */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Deal Pipeline</h1>
                <p className="text-gray-500 font-mono text-sm">Review incoming capital and support requests.</p>
              </div>
              <button className="flex items-center gap-3 px-6 py-3.5 bg-white text-black hover:bg-gray-200 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl">
                <Download size={18} /> Data Dump
              </button>
            </div>

            <div className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
                  <tr>
                    <th className="px-10 py-6">Timestamp</th>
                    <th className="px-10 py-6">Entity</th>
                    <th className="px-10 py-6">Facility</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6 text-[10px] text-gray-500 font-mono">{app.date}</td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-gray-100 group-hover:text-white transition-colors">{app.businessName}</div>
                        <div className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">{app.fullName}</div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[9px] font-black text-nova-400 uppercase tracking-[0.2em]">{app.loanType || app.serviceType}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                            app.status === 'Approved' ? 'text-emerald-400' :
                            app.status === 'Declined' ? 'text-red-400' :
                            'text-orange-400'
                        }`}>
                            {app.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-3 bg-white/5 hover:bg-nova-500 hover:text-white rounded-xl text-gray-500 transition-all border border-transparent hover:border-white/10"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && <div className="p-32 text-center text-gray-600 uppercase tracking-[0.3em] font-mono text-xs">Null records detected.</div>}
            </div>
          </div>
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Message Grid</h1>
                <p className="text-gray-500 font-mono text-sm">Direct communications from corporate prospects.</p>
              </div>
            </div>

            <div className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
                  <tr>
                    <th className="px-10 py-6">Date</th>
                    <th className="px-10 py-6">Sender</th>
                    <th className="px-10 py-6">Subject</th>
                    <th className="px-10 py-6">Status</th>
                    <th className="px-10 py-6 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6 text-[10px] text-gray-500 font-mono">{inq.date}</td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-gray-100 group-hover:text-white transition-colors">{inq.fullName}</div>
                        <div className="text-[9px] text-gray-600 uppercase tracking-widest mt-1">{inq.email}</div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-[10px] text-gray-300 line-clamp-1">{inq.subject}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${
                            inq.status === 'Unread' ? 'text-purple-400' :
                            inq.status === 'Replied' ? 'text-emerald-400' :
                            'text-gray-500'
                        }`}>
                            {inq.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => setSelectedInquiry(inq)}
                          className="p-3 bg-white/5 hover:bg-purple-500 hover:text-white rounded-xl text-gray-500 transition-all border border-transparent hover:border-white/10"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inquiries.length === 0 && <div className="p-32 text-center text-gray-600 uppercase tracking-[0.3em] font-mono text-xs">Inbox clear.</div>}
            </div>
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Subscriber List</h1>
                <p className="text-gray-500 font-mono text-sm">Newsletter mailing list synchronization.</p>
              </div>
              <button className="flex items-center gap-3 px-6 py-3.5 bg-white text-black hover:bg-gray-200 rounded-2xl transition-all text-xs font-black uppercase tracking-widest shadow-xl">
                <Download size={18} /> Export List
              </button>
            </div>

            <div className="glass-panel rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-[0.3em] font-black">
                  <tr>
                    <th className="px-10 py-6">Sub_Date</th>
                    <th className="px-10 py-6">Email_Address</th>
                    <th className="px-10 py-6 text-right">Purge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-10 py-6 text-[10px] text-gray-500 font-mono">{sub.date}</td>
                      <td className="px-10 py-6">
                        <div className="font-bold text-gray-100 group-hover:text-nova-accent transition-colors">{sub.email}</div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => handleDeleteSubscription(sub.id)}
                          className="p-3 text-red-500/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscriptions.length === 0 && <div className="p-32 text-center text-gray-600 uppercase tracking-[0.3em] font-mono text-xs">No active subscribers.</div>}
            </div>
          </div>
        )}

        {/* ARTICLES TAB */}
        {activeTab === 'articles' && (
          <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Insight Injection</h1>
                <p className="text-gray-500 font-mono text-sm">Push corporate wisdom to the live grid.</p>
              </div>
              <button 
                onClick={() => setIsArticleModalOpen(true)}
                className="flex items-center gap-3 px-8 py-4 bg-nova-500 hover:bg-nova-400 rounded-2xl transition-all font-black text-sm shadow-2xl shadow-nova-500/30 uppercase tracking-widest"
              >
                <Plus size={24} /> New Insight
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="group bg-white/5 border border-white/5 rounded-[3rem] p-8 flex flex-col hover:border-nova-500/40 transition-all duration-500 hover:translate-y-[-5px]">
                   <div className={`h-40 rounded-2xl bg-gradient-to-br ${article.imageGradient} mb-6 relative overflow-hidden shadow-2xl`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                   </div>
                   <h3 className="font-bold text-xl mb-3 text-gray-100 group-hover:text-white transition-colors tracking-tight leading-tight">{article.title}</h3>
                   <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">{article.excerpt}</p>
                   <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5">
                      <span className="text-[10px] text-nova-400 font-black uppercase tracking-[0.2em] bg-nova-500/10 px-3 py-1.5 rounded-lg">{article.category}</span>
                      <button 
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-2 text-red-500/50 hover:text-white hover:bg-red-500 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-nova-900 border border-white/10 rounded-[4rem] w-full max-w-2xl overflow-hidden shadow-2xl relative animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Deal_Analysis_Terminal</h3>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-600 hover:text-white"><XCircle size={24} /></button>
            </div>
            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Corporate Entity</p>
                  <p className="font-bold text-xl text-white">{selectedApp.businessName}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Facility Required</p>
                  <p className="font-bold text-xl text-nova-400 uppercase tracking-tighter">{selectedApp.loanType || selectedApp.serviceType}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Authorized Officer</p>
                  <p className="text-white font-bold">{selectedApp.fullName} ({selectedApp.role})</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-1">Uplink Hub</p>
                  <p className="text-gray-400 text-xs font-mono">{selectedApp.email}</p>
                  <p className="text-gray-400 text-xs font-mono">{selectedApp.phone}</p>
                </div>
              </div>
              
              <div className="mb-10 p-6 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-3">Context Log</p>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{selectedApp.description || 'No additional narrative provided.'}"</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => handleUpdateStatus(selectedApp.id, 'Approved')}
                  className="flex-grow py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-emerald-600/20"
                >
                  Commit Approval
                </button>
                <button 
                   onClick={() => handleUpdateStatus(selectedApp.id, 'Declined')}
                   className="flex-grow py-5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                >
                  Reject Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <div className="bg-nova-900 border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">Inquiry_Decrypt</h3>
                <button onClick={() => setSelectedInquiry(null)} className="p-2 hover:bg-white/10 rounded-full text-gray-600 hover:text-white transition-colors"><XCircle size={24} /></button>
            </div>
            <div className="p-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-purple-500/10 text-purple-400 flex items-center justify-center rounded-2xl font-black text-xl">
                        {selectedInquiry.fullName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-white">{selectedInquiry.fullName}</h4>
                        <p className="text-xs text-gray-500 font-mono tracking-tighter">{selectedInquiry.email}</p>
                    </div>
                </div>

                <div className="space-y-6 mb-10">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-black mb-1">Subject Vector</p>
                        <p className="text-white font-bold text-lg">{selectedInquiry.subject}</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] font-black mb-1">Message Payload</p>
                        <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5">{selectedInquiry.message}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'Replied')}
                        className="flex-grow py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                    >
                        Mark as Handled
                    </button>
                    <button 
                        onClick={() => handleUpdateInquiryStatus(selectedInquiry.id, 'Archived')}
                        className="flex-grow py-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                    >
                        Archive
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Article Posting Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
          <form onSubmit={handlePostArticle} className="bg-nova-900 border border-white/10 rounded-[4rem] w-full max-w-xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-10 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic tracking-tighter">Insight_Injection</h3>
              <button type="button" onClick={() => setIsArticleModalOpen(false)} className="text-gray-600 hover:text-white transition-colors"><XCircle size={24} /></button>
            </div>
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Headline</label>
                <input 
                  required
                  type="text" 
                  value={newArticle.title}
                  onChange={e => setNewArticle({...newArticle, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-nova-500 transition-all font-bold"
                  placeholder="Neural Core Analysis..."
                />
              </div>
              <div>
                <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Digest Summary</label>
                <textarea 
                  required
                  value={newArticle.excerpt}
                  onChange={e => setNewArticle({...newArticle, excerpt: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 h-32 text-white focus:outline-none focus:border-nova-500 transition-all text-sm leading-relaxed resize-none"
                  placeholder="Compressing insight..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Vector</label>
                  <select 
                    value={newArticle.category}
                    onChange={e => setNewArticle({...newArticle, category: e.target.value})}
                    className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none appearance-none font-bold text-sm"
                  >
                    <option value="Strategy">Strategy</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Eco-Finance">Eco-Finance</option>
                    <option value="Guide">Guide</option>
                    <option value="Tech">Tech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] text-gray-500 uppercase font-black tracking-[0.3em] mb-2 ml-4">Neural Theme</label>
                  <select 
                     value={newArticle.imageGradient}
                     onChange={e => setNewArticle({...newArticle, imageGradient: e.target.value})}
                     className="w-full bg-nova-800 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none appearance-none font-bold text-sm"
                  >
                    <option value="from-nova-500 to-purple-600">Cyber_Pulse</option>
                    <option value="from-emerald-600 to-teal-500">Growth_Bio</option>
                    <option value="from-orange-500 to-red-600">Market_Heat</option>
                    <option value="from-gray-700 to-black">Void_Terminal</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-nova-600 to-purple-600 text-white font-black rounded-3xl transition-all shadow-2xl shadow-nova-500/30 uppercase tracking-[0.4em] text-[10px]"
              >
                Broadcast Insight
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
