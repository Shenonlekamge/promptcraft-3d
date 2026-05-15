import { useState } from "react";
import type { RoomData } from "../pages/Home";
import BuildPanel from "./BuildPanel";
import RoomPanel from "./RoomPanel";
import AssetPanel from "./AssetPanel";
import ToolbarPanel from "./ToolbarPanel";

interface PromptPanelProps {
  data: RoomData | null;
  onGenerate: (text: string) => void;
  isGenerating: boolean;
  onAddFurniture: (type: string, color: string) => void;
  onUpdateRoom: (updates: Partial<RoomData>) => void;
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (id: string, direction: 'forward' | 'back' | 'left' | 'right') => void;
  activeTool: 'translate' | 'rotate' | 'tour';
  onSetTool: (tool: 'translate' | 'rotate' | 'tour') => void;
  generationError: string | null;
}

const PromptPanel = ({ data, onGenerate, isGenerating, onAddFurniture, onUpdateRoom, selectedId, onSelectItem, onDeleteItem, onMoveItem, activeTool, onSetTool, generationError }: PromptPanelProps) => {
  const [activeTab, setActiveTab] = useState<'build' | 'room' | 'furnish' | 'toolbar'>('build');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex border-b border-pc-surface text-sm font-bold uppercase tracking-wider bg-pc-bg/50 backdrop-blur-sm sticky top-0 z-10">
        {(['build', 'room', 'furnish', 'toolbar'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-5 transition-all ${
              activeTab === tab 
              ? 'text-pc-cyan border-b-2 border-pc-cyan bg-pc-surface/30' 
              : 'text-pc-muted hover:text-pc-text'
            }`}
          >
            {tab === 'furnish' ? 'Assets' : tab}
          </button>
        ))}
      </div>

      <div className="p-8 flex-1 overflow-y-auto">
        {activeTab === 'build' && (
          <BuildPanel onGenerate={onGenerate} isGenerating={isGenerating} generationError={generationError} />
        )}

        {activeTab === 'room' && data && (
          <RoomPanel data={data} onUpdateRoom={onUpdateRoom} />
        )}

        {activeTab === 'furnish' && (
          <AssetPanel onAddFurniture={onAddFurniture} />
        )}

        {activeTab === 'toolbar' && data && (
          <ToolbarPanel
            data={data}
            selectedId={selectedId}
            onSelectItem={onSelectItem}
            onDeleteItem={onDeleteItem}
            onMoveItem={onMoveItem}
            activeTool={activeTool}
            onSetTool={onSetTool}
          />
        )}
      </div>
    </div>
  );
};

export default PromptPanel;