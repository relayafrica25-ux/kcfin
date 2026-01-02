
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Building2, Wallet, User, Calculator, CheckCircle2, Briefcase, MapPin, UploadCloud, FileText, Trash2, Scale, BrainCircuit, Globe, Landmark, TrendingUp, Network } from 'lucide-react';
import { storageService } from '../services/storageService';
import { LoanApplication } from '../types';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApplicationType = 'financial' | 'business_support' | null;

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<ApplicationType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    loanType: '',
    serviceType: '',
    amount: '',
    revenue: '',
    bankStatementName: '',
    description: '',
    businessName: '',
    cacNumber: '',
    industry: 'General',
    state: 'Lagos',
    fullName: '',
    role: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAppType(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAppType = (type: ApplicationType) => {
    setAppType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const application: LoanApplication = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString(),
      type: appType!,
      ...formData,
      status: 'Pending'
    };

    storageService.saveApplication(application);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(5);
    setIsSubmitting(false);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);
  const isFinancial = appType === 'financial';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-nova-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">
                {step === 1 ? 'Initiate Inquiry' : 
                 isFinancial ? 'CASIEC Financial Support' : 'GSI Strategic Alliances Inquiry'}
            </h2>
            <p className="text-sm text-gray-400">Step {step > 4 ? 4 : step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><X size={20} /></button>
        </div>

        <div className="h-1 w-full bg-nova-800">
          <div className="h-full bg-gradient-to-r from-nova-500 to-purple-500 transition-all duration-500" style={{ width: step === 5 ? '100%' : `${((step - 1) / 4) * 100}%` }}></div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          {step === 1 && (
            <div className="space-y-8 py-4">
              <h3 className="text-3xl font-bold text-white text-center mb-8">Select Your Path</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={() => handleSelectAppType('financial')} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-nova-500 transition-all">
                  <div className="w-14 h-14 bg-nova-500/20 rounded-xl flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform"><Landmark size={32} /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Financial Support</h3>
                  <p className="text-gray-400 text-sm">Credit, NMSE Lending, Consumer Finance, and Wealth Advisory via CASIEC.</p>
                </div>
                <div onClick={() => handleSelectAppType('business_support')} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-purple-500 transition-all">
                  <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><Network size={32} /></div>
                  <h3 className="text-2xl font-bold text-white mb-2">Business Support</h3>
                  <p className="text-gray-400 text-sm">Advisory, Corporate Finance (CFRA), and Supply Chain Distribution via GSI.</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">{isFinancial ? 'Select Lending Program' : 'Select Advisory Pillar'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isFinancial ? (
                  ['Credit & Finance', 'NMSE Enterprise Lending', 'Consumer Credit', 'Supply Chain Financing', 'Wealth Management'].map((label) => (
                    <div key={label} onClick={() => { setFormData({...formData, loanType: label}); setTimeout(nextStep, 200); }} className={`p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.loanType === label ? 'bg-nova-500/20 border-nova-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <span className="font-semibold text-lg">{label}</span>
                    </div>
                  ))
                ) : (
                  ['Business Support Services', 'Corporate Finance (CFRA)', 'Supply Chain Advisory', 'Commodity Distribution'].map((label) => (
                    <div key={label} onClick={() => { setFormData({...formData, serviceType: label}); setTimeout(nextStep, 200); }} className={`p-6 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${formData.serviceType === label ? 'bg-purple-500/20 border-purple-500' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                      <span className="font-semibold text-lg">{label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Entity Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">CAC / Registration No.</label>
                  <input type="text" name="cacNumber" value={formData.cacNumber} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Narrative of Needs</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full h-32 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white resize-none" placeholder="Explain your specific requirements..." />
              </div>
            </div>
          )}

          {step === 4 && (
            <form id="application-form" onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Uplink Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
                <input required type="text" name="role" value={formData.role} onChange={handleInputChange} placeholder="Role" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
                <input required type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white" />
              </div>
            </form>
          )}

          {step === 5 && (
            <div className="text-center py-10">
              <CheckCircle2 size={60} className="mx-auto text-green-400 mb-6" />
              <h3 className="text-3xl font-bold text-white mb-4">Transmission Successful</h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">Our specialists will analyze your profile and contact you within 24-48 hours to discuss terms.</p>
              <button onClick={onClose} className="bg-white text-nova-900 px-8 py-3 rounded-full font-bold">Exit Terminal</button>
            </div>
          )}
        </div>

        {step > 1 && step < 5 && (
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
            <button onClick={prevStep} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft size={16} /> Back</button>
            {step < 4 ? (
              <button onClick={nextStep} className={`text-white px-6 py-2.5 rounded-full font-semibold ${isFinancial ? 'bg-nova-500' : 'bg-purple-600'}`}>Next Step <ChevronRight size={16} /></button>
            ) : (
              <button form="application-form" type="submit" disabled={isSubmitting} className={`text-white px-8 py-2.5 rounded-full font-bold ${isFinancial ? 'bg-nova-500' : 'bg-purple-600'}`}>
                {isSubmitting ? 'Syncing...' : 'Initiate Review'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
