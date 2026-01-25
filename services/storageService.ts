import axios from 'axios';
import { Article, LoanApplication, ContactInquiry, NewsletterSubscription, TickerItem, CarouselItem, TeamMember } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
  }
];

const INITIAL_BREAKING_NEWS: TickerItem[] = [
  { id: 'bn1', text: "CASIEC FINANCIALS AUTHORIZES ₦2.5B IN NEW NMSE CREDIT FACILITIES.", category: 'Urgent', isManual: true },
  { id: 'bn2', text: "BROASTREET DyDX ANNOUNCES STRATEGIC PARTNERSHIP WITH PAN-AFRICAN LOGISTICS GIANT.", category: 'Corporate', isManual: true },
  { id: 'bn3', text: "MARKET ALERT: NIGERIAN FINTECH SECTOR SEES 15% INCREASE IN Q1 VENTURE INFLOW.", category: 'Market', isManual: true },
  { id: 'bn4', text: "CASIEC SECURES INSTITUTIONAL DEBENTURE FOR INFRASTRUCTURE BRIDGE FUNDING.", category: 'Corporate', isManual: true }
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
  }
];

export const storageService = {
  // Articles
  getArticles: async (): Promise<Article[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/article`);
      return response.data.map((item: any) => ({
        id: item.id,
        title: item.headline,
        excerpt: item.summary,
        category: item.category,
        readTime: item.readTime || '5 min read',
        author: item.author || 'CASIEC Editorial',
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        imageGradient: item.imageGradient || 'from-gray-900 to-black',
        imageUrl: item.image,
        content: item.content
      }));
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return [];
    }
  },

  saveArticle: async (article: Article) => {
    const payload = {
      headline: article.title,
      summary: article.excerpt,
      category: article.category,
      image: article.imageUrl,
      readTime: article.readTime,
      author: article.author,
      imageGradient: article.imageGradient,
      content: article.content
    };
    try {
      if (article.id && !article.id.startsWith('temp-')) {
        await axios.patch(`${API_BASE_URL}/article/${article.id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/article`, payload);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/article/${id}`);
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error;
    }
  },

  // Team Members
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/team`);
      if (response.data.length === 0) return INITIAL_TEAM;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      return INITIAL_TEAM;
    }
  },

  saveTeamMember: async (member: TeamMember) => {
    try {
      if (member.id && !member.id.startsWith('temp-')) {
        await axios.patch(`${API_BASE_URL}/team/${member.id}`, member);
      } else {
        const { id, ...payload } = member;
        await axios.post(`${API_BASE_URL}/team`, payload);
      }
    } catch (error) {
      console.error('Failed to save team member:', error);
      throw error;
    }
  },

  deleteTeamMember: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/team/${id}`);
    } catch (error) {
      console.error('Failed to delete team member:', error);
      throw error;
    }
  },

  // Carousel
  getCarouselItems: async (): Promise<CarouselItem[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carousel`);
      if (response.data.length === 0) return INITIAL_CAROUSEL;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch carousel items:', error);
      return INITIAL_CAROUSEL;
    }
  },

  saveCarouselItem: async (item: CarouselItem) => {
    try {
      if (item.id && !item.id.startsWith('temp-')) {
        await axios.patch(`${API_BASE_URL}/carousel/${item.id}`, item);
      } else {
        const { id, ...payload } = item;
        await axios.post(`${API_BASE_URL}/carousel`, payload);
      }
    } catch (error) {
      console.error('Failed to save carousel item:', error);
      throw error;
    }
  },

  deleteCarouselItem: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/carousel/${id}`);
    } catch (error) {
      console.error('Failed to delete carousel item:', error);
      throw error;
    }
  },

  // Applications
  getApplications: async (): Promise<LoanApplication[]> => {
    try {
      const [financeRes, supportRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/finance`),
        axios.get(`${API_BASE_URL}/support`)
      ]);

      const financeApps = financeRes.data.map((app: any) => ({
        id: app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        type: 'financial',
        loanType: app.financialProduct,
        businessName: app.businessName,
        cacNumber: app.regNumber,
        industry: app.industryFocus,
        fullName: app.fullName,
        role: app.designatedRole,
        email: app.email,
        phone: app.phone,
        description: app.requirement,
        status: app.status || 'Pending'
      }));

      const supportApps = supportRes.data.map((app: any) => ({
        id: app.id,
        date: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        type: 'business_support',
        serviceType: app.advisoryPillars,
        businessName: app.businessName,
        cacNumber: app.regNumber,
        industry: app.industryFocus,
        fullName: app.fullName,
        role: app.designatedRole,
        email: app.email,
        phone: app.phone,
        description: app.requirement,
        status: app.status || 'Pending'
      }));

      return [...financeApps, ...supportApps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      return [];
    }
  },

  saveApplication: async (app: LoanApplication) => {
    const endpoint = app.type === 'financial' ? 'finance' : 'support';
    const payload = {
      fullName: app.fullName,
      email: app.email,
      phone: app.phone,
      designatedRole: app.role,
      businessName: app.businessName,
      isRegistered: app.cacNumber ? true : false,
      regNumber: app.cacNumber,
      industryFocus: app.industry,
      requirement: app.description,
      [app.type === 'financial' ? 'financialProduct' : 'advisoryPillars']: app.loanType || app.serviceType
    };
    try {
      await axios.post(`${API_BASE_URL}/${endpoint}`, payload);
    } catch (error) {
      console.error(`Failed to save ${app.type} application:`, error);
      throw error;
    }
  },

  updateApplicationStatus: async (id: string, status: LoanApplication['status']) => {
    // We determine the correct endpoint by fetching the application first or by convention
    // Since we don't have a single "application" table in backend yet, we might need to try both or add it.
    // For now, let's assume we can try to patch both or add a generic application module.
    try {
      // Try finance first
      await axios.patch(`${API_BASE_URL}/finance/${id}`, { status });
    } catch (e) {
      try {
        // Try support if finance fails
        await axios.patch(`${API_BASE_URL}/support/${id}`, { status });
      } catch (err) {
        console.error('Failed to update application status:', err);
      }
    }
  },

  deleteApplication: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/finance/${id}`);
    } catch (e) {
      try {
        await axios.delete(`${API_BASE_URL}/support/${id}`);
      } catch (err) {
        console.error('Failed to delete application:', err);
      }
    }
  },

  // Inquiries
  getInquiries: async (): Promise<ContactInquiry[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact`);
      return response.data.map((item: any) => ({
        id: item.id,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        fullName: item.fullName || 'Anonymous',
        email: item.email,
        subject: item.subject || 'Newsletter/General',
        message: item.message || 'No message provided',
        status: item.status || 'Unread'
      }));
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      return [];
    }
  },

  saveInquiry: async (inquiry: ContactInquiry) => {
    try {
      await axios.post(`${API_BASE_URL}/contact`, {
        email: inquiry.email,
        fullName: inquiry.fullName,
        subject: inquiry.subject,
        message: inquiry.message
      });
    } catch (error) {
      console.error('Failed to save inquiry:', error);
      throw error;
    }
  },

  updateInquiryStatus: async (id: string, status: ContactInquiry['status']) => {
    try {
      await axios.patch(`${API_BASE_URL}/contact/${id}`, { status });
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/contact/${id}`);
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  },

  // Ticker Management (Breaking News)
  getManualTickerItems: async (): Promise<TickerItem[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ticker`);
      if (response.data.length === 0) return INITIAL_BREAKING_NEWS;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ticker items:', error);
      return INITIAL_BREAKING_NEWS;
    }
  },

  saveTickerItem: async (item: TickerItem) => {
    try {
      await axios.post(`${API_BASE_URL}/ticker`, {
        text: item.text,
        category: item.category,
        isManual: item.isManual
      });
    } catch (error) {
      console.error('Failed to save ticker item:', error);
      throw error;
    }
  },

  deleteTickerItem: async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/ticker/${id}`);
    } catch (error) {
      console.error('Failed to delete ticker item:', error);
      throw error;
    }
  },

  // Newsletter Subscriptions
  getNewsletterSubscriptions: async (): Promise<NewsletterSubscription[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contact`);
      // Filter for newsletter-style inquiries or create a separate endpoint in future
      return response.data.filter((i: any) => !i.subject);
    } catch (error) {
      console.error('Failed to fetch newsletter subscriptions:', error);
      return [];
    }
  },

  saveNewsletterSubscription: async (email: string): Promise<{ success: boolean; message?: string; statusCode?: number }> => {
    try {
      await axios.post(`${API_BASE_URL}/contact`, { email: email.toLowerCase() });
      return { success: true };
    } catch (error) {
      console.error('Failed to save newsletter subscription:', error);
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.message || 'Failed to subscribe';
        return { success: false, message, statusCode };
      }
      return { success: false, message: 'An unexpected error occurred' };
    }
  },

  // Auth
  loginStep1: async (emailOrUsername: string, password: string) => {
    console.log(emailOrUsername, password);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: emailOrUsername,
        password: password
      });
      // Backend returns message and email if successful
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Login Step 1 failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, message: error.response.data.message || 'Authentication failed' };
      }
      return { success: false, message: 'Institutional link Failure' };
    }
  },

  verify2FA: async (email: string, code: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-2fa`, {
        email: email.toLowerCase(),
        code: code
      });

      if (response.data.access_token) {
        localStorage.setItem('casiec_token', response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, message: 'Invalid Verification response' };
    } catch (error) {
      console.error('2FA verification failed:', error);
      if (axios.isAxiosError(error) && error.response) {
        return { success: false, message: error.response.data.message || 'Verification failed' };
      }
      return { success: false, message: 'Link synchronization error' };
    }
  }
};

