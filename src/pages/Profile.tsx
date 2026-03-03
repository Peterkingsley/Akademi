import React from 'react';
import { Layout } from '@/components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, GraduationCap, CreditCard, Bell, Palette, Download, Upload, LogOut, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Profile() {
  // Updated profile page
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('onboarding_complete');
    navigate('/onboarding');
  };

  return (
    <Layout title="Profile">
      <div className="p-4 space-y-6 pb-24">
        
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#E8D4B9] overflow-hidden border-4 border-white shadow-sm">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="Profile" className="w-full h-full" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FFD700] text-[#0A1128] text-[10px] font-bold px-2 py-0.5 rounded-full border border-white">
              PREMIUM
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#0A1128]">Tunde</h2>
                <p className="text-sm font-bold text-[#0A1128]/80">University of Lagos</p>
                <p className="text-xs text-gray-500">Computer Science (300L)</p>
              </div>
              <button className="p-2 bg-gray-50 rounded-full hover:bg-gray-100">
                <Edit2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <MenuItem icon={GraduationCap} label="Edit Academic Details" color="text-blue-600" bg="bg-blue-50" />
          <div className="h-px bg-gray-50 mx-4"></div>
          <MenuItem icon={CreditCard} label="Subscription Management" color="text-yellow-600" bg="bg-yellow-50" />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <MenuItem icon={Bell} label="Notification Settings" color="text-blue-500" bg="bg-blue-50" />
          <div className="h-px bg-gray-50 mx-4"></div>
          <MenuItem icon={Palette} label="Appearance" color="text-purple-500" bg="bg-purple-50" />
          <div className="h-px bg-gray-50 mx-4"></div>
          <MenuItem icon={Download} label="Manage Offline Downloads" color="text-green-500" bg="bg-green-50" />
          <div className="h-px bg-gray-50 mx-4"></div>
          <MenuItem icon={Upload} label="My Uploads" color="text-orange-500" bg="bg-orange-50" to="/my-uploads" />
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="flex-1 font-bold text-red-500 text-sm">Log Out</span>
          </button>
        </div>

        <div className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          Academic AI Companion • v2.4.0
        </div>

      </div>
    </Layout>
  );
}

function MenuItem({ icon: Icon, label, color, bg, to }: any) {
  const Content = () => (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <span className="flex-1 font-bold text-[#0A1128] text-sm">{label}</span>
      <ChevronRight className="w-5 h-5 text-gray-300" />
    </div>
  );

  if (to) {
    return <Link to={to} className="block"><Content /></Link>;
  }

  return <button className="w-full text-left"><Content /></button>;
}
