import React from 'react';
import { Layout } from '@/components/Layout';
import { Flame, Share2, History, BookOpen, ChevronRight, AlertTriangle, GitMerge, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

export default function Progress() {
  // Updated progress page
  const weeklyData = [
    { day: 'M', hours: 2 },
    { day: 'T', hours: 4 },
    { day: 'W', hours: 8, active: true },
    { day: 'T', hours: 3 },
    { day: 'F', hours: 5 },
    { day: 'S', hours: 1 },
    { day: 'S', hours: 2 },
  ];

  return (
    <Layout title="Progress">
      <div className="p-4 space-y-6 pb-24">
        <div className="text-xs text-gray-500 -mt-2">Exam Prep Mode • Active</div>

        {/* Streak Card */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-500 text-sm mb-1">Daily Momentum</p>
              <h2 className="text-3xl font-extrabold text-[#0A1128] mb-1">5 Day Streak!</h2>
              <p className="text-gray-600 text-sm mb-4">Keep the fire burning, Tunde.</p>
              
              <div className="flex gap-3">
                <button className="bg-[#00D632] text-[#0A1128] font-bold px-6 py-2.5 rounded-xl text-sm shadow-lg shadow-green-200">
                  Share Streak
                </button>
                <button className="bg-gray-100 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-sm">
                  View Badges
                </button>
              </div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Flame className="w-8 h-8 text-[#00D632] fill-current" />
            </div>
          </div>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-8 -mt-8 z-0"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <History className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">Total Sessions</span>
            </div>
            <div className="text-3xl font-bold text-[#0A1128]">24</div>
            <div className="text-[10px] text-green-600 font-bold mt-1">↗ +15% vs last week</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-green-600">
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">Courses Covered</span>
            </div>
            <div className="text-3xl font-bold text-[#0A1128]">8</div>
            <div className="text-[10px] text-gray-400 mt-1 truncate">GST 101, CHM 102...</div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-[#0A1128]">Weekly Activity</h3>
              <p className="text-xs text-gray-500">Total study time: 12h 45m</p>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-[#00D632]"></div>
              <div className="w-2 h-2 rounded-full bg-gray-200"></div>
            </div>
          </div>
          
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                  dy={10}
                />
                <Bar dataKey="hours" radius={[4, 4, 4, 4]} barSize={8}>
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.active ? '#0A1128' : '#F3F4F6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weak Topics */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-[#0A1128]">Weak Topics</h3>
            <button className="text-[#00D632] text-xs font-bold">View All</button>
          </div>
          
          <div className="space-y-3">
            <WeakTopicCard 
              subject="GST 101"
              topic="Symbolic Logic"
              score="42%"
              icon={AlertTriangle}
              color="text-red-500"
              bg="bg-red-50"
            />
            <WeakTopicCard 
              subject="CHM 102"
              topic="Organic Bonding"
              score="Needs immediate review"
              icon={GitMerge}
              color="text-orange-500"
              bg="bg-orange-50"
            />
          </div>
        </div>

        {/* CTA */}
        <button className="w-full bg-[#00D632] text-[#0A1128] font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          START RECOMMENDED REVIEW
        </button>

      </div>
    </Layout>
  );
}

function WeakTopicCard({ subject, topic, score, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={cn("w-6 h-6", color)} />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-sm text-[#0A1128]">{subject}: {topic}</h4>
        <p className="text-xs text-gray-500 mb-2">Last Quiz: {score}</p>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full w-1/3", score.includes('42') ? "bg-red-500" : "bg-orange-500")}></div>
        </div>
      </div>
      <button className="p-2 hover:bg-gray-50 rounded-full">
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </button>
    </div>
  );
}
