import React from 'react';


const Onboarding: React.FC = () => {


  const handleSelect = () => {
    sessionStorage.setItem("onboardingComplete", "true");
    window.location.assign('/builder');
  };

  const options = [
    {
      id: 'personal',
      title: 'Personal Use',
      description: 'Design your own home or dream space.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80'
    },
    {
      id: 'gaming',
      title: 'Gaming Room Design',
      description: 'Create the ultimate immersive gaming setup.',
      image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80'
    },
    {
      id: 'resort',
      title: 'Resort Room',
      description: 'Plan luxurious and relaxing hospitality spaces.',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80'
    },
    {
      id: 'cabana',
      title: 'Cabana & Outdoor',
      description: 'Design outdoor living and poolside escapes.',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-4 tracking-tight">
          Welcome to PromptCraft 3D
        </h1>
        <p className="text-xl text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          For what purpose are you using PromptCraft 3D? Select an option below to tailor your experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <div 
              key={option.id}
              onClick={handleSelect}
              className="group relative rounded-3xl overflow-hidden cursor-pointer border border-slate-800 bg-slate-900/50 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-[4/5] relative">
                <img 
                  src={option.image} 
                  alt={option.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
                
                <div className="absolute bottom-0 left-0 w-full p-6 transform transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={handleSelect}
            className="text-slate-500 hover:text-white transition-colors underline underline-offset-4"
          >
            Skip for now, I just want to explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
