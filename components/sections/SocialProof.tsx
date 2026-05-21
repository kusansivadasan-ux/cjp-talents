interface SocialProofProps {
  count: number
}

export function SocialProof({ count }: SocialProofProps) {
  return (
    <section className="py-16 px-4 border-t border-white/5 text-center">
      <p className="text-[#F5E8D5]/40 text-sm mb-2">Growing every hour</p>
      <p className="text-[#F5E8D5] text-2xl font-black">
        <span className="text-[#E8540A]">{count.toLocaleString('en-IN')}+</span> talents from across India have already applied
      </p>
      <p className="text-[#F5E8D5]/30 text-sm mt-2">
        Maharashtra · Karnataka · Delhi · Tamil Nadu · Gujarat and more
      </p>
    </section>
  )
}
