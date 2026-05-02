'use client';

import { useState, useEffect } from 'react';

interface LoadingSpinnerProps {
  timeout: number;
  onTimeout: () => void;
}

export default function LoadingSpinner({ timeout, onTimeout }: LoadingSpinnerProps) {
  const [remaining, setRemaining] = useState(Math.ceil(timeout / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeout]);

  return (
    <div className="flex items-center justify-center py-6">
      <span className="text-sm text-[#6b6b6b]">预计剩余 {remaining} 秒</span>
    </div>
  );
}
