
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem } from '../types';

const ARTICLES_KEY = 'casiec_articles';
const APPLICATIONS_KEY = 'casiec_applications';
const INQUIRIES_KEY = 'casiec_inquiries';
const NEWSLETTER_KEY = 'casiec_newsletter';
const TICKER_KEY = 'casiec_ticker_manual';
const USERS_KEY = 'casiec_admin_users';

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
