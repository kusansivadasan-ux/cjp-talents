'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  initialCount: number
}

export function Hero({ initialCount }: HeroProps) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/member-count')
        const data = await res.json()
        setCount(data.count)
      } catch {
        // silent — keep showing last known count
      }
    }, 15_000)
    return () => clearInterval(interval)
  }, [])

  function scrollToSignup() {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
      <div className="mb-8 inline-flex items-center gap-3 rounded-full border-2 border-[#E8540A]/50 bg-[#E8540A]/10 px-6 py-2.5 shadow-lg shadow-[#E8540A]/20">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E8540A] opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#E8540A]" />
        </span>
        <span className="text-[#E8540A] text-base md:text-lg font-black uppercase tracking-[0.2em]">
          Launching Soon
        </span>
      </div>

      <p className="text-[#F5E8D5]/50 text-xs font-bold uppercase tracking-[0.25em] mb-6">
        Cockroach Janta Party Talents
      </p>

      <h1 className="text-5xl md:text-7xl font-black text-[#F5E8D5] leading-[1.05] mb-6 max-w-4xl">
        They called us cockroaches.{' '}
        <span className="text-[#E8540A]">We built a movement.</span>
      </h1>

      <p className="text-lg md:text-xl text-[#F5E8D5]/60 max-w-2xl mx-auto mb-6 leading-relaxed">
        India&apos;s exclusive Social media talent platform for job seekers and co-founders.
        Apply once. Get verified. Find your opportunity.
      </p>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-[#E8540A]/10 via-white/5 to-[#1A6B35]/10 px-6 py-4 max-w-2xl">
        <span className="text-2xl md:text-3xl" role="img" aria-label="Indian flag">🇮🇳</span>
        <p className="text-base md:text-xl font-black text-[#F5E8D5] leading-tight">
          Let&apos;s Make it{' '}
          <span className="text-[#E8540A]">India&apos;s Largest</span>{' '}
          Social Media Platform
        </p>
        <span className="text-2xl md:text-3xl" role="img" aria-label="Indian flag">🇮🇳</span>
      </div>

      <Button
        onClick={scrollToSignup}
        size="lg"
        className="bg-[#E8540A] hover:bg-[#C44208] text-white text-lg font-black px-10 py-5 h-auto rounded-full"
      >
        Join the Movement →
      </Button>

      <div className="mt-8 flex flex-col items-center gap-1">
        <p className="text-4xl font-black text-[#E8540A]">
          {count.toLocaleString('en-IN')}+
        </p>
        <p className="text-[#F5E8D5]/40 text-sm">talents and counting</p>
      </div>

      <div className="mt-12 flex items-center gap-2 text-[#F5E8D5]/30 text-xs">
        <span className="w-2 h-2 rounded-full bg-[#1A6B35] animate-pulse" />
        Invite-only · All profiles personally reviewed
      </div>
    </section>
  )
}
