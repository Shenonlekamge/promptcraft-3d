import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for the background grid - you can replace these with your 3D asset renders
  const gridItems = Array.from({ length: 18 });

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans text-white">
      
      {/* 1. Background Image Mosaic */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 opacity-40 scale-110 blur-[1px]">
        {gridItems.map((_, i) => (
          <div 
            key={i} 
            className={`bg-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-105 
              ${i % 3 === 0 ? 'aspect-square' : 'aspect-video'} 
              ${i % 5 === 0 ? 'md:col-span-2' : ''}`}
          >
            <img 
              src={`https://picsum.photos/seed/${i + 40}/800/600`} 
              alt="3D Interior Concept"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        ))}
      </div>

      {/* 2. Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />

      {/* 3. Navigation Bar */}
      <nav className="relative z-20 flex justify-between items-center p-8 max-w-7xl mx-auto">
        <div className="text-xl font-bold tracking-tighter">
          PROMPT<span className="text-blue-500">CRAFT 3D</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <button className="hover:text-white transition-colors">Showcase</button>
          <button className="hover:text-white transition-colors underline decoration-blue-500 underline-offset-8">Pricing</button>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-5 py-2 rounded-full transition-all"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* 4. Hero Content */}
      <main className="relative z-10 flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <h1 className="text-8xl md:text-[10rem] font-bold tracking-tighter mb-4 animate-in fade-in zoom-in duration-1000">
          PromtCraft 3D
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-lg mb-10 font-medium">
          Where the next wave of interior design happens.
        </p>
        
        <button 
          onClick={() => navigate('/auth')}
          className="group relative px-10 py-5 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-xl rounded-full transition-all duration-300 shadow-2xl"
        >
          <span className="relative z-10 text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            Start Creating with AI
          </span>
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all" />
        </button>
      </main>

      {/* 5. Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll to Explore</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
      </div>

    </div>
  );
};

export default LandingPage;