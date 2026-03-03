import React from 'react';
import { Layout } from '@/components/Layout';
import { Database, FileText, Trash2, Calculator, FlaskConical, Book, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OfflineDownloads() {
  const downloads = [
    { id: 1, title: 'GST 101: Use of English', size: '12.4 MB', type: 'PDF', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 2, title: 'MTH 101: Calculus I', size: '25.8 MB', type: 'PDF', icon: Calculator, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 3, title: 'CHM 101: General Chemistry', size: '18.2 MB', type: 'PDF', icon: FlaskConical, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 4, title: 'PHS 101: Physics for Life...', size: '42.1 MB', type: 'PDF', icon: Book, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 5, title: 'GST 102: Philosophy & Logic', size: '8.5 MB', type: 'PDF', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 6, title: 'JAMB Past Questions: 2023', size: '15.0 MB', type: 'Quiz Pack', icon: HelpCircle, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <Layout title="Manage Downloads" showBack>
      <div className="p-4 space-y-6 pb-24">
        
        {/* Storage Usage */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <Database className="w-5 h-5 text-[#00D632]" />
            <span className="font-bold text-[#0A1128] text-sm">Storage Usage</span>
            <span className="ml-auto text-xs text-gray-500 font-mono">145MB / 320MB</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-[#00D632] h-full rounded-full w-[45%]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
            <span className="text-[#00D632]">45% Used</span>
            <span className="text-gray-400">175MB Available</span>
          </div>
        </div>

        {/* Downloads List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#0A1128]">Downloaded Materials</h3>
            <span className="text-[#00D632] text-xs font-bold">8 Files</span>
          </div>
          
          <div className="space-y-3">
            {downloads.map((item) => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", item.bg)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-[#0A1128] truncate">{item.title}</h4>
                  <p className="text-xs text-gray-500">{item.size} • {item.type}</p>
                </div>
                <button className="p-2 hover:bg-red-50 rounded-full group transition-colors">
                  <Trash2 className="w-5 h-5 text-gray-300 group-hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delete All Button */}
        <div className="fixed bottom-6 left-4 right-4">
          <button className="w-full bg-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
            <Trash2 className="w-5 h-5" />
            Delete All Downloads
          </button>
        </div>

      </div>
    </Layout>
  );
}
