'use client';

import { Download, RotateCcw, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  imageUrl: string;
  onRegenerate: () => void;
}

export default function ResultDisplay({ imageUrl, onRegenerate }: ResultDisplayProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitai-tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-semibold text-[#1a1a1a]">Your try-on is ready</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            Save
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            Try again
          </button>
        </div>
      </div>

      {/* image */}
      <div className="rounded-2xl overflow-hidden border border-[#e5e5e5] shadow-sm">
        <img src={imageUrl} alt="Try-on result" className="w-full h-auto" />
      </div>

      {/* disclaimer */}
      <p className="text-xs text-center text-[#b4b4b4]">
        For reference only — actual fit may vary.
      </p>
    </div>
  );
}
