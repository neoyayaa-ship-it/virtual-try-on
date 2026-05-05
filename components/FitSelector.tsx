'use client';

import type { FitType } from '@/types';

interface FitSelectorProps {
  value: FitType | null;
  onChange: (fit: FitType) => void;
  disabled?: boolean;
}

const fits: { value: FitType; label: string; sub: string }[] = [
  { value: 'slim',      label: 'Slim Fit',   sub: 'Tailored & close-fitting' },
  { value: 'oversized', label: 'Oversized',  sub: 'Relaxed & loose silhouette' },
];

export default function FitSelector({ value, onChange, disabled }: FitSelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-[#1a1a1a]">Fit Style</p>
        <p className="text-xs text-[#9a9a9a] mt-0.5">Optional — leave blank to use the garment's default fit</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {fits.map((fit) => {
          const isSelected = value === fit.value;
          return (
            <button
              type="button"
              key={fit.value}
              onClick={(e) => { e.stopPropagation(); onChange(fit.value); }}
              disabled={disabled}
              className={`
                flex flex-col items-start gap-1 px-4 py-3.5 rounded-xl border
                transition-all duration-200 text-left
                ${isSelected
                  ? 'bg-[#1a1a1a] border-[#1a1a1a] shadow-sm'
                  : 'bg-white border-[#e5e5e5] hover:border-[#c4c4c4] hover:bg-[#fafafa]'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {fit.label}
              </p>
              <p className={`text-[11px] ${isSelected ? 'text-white/60' : 'text-[#9a9a9a]'}`}>
                {fit.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
