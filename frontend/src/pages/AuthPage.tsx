import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const response = await fetch("http://localhost:8000/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: credentialResponse.credential }),
    });
    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/onboarding";
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (!isLogin) {
      // --- REGISTRATION FLOW ---
      try {
        const response = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, full_name: fullName }),
        });
        const data = await response.json();

        if (response.ok) {
          alert("Account created! Now please log in.");
          setIsLogin(true); // 👈 THIS switches the UI to the Login screen
        } else {
          setMessage(data.detail || "Registration failed");
        }
      } catch (err) {
        setMessage("Server connection error");
      }
    } else {
      // --- LOGIN FLOW ---
      try {
        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();

        if (response.ok) {
          sessionStorage.setItem("user", JSON.stringify(data.user));
          window.location.href = "/onboarding"; // 👈 Redirect only after successful login
        } else {
          setMessage(data.detail || "Invalid credentials");
        }
      } catch (err) {
        setMessage("Server connection error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Join PromptCraft'}
        </h2>
        
        {message && <p className="text-red-400 text-center text-sm mb-4 bg-red-400/10 p-2 rounded-lg">{message}</p>}

        <GoogleLogin onSuccess={handleGoogleSuccess} theme="filled_blue" width="100%" />

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="px-3 text-xs text-slate-500 uppercase font-bold">Or</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLogin && (
            <input 
              type="text" placeholder="Full Name" 
              className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:border-blue-500"
              value={fullName} onChange={(e) => setFullName(e.target.value)} required 
            />
          )}
          <input 
            type="email" placeholder="Email Address" 
            className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:border-blue-500"
            value={email} onChange={(e) => setEmail(e.target.value)} required 
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full bg-slate-800/50 border border-slate-700 p-3.5 rounded-xl text-white outline-none focus:border-blue-500"
            value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-3.5 rounded-xl font-bold hover:bg-blue-500 mt-4 transition-all">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-400 font-semibold hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;