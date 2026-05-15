import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';

const App: React.FC = () => {
  const [isAuthenticated] = useState<boolean>(!!sessionStorage.getItem("user"));

  const checkOnboarded = () => !!sessionStorage.getItem("onboardingComplete");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/onboarding" /> : <AuthPage />} 
        />
        <Route 
          path="/onboarding" 
          element={isAuthenticated ? (checkOnboarded() ? <Navigate to="/builder" /> : <Onboarding />) : <Navigate to="/auth" />} 
        />
        <Route 
          path="/builder" 
          element={isAuthenticated ? (checkOnboarded() ? <Home /> : <Navigate to="/onboarding" />) : <Navigate to="/auth" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;