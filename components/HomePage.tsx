import React from 'react';
import { Hero } from './Hero';
import { FuturisticCarousel } from './FuturisticCarousel';
import { FAQSection } from './FAQSection';
import { Building, Hammer, Banknote, Briefcase, Truck, Landmark, Mail, Phone, MapPin, Wallet, BrainCircuit } from 'lucide-react';

interface HomePageProps {
  onApplyClick: () => void;
  onNavigate: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onApplyClick, onNavigate }) => {
  return (
    <>
      <div className="pt-10">
          <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            {/* Split Background Effect */}
            <div className="absolute inset-0 z-0">
               <div className="absolute top-0 left-0 w-1/2 h-full bg-nova-500/5 blur-[100px]"></div>
               <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-500/5 blur-[100px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                 <h1 className="text-5xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                   Your Partner in <br/>
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-400 via-white to-purple-400">
                     Growth & Capital
                   </span>
                 </h1>
                 <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                   KC Financial bridges the gap between ambition and achievement through comprehensive financial solutions and expert business support.
                 </p>
              </div>

              {/* The Two Major Functions Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Function 1: Financial Support */}
                <div className="group relative glass-card p-1 rounded-3xl hover:shadow-[0_0_50px_rgba(79,70,229,0.3)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-nova-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-nova-900/80 backdrop-blur-xl rounded-[22px] p-8 h-full flex flex-col items-center text-center border border-white/5 group-hover:border-nova-500/50 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-nova-500/10 flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <Wallet size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Financial Support</h2>
                        <p className="text-gray-400 mb-8">
                            Access liquid capital for real estate, business expansion, SBA loans, and lines of credit. Fast approvals, flexible terms.
                        </p>
                        <button 
                            onClick={() => onNavigate('financial-support')}
                            className="mt-auto px-8 py-3 rounded-full bg-nova-500 hover:bg-nova-400 text-white font-bold transition-all w-full"
                        >
                            Get Funded
                        </button>
                    </div>
                </div>

                {/* Function 2: Business Support */}
                <div className="group relative glass-card p-1 rounded-3xl hover:shadow-[0_0_50px_rgba(168,85,247,0.3)] transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative bg-nova-900/80 backdrop-blur-xl rounded-[22px] p-8 h-full flex flex-col items-center text-center border border-white/5 group-hover:border-purple-500/50 transition-colors">
                        <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <BrainCircuit size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Business Support</h2>
                        <p className="text-gray-400 mb-8">
                            Prepare for capital. Expert advisory, BOI loan documentation, and investment readiness support to secure your funding.
                        </p>
                        <button 
                             onClick={() => onNavigate('business-support')}
                             className="mt-auto px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all w-full"
                        >
                            Start Your Raise
                        </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      
      {/* Featured Carousel Section */}
      <section className="py-20 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-nova-800/20 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Live Insights & Updates</h2>
              <p className="text-gray-400">Breaking news, eco-financial opportunities, and company announcements.</p>
            </div>
            <div className="hidden md:block">
              <span className="flex items-center gap-2 text-xs text-nova-400 uppercase tracking-widest font-bold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Live Feed Active
              </span>
            </div>
          </div>
          
          <FuturisticCarousel />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA / Newsletter Section */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-nova-700 to-nova-800 rounded-3xl p-12 text-center relative overflow-hidden border border-white/10">
             <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
             <div className="relative z-10">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-nova-400 text-sm font-semibold mb-6">
                  <Mail size={14} />
                  <span>Market Insights</span>
               </div>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Ahead of the Curve</h2>
               <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                 Join our network. Receive daily rate updates, market news, and business growth tips.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="px-6 py-3 rounded-full bg-white/5 border border-white/10 focus:border-nova-400 focus:outline-none w-full sm:w-80 text-white placeholder:text-gray-500"
                 />
                 <button className="px-8 py-3 rounded-full bg-nova-500 hover:bg-nova-400 font-bold transition-colors shadow-lg shadow-nova-500/20 whitespace-nowrap">
                   Subscribe
                 </button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 border-t border-white/5 bg-gradient-to-b from-nova-900 to-nova-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-400">Our team is available 24/7 to assist with your funding needs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {/* Phone */}
            <div className="flex flex-col items-center group p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-nova-500/10 flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-nova-500/10">
                <Phone size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Call Us</h3>
              <a href="tel:+18885550123" className="text-2xl text-nova-400 hover:text-white font-bold transition-colors font-mono tracking-tight">
                (888) 555-0123
              </a>
              <p className="text-sm text-gray-500 mt-2">Speak directly with a funding advisor</p>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center group p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-nova-accent/10 flex items-center justify-center text-nova-accent mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-nova-accent/10">
                <Mail size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Email Us</h3>
              <a href="mailto:support@kcfinancial.com" className="text-2xl text-nova-accent hover:text-white font-bold transition-colors font-mono tracking-tight">
                support@kcfinancial.com
              </a>
              <p className="text-sm text-gray-500 mt-2">Guaranteed response within 2 hours</p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-center group p-6 rounded-2xl hover:bg-white/5 transition-colors">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/10">
                <MapPin size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Visit HQ</h3>
              <div className="text-xl text-gray-300 font-medium leading-relaxed">
                100 Financial District Blvd<br/>
                Suite 500<br/>
                New York, NY 10005
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};