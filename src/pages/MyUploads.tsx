import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Search, FileText, Clock, AlertCircle, BookOpen, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyUploads() {
  // Mock data to match the screenshot exactly
  const uploads = [
    {
      id: 1,
      code: 'CSC 301',
      title: 'Lecture Notes',
      size: '2.4MB',
      date: '2 days ago',
      status: 'verified',
      type: 'notes'
    },
    {
      id: 2,
      code: 'GST 101',
      title: 'Past Questions',
      size: '1.8MB',
      date: '3 hours ago',
      status: 'pending',
      progress: 6,
      total: 10,
      type: 'pq'
    },
    {
      id: 3,
      code: 'CHM 102',
      title: 'Handout',
      size: '5.1MB',
      status: 'rejected',
      reason: 'DUPLICATE DETECTED',
      type: 'handout'
    },
    {
      id: 4,
      code: 'PHY 101',
      title: 'Textbook Summary',
      size: '1.2MB',
      date: '1 week ago',
      status: 'verified',
      type: 'summary'
    }
  ];

  return (
    <Layout title="My Uploads" showBack>
      <div className="p-4 space-y-4 pb-24">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            className="w-full bg-gray-100 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search course or material..."
          />
        </div>

        {/* Uploads List */}
        <div className="space-y-4">
          {uploads.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    item.status === 'rejected' ? "bg-red-50" : "bg-green-50"
                  )}>
                    {item.status === 'rejected' ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : item.type === 'notes' ? (
                      <FileText className="w-6 h-6 text-green-600" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-green-600" /> // Fallback icon
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.code}</h3>
                    <p className="text-xs text-gray-500">{item.title} • {item.size}</p>
                    {item.date && <p className="text-[10px] text-gray-400 mt-1 uppercase">UPLOADED {item.date}</p>}
                    {item.status === 'rejected' && <p className="text-[10px] text-red-400 mt-1 uppercase font-bold">{item.reason}</p>}
                  </div>
                </div>
                
                <StatusBadge status={item.status} />
              </div>

              {item.status === 'pending' && (
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-gray-600">Verification Progress</span>
                    <span className="text-green-600">{item.progress}/{item.total} received</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#00D632] h-full rounded-full" style={{ width: `${(item.progress! / item.total!) * 100}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    Waiting for more students to upload matching content for validation.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAB */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-[#00D632] rounded-full flex items-center justify-center shadow-lg shadow-green-200 hover:scale-105 transition-transform">
          <Plus className="w-8 h-8 text-white" />
        </button>
      </div>
    </Layout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    verified: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide",
      styles[status as keyof typeof styles]
    )}>
      {status}
    </span>
  );
}
