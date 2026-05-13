import type { RoomData } from "../pages/Home";

interface RoomPanelProps {
  data: RoomData;
  onUpdateRoom: (updates: Partial<RoomData>) => void;
}

const RoomPanel = ({ data, onUpdateRoom }: RoomPanelProps) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
      <section>
        <h3 className="text-sm font-bold text-pc-muted uppercase mb-6 tracking-widest">Dimensions</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-medium mb-2 uppercase"><span>Width</span><span>{data.width}m</span></div>
            <input type="range" min="4" max="20" step="1" value={data.width} onChange={(e) => onUpdateRoom({ width: parseInt(e.target.value) })} className="w-full h-2 accent-pc-cyan cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2 uppercase"><span>Depth</span><span>{data.depth}m</span></div>
            <input type="range" min="4" max="20" step="1" value={data.depth} onChange={(e) => onUpdateRoom({ depth: parseInt(e.target.value) })} className="w-full h-2 accent-pc-cyan cursor-pointer" />
          </div>
          <div>
            <div className="flex justify-between text-sm font-medium mb-2 uppercase"><span>Wall Height</span><span>{data.height}m</span></div>
            <input type="range" min="2" max="5" step="0.5" value={data.height} onChange={(e) => onUpdateRoom({ height: parseFloat(e.target.value) })} className="w-full h-2 accent-pc-cyan cursor-pointer" />
          </div>
        </div>
      </section>

      <section className="space-y-6 pt-6 border-t border-pc-surface">
        <h3 className="text-sm font-bold text-pc-muted uppercase tracking-widest">Aesthetics</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-pc-muted mb-2 uppercase">Floor Color</label>
            <input type="color" value={data.floorColor} onChange={(e) => onUpdateRoom({ floorColor: e.target.value })} className="w-full h-12 bg-transparent cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-bold text-pc-muted mb-2 uppercase">Wall Color</label>
            <input type="color" value={data.wallColor} onChange={(e) => onUpdateRoom({ wallColor: e.target.value })} className="w-full h-12 bg-transparent cursor-pointer" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-pc-muted mb-2 uppercase tracking-tight">Floor Texture</label>
          <select value={data.floorTexture} onChange={(e) => onUpdateRoom({ floorTexture: e.target.value })} className="w-full bg-pc-surface border-none text-pc-text p-3 rounded text-base outline-none cursor-pointer">
            <option value="none">Solid Color</option>
            <option value="wood">Polished Wood</option>
            <option value="tiles">Ceramic Tiles</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-pc-muted mb-2 uppercase tracking-tight">Wall Texture</label>
          <select value={data.wallTexture} onChange={(e) => onUpdateRoom({ wallTexture: e.target.value })} className="w-full bg-pc-surface border-none text-pc-text p-3 rounded text-base outline-none cursor-pointer">
            <option value="none">Flat Paint</option>
            <option value="brick">Industrial Brick</option>
            <option value="plaster">Rough Plaster</option>
          </select>
        </div>
      </section>

      <section className="space-y-6 pt-6 border-t border-pc-surface">
        <h3 className="text-sm font-bold text-pc-muted uppercase tracking-widest">Structures & Lighting</h3>
        
        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold text-pc-muted uppercase tracking-tight">Add Ceiling</label>
          <input 
            type="checkbox" 
            checked={!!data.hasCeiling} 
            onChange={(e) => onUpdateRoom({ hasCeiling: e.target.checked })} 
            className="w-5 h-5 accent-pc-cyan cursor-pointer" 
          />
        </div>

        {data.hasCeiling && (
          <div className="mb-4">
            <label className="block text-xs font-bold text-pc-muted mb-2 uppercase">Ceiling Color</label>
            <input 
              type="color" 
              value={data.ceilingColor || "#ffffff"} 
              onChange={(e) => onUpdateRoom({ ceilingColor: e.target.value })} 
              className="w-full h-12 bg-transparent cursor-pointer" 
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <label className="text-xs font-bold text-pc-muted uppercase tracking-tight">Add Second Story</label>
          <input 
            type="checkbox" 
            checked={!!data.hasSecondStory} 
            onChange={(e) => onUpdateRoom({ hasSecondStory: e.target.checked, ...(e.target.checked ? { hasCeiling: true } : {}) })} 
            className="w-5 h-5 accent-pc-cyan cursor-pointer" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button 
            onClick={() => onUpdateRoom({
              furniture: [...data.furniture, { id: Math.random().toString(36).substr(2, 9), type: 'door', position: [0, 0, -data.depth / 2], rotation: 0, color: "#ffffff" }]
            })}
            className="p-3 bg-pc-surface hover:bg-pc-surface/80 rounded text-sm font-bold uppercase tracking-wider text-pc-text transition-colors"
          >
            + Add Door
          </button>
          <button 
            onClick={() => onUpdateRoom({
              furniture: [...data.furniture, { id: Math.random().toString(36).substr(2, 9), type: 'window', position: [0, data.height / 2, -data.depth / 2], rotation: 0, color: "#ffffff" }]
            })}
            className="p-3 bg-pc-surface hover:bg-pc-surface/80 rounded text-sm font-bold uppercase tracking-wider text-pc-text transition-colors"
          >
            + Add Window
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-pc-muted mb-2 uppercase tracking-tight">Sun / Light Position (X, Y, Z)</label>
          <div className="grid grid-cols-3 gap-2">
            <input type="range" min="-20" max="20" step="1" value={data.sunPosition?.[0] ?? 10} onChange={(e) => onUpdateRoom({ sunPosition: [parseFloat(e.target.value), data.sunPosition?.[1] ?? 15, data.sunPosition?.[2] ?? 10] })} className="w-full h-2 accent-yellow-500 cursor-pointer" />
            <input type="range" min="5" max="30" step="1" value={data.sunPosition?.[1] ?? 15} onChange={(e) => onUpdateRoom({ sunPosition: [data.sunPosition?.[0] ?? 10, parseFloat(e.target.value), data.sunPosition?.[2] ?? 10] })} className="w-full h-2 accent-yellow-500 cursor-pointer" />
            <input type="range" min="-20" max="20" step="1" value={data.sunPosition?.[2] ?? 10} onChange={(e) => onUpdateRoom({ sunPosition: [data.sunPosition?.[0] ?? 10, data.sunPosition?.[1] ?? 15, parseFloat(e.target.value)] })} className="w-full h-2 accent-yellow-500 cursor-pointer" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomPanel;