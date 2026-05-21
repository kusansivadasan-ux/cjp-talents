import { Suspense } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Hero } from '@/components/sections/Hero'
import { Mission } from '@/components/sections/Mission'
import { Pillars } from '@/components/sections/Pillars'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { SignupForm } from '@/components/sections/SignupForm'
import { SocialProof } from '@/components/sections/SocialProof'
import { Footer } from '@/components/sections/Footer'
import { MEMBER_COUNT_SEED } from '@/lib/constants'
import { createServerClient } from '@/lib/supabase/server'

async function getMemberCount(): Promise<number> {
  try {
    const supabase = createServerClient()
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
    return MEMBER_COUNT_SEED + (count ?? 0)
  } catch {
    return MEMBER_COUNT_SEED
  }
}

export default async function HomePage() {
  const memberCount = await getMemberCount()

  return (
    <main>
      <Navbar />
      <Hero initialCount={memberCount} />
      <Mission />
      <Pillars />
      <HowItWorks />
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
      <SocialProof count={memberCount} />
      <Footer />
    </main>
  )
}
