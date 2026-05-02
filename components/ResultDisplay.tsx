'use client';

import { Download, RefreshCw } from 'lucide-react';

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
      a.download = `tryon-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('下载失败:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#1a1a1a]">生成结果</h3>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            下载
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            重新生成
          </button>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden border border-[#e5e5e5]">
        <img
          src={imageUrl}
          alt="换装结果"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
