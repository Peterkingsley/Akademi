import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from '@/pages/Home';
import Assignment from '@/pages/Assignment';
import Library from '@/pages/Library';
import Sessions from '@/pages/Sessions';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';
import Tutor from '@/pages/Tutor';
import ExamPrep from '@/pages/ExamPrep';
import Onboarding from '@/pages/Onboarding';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isOnboarded = localStorage.getItem('onboarding_complete');
    if (!isOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/assignment" element={<Assignment />} />
      <Route path="/library" element={<Library />} />
      <Route path="/sessions" element={<Sessions />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tutor" element={<Tutor />} />
      <Route path="/exam-prep" element={<ExamPrep />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
