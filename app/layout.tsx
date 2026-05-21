import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CJP Talents — Talent | Opportunity | Together',
  description:
    "India's exclusive platform for job seekers and co-founders. Built by the movement, for the movement. Apply now — all profiles are personally reviewed.",
  openGraph: {
    title: 'CJP Talents',
    description: 'Find jobs. Find co-founders. Find your people.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
