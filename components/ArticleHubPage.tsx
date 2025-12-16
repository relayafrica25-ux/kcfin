import React, { useState, useEffect } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { ArrowRight, BookOpen, Clock, Tag, Search, TrendingUp, Filter, Hash, Sparkles, ChevronRight, Cpu, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  date: string;
  imageGradient: string;
  imageUrl?: string;
  featured?: boolean;
  url?: string;
}

const STATIC_ARTICLES: Article[] = [
  {
    id: '1',
    title: "The Architecture of Capital: Structuring Debt for Growth",
    excerpt: "Why standard term loans aren't always the answer. Explore how mezzanine financing and structured equity can accelerate your expansion without diluting ownership.",
    category: "Strategy",
    readTime: "8 min read",
    author: "Sarah Jenkins, CFO",
    date: "Oct 12, 2024",
    imageGradient: "from-purple-600 to-blue-600",
    featured: true,
    url: "#"
  },
  {
    id: '2',
    title: "Navigating BOI Requirements: A 2024 Playbook",
    excerpt: "A step-by-step guide to documenting your business for Bank of Industry applications. Avoid the common pitfalls that lead to rejection.",
    category: "Guide",
    readTime: "12 min read",
    author: "David Okonkwo",
    date: "Oct 10, 2024",
    imageGradient: "from-emerald-600 to-teal-600",
    url: "#"
  },
  {
    id: '3',
    title: "Green Bonds & The Future of Eco-Finance",
    excerpt: "How sustainable manufacturing is unlocking cheaper capital through green credit facilities and carbon credit monetization.",
    category: "Eco-Finance",
    readTime: "6 min read",
    author: "Green Desk",
    date: "Oct 08, 2024",
    imageGradient: "from-green-500 to-emerald-900",
    url: "#"
  },
  {
    id: '4',
    title: "Commercial Real Estate: Cap Rates vs. Cash on Cash",
    excerpt: "Understanding the metrics that matter. How to evaluate multifamily deals in a high-interest rate environment.",
    category: "Real Estate",
    readTime: "10 min read",
    author: "Marcus Thorne",
    date: "Oct 05, 2024",
    imageGradient: "from-blue-600 to-indigo-900",
    url: "#"
  },
  {
    id: '5',
    title: "Digital Transformation in SME Lending",
    excerpt: "How AI and Open Banking are reducing approval times from weeks to hours for small business loans.",
    category: "Tech",
    readTime: "5 min read",
    author: "Tech Team",
    date: "Oct 01, 2024",
    imageGradient: "from-orange-500 to-red-600",
    url: "#"
  }
];

