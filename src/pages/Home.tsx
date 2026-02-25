import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Edit3, BookOpen, MessageCircle, GraduationCap, ChevronRight, Zap } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <Layout title="Good morning, Tunde">
      <div className="p-4 space-y-6">
        
        {/* Exam Countdown Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A2E1A] rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#00D632] p-2 rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Exam in 4 days</h3>
                <p className="text-gray-300 text-xs">Your prep plan is ready</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-[#00D632] h-1.5 rounded-full w-[75%]"></div>
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#00D632]/20 rounded-full blur-xl"></div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <QuickAction 
            to="/assignment" 
            icon={Edit3} 
            label="Solve Assignment" 
            color="text-blue-500" 
            bg="bg-blue-50" 
          />
          <QuickAction 
            to="/library" 
            icon={BookOpen} 
            label="Study Materials" 
            color="text-orange-500" 
            bg="bg-orange-50" 
          />
          <QuickAction 
            to="/tutor" 
            icon={MessageCircle} 
            label="Live Tutor" 
            color="text-purple-500" 
            bg="bg-purple-50" 
          />
          <QuickAction 
            to="/exam-prep" 
            icon={Zap} 
            label="Exam Prep" 
            color="text-green-500" 
            bg="bg-green-50" 
          />
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
            <button className="text-[#00D632] text-xs font-semibold">VIEW ALL</button>
          </div>
          
          <div className="space-y-3">
            <ActivityCard 
              title="GST 111 Notes" 
              subtitle="Communication Skills" 
              time="2h ago" 
              icon={BookOpen}
              iconColor="text-orange-500"
              iconBg="bg-orange-100"
            />
            <ActivityCard 
              title="Quiz: Algebra" 
              subtitle="Linear Equations" 
              time="Yesterday" 
              icon={Zap}
              iconColor="text-blue-500"
              iconBg="bg-blue-100"
            />
          </div>
        </div>

        {/* Recommended */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Recommended for you</h2>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shrink-0">
              <span className="text-white font-mono text-xs">MTH</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">PAST QUESTIONS</span>
              </div>
              <h3 className="font-bold text-sm text-gray-900">MTH101 Past Questions</h3>
              <p className="text-xs text-gray-500">Practice with 2022 solutions</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>

      </div>
    </Layout>
  );
}

function QuickAction({ to, icon: Icon, label, color, bg }: { to: string; icon: any; label: string; color: string; bg: string }) {
  return (
    <Link to={to} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 hover:bg-gray-50 transition-colors h-32">
      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <span className="font-semibold text-sm text-gray-900">{label}</span>
    </Link>
  );
}

function ActivityCard({ title, subtitle, time, icon: Icon, iconColor, iconBg }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-sm text-gray-900">{title}</h3>
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <button className="bg-[#1A2E1A] text-white text-xs font-medium px-3 py-1.5 rounded-lg">
        Resume
      </button>
    </div>
  );
}
