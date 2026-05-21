const PILLARS = [
  {
    icon: '💼',
    title: 'Find Jobs',
    description: 'Discover opportunities from verified employers who are actively looking for talent like yours.',
  },
  {
    icon: '🌟',
    title: 'Show Talent',
    description: 'Build a verified profile that showcases your skills, projects, and story — beyond a resume.',
  },
  {
    icon: '🤝',
    title: 'Find Co-Founder',
    description: 'Match with ambitious builders who complement your skills. Start something that matters.',
  },
  {
    icon: '📈',
    title: 'Grow Together',
    description: 'A community that grows with you — from first job to first startup and beyond.',
  },
]

export function Pillars() {
  return (
    <section className="py-24 px-4 bg-[#1A1A1A]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-[#F5E8D5] text-center mb-4">
          One platform. Every career move.
        </h2>
        <p className="text-[#F5E8D5]/50 text-center mb-14">
          Whether you&apos;re looking for a job, a co-founder, or your community — it all starts here.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-6 flex flex-col gap-4 hover:border-[#E8540A]/30 transition-colors"
            >
              <span className="text-4xl">{pillar.icon}</span>
              <h3 className="text-[#F5E8D5] font-black text-lg">{pillar.title}</h3>
              <p className="text-[#F5E8D5]/50 text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
