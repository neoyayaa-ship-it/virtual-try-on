'use client';

import { useState, useCallback } from 'react';
import { Plus, X, Upload } from 'lucide-react';
import type { UploadedImage } from '@/types';

interface ImageUploaderProps {
  hint: string;
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
}

export default function ImageUploader({ hint, value, onChange }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange({
        file,
        base64: e.target?.result as string,
      });
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
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileChange(file);
      }
    };
    input.click();
  }, [handleFileChange]);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  }, [onChange]);

  if (value) {
    return (
      <div
        onClick={handleClick}
        className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#e5e5e5] cursor-pointer group"
      >
        <img
          src={value.base64}
          alt="上传内容"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-lg px-3 py-2 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">重新上传</span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <X className="w-4 h-4 text-[#6b6b6b]" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        aspect-[3/4] rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
        flex flex-col items-center justify-center
        ${isDragging
          ? 'border-[#1a1a1a] bg-[#f7f7f5]'
          : 'border-[#e5e5e5] hover:border-[#d4d4d4] hover:bg-[#fafafa]'
        }
      `}
    >
      <div className="w-12 h-12 rounded-full bg-[#f7f7f5] flex items-center justify-center mb-4">
        <Plus className="w-5 h-5 text-[#6b6b6b]" />
      </div>
      <p className="text-sm text-[#6b6b6b] mb-1">{hint}</p>
      <p className="text-xs text-[#9a9a9a]">点击或拖拽上传</p>
    </div>
  );
}
