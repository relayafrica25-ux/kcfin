import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Minus } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I'm Nova, your AI capital assistant. How can I help you fund your business today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const responseText = await sendChatMessage(messages, input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      <div 
        className={`mb-4 w-[350px] md:w-[380px] bg-nova-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-nova-500 to-purple-600 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Bot className="text-white h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Nova AI Support</h3>
              <p className="text-[10px] text-white/80 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <Minus size={18} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                  msg.role === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-nova-500/20 text-nova-400'
                }`}
              >
                {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
              </div>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-nova-500/20 text-nova-400 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles size={14} />
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none">
                <Loader2 size={16} className="animate-spin text-nova-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSubmit} className="p-4 bg-white/5 border-t border-white/10">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about loans..." 
              className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-nova-500 focus:bg-black/40 transition-all placeholder:text-gray-600"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-nova-500 rounded-full text-white hover:bg-nova-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
          <div className="text-[10px] text-gray-600 text-center mt-2">
            AI can make mistakes. Contact support for official advice.
          </div>
        </form>
      </div>

      {/* Floating Toggle Button Wrapper */}
      <div className="relative flex items-center pointer-events-auto">
        {/* Call to Action Label */}
        <div 
           className={`absolute right-full mr-5 bg-white text-nova-900 px-5 py-3 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] font-bold text-sm whitespace-nowrap transition-all duration-500 origin-right flex items-center cursor-pointer hover:bg-gray-100 hover:scale-105 ${
             !isOpen ? 'opacity-100 translate-x-0 scale-100 animate-fade-in-up' : 'opacity-0 translate-x-4 scale-95 pointer-events-none'
           }`}
           onClick={() => setIsOpen(true)}
        >
           Chat with us now
           {/* Arrow pointing right */}
           <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 transform origin-center shadow-sm"></div>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-lg shadow-nova-500/30 transition-all duration-300 hover:scale-105 active:scale-95 group flex items-center justify-center ${
            isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-gradient-to-r from-nova-500 to-purple-600 text-white'
          }`}
        >
          {isOpen ? <X size={24} /> : <MessageCircle size={24} className="animate-pulse-slow" />}
          {!isOpen && (
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
             </span>
          )}
        </button>
      </div>
    </div>
  );
};