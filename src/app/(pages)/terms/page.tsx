import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Milo',
  description: 'Terms of Service for using the Milo platform.',
}

const TERMS = [
  { title: 'Acceptance of Terms', body: 'By accessing or using Milo, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our service.' },
  { title: 'Eligibility', body: 'You must be at least 18 years old (or 16 with parental consent) to use Milo. By creating an account, you represent that you meet this age requirement.' },
  { title: 'Your Account', body: 'You are responsible for maintaining the confidentiality of your account credentials. Your account is personal and non-transferable. You must not share your OTP or account access with others.' },
  { title: 'Event Listings', body: 'Event information on Milo is sourced from public listings and verified organisers. Milo does not guarantee the accuracy of event details. Always verify event information directly with organisers before attending.' },
  { title: 'User Conduct', body: 'You agree not to use Milo to harass other users, post false information, spam community channels, or violate any applicable laws. We reserve the right to suspend accounts that violate these rules.' },
  { title: 'RSVP & Tickets', body: 'RSVPs on Milo are expressions of intent, not guaranteed admission. Ticket purchases are handled by third-party platforms. Milo is not responsible for ticket transactions or refunds.' },
  { title: 'Content', body: 'By posting vibe checks or other content, you grant Milo a non-exclusive licence to display that content on the platform. You retain ownership of your content.' },
  { title: 'Limitation of Liability', body: 'Milo is not liable for any indirect, incidental, or consequential damages arising from your use of the service or attendance at events discovered through Milo.' },
  { title: 'Changes', body: 'We reserve the right to modify these terms at any time. Changes are effective immediately upon posting. Your continued use of Milo after changes constitutes acceptance.' },
  { title: 'Contact', body: 'For terms-related questions: legal@baharmilo.com' },
]

export default function TermsPage() {
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 page-in">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>Legal</span>
          <h1 className="font-d text-[clamp(30px,5vw,56px)] font-black leading-[.9] tracking-[-0.03em] mb-4" style={{ color: '#E8EEF8' }}>
            Terms of Service
          </h1>
          <p className="font-mono text-[10px] tracking-[.06em]" style={{ color: 'rgba(232,238,248,.3)' }}>Last updated: January 2025</p>
        </div>
        <div className="space-y-4">
          {TERMS.map((t, i) => (
            <div key={t.title} className="glass noise rounded-2xl p-7">
              <div className="flex items-start gap-4 mb-3">
                <span className="font-d text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,.08)', color: '#C9A84C', border: '0.5px solid rgba(201,168,76,.2)' }}>
                  {i + 1}
                </span>
                <h2 className="font-d text-[17px] font-bold" style={{ color: '#E8EEF8' }}>{t.title}</h2>
              </div>
              <p className="font-b text-[14px] leading-[1.75]" style={{ color: 'rgba(232,238,248,.48)' }}>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
