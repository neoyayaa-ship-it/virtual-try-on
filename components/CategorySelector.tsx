'use client';

import { Shirt, Layers, Sparkles } from 'lucide-react';
import type { Category } from '@/types';

interface CategorySelectorProps {
  value: Category | null;
  onChange: (category: Category) => void;
  disabled?: boolean;
}

const categories: { value: Category; label: string; sub: string; icon: typeof Shirt }[] = [
  { value: 'top',    label: 'Tops',    sub: 'Shirts & jackets', icon: Shirt },
  { value: 'bottom', label: 'Bottoms', sub: 'Pants & skirts',   icon: Layers },
  { value: 'dress',  label: 'Dresses', sub: 'Full outfits',     icon: Sparkles },
];

export default function CategorySelector({ value, onChange, disabled }: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-[#1a1a1a]">Category</p>
        <p className="text-xs text-[#9a9a9a] mt-0.5">Which part of the outfit are you trying on?</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = value === cat.value;
          return (
            <button
              type="button"
              key={cat.value}
              onClick={(e) => { e.stopPropagation(); onChange(cat.value); }}
              disabled={disabled}
              className={`
                flex flex-col items-center gap-2 px-3 py-4 rounded-xl border
                transition-all duration-200 text-center
                ${isSelected
                  ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white shadow-sm'
                  : 'bg-white border-[#e5e5e5] text-[#6b6b6b] hover:border-[#c4c4c4] hover:bg-[#fafafa]'
                }
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <div>
                <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {cat.label}
                </p>
                <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-white/60' : 'text-[#9a9a9a]'}`}>
                  {cat.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
