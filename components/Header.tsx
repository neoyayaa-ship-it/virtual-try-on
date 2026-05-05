'use client';

import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Sparkles, History } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1a1a1a]" />
            <span className="text-[17px] font-semibold text-[#1a1a1a] tracking-tight">FitAI</span>
          </div>
          <div className="flex items-center gap-4" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1a1a1a]" />
          <span className="text-[17px] font-semibold text-[#1a1a1a] tracking-tight">FitAI</span>
        </Link>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Link
                href="/history"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </Link>
              {user && (
                <span className="text-sm text-[#9a9a9a] hidden sm:inline">
                  {user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                </span>
              )}
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-[#333333] rounded-lg transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
