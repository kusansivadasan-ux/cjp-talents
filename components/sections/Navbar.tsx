'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Navbar() {
  function scrollToSignup() {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0D0D0D]/90 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="CJP Talents" width={40} height={40} className="rounded-full" />
        <span className="font-black text-lg text-[#F5E8D5] tracking-tight">
          CJP <span className="text-[#E8540A]">Talents</span>
        </span>
      </div>
      <Button
        onClick={scrollToSignup}
        className="bg-[#E8540A] hover:bg-[#C44208] text-white font-bold px-5 py-2 h-auto text-sm"
      >
        Join Now →
      </Button>
    </nav>
  )
}
