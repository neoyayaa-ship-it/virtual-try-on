'use client';

import { useState, useCallback } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import axios from 'axios';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowRight, Sparkles, LogIn } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import CategorySelector from '@/components/CategorySelector';
import FitSelector from '@/components/FitSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorToast from '@/components/ErrorToast';
import Header from '@/components/Header';
import type { Category, FitType, UploadedImage } from '@/types';

type Status = 'idle' | 'generating' | 'success' | 'error';

const TIMEOUT_DURATION = 30000;

function SectionDivider({ step, title }: { step: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-[10px] font-bold tracking-[0.15em] text-[#9a9a9a] uppercase whitespace-nowrap">
        {step}
      </span>
      <div className="flex-1 h-px bg-[#e5e5e5]" />
      <span className="text-[10px] font-medium tracking-wide text-[#b4b4b4] uppercase whitespace-nowrap">
        {title}
      </span>
    </div>
  );
}

export default function TryOnPage() {
  const { isSignedIn } = useUser();
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [clothingImage, setClothingImage] = useState<UploadedImage | null>(null);
  const [category, setCategory] = useState<Category>('top');
  const [fit, setFit] = useState<FitType | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const resetState = useCallback(() => {
    setStatus('idle');
    setResultImage('');
    setError('');
    setTurnstileToken('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('Please upload both photos first');
      return;
    }
    if (!turnstileToken) {
      setError('Please complete the verification check');
      return;
    }

    setStatus('generating');
    setError('');

    try {
      const response = await axios.post('/api/tryon', {
        personImage: personImage.base64,
        clothingImage: clothingImage.base64,
        category,
        fit,
        turnstileToken,
      }, { timeout: TIMEOUT_DURATION });

      if (response.data.success && response.data.resultImage) {
        setResultImage(response.data.resultImage);
        setStatus('success');
      } else {
        setError(response.data.error || 'Generation failed. Please try again.');
        setStatus('error');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(
          err.code === 'ECONNABORTED'
            ? 'Request timed out. Please try again.'
            : err.response?.data?.error || 'Network error. Please try again.'
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
      setStatus('error');
    }
  }, [personImage, clothingImage, category, fit, turnstileToken]);

  const handleTimeout = useCallback(() => {
    setError('Request timed out. Please try again.');
    setStatus('error');
  }, []);

  const canGenerate = personImage && clothingImage && status !== 'generating';
  const isGenerating = status === 'generating';

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Guest notice */}
      {!isSignedIn && (
        <div className="border-b border-[#e5e5e5] bg-[#f7f7f5]">
          <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-center gap-3">
            <span className="text-[13px] text-[#6b6b6b]">
              Guest mode — results won&apos;t be saved to your history
            </span>
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1a1a1a] hover:opacity-70 transition-opacity">
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </button>
            </SignInButton>
          </div>
        </div>
      )}

      {error && <ErrorToast message={error} onClose={() => setError('')} />}

      <div className="max-w-2xl mx-auto px-6 py-14">

        {/* Page header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#f7f7f5] border border-[#e5e5e5] rounded-full px-3.5 py-1.5 mb-5">
            <Sparkles className="w-3.5 h-3.5 text-[#6b6b6b]" />
            <span className="text-[11px] font-bold tracking-widest text-[#6b6b6b] uppercase">
              AI-Powered
            </span>
          </div>
          <h1 className="text-[32px] font-bold text-[#1a1a1a] tracking-tight leading-tight mb-3">
            Virtual Try-On
          </h1>
          <p className="text-[15px] text-[#6b6b6b] leading-relaxed max-w-sm">
            Upload a photo of yourself and any clothing item. Our AI generates
            a photorealistic try-on in seconds.
          </p>
        </div>

        {/* ── Step 01: Upload photos ── */}
        <section className="mb-10">
          <SectionDivider step="Step 01" title="Upload Photos" />
          <div className="grid grid-cols-2 gap-5">
            <ImageUploader
              label="Person Photo"
              hint="Upload your photo"
              value={personImage}
              onChange={setPersonImage}
            />
            <ImageUploader
              label="Clothing Image"
              hint="Upload clothing"
              value={clothingImage}
              onChange={setClothingImage}
            />
          </div>
          <p className="mt-3 text-xs text-[#b4b4b4] text-center">
            A clear, well-lit front-facing photo gives the best results
          </p>
        </section>

        {/* ── Step 02: Options ── */}
        <section className="mb-10">
          <SectionDivider step="Step 02" title="Options" />
          <div className="bg-[#f7f7f5] border border-[#e5e5e5] rounded-2xl p-6 space-y-6">
            <CategorySelector
              value={category}
              onChange={setCategory}
              disabled={isGenerating}
            />
            <div className="h-px bg-[#e5e5e5]" />
            <FitSelector
              value={fit}
              onChange={setFit}
              disabled={isGenerating}
            />
          </div>
        </section>

        {/* ── Step 03: Generate ── */}
        <section>
          <SectionDivider step="Step 03" title="Generate" />

          <div className="mb-6 flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
              onSuccess={setTurnstileToken}
              options={{ theme: 'light' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canGenerate}
            className={`
              w-full py-5 rounded-2xl font-semibold text-[15px]
              flex items-center justify-center gap-2.5
              transition-all duration-200
              ${isGenerating
                ? 'bg-[#f0f0ee] text-[#9a9a9a] cursor-not-allowed'
                : canGenerate
                  ? 'bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] shadow-sm hover:shadow-md active:scale-[0.99]'
                  : 'bg-[#e5e5e5] text-[#b4b4b4] cursor-not-allowed'
              }
            `}
          >
            {isGenerating ? (
              <>
                <span className="w-4 h-4 border-2 border-[#c4c4c4] border-t-[#6b6b6b] rounded-full animate-spin" />
                Generating your look…
              </>
            ) : (
              <>
                Generate Try-On
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {!canGenerate && !isGenerating && (
            <p className="mt-3 text-xs text-[#b4b4b4] text-center">
              {!personImage && !clothingImage
                ? 'Upload both photos to continue'
                : !personImage
                  ? 'Upload your photo to continue'
                  : 'Upload a clothing image to continue'}
            </p>
          )}

          {isGenerating && (
            <div className="mt-5 space-y-2">
              <div className="h-0.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div className="h-full bg-[#1a1a1a] rounded-full animate-progress" />
              </div>
              <LoadingSpinner timeout={TIMEOUT_DURATION} onTimeout={handleTimeout} />
            </div>
          )}
        </section>

        {/* Result */}
        {status === 'success' && resultImage && (
          <div className="mt-12 pt-12 border-t border-[#e5e5e5] animate-fade-in">
            <ResultDisplay imageUrl={resultImage} onRegenerate={resetState} />
          </div>
        )}

        <footer className="mt-20 pt-8 border-t border-[#e5e5e5] text-center">
          <p className="text-xs text-[#c4c4c4]">For reference only — actual fit may vary</p>
        </footer>
      </div>
    </div>
  );
}
