import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Building2, Wallet, User, Calculator, CheckCircle2, Briefcase, MapPin, UploadCloud, FileText, Trash2, Scale, BrainCircuit, Globe } from 'lucide-react';

interface LoanApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ApplicationType = 'financial' | 'business_support' | null;

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [appType, setAppType] = useState<ApplicationType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Consolidated Form Data
  const [formData, setFormData] = useState({
    // Type Selections
    loanType: '',
    serviceType: '', // For Business Support
    
    // Financial Specifics
    amount: '',
    revenue: '',
    bankStatementName: '',
    
    // Support Specifics
    description: '', // What they want

    // Common Business Info
    businessName: '',
    cacNumber: '',
    industry: '',
    state: '',
    
    // Contact Info
    fullName: '',
    role: '',
    email: '',
    phone: '',
  });

  // Reset step when reopening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setAppType(null);
      setIsSubmitting(false);
      setFormData(prev => ({ ...prev, loanType: '', serviceType: '' }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, bankStatementName: e.target.files[0].name });
    }
  };

  const clearFile = () => {
    setFormData({ ...formData, bankStatementName: '' });
  };

  // Step 1: Choose Main Path
  const handleSelectAppType = (type: ApplicationType) => {
    setAppType(type);
    setStep(2);
  };

  // Step 2 (Financial): Choose Loan Type
  const handleSelectLoanType = (type: string) => {
    setFormData({ ...formData, loanType: type });
    setTimeout(() => setStep(3), 200);
  };

  // Step 2 (Support): Choose Service Type
  const handleSelectServiceType = (type: string) => {
    setFormData({ ...formData, serviceType: type });
    setTimeout(() => setStep(3), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStep(5); // Success step
    setIsSubmitting(false);
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  // Helper for render logic
  const isFinancial = appType === 'financial';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-3xl bg-nova-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">
                {step === 1 ? 'Start Your Journey' : 
                 isFinancial ? 'Financial Support Application' : 'Business Support Inquiry'}
            </h2>
            <p className="text-sm text-gray-400">Step {step > 4 ? 4 : step} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-nova-800">
          <div 
            className="h-full bg-gradient-to-r from-nova-500 to-purple-500 transition-all duration-500 ease-out" 
            style={{ width: step === 5 ? '100%' : `${((step - 1) / 4) * 100}%` }}
          ></div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: Main Branch Selection */}
          {step === 1 && (
            <div className="space-y-8 py-4">
              <h3 className="text-3xl font-bold text-white text-center mb-8">How can KC Financial help you?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Financial Support Card */}
                <div 
                  onClick={() => handleSelectAppType('financial')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-nova-500 transition-all duration-300 hover:shadow-2xl hover:shadow-nova-500/20"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Wallet size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-nova-500/20 rounded-xl flex items-center justify-center text-nova-400 mb-6 group-hover:scale-110 transition-transform">
                      <Wallet size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Financial Support</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Loans, Lines of Credit, Real Estate Financing, and SBA Loans. Get capital to grow.
                    </p>
                    <div className="mt-6 flex items-center text-nova-400 text-sm font-bold group-hover:gap-2 transition-all">
                      Apply for Funding <ChevronRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Business Support Card */}
                <div 
                  onClick={() => handleSelectAppType('business_support')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white/5 p-8 border border-white/10 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BrainCircuit size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                      <Briefcase size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Business Support</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Advisory, Business Plans (BDSP), Training, and Market Linkages. Expert guidance.
                    </p>
                    <div className="mt-6 flex items-center text-purple-400 text-sm font-bold group-hover:gap-2 transition-all">
                      Request Services <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Sub-Type Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">
                 {isFinancial ? 'Select Funding Type' : 'Select Support Service'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isFinancial ? (
                  // Financial Options
                  [
                    { id: 'cre', label: 'Commercial Real Estate', icon: <Building2 className="text-blue-400" /> },
                    { id: 'sba', label: 'SBA Loan (7a / 504)', icon: <Calculator className="text-emerald-400" /> },
                    { id: 'business', label: 'Business Term Loan', icon: <Wallet className="text-purple-400" /> },
                    { id: 'bridge', label: 'Bridge / Fix & Flip', icon: <Building2 className="text-orange-400" /> },
                  ].map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleSelectLoanType(option.label)}
                      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group
                        ${formData.loanType === option.label 
                          ? 'bg-nova-500/20 border-nova-500' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                        {option.icon}
                      </div>
                      <span className="font-semibold text-lg">{option.label}</span>
                    </div>
                  ))
                ) : (
                  // Business Support Options
                  [
                    { id: 'advisory', label: 'Financial Advisory', icon: <Scale className="text-nova-accent" /> },
                    { id: 'bdsp', label: 'BDSP (Business Plans)', icon: <FileText className="text-purple-400" /> },
                    { id: 'capacity', label: 'Capacity Building', icon: <BrainCircuit className="text-emerald-400" /> },
                    { id: 'linkages', label: 'Market Linkages', icon: <Globe className="text-orange-400" /> },
                  ].map((option) => (
                    <div 
                      key={option.id}
                      onClick={() => handleSelectServiceType(option.label)}
                      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 flex items-center gap-4 group
                        ${formData.serviceType === option.label 
                          ? 'bg-purple-500/20 border-purple-500' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}`}
                    >
                      <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                        {option.icon}
                      </div>
                      <span className="font-semibold text-lg">{option.label}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* STEP 3: Business Details & Specifics */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">Business Profile</h3>
              <div className="space-y-4">
                
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Legal Business Name</label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                          type="text" 
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Acme Corp LLC"
                          className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                        />
                    </div>
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">CAC / Reg Number</label>
                    <input 
                      type="text" 
                      name="cacNumber"
                      value={formData.cacNumber}
                      onChange={handleInputChange}
                      placeholder="RC123456"
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Conditional Fields based on Type */}
                {isFinancial ? (
                  <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Requested Amount</label>
                            <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                            <input 
                                type="number" 
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="50,000"
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-8 pr-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                            />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Annual Revenue</label>
                            <select 
                            name="revenue"
                            value={formData.revenue}
                            onChange={handleInputChange}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-nova-500 transition-colors appearance-none"
                            >
                            <option value="" className="bg-nova-900">Select...</option>
                            <option value="0-100k" className="bg-nova-900">$0 - $100k</option>
                            <option value="100k-500k" className="bg-nova-900">$100k - $500k</option>
                            <option value="500k-1m" className="bg-nova-900">$500k - $1M</option>
                            <option value="1m+" className="bg-nova-900">$1M+</option>
                            </select>
                        </div>
                    </div>
                    {/* Bank Statement Upload for Financial */}
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Business Account Statement (Last 3 Months)</label>
                        <div className={`border-2 border-dashed rounded-xl p-6 transition-colors ${formData.bankStatementName ? 'border-nova-500 bg-nova-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                            {formData.bankStatementName ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-nova-500/20 rounded-lg text-nova-400">
                                            <FileText size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white break-all">{formData.bankStatementName}</p>
                                            <p className="text-xs text-green-400">Ready for upload</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={clearFile}
                                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center relative">
                                    <input 
                                        type="file" 
                                        id="bankStatement"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.csv,.xlsx,.xls"
                                    />
                                    <UploadCloud className="mx-auto h-10 w-10 text-gray-500 mb-3" />
                                    <p className="text-sm text-gray-300 font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, Excel or CSV (Max 10MB)</p>
                                </div>
                            )}
                        </div>
                    </div>
                  </>
                ) : (
                  // Business Support Specifics
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Describe what you need</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please describe your business needs, goals, or the specific documentation you require assistance with..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Contact Info */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in-up">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <form id="application-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                            type="text" 
                            name="fullName"
                            required
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title / Role</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                            type="text" 
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleInputChange}
                            placeholder="Owner, CEO..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-nova-500 transition-colors"
                  />
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 5 && (
            <div className="text-center py-10 animate-fade-in-up">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isFinancial ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                  {isFinancial ? 'Application Received!' : 'Inquiry Sent!'}
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                Thanks {formData.fullName.split(' ')[0]}. 
                {isFinancial 
                  ? " One of our senior funding advisors will review your file and contact you " 
                  : " A business development specialist will analyze your request and reach out "} 
                at <span className="text-white font-medium">{formData.phone}</span> within the next <span className="text-white font-bold">48 hours</span>.
              </p>
              <button 
                onClick={onClose}
                className="bg-white text-nova-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors"
              >
                Return to Homepage
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {step > 1 && step < 5 && (
          <div className="p-6 border-t border-white/10 bg-white/5 flex justify-between items-center">
            <button 
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ChevronLeft size={16} /> Back
            </button>

            {step < 4 ? (
              <button 
                onClick={nextStep}
                disabled={
                    (step === 2 && isFinancial && !formData.loanType) ||
                    (step === 2 && !isFinancial && !formData.serviceType)
                }
                className={`text-white px-6 py-2.5 rounded-full font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${isFinancial ? 'bg-nova-500 hover:bg-nova-400' : 'bg-purple-600 hover:bg-purple-500'}`}
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                form="application-form"
                type="submit"
                disabled={isSubmitting}
                className={`text-white px-8 py-2.5 rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70
                    ${isFinancial ? 'bg-gradient-to-r from-nova-400 to-nova-accent hover:shadow-nova-500/25' : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/25'}`}
              >
                {isSubmitting ? 'Processing...' : 'Submit Request'}
                {!isSubmitting && <Check size={16} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};