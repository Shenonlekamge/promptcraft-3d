import { useState } from "react";

interface BuildPanelProps {
  onGenerate: (text: string) => void;
  isGenerating: boolean;
  generationError: string | null;
}

const BuildPanel = ({ onGenerate, isGenerating, generationError }: BuildPanelProps) => {
  const [inputText, setInputText] = useState("");

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-base font-bold text-pc-muted uppercase mb-5 tracking-tight">AI Generator</h2>
      <textarea 
        className="w-full h-40 bg-pc-surface border border-pc-surface focus:border-pc-cyan text-pc-text text-base rounded-md p-5 outline-none transition-all resize-none mb-4 shadow-inner"
        placeholder={"Try prompts like:\n• bedroom\n• 12x14 kitchen\n• modern living room\n• home office\n• kids room\n• bathroom"}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      {/* Quick prompt chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['bedroom', 'living room', 'kitchen', 'office', 'bathroom', 'dining room'].map((chip) => (
          <button
            key={chip}
            onClick={() => setInputText(chip)}
            className="text-xs px-3 py-1.5 bg-pc-surface text-pc-muted hover:text-pc-cyan hover:border-pc-cyan/40 border border-transparent rounded-full transition-all capitalize font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onGenerate(inputText)} 
        disabled={isGenerating || !inputText.trim()}
        className={`w-full py-4 text-base font-bold rounded shadow-lg transition-all ${
          isGenerating || !inputText.trim() 
          ? "bg-pc-surface text-pc-muted cursor-not-allowed" 
          : "bg-pc-accent hover:bg-pc-cyan text-pc-text"
        }`}
      >
        {isGenerating ? "CONSTRUCTING..." : "GENERATE LAYOUT"}
      </button>

      {/* Error message */}
      {generationError && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 whitespace-pre-line">
          {generationError}
        </div>
      )}
    </div>
  );
};

export default BuildPanel;