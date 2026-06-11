import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Milo',
  description: 'Milo privacy policy. How we collect, use, and protect your data.',
  robots: { index: true, follow: true },
}

const SECTIONS = [
  {
    title: 'Information We Collect',
    body: `We collect information you provide when you create an account (name, phone number, email address, date of birth, gender). We also collect usage data such as events viewed, RSVPs, and location data when you grant permission to personalise your city experience.`,
  },
  {
    title: 'How We Use Your Data',
    body: `We use your data to personalise event recommendations, send you relevant notifications about events in your city, enable social features like friends-going and vibe checks, and improve our platform. We do not sell your data to third parties.`,
  },
  {
    title: 'Data Storage & Security',
    body: `Your data is stored securely on Supabase infrastructure with row-level security policies. We use end-to-end encrypted connections and follow industry best practices for data protection. Phone OTP authentication ensures only you can access your account.`,
  },
  {
    title: 'Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time. You can export your data or permanently delete your account from the app settings. For any data requests, contact us at privacy@baharmilo.com.`,
  },
  {
    title: 'WhatsApp Communities',
    body: `Our city WhatsApp groups are community spaces. We share group links only with verified Milo users. WhatsApp's own privacy policy governs communications within those groups.`,
  },
  {
    title: 'Cookies',
    body: `We use essential cookies for authentication and session management. We do not use third-party tracking cookies for advertising. You can manage cookie preferences in your browser settings.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this policy periodically. We will notify you of significant changes via in-app notification or email. Continued use of Milo after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: 'Contact',
    body: `For privacy-related questions: privacy@baharmilo.com\nMilo, New Delhi, India`,
  },
]

export default function PrivacyPage() {
  return (
    <section className="pt-28 pb-24 px-5 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 page-in">
          <span className="font-mono text-[10px] tracking-[.2em] uppercase mb-4 block" style={{ color: '#C9A84C' }}>
            Legal
          </span>
          <h1 className="font-d text-[clamp(30px,5vw,56px)] font-black leading-[.9] tracking-[-0.03em] mb-4"
            style={{ color: '#E8EEF8' }}>
            Privacy Policy
          </h1>
          <p className="font-mono text-[10px] tracking-[.06em]" style={{ color: 'rgba(232,238,248,.3)' }}>
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((s, i) => (
            <div key={s.title} className="glass noise rounded-2xl p-7">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-d text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(201,168,76,.1)', color: '#C9A84C', border: '0.5px solid rgba(201,168,76,.3)' }}>
                  {i + 1}
                </span>
                <h2 className="font-d text-[18px] font-bold" style={{ color: '#E8EEF8' }}>{s.title}</h2>
              </div>
              <p className="font-b text-[14px] leading-[1.8] whitespace-pre-line"
                style={{ color: 'rgba(232,238,248,.5)' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
