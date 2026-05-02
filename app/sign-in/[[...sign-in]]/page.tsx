import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6 text-center">
          登录虚拟试衣
        </h1>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#1a1a1a] hover:bg-[#333333]',
              card: 'shadow-none',
            },
          }}
        />
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
          >
            不登录，直接体验 →
          </Link>
        </div>
      </div>
    </div>
  );
}
