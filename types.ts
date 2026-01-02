
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  sources?: Array<{ uri: string; title: string }>;
  imageUrl?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  imageGradient: string;
  imageUrl?: string;
  content?: string;
  url?: string;
}

export interface LoanApplication {
  id: string;
  date: string;
  type: 'financial' | 'business_support';
  loanType?: string;
  serviceType?: string;
  amount?: string;
  revenue?: string;
  businessName: string;
  cacNumber: string;
  industry: string;
  state: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  description?: string;
  status: 'Pending' | 'Reviewed' | 'Approved' | 'Declined';
}

export interface ContactInquiry {
  id: string;
  date: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Archived';
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  date: string;
}
