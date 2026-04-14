import { useState } from "react";

const PromptPanel = () => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    console.log("User Prompt:", prompt);
  };

  return (
    <div className="w-full h-full bg-zinc-800 p-6 flex flex-col gap-4">
      <h2 className="text-white text-lg font-semibold">Describe your room</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. A modern bedroom with LED lights and wooden floor..."
        className="w-full h-40 p-3 rounded-lg bg-zinc-900 text-white outline-none resize-none"
      />

      <button
        onClick={handleGenerate}
        className="bg-green-500 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
      >
        Generate 3D Room
      </button>
    </div>
  );
};

export default PromptPanel;