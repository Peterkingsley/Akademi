import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Search, Check, Eye, EyeOff, BookOpen, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: Splash, 1: Intro, 2: Uni, 3: Study, 4: Auth, 5: Success
  const [formData, setFormData] = useState({
    university: '',
    faculty: '',
    department: '',
    level: '',
    email: '',
    password: '',
    name: 'Tunde', // Default for demo
  });

  useEffect(() => {
    // Splash screen timer
    if (step === 0) {
      const timer = setTimeout(() => setStep(1), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = async () => {
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          university: formData.university,
          department: formData.department,
          level: formData.level
        })
      });
      localStorage.setItem('onboarding_complete', 'true');
      navigate('/');
    } catch (error) {
      console.error('Onboarding failed', error);
    }
  };

  return (
    <div className="h-screen w-full bg-white overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {step === 0 && <SplashScreen key="splash" />}
        {step === 1 && <IntroStep key="intro" onNext={handleNext} />}
        {step === 2 && <UniversityStep key="uni" onNext={handleNext} onBack={handleBack} data={formData} update={updateForm} />}
        {step === 3 && <StudyStep key="study" onNext={handleNext} onBack={handleBack} data={formData} update={updateForm} />}
        {step === 4 && <AuthStep key="auth" onNext={handleNext} onBack={handleBack} data={formData} update={updateForm} />}
        {step === 5 && <SuccessStep key="success" onFinish={handleFinish} name={formData.name} />}
      </AnimatePresence>
    </div>
  );
}

function SplashScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full w-full bg-[#0A1128] flex flex-col items-center justify-center"
    >
      <div className="flex items-end gap-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">Akademi</h1>
        <div className="w-2 h-2 bg-[#00D632] rounded-full mb-2"></div>
      </div>
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="mt-8 w-2 h-2 bg-[#00D632] rounded-full"
      />
    </motion.div>
  );
}

function IntroStep({ onNext }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -100 }}
      className="h-full w-full relative"
    >
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?q=80&w=1974&auto=format&fit=crop" 
          alt="Student" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80"></div>
      </div>

      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="text-white/80 text-xs font-bold tracking-widest uppercase">Step 1 of 4</div>
        <div className="w-full bg-white/20 h-1 mt-2 rounded-full overflow-hidden">
          <div className="bg-[#00D632] h-full w-1/4"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 z-10 text-white space-y-6">
        <h1 className="text-4xl font-bold leading-tight">
          The tutor you <br />
          <span className="text-[#00D632]">always</span> needed. <br />
          Finally here.
        </h1>
        <p className="text-gray-200 text-lg">
          Personalized learning and exam prep designed for the Nigerian student.
        </p>
        
        <button 
          onClick={onNext}
          className="w-full bg-[#00D632] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00b52a] transition-colors"
        >
          Let's go <ArrowRight className="w-5 h-5" />
        </button>
        
        <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-gray-500 border border-black"></div>
            ))}
          </div>
          <span>JOIN 10,000+ STUDENTS NATIONWIDE</span>
        </div>
      </div>
    </motion.div>
  );
}

function UniversityStep({ onNext, onBack, data, update }: any) {
  const universities = ['UNILAG', 'UI', 'OAU', 'UNIBEN', 'ABU', 'UNN'];

  return (
    <StepLayout step={2} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1128] mb-2">Which university do you attend?</h1>
          <p className="text-gray-500">This helps us find the right curriculum and past questions for your exams.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input 
            value={data.university}
            onChange={(e) => update('university', e.target.value)}
            placeholder="Search schools..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00D632]"
          />
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Popular Universities</h3>
          <div className="flex flex-wrap gap-3">
            {universities.map(uni => (
              <button
                key={uni}
                onClick={() => update('university', uni)}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-bold transition-all",
                  data.university === uni 
                    ? "bg-[#0A1128] text-white shadow-lg" 
                    : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300"
                )}
              >
                {uni}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <a href="#" className="text-[#00D632] text-sm font-bold flex items-center gap-1">
            My school isn't here <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <button 
            onClick={onNext}
            disabled={!data.university}
            className="w-full bg-[#00D632] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Over 500,000 Nigerian students are already studying with us
          </p>
        </div>
      </div>
    </StepLayout>
  );
}

