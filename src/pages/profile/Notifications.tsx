import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { BookOpen, Clock, AlertCircle, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const [settings, setSettings] = useState({
    studyReminders: true,
    examAlerts: true,
    materialAlerts: false,
    streakReminders: true,
  });

  const toggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  return (
    <Layout title="Notifications" showBack>
      <div className="p-4 space-y-8">
        
        {/* Study Management */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Study Management</h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <ToggleItem 
              icon={BookOpen} 
              label="Study Reminders" 
              checked={settings.studyReminders} 
              onChange={() => toggle('studyReminders')}
              color="text-blue-500"
              bg="bg-blue-50"
            />
            <div className="h-px bg-gray-50 mx-4"></div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-bold text-[#0A1128] text-sm">Reminder Schedule</span>
              </div>
              <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-xs font-bold text-[#0A1128] flex items-center gap-2">
                07:00 PM <Clock className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Exam & Materials */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Exam & Materials</h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <ToggleItem 
              icon={AlertCircle} 
              label="Exam Countdown Alerts" 
              checked={settings.examAlerts} 
              onChange={() => toggle('examAlerts')}
              color="text-red-500"
              bg="bg-red-50"
            />
            <div className="h-px bg-gray-50 mx-4"></div>
            <ToggleItem 
              icon={BookOpen} 
              label="New Material Alerts" 
              checked={settings.materialAlerts} 
              onChange={() => toggle('materialAlerts')}
              color="text-orange-500"
              bg="bg-orange-50"
            />
          </div>
        </div>

        {/* Engagement */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Engagement</h3>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <ToggleItem 
              icon={Flame} 
              label="Streak Reminders" 
              checked={settings.streakReminders} 
              onChange={() => toggle('streakReminders')}
              color="text-orange-500"
              bg="bg-orange-50"
            />
          </div>
        </div>

      </div>
    </Layout>
  );
}

function ToggleItem({ icon: Icon, label, checked, onChange, color, bg }: any) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bg)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <span className="font-bold text-[#0A1128] text-sm">{label}</span>
      </div>
      <button 
        onClick={onChange}
        className={cn(
          "w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out",
          checked ? "bg-blue-600" : "bg-gray-200"
        )}
      >
        <div className={cn(
          "w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}
