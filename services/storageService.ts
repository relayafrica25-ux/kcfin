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

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('casiec_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('casiec_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await api.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });

        const { access_token } = response.data;
        localStorage.setItem('casiec_token', access_token);

        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        processQueue(null, access_token);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // Clear tokens and redirect to login
        localStorage.removeItem('casiec_token');
        localStorage.removeItem('casiec_refresh_token');
        window.location.hash = 'home';

        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

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
      const response = await api.get(`${API_BASE_URL}/article`);
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

  saveArticle: async (article: Article, file?: File | null) => {
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
        await api.patch(`${API_BASE_URL}/article/${article.id}`, payload);
      } else {
        if (file) {
          const formData = new FormData();
          formData.append('headline', article.title);
          formData.append('summary', article.excerpt);
          formData.append('category', article.category);
          formData.append('readTime', article.readTime);
          formData.append('author', article.author);
          formData.append('imageGradient', article.imageGradient);
          if (article.content) formData.append('content', article.content);
          formData.append('image', file);
          await api.post(`${API_BASE_URL}/article`, formData);
        } else {
          await api.post(`${API_BASE_URL}/article`, payload);
        }
      }
    } catch (error) {
      console.error('Failed to save article:', error);
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/article/${id}`);
    } catch (error) {
      console.error('Failed to delete article:', error);
      throw error;
    }
  },

  // Team Members
  getTeamMembers: async (): Promise<TeamMember[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/team`);
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
        await api.patch(`${API_BASE_URL}/team/${member.id}`, member);
      } else {
        const { id, ...payload } = member;
        await api.post(`${API_BASE_URL}/team`, payload);
      }
    } catch (error) {
      console.error('Failed to save team member:', error);
      throw error;
    }
  },

  deleteTeamMember: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/team/${id}`);
    } catch (error) {
      console.error('Failed to delete team member:', error);
      throw error;
    }
  },

  // Carousel
  getCarouselItems: async (): Promise<CarouselItem[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/carousel`);
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
        await api.patch(`${API_BASE_URL}/carousel/${item.id}`, item);
      } else {
        const { id, ...payload } = item;
        await api.post(`${API_BASE_URL}/carousel`, payload);
      }
    } catch (error) {
      console.error('Failed to save carousel item:', error);
      throw error;
    }
  },

  deleteCarouselItem: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/carousel/${id}`);
    } catch (error) {
      console.error('Failed to delete carousel item:', error);
      throw error;
    }
  },

  // Applications
  getApplications: async (): Promise<LoanApplication[]> => {
    try {
      const [financeRes, supportRes] = await Promise.all([
        api.get(`${API_BASE_URL}/finance`),
        api.get(`${API_BASE_URL}/support`)
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
      await api.post(`${API_BASE_URL}/${endpoint}`, payload);
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
      // Try finance first - send status in lowercase
      await api.patch(`${API_BASE_URL}/finance/${id}`, { status: status.toLowerCase() });
    } catch (e) {
      try {
        // Try support if finance fails - send status in lowercase
        await api.patch(`${API_BASE_URL}/support/${id}`, { status: status.toLowerCase() });
      } catch (err) {
        console.error('Failed to update application status:', err);
      }
    }
  },

  deleteApplication: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/finance/${id}`);
    } catch (e) {
      try {
        await api.delete(`${API_BASE_URL}/support/${id}`);
      } catch (err) {
        console.error('Failed to delete application:', err);
      }
    }
  },

  // Inquiries
  getInquiries: async (): Promise<ContactInquiry[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/contact`);
      return response.data.map((item: any) => ({
        id: item.id,
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        fullName: item.fullName || 'Anonymous',
        email: item.email,
        subject: item.subject || 'Newsletter/General',
        message: item.message || 'No message provided',
        status: item.status || 'Unread',
        opened: item.opened || false
      }));
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
      return [];
    }
  },

  saveInquiry: async (inquiry: ContactInquiry) => {
    try {
      await api.post(`${API_BASE_URL}/contact`, {
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
      await api.patch(`${API_BASE_URL}/contact/${id}`, { status });
    } catch (error) {
      console.error('Failed to update inquiry status:', error);
    }
  },

  updateContactOpened: async (id: string) => {
    try {
      await api.put(`${API_BASE_URL}/contact/${id}/opened`);
    } catch (error) {
      console.error('Failed to update contact opened status:', error);
    }
  },

  deleteInquiry: async (id: string) => {
    try {
      await api.delete(`${API_BASE_URL}/contact/${id}`);
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  },

  // Ticker Management (Breaking News)
  getManualTickerItems: async (): Promise<TickerItem[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/ticker`);
      if (response.data.length === 0) return INITIAL_BREAKING_NEWS;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ticker items:', error);
      return INITIAL_BREAKING_NEWS;
    }
  },

  saveTickerItem: async (item: TickerItem) => {
    try {
      await api.post(`${API_BASE_URL}/ticker`, {
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
      await api.delete(`${API_BASE_URL}/ticker/${id}`);
    } catch (error) {
      console.error('Failed to delete ticker item:', error);
      throw error;
    }
  },

  // Newsletter Subscriptions
  getNewsletterSubscriptions: async (): Promise<NewsletterSubscription[]> => {
    try {
      const response = await api.get(`${API_BASE_URL}/contact`);
      // Filter for newsletter-style inquiries or create a separate endpoint in future
      return response.data.filter((i: any) => !i.subject);
    } catch (error) {
      console.error('Failed to fetch newsletter subscriptions:', error);
      return [];
    }
  },

  saveNewsletterSubscription: async (email: string): Promise<{ success: boolean; message?: string; statusCode?: number }> => {
    try {
      await api.post(`${API_BASE_URL}/contact`, { email: email.toLowerCase() });
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
      const response = await api.post(`${API_BASE_URL}/auth/login`, {
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
      const response = await api.post(`${API_BASE_URL}/auth/verify-2fa`, {
        email: email.toLowerCase(),
        code: code
      });

      if (response.data.access_token) {
        localStorage.setItem('casiec_token', response.data.access_token);

        // Store refresh token if provided
        if (response.data.refresh_token) {
          localStorage.setItem('casiec_refresh_token', response.data.refresh_token);
        }

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
  },

  logout: async () => {
    try {
      // Call backend logout endpoint if available
      await api.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout endpoint failed:', error);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear all tokens from localStorage
      localStorage.removeItem('casiec_token');
      localStorage.removeItem('casiec_refresh_token');
    }
  }
};

