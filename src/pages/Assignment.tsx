import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Camera, Type, ChevronDown, Info, Send, Loader2, RefreshCw, Zap, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Assignment() {
  const [step, setStep] = useState<'input' | 'mode' | 'chat'>('input');
  const [question, setQuestion] = useState('');
  const [course, setCourse] = useState('');
  const [replyMode, setReplyMode] = useState<'direct' | 'study' | 'question' | 'wrongly'>('direct');
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartSession = async () => {
    if (!question.trim() || !course) return;
    
    setIsLoading(true);
    try {
      // Create session
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_1', // Hardcoded for demo
          type: 'assignment',
          courseCode: course,
          replyMode
        })
      });
      const data = await res.json();
      setSessionId(data.id);
      
      // Send first message
      await sendMessage(data.id, question);
      setStep('chat');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (sid: string, content: string) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/sessions/${sid}/messages`, {
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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !sessionId) return;
    sendMessage(sessionId, question);
    setQuestion('');
  };

  return (
    <Layout title="Solve Assignment" showBack>
      <div className="h-full flex flex-col">
        
        {step === 'input' && (
          <div className="p-4 space-y-6 flex-1">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">How can I help with your assignment today?</h2>
              <p className="text-gray-500 text-sm">Upload a photo or type your question to get started with your Nigerian University prep.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:border-green-500 transition-colors group">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Take a Photo</span>
              </button>
              <button 
                onClick={() => setStep('mode')}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:border-green-500 transition-colors group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center group-hover:bg-green-100">
                  <Type className="w-6 h-6 text-green-600" />
                </div>
                <span className="font-semibold text-gray-900">Type a Question</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Target Course</label>
              <div className="relative">
                <select 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <option value="">Select your course...</option>
                  <option value="CSC 201">CSC 201 - Computer Programming I</option>
                  <option value="MTH 101">MTH 101 - General Mathematics I</option>
                  <option value="GST 101">GST 101 - Use of English</option>
                  <option value="PHY 101">PHY 101 - General Physics I</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {course && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                 <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Your Question</label>
                  <textarea 
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px]"
                    placeholder="Type your assignment question here..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setStep('mode')}
                  disabled={!question.trim()}
                  className="w-full mt-6 bg-[#00D632] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </div>
        )}

        {step === 'mode' && (
          <div className="p-4 space-y-6 flex-1">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-gray-900">Choose Reply Mode</h2>
              <p className="text-gray-500 text-sm">How do you want to learn today?</p>
            </div>

            <div className="space-y-3">
              <ModeCard 
                mode="direct" 
                title="Direct Reply" 
                desc="Get the answer quickly with key points." 
                icon={Zap} 
                selected={replyMode === 'direct'}
                onClick={() => setReplyMode('direct')}
              />
              <ModeCard 
                mode="study" 
                title="Study Reply" 
                desc="Step-by-step breakdown for exam prep." 
                icon={BookOpen} 
                selected={replyMode === 'study'}
                onClick={() => setReplyMode('study')}
              />
              <ModeCard 
                mode="question" 
                title="Question Reply" 
                desc="AI guides you to find the answer yourself." 
                icon={RefreshCw} 
                selected={replyMode === 'question'}
                onClick={() => setReplyMode('question')}
              />
              <ModeCard 
                mode="wrongly" 
                title="Wrongly Reply" 
                desc="Spot the error in a deliberately wrong answer." 
                icon={Info} 
                selected={replyMode === 'wrongly'}
                onClick={() => setReplyMode('wrongly')}
              />
            </div>

            <button 
              onClick={handleStartSession}
              disabled={isLoading}
              className="w-full bg-[#00D632] text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get Answer'}
            </button>
          </div>
        )}

        {step === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-[#00D632] text-white rounded-tr-none" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm"
                  )}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-green-500" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleChatSubmit} className="flex gap-2">
                <input 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ask a follow-up question..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!question.trim() || isLoading}
                  className="bg-[#00D632] text-white p-2 rounded-xl disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

function ModeCard({ mode, title, desc, icon: Icon, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3",
        selected ? "border-[#00D632] bg-green-50" : "border-gray-100 bg-white hover:border-green-200"
      )}
    >
      <div className={cn(
        "p-2 rounded-lg shrink-0",
        selected ? "bg-[#00D632] text-white" : "bg-gray-100 text-gray-500"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className={cn("font-bold text-sm", selected ? "text-gray-900" : "text-gray-700")}>{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
