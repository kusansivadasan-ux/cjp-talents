'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'

interface ThankYouProps {
  displayNumber: number
  referralCode: string
}

export function ThankYou({ displayNumber, referralCode }: ThankYouProps) {
  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://cjptalents.in'
  const referralLink = `${appUrl}/join?ref=${referralCode}`

  const shareText = `I just applied to CJP Talents — India's exclusive platform for talent & co-founders. Join me in the movement! 🪳✊`

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${referralLink}`)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(referralLink)}`

  async function copyLink() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="signup" className="py-24 px-4 bg-[#1A1A1A] border-t border-white/5">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-7xl mb-6">🪳</div>

        <h2 className="text-3xl font-black text-[#F5E8D5] mb-3">
          Application Received!
        </h2>

        <p className="text-[#F5E8D5]/70 text-lg mb-1">
          You&apos;re{' '}
          <span className="text-[#E8540A] font-black text-2xl">
            #{displayNumber.toLocaleString('en-IN')}
          </span>{' '}
          in the movement.
        </p>

        <div className="inline-flex items-center gap-2 mt-2 mb-8 bg-[#0D0D0D] border border-white/10 rounded-full px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-[#F5E8D5]/50 text-sm">Under Review · up to 7 days</span>
        </div>

        <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 mb-6 text-left">
          <p className="text-[#F5E8D5]/40 text-xs mb-2 uppercase tracking-wider">Your invite link</p>
          <p className="text-[#E8540A] text-sm font-mono break-all">{referralLink}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button
            onClick={copyLink}
            variant="outline"
            className="border-white/10 text-[#F5E8D5] hover:bg-white/5 gap-2"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-sm rounded-md px-4 py-2 transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-black hover:bg-zinc-900 border border-white/10 text-white font-semibold text-sm rounded-md px-4 py-2 transition-colors"
          >
            X / Twitter
          </a>
          <button
            type="button"
            onClick={() => { window.prompt('Copy this link to share on Instagram:', referralLink) }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white font-semibold text-sm rounded-md px-4 py-2 transition-opacity"
          >
            Instagram
          </button>
        </div>

        <p className="text-[#F5E8D5]/30 text-xs leading-relaxed">
          Friends you invite using this link will be fast-tracked to priority review once you&apos;re approved.
          Every person who joins through you earns you an extra invite token.
        </p>
      </div>
    </section>
  )
}
