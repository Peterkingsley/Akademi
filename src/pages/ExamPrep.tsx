import React from 'react';
import { Layout } from '@/components/Layout';
import { Calendar, Clock, BookOpen, CheckCircle, ChevronRight, PlayCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamPrep() {
  return (
    <Layout title="Exam Prep" showBack>
      <div className="p-4 space-y-6">
        
        {/* Exam Schedule Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-gray-900">Upcoming Exams</h2>
            <button className="text-green-600 text-xs font-bold">EDIT SCHEDULE</button>
          </div>
          
          <div className="space-y-4">
            <ExamItem 
              code="CSC 201" 
              title="Computer Programming I" 
              date="Mon, 15 May" 
              daysLeft={4} 
              color="bg-green-100 text-green-700"
            />
            <ExamItem 
              code="MTH 101" 
              title="General Mathematics I" 
              date="Wed, 17 May" 
              daysLeft={6} 
              color="bg-yellow-100 text-yellow-700"
            />
          </div>
        </div>

        {/* Study Plan */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Your Study Plan</h2>
          <div className="space-y-3">
            <PlanItem 
              subject="CSC 201" 
              topic="Pointers & Arrays" 
              duration="45 mins" 
              status="todo"
            />
            <PlanItem 
              subject="MTH 101" 
              topic="Calculus: Limits" 
              duration="30 mins" 
              status="done"
            />
            <PlanItem 
              subject="GST 101" 
              topic="Essay Writing" 
              duration="1 hour" 
              status="todo"
            />
          </div>
        </div>

        {/* Mock Exams */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">Mock Exams</h2>
          <div className="grid grid-cols-2 gap-4">
            <MockExamCard code="CSC 201" score="85%" />
            <MockExamCard code="MTH 101" score="Pending" />
          </div>
        </div>

      </div>
    </Layout>
  );
}

function ExamItem({ code, title, date, daysLeft, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-xl border border-gray-100">
        <span className="text-xs font-bold text-gray-500">{date.split(',')[0]}</span>
        <span className="text-lg font-bold text-gray-900">{date.split(' ')[1]}</span>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-900 text-sm">{code}</h3>
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", color)}>
            {daysLeft} DAYS LEFT
          </span>
        </div>
        <p className="text-xs text-gray-500 truncate">{title}</p>
      </div>
    </div>
  );
}

function PlanItem({ subject, topic, duration, status }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center border-2",
        status === 'done' ? "bg-green-500 border-green-500" : "border-gray-300"
      )}>
        {status === 'done' && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-bold text-sm text-gray-900">{topic}</h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {duration}
          </span>
        </div>
        <p className="text-xs text-gray-500">{subject}</p>
      </div>
      {status === 'todo' && (
        <button className="p-2 bg-green-50 rounded-full text-green-600 hover:bg-green-100">
          <PlayCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function MockExamCard({ code, score }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="font-bold text-gray-900">{code}</span>
        <span className={cn(
          "text-xs font-bold px-2 py-0.5 rounded-full",
          score === 'Pending' ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
        )}>
          {score}
        </span>
      </div>
      <p className="text-xs text-gray-500">Mock Exam 1</p>
      <button className="mt-2 w-full py-2 bg-gray-50 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100">
        {score === 'Pending' ? 'Start' : 'Review'}
      </button>
    </div>
  );
}
