'use client';

import { useState, useCallback } from 'react';
import { Upload, X, ImagePlus, CheckCircle2 } from 'lucide-react';
import type { UploadedImage } from '@/types';

interface ImageUploaderProps {
  label: string;
  hint: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
}

export default function ImageUploader({ label, hint, value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({ file, base64: e.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  }, [handleFileChange]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileChange(file);
    };
    input.click();
  }, [handleFileChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#1a1a1a]">{label}</p>
        {value && (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="text-xs font-medium text-[#22c55e]">Uploaded</span>
          </div>
        )}
      </div>

      {value ? (
        <div
          onClick={handleClick}
          className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#e5e5e5] cursor-pointer group shadow-sm"
        >
          <img
            src={value.base64}
            alt="uploaded"
            className="w-full h-full object-cover"
          />
          {/* hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 bg-white rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-lg">
              <Upload className="w-4 h-4 text-[#1a1a1a]" />
              <span className="text-sm font-semibold text-[#1a1a1a]">Change photo</span>
            </div>
          </div>
          {/* remove button */}
          <button
            onClick={handleRemove}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white hover:scale-105 transition-all"
          >
            <X className="w-3.5 h-3.5 text-[#1a1a1a]" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            aspect-[3/4] rounded-2xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-4
            transition-all duration-200
            ${isDragging
              ? 'border-[#1a1a1a] bg-[#f0f0ee] scale-[1.01]'
              : 'border-[#e0e0de] hover:border-[#b4b4b4] hover:bg-[#fafaf8]'
            }
          `}
        >
          {/* icon */}
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
            ${isDragging ? 'bg-[#1a1a1a]' : 'bg-[#f0f0ee]'}
          `}>
            <ImagePlus
              className={`w-7 h-7 transition-colors duration-200 ${isDragging ? 'text-white' : 'text-[#9a9a9a]'}`}
              strokeWidth={1.5}
            />
          </div>

          {/* text */}
          <div className="text-center px-6">
            <p className="text-sm font-semibold text-[#1a1a1a] mb-1">{hint}</p>
            <p className="text-xs text-[#9a9a9a] leading-relaxed">
              Click to browse or<br />drag & drop here
            </p>
          </div>

          {/* format hint */}
          <p className="text-[10px] text-[#b4b4b4] tracking-wide uppercase">JPG · PNG · WEBP</p>
        </div>
      )}
    </div>
  );
}
