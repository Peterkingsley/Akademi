import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Assignment from '@/pages/Assignment';
import Library from '@/pages/Library';
import Sessions from '@/pages/Sessions';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';
import Tutor from '@/pages/Tutor';
import ExamPrep from '@/pages/ExamPrep';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignment" element={<Assignment />} />
        <Route path="/library" element={<Library />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutor" element={<Tutor />} />
        <Route path="/exam-prep" element={<ExamPrep />} />
      </Routes>
    </BrowserRouter>
  );
}
