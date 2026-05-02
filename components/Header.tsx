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
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#1a1a1a]" />
            <h1 className="text-xl font-semibold text-[#1a1a1a]">
              虚拟试衣
            </h1>
          </div>
          <div className="flex items-center gap-4"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#e5e5e5]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#1a1a1a]" />
            <h1 className="text-xl font-semibold text-[#1a1a1a]">
              虚拟试衣
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link 
                href="/history"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors"
              >
                <History className="w-4 h-4" />
                历史记录
              </Link>
              {user && (
                <span className="text-sm text-[#6b6b6b] hidden sm:inline">
                  欢迎，{user.firstName || user.emailAddresses[0]?.emailAddress?.split('@')[0]}
                </span>
              )}
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f7f7f5] rounded-lg transition-colors">
                  登录
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#1a1a1a] hover:bg-[#333333] rounded-lg transition-colors">
                  注册
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
