
import React, { useState, useEffect } from 'react';
import { fetchFinancialNews } from '../services/geminiService';
import { storageService } from '../services/storageService';
import { NewsItem, Article } from '../types';
import { ArrowRight, BookOpen, Clock, Tag, Search, TrendingUp, Filter, Hash, Sparkles, ChevronRight, Cpu, ExternalLink, Image as ImageIcon } from 'lucide-react';

export const ArticleHubPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);
  const [storedArticles, setStoredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      const news = await fetchFinancialNews();
      setMarketNews(news);
      setStoredArticles(storageService.getArticles());
    };
    loadContent();
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

  const allContent = [...storedArticles, ...newsAsArticles];

  const filteredContent = allContent.filter(article => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = storedArticles[0] || newsAsArticles[0];

  const handleArticleClick = (article: Article) => {
    if (article.url) {
      window.open(article.url, '_blank');
    } else {
      console.log("Viewing internal article", article.id);
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
              <span>CASIEC Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              Knowledge is <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-nova-accent">
                Capital.
              </span>
            </h1>
          </div>

          {/* Featured Article Card - Stable height container */}
          <div className="min-h-[400px]">
            {activeCategory === 'All' && !searchQuery && featuredArticle && (
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
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-purple-300 transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-auto">
                         <div className="text-white font-medium text-sm">By {featuredArticle.author}</div>
                      </div>
                   </div>
                   <div className={`relative min-h-[400px] bg-gradient-to-br ${featuredArticle.imageGradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {featuredArticle.imageUrl && (
                        <img 
                          src={featuredArticle.imageUrl} 
                          width="800"
                          height="400"
                          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                          alt="" 
                        />
                      )}
                      <div className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-md border border-white/10 p-4 rounded-full">
                         <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="sticky top-20 z-40 mb-12">
            <div className="glass-panel p-2 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center bg-nova-900/80 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                activeCategory === cat 
                                ? 'bg-white text-nova-900' 
                                : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64 group">
                    <input 
                        type="text" 
                        placeholder="Search topics..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((article) => (
                <div 
                    key={article.id} 
                    onClick={() => handleArticleClick(article)}
                    className="group flex flex-col bg-white/5 border border-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer h-full"
                >
                    <div className={`h-48 relative overflow-hidden bg-gradient-to-br ${article.imageGradient}`}>
                        {article.imageUrl && (
                          <img 
                            src={article.imageUrl} 
                            width="400"
                            height="192"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                            alt="" 
                          />
                        )}
                        <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase rounded-full">
                                {article.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition-colors">
                            {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                            {article.excerpt}
                        </p>
                        <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                            <span className="text-xs text-gray-500">By {article.author}</span>
                            <ChevronRight size={20} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
