import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { ChevronDown, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function EditAcademicDetails() {
  const [university, setUniversity] = useState('University of Lagos (UNILAG)');
  const [faculty, setFaculty] = useState('Engineering');
  const [department, setDepartment] = useState('Computer Engineering');
  const [level, setLevel] = useState('400 Level');

  return (
    <Layout title="Edit Academic Details" showBack>
      <div className="p-4 space-y-6 pb-24">
        
        <div>
          <h2 className="text-[#00D632] text-xs font-bold uppercase mb-2">Academic Profile</h2>
          <p className="text-gray-500 text-sm">
            Update your institution details to personalize your AI learning path.
          </p>
        </div>

        <div className="space-y-4">
          <SelectInput 
            label="University" 
            value={university} 
            onChange={setUniversity}
            options={['University of Lagos (UNILAG)', 'University of Ibadan (UI)', 'Obafemi Awolowo University (OAU)']} 
          />
          <SelectInput 
            label="Faculty" 
            value={faculty} 
            onChange={setFaculty}
            options={['Engineering', 'Science', 'Arts', 'Social Sciences']} 
          />
          <SelectInput 
            label="Department" 
            value={department} 
            onChange={setDepartment}
            options={['Computer Engineering', 'Systems Engineering', 'Electrical Engineering']} 
          />
          <SelectInput 
            label="Level" 
            value={level} 
            onChange={setLevel}
            options={['100 Level', '200 Level', '300 Level', '400 Level', '500 Level']} 
          />
        </div>

        <div className="bg-[#1A2E1A] p-4 rounded-xl flex gap-3 border border-[#00D632]/20">
          <Info className="w-5 h-5 text-[#00D632] shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            Changing your academic details will refresh your personalized exam prep materials and study schedules to match your new curriculum.
          </p>
        </div>

        <div className="fixed bottom-6 left-4 right-4">
          <button className="w-full bg-[#00D632] text-[#0A1128] font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:bg-[#00b52a] transition-colors">
            Save Changes
            <CheckCircle className="w-5 h-5 fill-current" />
          </button>
        </div>

      </div>
    </Layout>
  );
}

function SelectInput({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-bold text-gray-200">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#0A1128] text-white border border-gray-800 rounded-xl px-4 py-3.5 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00D632] text-sm"
        >
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-[#00D632] pointer-events-none" />
      </div>
    </div>
  );
}
