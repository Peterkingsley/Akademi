import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { MessageSquare, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions');
        const data = await res.json();
        setSessions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <Layout title="Study Sessions">
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] p-6 text-center">
            <div className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-2 -right-2 bg-[#00D632] p-2 rounded-full text-white">
                <span className="text-xs">💬</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No sessions yet</h2>
            <p className="text-gray-500 text-sm mb-8">Solve your first assignment or start a tutoring session to see your history here.</p>
            
            <div className="w-full space-y-3">
              <Link to="/assignment" className="block w-full bg-[#00D632] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 text-center">
                Solve Assignment
              </Link>
              <Link to="/tutor" className="block w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-center">
                Start AI Tutoring
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Link to={session.type === 'tutor' ? '/tutor' : '/assignment'} key={session.id} className="block">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-green-200 transition-colors">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    session.type === 'tutor' ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"
                  )}>
                    {session.type === 'tutor' ? <MessageSquare className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{session.course_code}</h3>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(session.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {session.first_message || (session.type === 'tutor' ? 'Live Tutoring Session' : 'Assignment Help')}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className={cn(
                        "text-[10px] px-2 py-1 rounded-lg font-medium capitalize",
                        session.type === 'tutor' ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"
                      )}>
                        {session.type}
                      </span>
                      {session.reply_mode && (
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-lg font-medium capitalize">
                          {session.reply_mode} Mode
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
