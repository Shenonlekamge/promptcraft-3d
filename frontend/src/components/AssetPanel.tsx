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

  const categories = assets.reduce((acc, asset) => {
    const cat = asset.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-10">
      <h2 className="text-base font-bold text-pc-muted uppercase tracking-widest border-b border-pc-surface pb-4">
        Asset Library ({assets.length})
      </h2>
      
      {Object.entries(categories).map(([name, items]) => (
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
      ))}
    </div>
  );
};

export default AssetPanel;