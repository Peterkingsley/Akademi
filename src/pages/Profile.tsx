import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { User, School, Book, Award, Target, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          fetch('/api/user'),
          fetch('/api/learning-profile')
        ]);
        const userData = await userRes.json();
        const profileData = await profileRes.json();
        setUser(userData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Layout title="Profile">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-green-500" />
        </div>
      </Layout>
    );
  }

  const strengths = JSON.parse(profile?.subject_strengths || '[]');
  const weaknesses = JSON.parse(profile?.subject_weaknesses || '[]');

  return (
    <Layout title="Your Profile">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="inline-block mt-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              {user?.subscription_tier} Account
            </span>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-3">
          <h3 className="font-bold text-gray-900 text-sm px-1 flex items-center gap-2">
            <School className="w-4 h-4 text-green-600" /> Academic Context
          </h3>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
            <DetailRow label="University" value={user?.university} />
            <DetailRow label="Faculty" value={user?.faculty} />
            <DetailRow label="Department" value={user?.department} />
            <DetailRow label="Level" value={user?.level} />
          </div>
        </div>

        {/* Learning Profile */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-sm px-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" /> Learning Profile
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {/* Strengths */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <Award className="w-5 h-5" />
                <span className="font-bold text-sm">Subject Strengths</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {strengths.map((s: string) => (
                  <span key={s} className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full border border-green-100 font-medium">
                    {s}
                  </span>
                ))}
                {strengths.length === 0 && <span className="text-gray-400 text-xs italic">No strengths identified yet</span>}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-500">
                <Zap className="w-5 h-5" />
                <span className="font-bold text-sm">Focus Areas (Weaknesses)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {weaknesses.map((w: string) => (
                  <span key={w} className="bg-red-50 text-red-700 text-xs px-3 py-1 rounded-full border border-red-100 font-medium">
                    {w}
                  </span>
                ))}
                {weaknesses.length === 0 && <span className="text-gray-400 text-xs italic">No focus areas identified yet</span>}
              </div>
            </div>
          </div>

          <div className="bg-[#00D632]/5 p-4 rounded-2xl border border-[#00D632]/10 space-y-2">
             <h4 className="font-bold text-[#00D632] text-xs uppercase tracking-wider">Preferred Style</h4>
             <p className="text-gray-700 text-sm capitalize">{profile?.preferred_explanation_style || 'Not set'}</p>
          </div>
        </div>

        <button className="w-full py-4 text-red-500 font-bold text-sm bg-white border border-gray-100 rounded-2xl">
          Log Out
        </button>
      </div>
    </Layout>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center p-4">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-900 font-semibold text-sm">{value}</span>
    </div>
  );
}
