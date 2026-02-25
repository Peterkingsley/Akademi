import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { BarChart3, TrendingUp, BookOpen, MessageSquare, Award, Zap, Loader2 } from 'lucide-react';

export default function Progress() {
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, sessionsRes] = await Promise.all([
          fetch('/api/learning-profile'),
          fetch('/api/sessions')
        ]);
        const profileData = await profileRes.json();
        const sessionsData = await sessionsRes.json();
        setProfile(profileData);
        setSessions(sessionsData);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Your Progress">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </Layout>
    );
  }

  const strengths = JSON.parse(profile?.subject_strengths || '[]');
  const weaknesses = JSON.parse(profile?.subject_weaknesses || '[]');

  return (
    <Layout title="Learning Insights">
      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Total Sessions"
            value={profile?.session_count || 0}
            icon={MessageSquare}
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Study Hours"
            value="12.5"
            icon={TrendingUp}
            color="bg-green-50 text-green-600"
          />
        </div>

        {/* Learning Trajectory */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-600" /> Learning Trajectory
          </h3>
          <div className="space-y-4">
            <ProgressBar label="Programming Mastery" progress={85} />
            <ProgressBar label="Mathematical Logic" progress={40} />
            <ProgressBar label="Physics Fundamentals" progress={65} />
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="space-y-4">
           <h3 className="font-bold text-gray-900 text-sm px-1">AI Insights</h3>
           <div className="space-y-3">
             <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl flex gap-3">
               <Award className="w-6 h-6 text-green-600 shrink-0" />
               <div>
                 <p className="font-bold text-sm text-green-800">Key Strengths</p>
                 <p className="text-xs text-green-700 mt-1">
                   You are excelling in {strengths.join(', ') || 'your current studies'}. Your reasoning in these areas is sharp.
                 </p>
               </div>
             </div>

             <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl flex gap-3">
               <Zap className="w-6 h-6 text-yellow-600 shrink-0" />
               <div>
                 <p className="font-bold text-sm text-yellow-800">Growth Opportunities</p>
                 <p className="text-xs text-yellow-700 mt-1">
                   We've noticed you're spending more time on {weaknesses.join(', ') || 'new topics'}. Consider a Study Session for these.
                 </p>
               </div>
             </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-sm px-1">Recent Activity</h3>
          <div className="space-y-2">
            {sessions.slice(0, 3).map((s: any) => (
              <div key={s.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{s.course_code}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{s.type} Session</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">{new Date(s.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ProgressBar({ label, progress }: { label: string, progress: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-gray-600">{label}</span>
        <span className="text-green-600">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#00D632] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
