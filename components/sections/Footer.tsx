export function Footer() {
  return (
    <footer className="py-10 px-4 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[#F5E8D5]/30 text-sm">
          © 2026 CJP Talents · Cockroach Janta Party Talents
        </p>
        <div className="flex items-center gap-6 text-[#F5E8D5]/30 text-sm">
          <a href="mailto:hello@cjptalents.in" className="hover:text-[#E8540A] transition-colors">
            Contact
          </a>
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  )
}
