import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f5]">
      <div className="bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-[#1a1a1a] mb-6 text-center">
          注册虚拟试衣
        </h1>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#1a1a1a] hover:bg-[#333333]',
              card: 'shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
}
