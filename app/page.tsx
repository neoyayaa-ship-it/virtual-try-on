'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignInButton, SignUpButton, useUser, UserButton } from '@clerk/nextjs';
import {
  Sparkles, Zap, Target, Shield, Check, Star,
  ArrowRight, Menu, X, History,
} from 'lucide-react';

// ─── Landing Header ───────────────────────────────────────────────────────────

function LandingHeader() {
  const { isSignedIn } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Sparkles className="w-5 h-5 text-[#1a1a1a]" />
          <span className="text-[17px] font-semibold text-[#1a1a1a] tracking-tight">FitAI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors">Reviews</a>
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {mounted && isSignedIn ? (
            <>
              <Link
                href="/tryon"
                className="flex items-center gap-1.5 text-sm font-medium text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#f7f7f5] transition-colors"
              >
                Open App
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] px-4 py-2 rounded-lg hover:bg-[#f7f7f5] transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm font-medium text-white bg-[#1a1a1a] hover:bg-[#333333] px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#f7f7f5] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-[#e5e5e5] px-6 py-5 space-y-4">
          <a href="#features" className="block text-sm text-[#6b6b6b]" onClick={() => setMenuOpen(false)}>Features</a>
          <a href="#pricing" className="block text-sm text-[#6b6b6b]" onClick={() => setMenuOpen(false)}>Pricing</a>
          <a href="#testimonials" className="block text-sm text-[#6b6b6b]" onClick={() => setMenuOpen(false)}>Reviews</a>
          <div className="pt-3 border-t border-[#e5e5e5] flex flex-col gap-2">
            <SignInButton mode="modal">
              <button className="text-sm text-left text-[#1a1a1a] px-1">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium text-white bg-[#1a1a1a] px-4 py-2.5 rounded-lg text-center">
                Get Started Free
              </button>
            </SignUpButton>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── Hero Mockup ─────────────────────────────────────────────────────────────

function HeroMockup() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-50 via-white to-emerald-50 blur-3xl scale-110 opacity-70" />

      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-[0_8px_48px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Browser chrome */}
        <div className="border-b border-[#f0f0f0] bg-[#fafafa] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-[#f0f0f0] rounded-md h-5 flex items-center px-3">
              <span className="text-[10px] text-[#9a9a9a]">fitai.app/tryon</span>
            </div>
          </div>
        </div>

        {/* App UI */}
        <div className="p-5 bg-white">
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Person photo slot */}
            <div>
              <p className="text-[10px] font-medium text-[#9a9a9a] mb-1.5 uppercase tracking-wide">Person</p>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-[#f5f5f3] to-[#ebebea] flex items-center justify-center">
                <svg viewBox="0 0 56 74" fill="none" className="w-10 opacity-25">
                  <circle cx="28" cy="14" r="10" fill="#1a1a1a" />
                  <path d="M8 74c0-24 10-36 20-36s20 12 20 36H8Z" fill="#1a1a1a" />
                  <rect x="14" y="36" width="28" height="26" rx="2" fill="#1a1a1a" />
                </svg>
              </div>
            </div>

            {/* Clothing slot */}
            <div>
              <p className="text-[10px] font-medium text-[#9a9a9a] mb-1.5 uppercase tracking-wide">Clothing</p>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-[#eef2ff] to-[#e0e7ff] flex items-center justify-center">
                <svg viewBox="0 0 56 64" fill="none" className="w-10 opacity-60">
                  <path
                    d="M14 12 L4 28 L18 32 L18 60 L38 60 L38 32 L52 28 L42 12 C38 20 18 20 14 12Z"
                    fill="#6366f1"
                  />
                </svg>
              </div>
            </div>

            {/* Result slot */}
            <div>
              <p className="text-[10px] font-medium text-[#9a9a9a] mb-1.5 uppercase tracking-wide">Result</p>
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-[#f5f5f3] to-[#ebebea] relative flex items-end justify-center pb-2">
                <svg viewBox="0 0 56 74" fill="none" className="w-10">
                  <circle cx="28" cy="14" r="10" fill="#1a1a1a" opacity="0.25" />
                  <path d="M8 74c0-24 10-36 20-36s20 12 20 36H8Z" fill="#1a1a1a" opacity="0.25" />
                  <path
                    d="M17 35 L10 48 L21 51 L21 68 L35 68 L35 51 L46 48 L39 35 C35 42 21 42 17 35Z"
                    fill="#6366f1"
                    opacity="0.85"
                  />
                </svg>
                <span className="absolute top-2 right-2 bg-[#22c55e] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                  Done ✓
                </span>
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div className="flex gap-2">
            <div className="flex-1 h-9 bg-[#f7f7f5] rounded-lg border border-[#e5e5e5] flex items-center gap-2 px-3">
              <div className="w-2 h-2 rounded-full bg-[#d4d4d4]" />
              <div className="h-2.5 bg-[#e5e5e5] rounded-full flex-1" />
            </div>
            <div className="h-9 px-5 bg-[#1a1a1a] rounded-lg flex items-center">
              <span className="text-[10px] text-white font-medium">Generate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -left-4 bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2">
        <span className="text-base">⚡</span>
        <div>
          <p className="text-xs font-semibold text-[#1a1a1a]">Under 10 seconds</p>
          <p className="text-[10px] text-[#9a9a9a]">AI generation time</p>
        </div>
      </div>

      {/* Floating badge 2 */}
      <div className="absolute -top-4 -right-4 bg-white border border-[#e5e5e5] rounded-xl px-4 py-2.5 shadow-lg flex items-center gap-2">
        <span className="text-base">🎯</span>
        <div>
          <p className="text-xs font-semibold text-[#1a1a1a]">98% Accuracy</p>
          <p className="text-[10px] text-[#9a9a9a]">Garment detection</p>
        </div>
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Instant Results',
    desc: 'AI processes your photos in under 10 seconds. No queues, no waiting — just upload and see.',
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: 'Precision Fit Control',
    desc: 'Choose tops, bottoms, or full outfits. Fine-tune with slim or oversized fit to preview exactly how clothes drape on you.',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Private by Design',
    desc: "Your photos are processed in real time and never stored without your explicit consent. Your data stays yours.",
  },
];

const features = [
  {
    tag: 'Smart Detection',
    title: 'AI That Knows Clothes',
    desc: 'Our model precisely identifies garment boundaries, body pose, and lighting — then replaces only the clothing area while keeping your face, hair, and background pixel-perfect.',
  },
  {
    tag: 'Fit Styles',
    title: 'Slim or Oversized — Your Call',
    desc: 'Select between slim-cut and oversized silhouettes to preview how different styles drape on your body before you commit to a purchase.',
  },
  {
    tag: 'History',
    title: 'Save & Compare Looks',
    desc: 'Every result is saved to your personal history. Browse past sessions and compare outfits side by side to make the right choice.',
  },
  {
    tag: 'Compatibility',
    title: 'Any Photo, Any Clothing',
    desc: 'Upload a casual selfie or a product image from any online store. FitAI works with virtually any photo — no studio setup required.',
  },
];

const testimonials = [
  {
    name: 'Sarah K.',
    role: 'Fashion Blogger',
    initials: 'SK',
    rating: 5,
    quote:
      'FitAI completely changed how I plan my outfits. I can preview 10 looks in the time it used to take me to try on one. The results are genuinely impressive.',
  },
  {
    name: 'Marcus L.',
    role: 'Online Shopper',
    initials: 'ML',
    rating: 5,
    quote:
      "I used to return so many clothes because they didn't look how I imagined. Since using FitAI, my return rate has dropped to almost zero. It just works.",
  },
  {
    name: 'Priya N.',
    role: 'Personal Stylist',
    initials: 'PN',
    rating: 5,
    quote:
      'I use FitAI with clients to mock up looks before any purchase. It speeds up consultations dramatically and clients love seeing themselves in the clothes.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for trying it out.',
    features: ['3 try-ons per day', 'All garment categories', 'Standard resolution', '7-day history'],
    cta: 'Get Started Free',
    href: '/tryon',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    desc: 'For fashion-forward individuals.',
    features: [
      'Unlimited try-ons',
      'All garment categories',
      'HD resolution output',
      'Unlimited history',
      'Fit style controls',
      'Priority processing',
    ],
    cta: 'Start Free Trial',
    href: '/tryon',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'contact us',
    desc: 'For brands & retailers.',
    features: [
      'API access',
      'Custom model fine-tuning',
      'White-label option',
      'SLA guarantee',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    href: 'mailto:hello@fitai.app',
    highlight: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] overflow-x-hidden">
      <LandingHeader />

      {/* ── Hero ── */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#f7f7f5] border border-[#e5e5e5] rounded-full px-4 py-1.5 mb-7">
              <Sparkles className="w-3.5 h-3.5 text-[#6b6b6b]" />
              <span className="text-[11px] font-semibold text-[#6b6b6b] tracking-widest uppercase">
                AI-Powered Virtual Try-On
              </span>
            </div>

            <h1 className="text-5xl lg:text-[64px] font-bold text-[#1a1a1a] leading-[1.05] tracking-tight mb-6">
              Try Before<br className="hidden sm:block" /> You Buy.
            </h1>

            <p className="text-lg text-[#6b6b6b] leading-relaxed mb-9 max-w-md">
              Upload your photo and any clothing item. Our AI generates photorealistic
              try-on results in seconds — no dressing room required.
            </p>

            <div className="flex flex-wrap gap-3 mb-5">
              <Link
                href="/tryon"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-sm font-semibold rounded-xl hover:bg-[#333333] transition-colors"
              >
                Try It Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1a1a1a] text-sm font-medium rounded-xl border border-[#e5e5e5] hover:bg-[#f7f7f5] transition-colors"
              >
                See How It Works
              </a>
            </div>

            <p className="text-xs text-[#9a9a9a]">No credit card required · 3 free try-ons per day</p>
          </div>

          {/* Mockup */}
          <div className="relative px-6">
            <HeroMockup />
          </div>
        </div>
      </section>

      {/* ── Social Proof Strip ── */}
      <div className="border-y border-[#e5e5e5] bg-[#f7f7f5] py-5 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          <span className="text-[11px] text-[#9a9a9a] uppercase tracking-widest font-medium">Trusted by</span>
          {['10,000+ Users', '500K+ Try-Ons Generated', '4.9 ★ Rating', '98% Satisfaction'].map((s) => (
            <span key={s} className="text-sm font-semibold text-[#1a1a1a]">{s}</span>
          ))}
        </div>
      </div>

      {/* ── Benefits ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-[#1a1a1a] mb-3">Why FitAI?</h2>
            <p className="text-[#6b6b6b] text-base max-w-sm mx-auto">
              Built for speed, precision, and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="bg-[#f7f7f5] rounded-2xl p-7 border border-[#e5e5e5]">
                <div className="w-10 h-10 bg-white rounded-xl border border-[#e5e5e5] flex items-center justify-center mb-5 shadow-sm">
                  {b.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-[#1a1a1a] mb-2">{b.title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-[#1a1a1a] mb-3">Everything You Need</h2>
            <p className="text-[#6b6b6b] text-base max-w-sm mx-auto">
              Powerful features that make virtual try-on feel like the real thing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-8 rounded-2xl border border-[#e5e5e5] hover:border-[#d4d4d4] hover:shadow-sm transition-all group"
              >
                <span className="text-[10px] font-bold tracking-[0.15em] text-[#9a9a9a] uppercase">
                  {f.tag}
                </span>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mt-2 mb-2">{f.title}</h3>
                <p className="text-sm text-[#6b6b6b] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-24 px-6 bg-[#f7f7f5] border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-[#1a1a1a] mb-3">What People Are Saying</h2>
            <p className="text-[#6b6b6b] text-base">Real feedback from real fashion lovers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl border border-[#e5e5e5] p-7 flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm text-[#1a1a1a] leading-relaxed flex-1 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1a1a1a]">{t.name}</p>
                    <p className="text-xs text-[#9a9a9a]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-3xl px-10 py-20 text-center relative overflow-hidden">
            {/* subtle texture */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }} />
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
                Stop guessing.<br />Start knowing.
              </h2>
              <p className="text-[#9a9a9a] text-base mb-9 max-w-md mx-auto leading-relaxed">
                Join thousands of shoppers who never return clothes anymore.
                See exactly how every piece looks on you — before you buy.
              </p>
              <Link
                href="/tryon"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] text-sm font-semibold rounded-xl hover:bg-[#f7f7f5] transition-colors"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-4 text-xs text-[#6b6b6b]">
                Free forever · No credit card · Up and running in 30 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-6 border-t border-[#e5e5e5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-[32px] font-bold text-[#1a1a1a] mb-3">Simple, Transparent Pricing</h2>
            <p className="text-[#6b6b6b] text-base">Start free, upgrade when you&apos;re ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 border transition-shadow ${
                  plan.highlight
                    ? 'bg-[#1a1a1a] border-[#1a1a1a] shadow-xl'
                    : 'bg-white border-[#e5e5e5]'
                }`}
              >
                {plan.highlight && (
                  <div className="inline-block bg-white/10 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-5">
                    Most Popular
                  </div>
                )}

                <p className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-[#9a9a9a]' : 'text-[#6b6b6b]'}`}>
                  {plan.name}
                </p>
                <div className={`text-[42px] font-bold leading-none mb-1 ${plan.highlight ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {plan.price}
                </div>
                <p className={`text-sm mb-2 ${plan.highlight ? 'text-[#6b6b6b]' : 'text-[#9a9a9a]'}`}>
                  {plan.period}
                </p>
                <p className={`text-sm mb-7 ${plan.highlight ? 'text-[#6b6b6b]' : 'text-[#6b6b6b]'}`}>
                  {plan.desc}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-white' : 'text-[#1a1a1a]'}`} />
                      <span className={`text-sm ${plan.highlight ? 'text-[#d4d4d4]' : 'text-[#6b6b6b]'}`}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-white text-[#1a1a1a] hover:bg-[#f7f7f5]'
                      : 'bg-[#f7f7f5] text-[#1a1a1a] hover:bg-[#ebebea] border border-[#e5e5e5]'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#e5e5e5] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1a1a1a]" />
            <span className="text-sm font-semibold text-[#1a1a1a]">FitAI</span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/terms" className="text-xs text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-xs text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:hello@fitai.app" className="text-xs text-[#9a9a9a] hover:text-[#1a1a1a] transition-colors">
              Contact Us
            </a>
          </div>

          <p className="text-xs text-[#9a9a9a]">© 2025 FitAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
