
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem, CarouselItem, TeamMember } from '../types';

const ARTICLES_KEY = 'casiec_articles';
const APPLICATIONS_KEY = 'casiec_applications';
const INQUIRIES_KEY = 'casiec_inquiries';
const NEWSLETTER_KEY = 'casiec_newsletter';
const TICKER_KEY = 'casiec_ticker_manual';
const USERS_KEY = 'casiec_admin_users';
const CAROUSEL_KEY = 'casiec_carousel_items';
const TEAM_KEY = 'casiec_team_members';

const INITIAL_TEAM: TeamMember[] = [
  {
    id: '1',
    name: "Dr. Adebayo Ogunlesi",
    role: "Managing Director / CEO",
    bio: "Visionary leader with 20+ years in investment banking and structured finance across emerging markets. Architect of the CASIEC institutional framework.",
    imageGradient: "from-blue-600 to-indigo-900",
    specialization: "Strategic Leadership",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "ceo@casiec.com"
  },
  {
    id: '2',
    name: "Sarah Jenkins",
    role: "Chief Financial Officer",
    bio: "Expert in mezzanine financing and corporate treasury management with a focus on institutional risk assessment and capital mapping.",
    imageGradient: "from-purple-600 to-nova-500",
    specialization: "Corporate Finance",
    linkedin: "https://linkedin.com",
    email: "cfo@casiec.com"
  },
  {
    id: '3',
    name: "Chidi Okafor",
    role: "Head of Business Support",
    bio: "Specialist in supply chain optimization and strategic outsourcing. Driving enterprise sustainability for NMSE growth across Africa.",
    imageGradient: "from-emerald-600 to-teal-900",
    specialization: "Operations & GSI",
    linkedin: "https://linkedin.com",
    email: "ops@casiec.com"
  },
  {
    id: '4',
    name: "Elena Rodriguez",
    role: "Director of Wealth Advisory",
    bio: "Architecting bespoke wealth preservation strategies for high-net-worth family offices and institutional capital partners.",
    imageGradient: "from-amber-500 to-orange-700",
    specialization: "Wealth Management",
    linkedin: "https://linkedin.com",
    email: "wealth@casiec.com"
  }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: "The Architecture of Capital: Structuring Debt for Growth",
    excerpt: "Why standard term loans aren't always the answer. Explore how mezzanine financing and structured equity can accelerate your expansion.",
    category: "Strategy",
    readTime: "8 min read",
    author: "Sarah Jenkins, CFO",
    date: new Date().toLocaleDateString(),
    imageGradient: "from-purple-600 to-blue-600",
  }
];

const INITIAL_CAROUSEL: CarouselItem[] = [
  {
    id: 'adv-1',
    type: 'advert',
    title: "Expansion Capital Phase II",
    summary: "Fueling the next generation of African retail giants with structured credit facilities up to ₦500M.",
    tag: "Active Campaign",
    linkText: "Learn More",
    imageGradient: "from-nova-500 via-indigo-600 to-purple-800",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
    statLabel: "Interest Rate",
    statValue: "9.5% Fixed"
  },
  {
    id: 'adv-2',
    type: 'advert',
    title: "Real Estate Bridge Facilities",
    summary: "Close on prime property in as little as 5 days. Our bridge loans bridge the gap to your permanent financing.",
    tag: "Real Estate",
    linkText: "Check Terms",
    imageGradient: "from-blue-600 via-cyan-500 to-nova-accent",
    imageUrl: "https://images.unsplash.com/photo-1582408921715-18e7806365c1?auto=format&fit=crop&q=80&w=1200",
    statLabel: "Approval",
    statValue: "24-48 Hours"
  },
  {
    id: 'adv-3',
    type: 'advert',
    title: "Global Supply Chain Credit",
    summary: "Leverage your inventory to unlock liquid capital for cross-border commodity trading and distribution.",
    tag: "Global Trade",
    linkText: "View Program",
    imageGradient: "from-emerald-600 via-teal-500 to-emerald-900",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200",
    statLabel: "Leverage",
    statValue: "Up to 85% LTC"
  }
];

export const storageService = {
  // Articles
  getArticles: (): Article[] => {
    const saved = localStorage.getItem(ARTICLES_KEY);
    if (!saved) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(INITIAL_ARTICLES));
      return INITIAL_ARTICLES;
    }
    return JSON.parse(saved);
  },

  saveArticle: (article: Article) => {
    const articles = storageService.getArticles();
    const existingIndex = articles.findIndex(a => a.id === article.id);
    if (existingIndex > -1) {
      articles[existingIndex] = article;
    } else {
      articles.unshift(article);
    }
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  },

  deleteArticle: (id: string) => {
    const articles = storageService.getArticles().filter(a => a.id !== id);
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  },

  // Team Members
  getTeamMembers: (): TeamMember[] => {
    const saved = localStorage.getItem(TEAM_KEY);
    if (!saved) {
      localStorage.setItem(TEAM_KEY, JSON.stringify(INITIAL_TEAM));
      return INITIAL_TEAM;
    }
    return JSON.parse(saved);
  },

  saveTeamMember: (member: TeamMember) => {
    const members = storageService.getTeamMembers();
    const existingIndex = members.findIndex(m => m.id === member.id);
    if (existingIndex > -1) {
      members[existingIndex] = member;
    } else {
      members.push(member);
    }
    localStorage.setItem(TEAM_KEY, JSON.stringify(members));
  },

  deleteTeamMember: (id: string) => {
    const members = storageService.getTeamMembers().filter(m => m.id !== id);
    localStorage.setItem(TEAM_KEY, JSON.stringify(members));
  },

  // Carousel
  getCarouselItems: (): CarouselItem[] => {
    const saved = localStorage.getItem(CAROUSEL_KEY);
    if (!saved) {
      localStorage.setItem(CAROUSEL_KEY, JSON.stringify(INITIAL_CAROUSEL));
      return INITIAL_CAROUSEL;
    }
    return JSON.parse(saved);
  },

  saveCarouselItem: (item: CarouselItem) => {
    const items = storageService.getCarouselItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex > -1) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    localStorage.setItem(CAROUSEL_KEY, JSON.stringify(items));
  },

  deleteCarouselItem: (id: string) => {
    const items = storageService.getCarouselItems().filter(i => i.id !== id);
    localStorage.setItem(CAROUSEL_KEY, JSON.stringify(items));
  },

  // Applications
  getApplications: (): LoanApplication[] => {
    const saved = localStorage.getItem(APPLICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveApplication: (app: LoanApplication) => {
    const apps = storageService.getApplications();
    apps.unshift(app);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  },

  updateApplicationStatus: (id: string, status: LoanApplication['status']) => {
    const apps = storageService.getApplications();
    const app = apps.find(a => a.id === id);
    if (app) {
      app.status = status;
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    }
  },

  deleteApplication: (id: string) => {
    const apps = storageService.getApplications().filter(a => a.id !== id);
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  },

  // Inquiries
  getInquiries: (): ContactInquiry[] => {
    const saved = localStorage.getItem(INQUIRIES_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveInquiry: (inquiry: ContactInquiry) => {
    const inquiries = storageService.getInquiries();
    inquiries.unshift(inquiry);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  },

  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => {
    const inquiries = storageService.getInquiries();
    const inquiry = inquiries.find(i => i.id === id);
    if (inquiry) {
      inquiry.status = status;
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
    }
  },

  deleteInquiry: (id: string) => {
    const inquiries = storageService.getInquiries().filter(i => i.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  },

  // Ticker Management
  getManualTickerItems: (): TickerItem[] => {
    const saved = localStorage.getItem(TICKER_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveTickerItem: (item: TickerItem) => {
    const items = storageService.getManualTickerItems();
    items.unshift(item);
    localStorage.setItem(TICKER_KEY, JSON.stringify(items));
  },

  deleteTickerItem: (id: string) => {
    const items = storageService.getManualTickerItems().filter(i => i.id !== id);
    localStorage.setItem(TICKER_KEY, JSON.stringify(items));
  },

  // Newsletter Subscriptions
  getNewsletterSubscriptions: (): NewsletterSubscription[] => {
    const saved = localStorage.getItem(NEWSLETTER_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  saveNewsletterSubscription: (email: string) => {
    const subs = storageService.getNewsletterSubscriptions();
    if (subs.find(s => s.email.toLowerCase() === email.toLowerCase())) return;
    
    const newSub: NewsletterSubscription = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      date: new Date().toLocaleString()
    };
    subs.unshift(newSub);
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
  },

  deleteNewsletterSubscription: (id: string) => {
    const subs = storageService.getNewsletterSubscriptions().filter(s => s.id !== id);
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
  },

  // Admin Users
  getUsers: () => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  registerUser: (username: string, email: string, password: string) => {
    const users = storageService.getUsers();
    if (users.find((u: any) => u.email === email || u.username === username)) {
      throw new Error("User already exists");
    }
    users.push({ username, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  authenticateUser: (emailOrUsername: string, password: string) => {
    const users = storageService.getUsers();
    if (emailOrUsername === 'admin' && password === 'admin') return true;
    
    return users.some((u: any) => 
      (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );
  }
};