function StudyStep({ onNext, onBack, data, update }: any) {
  return (
    <StepLayout step={3} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1128] mb-2">What are you studying?</h1>
          <p className="text-gray-500">This helps us show you the right courses and materials.</p>
        </div>

        <div className="space-y-4">
          <SelectInput 
            label="Faculty" 
            value={data.faculty} 
            onChange={(val: string) => update('faculty', val)}
            options={['Science', 'Engineering', 'Arts', 'Social Sciences']} 
          />
          <SelectInput 
            label="Department" 
            value={data.department} 
            onChange={(val: string) => update('department', val)}
            options={['Computer Science', 'Mathematics', 'Physics', 'Chemistry']} 
          />
          <SelectInput 
            label="Level" 
            value={data.level} 
            onChange={(val: string) => update('level', val)}
            options={['100L', '200L', '300L', '400L', '500L']} 
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
          <button 
            onClick={onNext}
            disabled={!data.faculty || !data.department || !data.level}
            className="w-full bg-[#00D632] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Tailoring your learning experience to your academic path
          </p>
        </div>
      </div>
    </StepLayout>
  );
}

function AuthStep({ onNext, onBack, data, update }: any) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <StepLayout step={4} onBack={onBack}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0A1128] mb-2">One last step</h1>
          <p className="text-gray-500">Create your account to save your progress and access your personalized AI tutor.</p>
        </div>

        <button className="w-full bg-white border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs font-bold text-gray-400">OR EMAIL</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
            <input 
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="e.g. student@unilag.edu.ng"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00D632]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={data.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00D632]"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 w-5 h-5 rounded border-gray-300 text-[#00D632] focus:ring-[#00D632]" />
          <p className="text-xs text-gray-500">
            I agree to the <span className="text-[#00D632]">Terms of Service</span> and <span className="text-[#00D632]">Privacy Policy</span>.
          </p>
        </div>

        <button 
          onClick={onNext}
          disabled={!data.email || !data.password}
          className="w-full bg-[#00D632] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none"
        >
          Sign Up
        </button>

        <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
          <div className="bg-green-100 p-1 rounded-full shrink-0">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <p className="text-xs text-gray-500">
            We only use your info to personalize your learning. We never sell it.
          </p>
        </div>

        <p className="text-center text-sm text-gray-500 pb-6">
          Already have an account? <span className="text-[#00D632] font-bold">Log In</span>
        </p>
      </div>
    </StepLayout>
  );
}

function SuccessStep({ onFinish, name }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-[#E8FCE8] relative flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-sm relative z-10">
          <div className="w-20 h-20 bg-[#00D632] rounded-full flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-4 bg-yellow-400 p-2 rounded-lg rotate-12">
          <div className="w-4 h-4 text-white">✨</div>
        </div>
        <div className="absolute top-10 -left-6 bg-[#00D632] p-2 rounded-full">
           <GraduationCap className="w-4 h-4 text-white" />
        </div>
        <div className="absolute -bottom-2 right-0 bg-[#0A1128] p-2 rounded-full">
           <BookOpen className="w-4 h-4 text-white" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-[#0A1128] mb-2">
        You're all set, <br />
        <span className="text-[#00D632]">{name}.</span>
      </h1>
      
      <p className="text-gray-600 mb-8 max-w-xs">
        Your Computer Science materials are ready.
      </p>

      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-4 w-full max-w-xs mb-12 border border-white">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <div className="w-6 h-6">🧠</div>
        </div>
        <div className="text-left">
          <div className="text-[10px] font-bold text-gray-400 uppercase">AI Assistant Ready</div>
          <div className="text-sm font-bold text-[#0A1128]">Personalized for 200L CS</div>
        </div>
      </div>

      <button 
        onClick={onFinish}
        className="w-full max-w-xs bg-[#00D632] text-[#0A1128] font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2"
      >
        Explore Akademi <div className="w-5 h-5">🚀</div>
      </button>

      <p className="text-xs text-gray-400 mt-6">
        Welcome to the future of learning
      </p>
    </motion.div>
  );
}

function StepLayout({ step, onBack, children }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-full flex flex-col bg-[#F8F9FA]"
    >
      <div className="px-6 pt-6 pb-2 bg-white">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
            <ChevronRight className="w-6 h-6 rotate-180 text-gray-700" />
          </button>
          <div className="text-sm font-bold text-gray-900">Step {step} of 4</div>
        </div>
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-[#00D632] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        {children}
      </div>
    </motion.div>
  );
}

function SelectInput({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-400 uppercase">{label}</label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-[#00D632]"
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronRight className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
      </div>
    </div>
  );
}
