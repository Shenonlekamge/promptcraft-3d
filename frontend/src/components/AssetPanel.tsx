import { useState, useEffect } from "react";

interface Asset {
  type: string;
  label: string;
  category: string;
}

interface AssetPanelProps {
  onAddFurniture: (type: string, color: string) => void;
}

const AssetPanel = ({ onAddFurniture }: AssetPanelProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch('/models/manifest.json')
      .then(res => res.json())
      .then(data => {
        setAssets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-pc-muted animate-pulse text-lg">Loading 100+ Assets...</div>;

  const trimmed = query.trim().toLowerCase();

  const filteredAssets = trimmed
    ? assets.filter(
        (a) =>
          a.label.toLowerCase().includes(trimmed) ||
          a.type.toLowerCase().includes(trimmed) ||
          (a.category || "").toLowerCase().includes(trimmed)
      )
    : assets;

  const categories = filteredAssets.reduce((acc, asset) => {
    const cat = asset.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-base font-bold text-pc-muted uppercase tracking-widest border-b border-pc-surface pb-4 mb-4">
          Asset Library ({assets.length})
        </h2>

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pc-muted pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            id="asset-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assets…"
            className="w-full bg-pc-surface text-sm text-white placeholder-pc-muted rounded-lg pl-9 pr-9 py-2.5 border border-transparent focus:border-pc-cyan focus:outline-none transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pc-muted hover:text-white transition-colors text-base leading-none"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Result count when searching */}
        {trimmed && (
          <p className="mt-2 text-xs text-pc-muted">
            {filteredAssets.length === 0
              ? "No assets match your search."
              : `${filteredAssets.length} result${filteredAssets.length !== 1 ? "s" : ""}`}
          </p>
        )}
      </div>

      {filteredAssets.length === 0 && trimmed ? (
        <div className="flex flex-col items-center gap-3 py-12 text-pc-muted">
          <svg className="w-10 h-10 opacity-40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <span className="text-sm">No results for <span className="text-white font-semibold">"{query}"</span></span>
        </div>
      ) : (
        Object.entries(categories).map(([name, items]) => (
          <section key={name} className="space-y-4">
            <h3 className="text-sm font-black text-pc-cyan uppercase tracking-tighter opacity-80">
              {name}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {items.map((asset) => (
                <button
                  key={asset.type}
                  onClick={() => onAddFurniture(asset.type, '#3895D3')}
                  className="bg-pc-surface p-5 rounded-lg text-left hover:border-pc-cyan border border-transparent transition-all group shadow-sm flex items-center justify-between"
                >
                  <div>
                    <span className="text-base font-bold group-hover:text-pc-cyan transition-colors block">
                      {asset.label}
                    </span>
                    <span className="text-xs text-pc-muted uppercase font-mono">{asset.type}</span>
                  </div>
                  <div className="text-pc-muted group-hover:text-pc-cyan text-xl">+</div>
                </button>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default AssetPanel;