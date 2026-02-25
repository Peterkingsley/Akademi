import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Send, Loader2, Mic, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Tutor() {
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [course, setCourse] = useState('');
  const [started, setStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartSession = async () => {
    if (!course) return;
    
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_1',
          type: 'tutor',
          courseCode: course,
          replyMode: 'tutor'
        })
      });
      const data = await res.json();
      setSessionId(data.id);
      setStarted(true);
      
      // Initial greeting
      setMessages([{ role: 'assistant', content: `Hello! I'm your AI tutor for ${course}. What topic would you like to cover today?` }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!sessionId) return;
    
    setMessages(prev => [...prev, { role: 'user', content }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, role: 'user' })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
  };

  if (!started) {
    return (
      <Layout title="Live AI Tutor" showBack>
        <div className="p-6 flex flex-col items-center justify-center h-full space-y-8">
          <div className="w-32 h-32 bg-purple-50 rounded-full flex items-center justify-center relative">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center animate-pulse">
               <span className="text-4xl">🎓</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Personalized Tutoring</h2>
            <p className="text-gray-500">Select a course to start a live interactive session.</p>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Select Course</label>
              <select 
                className="w-full p-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
              >
                <option value="">Choose a course...</option>
                <option value="CSC 201">CSC 201 - Computer Programming I</option>
                <option value="MTH 101">MTH 101 - General Mathematics I</option>
                <option value="GST 101">GST 101 - Use of English</option>
                <option value="PHY 101">PHY 101 - General Physics I</option>
              </select>
            </div>

            <button 
              onClick={handleStartSession}
              disabled={!course || isLoading}
              className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Session'}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Tutor: ${course}`} showBack>
      <div className="flex flex-col h-full bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] p-4 rounded-2xl text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-purple-600 text-white rounded-tr-none" 
                  : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
              )}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === 'assistant' && (
                  <button className="mt-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-2 items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <button type="button" className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
              <Mic className="w-5 h-5" />
            </button>
            <input 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-purple-600 text-white p-3 rounded-xl disabled:opacity-50 shadow-md shadow-purple-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
