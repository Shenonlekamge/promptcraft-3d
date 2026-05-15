import type { RoomData } from "../pages/Home";

interface ToolbarPanelProps {
  data: RoomData;
  selectedId: string | null;
  onSelectItem: (id: string | null) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (id: string, direction: 'forward' | 'back' | 'left' | 'right') => void;
  activeTool: 'translate' | 'rotate' | 'tour';
  onSetTool: (tool: 'translate' | 'rotate' | 'tour') => void;
}

const ToolbarPanel = ({ data, selectedId, onSelectItem, onDeleteItem, onMoveItem, activeTool, onSetTool }: ToolbarPanelProps) => {
  const selectedItem = data.furniture.find(f => f.id === selectedId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section>
        <h3 className="text-sm font-bold text-pc-muted uppercase mb-4 tracking-widest">Transform Tools</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSetTool('translate')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              activeTool === 'translate'
                ? 'bg-pc-cyan/15 border-pc-cyan text-pc-cyan shadow-lg shadow-pc-cyan/10'
                : 'bg-pc-surface border-transparent text-pc-muted hover:text-pc-text hover:border-pc-surface'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 9 2 12 5 15" />
              <polyline points="9 5 12 2 15 5" />
              <polyline points="15 19 12 22 9 19" />
              <polyline points="19 9 22 12 19 15" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="12" y1="2" x2="12" y2="22" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wide">Move</span>
          </button>

          <button
            onClick={() => onSetTool('rotate')}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-all ${
              activeTool === 'rotate'
                ? 'bg-pc-cyan/15 border-pc-cyan text-pc-cyan shadow-lg shadow-pc-cyan/10'
                : 'bg-pc-surface border-transparent text-pc-muted hover:text-pc-text hover:border-pc-surface'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6" />
              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wide">Rotate</span>
          </button>

          <button
            onClick={() => onSetTool('tour')}
            className={`col-span-2 flex items-center justify-center gap-3 p-4 rounded-lg border transition-all ${
              activeTool === 'tour'
                ? 'bg-green-500/15 border-green-500 text-green-400 shadow-lg shadow-green-500/10'
                : 'bg-pc-surface border-transparent text-pc-muted hover:text-pc-text hover:border-pc-surface'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path d="M2 12c0 4.4 3.6 8 8 8h4c4.4 0 8-3.6 8-8s-3.6-8-8-8H10C5.6 4 2 7.6 2 12Z" />
              <path d="M12 12v.01" />
            </svg>
            <span className="text-sm font-bold uppercase tracking-wide">Tour Mode</span>
          </button>
        </div>
        {activeTool === 'translate' && selectedId && (
          <div className="mt-5">
            <p className="text-xs text-pc-muted uppercase tracking-wider mb-3 font-bold">Nudge Selected</p>
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => onMoveItem(selectedId, 'forward')}
                className="w-12 h-10 bg-pc-surface hover:bg-pc-cyan/20 hover:text-pc-cyan text-pc-muted rounded-lg border border-transparent hover:border-pc-cyan/40 transition-all flex items-center justify-center"
                title="Move Forward (−Z)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>

              <div className="flex gap-1">
                <button
                  onClick={() => onMoveItem(selectedId, 'left')}
                  className="w-12 h-10 bg-pc-surface hover:bg-pc-cyan/20 hover:text-pc-cyan text-pc-muted rounded-lg border border-transparent hover:border-pc-cyan/40 transition-all flex items-center justify-center"
                  title="Move Left (−X)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className="w-12 h-10 bg-pc-surface/50 rounded-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-pc-cyan/50" />
                </div>
                <button
                  onClick={() => onMoveItem(selectedId, 'right')}
                  className="w-12 h-10 bg-pc-surface hover:bg-pc-cyan/20 hover:text-pc-cyan text-pc-muted rounded-lg border border-transparent hover:border-pc-cyan/40 transition-all flex items-center justify-center"
                  title="Move Right (+X)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => onMoveItem(selectedId, 'back')}
                className="w-12 h-10 bg-pc-surface hover:bg-pc-cyan/20 hover:text-pc-cyan text-pc-muted rounded-lg border border-transparent hover:border-pc-cyan/40 transition-all flex items-center justify-center"
                title="Move Back (+Z)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-pc-muted/50 text-center mt-2 font-mono">0.5m per step</p>
          </div>
        )}
      </section>
      <section className="pt-4 border-t border-pc-surface">
        <h3 className="text-sm font-bold text-pc-muted uppercase mb-4 tracking-widest">Actions</h3>
        <button
          onClick={() => { if (selectedId) onDeleteItem(selectedId); }}
          disabled={!selectedId}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
            selectedId
              ? 'bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-500/10'
              : 'bg-pc-surface border border-transparent text-pc-muted cursor-not-allowed opacity-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
          Delete Selected
        </button>
      </section>
      <section className="pt-4 border-t border-pc-surface">
        <h3 className="text-sm font-bold text-pc-muted uppercase mb-4 tracking-widest">
          Placed Assets ({data.furniture.length})
        </h3>

        {data.furniture.length === 0 ? (
          <div className="text-pc-muted text-sm py-6 text-center italic opacity-60">
            No assets placed yet
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {data.furniture.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectItem(selectedId === item.id ? null : item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group ${
                  selectedId === item.id
                    ? 'bg-pc-cyan/10 border-pc-cyan text-pc-cyan shadow-md shadow-pc-cyan/5'
                    : 'bg-pc-surface border-transparent hover:border-pc-surface text-pc-text hover:bg-pc-surface/80'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    selectedId === item.id ? 'bg-pc-cyan shadow-sm shadow-pc-cyan/50' : 'bg-pc-muted/40'
                  }`} />
                  <div className="min-w-0">
                    <span className="text-sm font-bold block truncate capitalize">
                      {item.type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs text-pc-muted font-mono">
                      ({item.position[0].toFixed(1)}, {item.position[2].toFixed(1)})
                    </span>
                  </div>
                </div>

                {selectedId === item.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                    className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                    title="Delete asset"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </button>
            ))}
          </div>
        )}
      </section>
      {selectedItem && (
        <section className="pt-4 border-t border-pc-surface">
          <h3 className="text-sm font-bold text-pc-muted uppercase mb-3 tracking-widest">Selected</h3>
          <div className="bg-pc-surface rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-pc-muted">Type</span>
              <span className="font-bold capitalize">{selectedItem.type.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-pc-muted">Position</span>
              <span className="font-mono text-xs">
                X:{selectedItem.position[0].toFixed(1)} Z:{selectedItem.position[2].toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-pc-muted">Rotation</span>
              <span className="font-mono text-xs">{selectedItem.rotation || 0}°</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-pc-muted">Color</span>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: selectedItem.color }} />
                <span className="font-mono text-xs uppercase">{selectedItem.color}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ToolbarPanel;
