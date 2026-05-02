'use client';

import type { FitType } from '@/types';

interface FitSelectorProps {
  value: FitType | null;
  onChange: (fit: FitType) => void;
  disabled?: boolean;
}

const fits: { value: FitType; label: string }[] = [
  { value: 'slim', label: '合身' },
  { value: 'oversized', label: '宽松' },
];

export default function FitSelector({ value, onChange, disabled }: FitSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#1a1a1a]">选择版型</label>
      <div className="flex gap-2">
        {fits.map((fit) => {
          const isSelected = value === fit.value;
          return (
            <button
              type="button"
              key={fit.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(fit.value);
              }}
              disabled={disabled}
              className={`
                flex-1 flex items-center justify-center px-4 py-2.5 rounded-full
                transition-all duration-200
                ${isSelected
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white text-[#6b6b6b] hover:bg-[#f7f7f5]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-sm font-medium">{fit.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
