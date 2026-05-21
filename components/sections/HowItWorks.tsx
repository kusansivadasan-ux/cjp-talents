const STEPS = [
  {
    number: '01',
    title: 'Register Your Profile',
    description: "Fill in your details, skills, and aspirations. Tell us why you're here.",
  },
  {
    number: '02',
    title: 'Get Reviewed & Verified',
    description: "Every application is personally reviewed. Got an invite from a member? You'll be fast-tracked.",
  },
  {
    number: '03',
    title: 'Connect & Grow',
    description: 'Once approved, build your profile, share your story, and find your opportunity.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4 border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-[#F5E8D5] text-center mb-4">
          How it works
        </h2>
        <p className="text-[#F5E8D5]/50 text-center mb-14">Three steps to your next chapter.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="flex flex-col gap-4 relative">
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-[#E8540A]/20" />
              )}
              <div className="w-12 h-12 rounded-full bg-[#E8540A]/10 border border-[#E8540A]/30 flex items-center justify-center">
                <span className="text-[#E8540A] font-black text-sm">{step.number}</span>
              </div>
              <h3 className="text-[#F5E8D5] font-black text-lg">{step.title}</h3>
              <p className="text-[#F5E8D5]/50 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
