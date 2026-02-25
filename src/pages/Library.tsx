import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Search, Filter, Book, FileText, Download, CheckCircle, Clock, X, Upload as UploadIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Library() {
  const [activeTab, setActiveTab] = useState('all');
  const [materials, setMaterials] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/materials');
      const data = await res.json();
      setMaterials(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <Layout title="University Library">
      <div className="p-4 space-y-4 h-full flex flex-col">
        
        {/* Search */}
        <div className="relative shrink-0">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input 
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search course materials..."
          />
          <button className="absolute right-3 top-2.5 p-1 bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
          {['All Materials', 'Past Questions', 'Lecture Notes', 'Summaries'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                (activeTab === tab.toLowerCase() || (activeTab === 'all' && tab === 'All Materials'))
                  ? "bg-[#00D632] text-white"
                  : "bg-white border border-gray-200 text-gray-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course Cards */}
        <div className="space-y-3 flex-1 overflow-y-auto pb-20">
          <h2 className="font-bold text-gray-900 text-sm">Your Courses</h2>
          {materials.length === 0 ? (
             <div className="text-center py-10 text-gray-500 text-sm">No materials found. Upload one!</div>
          ) : (
            materials.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg",
                  item.course_code.startsWith('CSC') ? "bg-green-100 text-green-600" :
                  item.course_code.startsWith('GST') ? "bg-yellow-100 text-yellow-600" :
                  item.course_code.startsWith('PHY') ? "bg-purple-100 text-purple-600" :
                  "bg-red-100 text-red-600"
                )}>
                  {item.course_code.split(' ')[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{item.course_code}</h3>
                    {item.status === 'verified' && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> VERIFIED
                      </span>
                    )}
                    {item.status === 'pending' && (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{item.title}</p>
                  <div className="flex gap-2">
                    <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-lg font-medium">
                      {item.type}
                    </span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-50 rounded-full">
                  <Download className="w-5 h-5 text-green-600" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Upload FAB */}
        <div className="fixed bottom-24 right-6 z-10">
          <button 
            onClick={() => setShowUpload(true)}
            className="bg-[#00D632] text-white p-4 rounded-full shadow-lg shadow-green-200 hover:scale-105 transition-transform flex items-center gap-2"
          >
            <UploadIcon className="w-5 h-5" />
            <span className="font-bold text-sm">Upload</span>
          </button>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchMaterials} />
          )}
        </AnimatePresence>

      </div>
    </Layout>
  );
}

function UploadModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [course, setCourse] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Notes');
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !course || !title) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseCode', course);
    formData.append('title', title);
    formData.append('type', type);

    try {
      await fetch('/api/materials', {
        method: 'POST',
        body: formData
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Upload Material</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Course Code</label>
            <select 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            >
              <option value="">Select Course</option>
              <option value="CSC 201">CSC 201</option>
              <option value="MTH 101">MTH 101</option>
              <option value="GST 101">GST 101</option>
              <option value="PHY 101">PHY 101</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Title</label>
            <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Lecture 1 Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Type</label>
            <div className="flex gap-2">
              {['Notes', 'PQ', 'Summary'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-bold border transition-colors",
                    type === t 
                      ? "bg-green-50 border-green-500 text-green-700" 
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">File</label>
            <input 
              type="file"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isUploading}
            className="w-full bg-[#00D632] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upload Material'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
