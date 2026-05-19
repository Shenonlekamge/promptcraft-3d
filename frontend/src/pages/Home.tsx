import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import PromptPanel from "../components/PromptPanel";
import PreviewPanel from "../components/PreviewPanel";
import { getSupportedRoomTypes } from "../components/layoutGenerator";
import { GLTFExporter } from 'three-stdlib';
import * as THREE from 'three';

export type RoomData = {
  width: number; depth: number; height: number;
  floorColor: string; wallColor: string;
  floorTexture: string; wallTexture: string;
  furniture: { id: string; type: string; position: [number, number, number]; rotation: number; color: string; scale?: number; }[];
  sunPosition?: [number, number, number];
  hasCeiling?: boolean;
  ceilingColor?: string;
  hasSecondStory?: boolean;
  isNight?: boolean;
  indoorLightOn?: boolean;
};

const Home = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'translate' | 'rotate' | 'tour'>('translate');
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
    hasSecondStory: false,
    isNight: false,
    indoorLightOn: true
  });
  const sceneRef = useRef<THREE.Scene | null>(null);

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

  const handleRotateItem = (id: string, deltaDeg: number) => {
    setSceneData((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) =>
        f.id === id ? { ...f, rotation: (f.rotation || 0) + deltaDeg } : f
      )
    }));
  };

  const handleMoveItem = (id: string, direction: 'forward' | 'back' | 'left' | 'right') => {
    const step = 0.5;
    setSceneData((prev) => {
      const item = prev.furniture.find(f => f.id === id);
      if (!item) return prev;

      let x = item.position[0];
      const y = item.position[1];
      let z = item.position[2];
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

  const handleUpdateRotation = (id: string, rotationDeg: number) => {
    setSceneData((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => (f.id === id ? { ...f, rotation: rotationDeg } : f))
    }));
  };

  const handleScaleItem = (id: string, delta: number) => {
    setSceneData((prev) => ({
      ...prev,
      furniture: prev.furniture.map((f) => {
        if (f.id !== id) return f;
        const current = f.scale ?? 1;
        const next = Math.max(0.2, Math.min(5, current + delta));
        return { ...f, scale: parseFloat(next.toFixed(2)) };
      })
    }));
  };

  const handleExport = (format: 'json' | 'jpg' | 'gltf') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(sceneData, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "promptcraft_room_export.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'jpg') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const dataURL = canvas.toDataURL('image/jpeg', 0.9);
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "promptcraft_room_export.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else if (format === 'gltf') {
      if (sceneRef.current) {
        const exporter = new GLTFExporter();
        exporter.parse(
          sceneRef.current,
          (gltf) => {
            const dataStr = JSON.stringify(gltf, null, 2);
            const blob = new Blob([dataStr], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "promptcraft_room_export.gltf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          },
          (error) => {
            console.error('An error happened during GLTF export:', error);
            alert("Error exporting 3D model.");
          },
          { binary: false }
        );
      } else {
        alert("3D scene not ready for export yet.");
      }
    }
  };

  return (
    <div className="h-screen flex flex-col bg-pc-bg text-pc-text font-sans">
      <Navbar onExport={handleExport} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-pc-surface bg-pc-bg flex flex-col">
          <PromptPanel
            data={sceneData}
            onGenerate={async (text) => {
              setIsGenerating(true);
              setGenerationError(null);

              try {
                const response = await fetch("http://127.0.0.1:8000/generate-layout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    prompt: text,
                    room_dimensions: { width: sceneData.width, depth: sceneData.depth },
                    available_assets: manifestRef.current
                  })
                });

                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({ detail: response.statusText }));
                  throw new Error(errorData.detail || "Failed to generate layout");
                }

                const result = await response.json();

                if (!result || !result.furniture) {
                  throw new Error("Invalid response format");
                }

                const validFurniture = result.furniture
                  .filter((item: { type: string }) => {
                    if (item.type === 'door' || item.type === 'window') return true;
                    return manifestRef.current.length === 0 || manifestRef.current.includes(item.type);
                  })
                  .map((item: { id?: string, type: string, position?: number[], rotation?: number, color?: string, scale?: number }) => ({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    type: item.type,
                    position: Array.isArray(item.position) && item.position.length === 3 ? item.position : [0, 0, 0],
                    rotation: typeof item.rotation === 'number' ? item.rotation : 0,
                    color: item.color || "#3895D3",
                    scale: typeof item.scale === 'number' ? item.scale : 2.0
                  }));

                setSceneData((prev) => ({
                  ...prev,
                  ...result.roomUpdates,
                  furniture: validFurniture,
                }));
                setSelectedId(null);
              } catch (err: unknown) {
                const error = err as Error;
                const supported = getSupportedRoomTypes();
                setGenerationError(
                  `Could not generate layout: ${error.message}\nTry something like:\n• "bedroom"\n• "12x14 kitchen"\n\nSupported: ${supported.join(', ')}`
                );
              } finally {
                setIsGenerating(false);
              }
            }}
            isGenerating={isGenerating}
            onAddFurniture={handleAddFurniture}
            onUpdateRoom={updateRoom}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            onDeleteItem={handleDeleteFurniture}
            onMoveItem={handleMoveItem}
            onRotateItem={handleRotateItem}
            onScaleItem={handleScaleItem}
            activeTool={activeTool}
            onSetTool={setActiveTool}
            generationError={generationError}
          />
        </div>
        <div className="w-2/3 bg-white relative">
          <PreviewPanel
            data={sceneData}
            onUpdatePosition={handleUpdatePosition}
            onUpdateRotation={handleUpdateRotation}
            selectedId={selectedId}
            onSelectItem={setSelectedId}
            activeTool={activeTool}
            activeFloor={activeFloor}
            sceneRef={sceneRef}
            onSetTool={setActiveTool}
          />
        </div>
      </div>


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