export const ArticleHubPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadNews = async () => {
      const news = await fetchFinancialNews();
      setMarketNews(news);
    };
    loadNews();
  }, []);

  const categories = ['All', 'Strategy', 'Real Estate', 'Eco-Finance', 'Guide', 'Tech', 'AI News'];

  // Merge static articles with dynamic news for the grid
  const newsAsArticles: Article[] = marketNews.map(item => ({
    id: item.id,
    title: item.title,
    excerpt: item.summary,
    category: 'AI News',
    readTime: 'Automated',
    author: 'AI News Crawler',
    date: 'Live',
    imageGradient: item.impact === 'Bullish' ? 'from-green-900 to-emerald-800' : 'from-red-900 to-rose-800',
    imageUrl: item.imageUrl,
    url: item.sources?.[0]?.uri
  }));

  const allContent = [...STATIC_ARTICLES, ...newsAsArticles];

  const filteredContent = allContent.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = STATIC_ARTICLES[0];

  const handleArticleClick = (article: Article) => {
    if (article.category === 'AI News' && article.url) {
      window.open(article.url, '_blank');
    } else {
      // Internal navigation logic (placeholder)
      console.log("Navigating to article", article.id);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-nova-900 selection:bg-purple-500">
      
      {/* Hero Section */}
      <div className="relative pb-20 pt-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-nova-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nova-400 text-sm font-semibold mb-6 backdrop-blur-md animate-fade-in-up">
              <Sparkles size={16} />
              <span>KC Financial Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              Knowledge is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-nova-accent">
                Capital.
              </span>
            </h1>
            <p className="text-xl text-gray-400 animate-fade-in-up">
              Deep dives, strategic playbooks, and real-time market analysis to empower your financial decisions.
            </p>
          </div>

          {/* Featured Article Card (Bento Box Style) */}
          {activeCategory === 'All' && !searchQuery && (
            <div 
              onClick={() => handleArticleClick(featuredArticle)}
              className="glass-panel p-1 rounded-[2.5rem] mb-20 animate-fade-in-up group cursor-pointer hover:shadow-[0_0_50px_rgba(79,70,229,0.2)] transition-shadow duration-500"
            >
              <div className="bg-nova-900/50 rounded-[2.3rem] overflow-hidden grid lg:grid-cols-2">
                 <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                         {featuredArticle.category}
                       </span>
                       <span className="text-gray-500 text-sm flex items-center gap-1">
                         <Clock size={14} /> {featuredArticle.readTime}
                       </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-purple-300 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10"></div>
                       <div>
                          <div className="text-white font-medium text-sm">{featuredArticle.author}</div>
                          <div className="text-gray-500 text-xs">{featuredArticle.date}</div>
                       </div>
                    </div>
                 </div>
                 <div className={`relative min-h-[400px] bg-gradient-to-br ${featuredArticle.imageGradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-full">
                       <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Controls Bar */}
        <div className="sticky top-20 z-40 mb-12">
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center bg-nova-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Categories */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                activeCategory === cat 
                                ? 'bg-white text-nova-900 shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-64 group">
                    <input 
                        type="text" 
                        placeholder="Search topics..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={16} />
                </div>
            </div>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.filter(a => activeCategory === 'All' ? a.id !== '1' : true).map((article) => (
                <div 
                    key={article.id} 
                    onClick={() => handleArticleClick(article)}
                    className="group flex flex-col bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 hover:translate-y-[-5px] transition-all duration-300 cursor-pointer"
                >
                    {/* Image Area */}
                    <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${article.imageGradient}`}>
                        {article.imageUrl ? (
                           <>
                             <img 
                               src={article.imageUrl} 
                               alt={article.title}
                               className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                               loading="lazy"
                               onError={(e) => {
                                 // If image fails, hide it and reveal the gradient below
                                 (e.target as HTMLImageElement).style.display = 'none';
                               }}
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-nova-900/80 via-transparent to-transparent"></div>
                           </>
                        ) : (
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                        )}

                        <div className="absolute top-4 left-4 z-10">
                            <span className={`px-3 py-1 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1
                              ${article.category === 'AI News' ? 'bg-nova-500/60 border-nova-500/50' : 'bg-black/30'}`}>
                                {article.category === 'AI News' && <Cpu size={10} />}
                                {article.category}
                            </span>
                        </div>
                        {article.category === 'AI News' && (
                          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <ExternalLink size={12} />
                          </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <Clock size={12} /> {article.readTime}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                            {article.excerpt}
                        </p>
                        
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${article.category === 'AI News' ? 'bg-nova-500/20 text-nova-400' : 'bg-gray-700 text-gray-300'}`}>
                                  {article.category === 'AI News' ? <Cpu size={14} /> : null}
                                </div>
                                <span className="text-xs text-gray-300">{article.author}</span>
                            </div>
                            <button className="text-purple-400 hover:text-white transition-colors">
                                {article.category === 'AI News' ? <ExternalLink size={18} /> : <ChevronRight size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredContent.length === 0 && (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-gray-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or category filters.</p>
            </div>
        )}

      </div>

      {/* Newsletter Section */}
      <section className="border-t border-white/5 bg-black/20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <BookOpen className="mx-auto text-purple-500 h-10 w-10 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Update</h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
                Subscribe to our intelligence briefing. Get the latest strategies and market news delivered to your inbox every Monday.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                 <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 focus:border-purple-500 focus:outline-none w-full text-white placeholder:text-gray-500"
                 />
                 <button className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg shadow-purple-500/20 whitespace-nowrap">
                   Subscribe
                 </button>
            </div>
        </div>
      </section>

    </div>
  );
};