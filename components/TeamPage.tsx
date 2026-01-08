
import React from 'react';
import { Linkedin, Mail, Twitter, ShieldCheck, Award, Briefcase, Globe } from 'lucide-react';
import { TeamMember } from '../types';

const team: TeamMember[] = [
  {
    id: '1',
    name: "Dr. Adebayo Ogunlesi",
    role: "Managing Director / CEO",
    bio: "Visionary leader with 20+ years in investment banking and structured finance across emerging markets.",
    imageGradient: "from-blue-600 to-indigo-900",
    specialization: "Strategic Leadership"
  },
  {
    id: '2',
    name: "Sarah Jenkins",
    role: "Chief Financial Officer",
    bio: "Expert in mezzanine financing and corporate treasury management with a focus on institutional risk assessment.",
    imageGradient: "from-purple-600 to-nova-500",
    specialization: "Corporate Finance"
  },
  {
    id: '3',
    name: "Chidi Okafor",
    role: "Head of Business Support",
    bio: "Specialist in supply chain optimization and strategic outsourcing for NMSE growth.",
    imageGradient: "from-emerald-600 to-teal-900",
    specialization: "Operations"
  },
  {
    id: '4',
    name: "Elena Rodriguez",
    role: "Director of Wealth Advisory",
    bio: "Architecting bespoke wealth preservation strategies for high-net-worth family offices.",
    imageGradient: "from-amber-500 to-orange-700",
    specialization: "Wealth Management"
  }
];

export const TeamPage: React.FC = () => {
  return (
    <div className="pt-24 min-h-screen bg-nova-900 selection:bg-nova-500">
      {/* Hero Section */}
      <div className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-nova-500/5 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-nova-400 to-purple-400">Architects.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
            A diverse collective of financial engineers, strategic advisors, and market specialists dedicated to driving continental success.
          </p>
        </div>
      </div>

      {/* Leadership Grid */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="h-px flex-grow bg-white/10"></div>
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-nova-400">Executive Leadership</h2>
            <div className="h-px flex-grow bg-white/10"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="group relative flex flex-col glass-panel rounded-[2.5rem] border border-white/5 overflow-hidden hover:border-nova-500/30 transition-all duration-500">
                <div className={`h-64 relative bg-gradient-to-br ${member.imageGradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                   <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest rounded-full">
                        {member.specialization}
                      </span>
                   </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-nova-400 transition-colors">{member.name}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-6">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                    {member.bio}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex gap-4">
                    <button className="text-gray-600 hover:text-white transition-colors"><Linkedin size={18} /></button>
                    <button className="text-gray-600 hover:text-white transition-colors"><Twitter size={18} /></button>
                    <button className="text-gray-600 hover:text-white transition-colors"><Mail size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-nova-500/10 rounded-2xl flex items-center justify-center text-nova-400 flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Integrity First</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Fostering trust through transparent fee structures and ethical lending practices.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 flex-shrink-0">
                <Award size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Domain Expertise</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Deep knowledge in NMSE lending, structured debt, and continental trade distribution.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-14 h-14 bg-nova-accent/10 rounded-2xl flex items-center justify-center text-nova-accent flex-shrink-0">
                <Globe size={28} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Global Vision</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Connecting local African ventures to institutional capital on a global scale.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
           <h2 className="text-3xl font-bold text-white mb-6 italic">Join the Alliance.</h2>
           <p className="text-gray-400 mb-10 leading-relaxed">
             We are always looking for high-caliber professionals to join our mission of continental economic advancement.
           </p>
           <a href="mailto:careers@casiec.com" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-nova-900 font-bold rounded-full hover:bg-nova-400 hover:text-white transition-all">
             View Open Positions <Briefcase size={18} />
           </a>
        </div>
      </section>
    </div>
  );
};
