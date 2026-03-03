import React from 'react';
import { Layout } from '@/components/Layout';
import { GraduationCap, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Subscription() {
  return (
    <Layout title="Subscription" showBack>
      <div className="p-4 space-y-6 pb-32">
        
        {/* Current Plan Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
              <GraduationCap className="w-8 h-8 text-[#00D632]" />
            </div>
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-[#00D632] text-xs font-bold uppercase tracking-wider">Current Plan</span>
              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">ACTIVE</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0A1128] self-start">Free Tier</h2>
            <p className="text-gray-500 text-sm mt-2 text-left">
              Limited access to AI summaries and practice tests.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div>
          <h3 className="font-bold text-[#0A1128] mb-4">Unlock Premium Features</h3>
          <div className="space-y-3">
            <FeatureItem 
              icon="🧠" 
              title="Unlimited AI Tutor access" 
              desc="Ask any question about your courses, anytime." 
            />
            <FeatureItem 
              icon="📡" 
              title="Offline Study Mode" 
              desc="Download course materials and summaries for data-free studying." 
            />
            <FeatureItem 
              icon="✅" 
              title="Verified Academic Content" 
              desc="Materials curated from top Nigerian universities." 
            />
          </div>
        </div>

        {/* Pricing Card */}
        <div className="bg-[#0A1128] rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-[#00D632] text-xs font-bold uppercase mb-1">Premium Annual</div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">₦2,500</span>
                <span className="text-gray-400 text-sm">/ month</span>
              </div>
              <p className="text-gray-400 text-xs mt-1">Billed annually. Cancel anytime.</p>
            </div>
            <div className="bg-[#00D632] text-[#0A1128] text-[10px] font-bold px-3 py-1 rounded-full">
              BEST VALUE
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              <Lock className="w-3 h-3" /> Secure payment via Paystack
            </div>
            <div className="flex gap-2 opacity-50 grayscale">
              <div className="bg-white/10 px-2 py-1 rounded text-[10px]">VISA</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[10px]">MASTERCARD</div>
              <div className="bg-white/10 px-2 py-1 rounded text-[10px]">VERVE</div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <button className="text-[#00D632] text-sm font-bold">Restore Purchase</button>
          <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>

        <div className="fixed bottom-6 left-4 right-4">
          <button className="w-full bg-[#00D632] text-[#0A1128] font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-[#00b52a] transition-colors">
            Unlock Premium Now
          </button>
        </div>

      </div>
    </Layout>
  );
}

function FeatureItem({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-lg shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-[#0A1128]">{title}</h4>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className="bg-[#00D632] w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1">
        <Check className="w-3 h-3 text-white stroke-[3]" />
      </div>
    </div>
  );
}
