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
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  function scrollToSignup() {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
      <p className="text-[#E8540A] text-xs font-bold uppercase tracking-[0.25em] mb-6">
        Cockroach Janta Party Talents
      </p>

      <h1 className="text-5xl md:text-7xl font-black text-[#F5E8D5] leading-[1.05] mb-6 max-w-4xl">
        They called us cockroaches.{' '}
        <span className="text-[#E8540A]">We built a movement.</span>
      </h1>

      <p className="text-lg md:text-xl text-[#F5E8D5]/60 max-w-2xl mx-auto mb-10 leading-relaxed">
        India&apos;s exclusive talent platform for job seekers and co-founders.
        Apply once. Get verified. Find your opportunity.
      </p>

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
