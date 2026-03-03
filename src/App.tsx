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

import MyUploads from '@/pages/MyUploads';
import EditAcademicDetails from '@/pages/profile/EditAcademicDetails';
import Subscription from '@/pages/profile/Subscription';
import Notifications from '@/pages/profile/Notifications';
import Appearance from '@/pages/profile/Appearance';
import OfflineDownloads from '@/pages/profile/OfflineDownloads';

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
      <Route path="/my-uploads" element={<MyUploads />} />
      
      {/* Profile Sub-pages */}
      <Route path="/profile/edit" element={<EditAcademicDetails />} />
      <Route path="/profile/subscription" element={<Subscription />} />
      <Route path="/profile/notifications" element={<Notifications />} />
      <Route path="/profile/appearance" element={<Appearance />} />
      <Route path="/profile/downloads" element={<OfflineDownloads />} />
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
