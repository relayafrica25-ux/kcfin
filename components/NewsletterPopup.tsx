
import React, { useState, useEffect } from 'react';
import { X, Mail, Zap, CheckCircle2 } from 'lucide-react';
import { storageService } from '../services/storageService';
import { useToast } from './Toast';

export const NewsletterPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Show after 2 seconds, every time the component mounts (page load)
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Optional: keep session logic if desired in future, but currently always shows as per previous request
      sessionStorage.setItem('kc_newsletter_seen', 'true');
    }, 300);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Persist subscription
      const result = await storageService.saveNewsletterSubscription(email);

      if (result.success) {
        setHasSubscribed(true);
        showToast('Successfully subscribed to newsletter!', 'success');
        // Close after showing success message for a bit
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        // Show error toast
        const errorMessage = result.statusCode
          ? `Error ${result.statusCode}: ${result.message}`
          : result.message || 'Failed to subscribe to newsletter';
        showToast(errorMessage, 'error');
      }
    } catch (error) {
      showToast('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        ></div>

        {/* Popup Content */}
        <div className={`relative w-full max-w-md bg-nova-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${isClosing ? 'scale-95' : 'scale-100 animate-fade-in-up'}`}>

          {/* Futuristic Glow Effects */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-nova-500/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-nova-accent/20 rounded-full blur-[80px]"></div>

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 p-2 hover:bg-white/5 rounded-full"
          >
            <X size={20} />
          </button>

          <div className="p-8 relative z-0">
            {!hasSubscribed ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(79,70,229,0.3)] backdrop-blur-md">
                    <Mail className="text-white h-8 w-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Unlock Market Alpha</h2>
                  <p className="text-gray-400 text-sm">
                    Join 50,000+ investors receiving exclusive deal flow and rate updates.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3.5 pl-11 text-white placeholder:text-gray-500 focus:outline-none focus:border-nova-400 focus:ring-1 focus:ring-nova-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-nova-400 transition-colors" size={18} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-nova-500 to-nova-400 hover:from-nova-400 hover:to-nova-300 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-nova-500/25 hover:shadow-nova-500/40 transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Get Access'}
                  </button>
                </form>

                <p className="text-[10px] text-gray-500 mt-4 text-center uppercase tracking-widest">
                  Join the future of funding
                </p>
              </>
            ) : (
              <div className="py-10 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full mx-auto flex items-center justify-center mb-6 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">You're on the list!</h2>
                <p className="text-gray-400">Keep an eye on your inbox.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
