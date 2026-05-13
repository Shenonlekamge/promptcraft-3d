import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import PromptPanel from "../components/PromptPanel";
import PreviewPanel from "../components/PreviewPanel";
import { generateLayout, getSupportedRoomTypes } from "../components/layoutGenerator";

export type RoomData = {
  width: number; depth: number; height: number;
  floorColor: string; wallColor: string;
  floorTexture: string; wallTexture: string;
  furniture: { id: string; type: string; position: [number, number, number]; rotation: number; color: string; }[];
  sunPosition?: [number, number, number];
  hasCeiling?: boolean;
  ceilingColor?: string;
  hasSecondStory?: boolean;
};

const Home = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'translate' | 'rotate'>('translate');
  const [activeFloor, setActiveFloor] = useState<1 | 2>(1);
  const manifestRef = useRef<string[]>([]);
  const [sceneData, setSceneData] = useState<RoomData>({
    width: 10, depth: 10, height: 3,
    floorColor: "#9ca3af", wallColor: "#ffffff",
    floorTexture: "none", wallTexture: "none",
    furniture: [],
    sunPosition: [10, 15, 10],
    hasCeiling: false,
    ceilingColor: "#ffffff",
    hasSecondStory: false
  });

  // Fetch manifest once on mount
  useEffect(() => {
    fetch('/models/manifest.json')
      .then(res => res.json())
      .then((data: { type: string }[]) => {
        manifestRef.current = data.map(a => a.type);
      })
      .catch(() => { });
  }, []);

  const updateRoom = (updates: Partial<RoomData>) => {
    setSceneData((prev) => ({ ...prev, ...updates }));
  };

  // --- AI BACKEND HANDLER ---
  // This handles instructions like: { action: 'REPLACE', targetId: '123', newType: 'bedDouble' }
  const handleAIUpdate = (instructions: any[]) => {
    setSceneData((prev) => {
      let currentFurniture = [...prev.furniture];

      instructions.forEach(instr => {
        if (instr.action === 'ADD') {
          currentFurniture.push({
            id: Math.random().toString(36).substr(2, 9),
            type: instr.type,
            position: instr.position || [0, 0, 0],
            rotation: instr.rotation || 0,
            color: "#3895D3"
          });
        }
        if (instr.action === 'REPLACE') {
          currentFurniture = currentFurniture.map(item =>
            item.id === instr.targetId ? { ...item, type: instr.newType } : item
          );
        }
        if (instr.action === 'REMOVE') {
          currentFurniture = currentFurniture.filter(item => item.id !== instr.targetId);
        }
      });

      return { ...prev, furniture: currentFurniture };
    });
  };

  const handleAddFurniture = (type: string, color: string) => {
    setSceneData((prev) => ({
      ...prev,
      furniture: [...prev.furniture, {
        id: Math.random().toString(36).substr(2, 9),
        type, position: [0, activeFloor === 2 ? prev.height : 0, 0], rotation: 0, color
      }]
    }));
  };

  const handleDeleteFurniture = (id: string) => {
    setSceneData((prev) => ({
      ...prev,
      furniture: prev.furniture.filter((f) => f.id !== id)
    }));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const handleMoveItem = (id: string, direction: 'forward' | 'back' | 'left' | 'right') => {
    const step = 0.5;
    setSceneData((prev) => {
      const item = prev.furniture.find(f => f.id === id);
      if (!item) return prev;

      let [x, y, z] = item.position;
      const buffer = 0.8;

      if (direction === 'forward') z = Math.max(-(prev.depth / 2) + buffer, z - step);
      if (direction === 'back') z = Math.min((prev.depth / 2) - buffer, z + step);
      if (direction === 'left') x = Math.max(-(prev.width / 2) + buffer, x - step);
      if (direction === 'right') x = Math.min((prev.width / 2) - buffer, x + step);

      return {
        ...prev,
        furniture: prev.furniture.map((f) => (f.id === id ? { ...f, position: [x, y, z] as [number, number, number] } : f))
      };
    });
  };

  const handleUpdatePosition = (id: string, newPosition: [number, number, number]) => {
    if (id === 'sun') {
      setSceneData((prev) => ({
        ...prev,
        sunPosition: newPosition
      }));
      return;
    }
    setSceneData((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => (f.id === id ? { ...f, position: newPosition } : f))
    }));
  };

  return (
    <div className="h-screen flex flex-col bg-pc-bg text-pc-text font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-pc-surface bg-pc-bg flex flex-col">
          <PromptPanel
            data={sceneData}
            onGenerate={(text) => {
              setIsGenerating(true);
              setGenerationError(null);

              // Simulate a brief loading feel
              setTimeout(() => {
                const result = generateLayout(text, sceneData, manifestRef.current);

                if (!result) {
                  const supported = getSupportedRoomTypes();
                  setGenerationError(
                    `Could not understand that prompt. Try something like:\n• "bedroom"\n• "12x14 kitchen"\n• "modern living room"\n\nSupported: ${supported.join(', ')}`
                  );
                  setIsGenerating(false);
                  return;
                }

                // Apply the generated layout
                setSceneData((prev) => ({
                  ...prev,
                  ...result.roomUpdates,
                  furniture: result.furniture,
                }));
                setSelectedId(null);
                setIsGenerating(false);
              }, 1200);
            }}
            isGenerating={isGenerating}
            onAddFurniture={handleAddFurniture}
            onUpdateRoom={updateRoom}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onDeleteItem={handleDeleteFurniture}
            onMoveItem={handleMoveItem}
            activeTool={activeTool}
            onSetTool={setActiveTool}
            generationError={generationError}
          />
        </div>
        <div className="w-2/3 bg-white relative">
          <PreviewPanel
            data={sceneData}
            onUpdatePosition={handleUpdatePosition}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            activeTool={activeTool}
            activeFloor={activeFloor}
          />
        </div>
      </div>

      {/* Floor selector overlay if second story exists */}
      {sceneData.hasSecondStory && (
        <div className="absolute top-24 right-8 bg-slate-900 border border-slate-700 rounded-lg p-2 flex flex-col gap-2 z-50 shadow-xl">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-1">Floor</div>
          <button
            onClick={() => setActiveFloor(2)}
            className={`w-10 h-10 rounded font-bold transition-colors ${activeFloor === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            2
          </button>
          <button
            onClick={() => setActiveFloor(1)}
            className={`w-10 h-10 rounded font-bold transition-colors ${activeFloor === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            1
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;