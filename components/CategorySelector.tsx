'use client';

import { Shirt, Layers, Circle } from 'lucide-react';
import type { Category } from '@/types';

interface CategorySelectorProps {
  value: Category | null;
  onChange: (category: Category) => void;
  disabled?: boolean;
}

const categories: { value: Category; label: string; icon: typeof Shirt }[] = [
  { value: 'top', label: '上装', icon: Shirt },
  { value: 'bottom', label: '下装', icon: Layers },
  { value: 'dress', label: '连衣裙', icon: Circle },
];

export default function CategorySelector({ value, onChange, disabled }: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#1a1a1a]">选择品类</label>
      <div className="flex gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = value === category.value;
          return (
            <button
              type="button"
              key={category.value}
              onClick={(e) => {
                e.stopPropagation();
                onChange(category.value);
              }}
              disabled={disabled}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full
                transition-all duration-200
                ${isSelected
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white text-[#6b6b6b] hover:bg-[#f7f7f5]'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className="w-4 h-4" strokeWidth={1.5} />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
