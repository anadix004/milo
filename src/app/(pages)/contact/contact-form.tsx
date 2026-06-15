"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    
    const { createClient } = await import('@/utils/supabase/client');
    const supabase = createClient();
    
    // collect checkboxes
    const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
    const interests = Array.from(checkboxes).map(cb => cb.parentElement?.textContent?.trim() || "");

    await supabase.from('waitlist').insert({
      name: data.get('name'),
      email: data.get('email'),
      city: data.get('city'),
      interests: interests,
    });
    
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="glass noise rounded-2xl p-8 md:p-10 text-center space-y-4">
        <div className="text-4xl">🎉</div>
        <h3 className="font-d text-xl font-bold" style={{ color: '#E8EEF8' }}>
          You're on the list!
        </h3>
        <p className="font-b text-sm" style={{ color: 'rgba(232,238,248,.5)' }}>
          We'll reach out when Milo drops in your city.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass noise rounded-2xl p-8 md:p-10 space-y-5">
      {[
        { id: 'name',  label: 'Full Name',  type: 'text',  placeholder: 'Your name'     },
        { id: 'email', label: 'Email',       type: 'email', placeholder: 'you@email.com' },
      ].map(f => (
        <div key={f.id}>
          <label htmlFor={f.id} className="font-mono text-[9px] tracking-[.14em] uppercase block mb-2"
            style={{ color: 'rgba(232,238,248,.35)' }}>
            {f.label}
          </label>
          <input id={f.id} name={f.id} type={f.type} required placeholder={f.placeholder}
            className="w-full rounded-xl px-4 py-3 font-b text-[14px] outline-none transition-colors duration-300"
            style={{
              background: 'rgba(255,255,255,.03)',
              border: '0.5px solid rgba(255,255,255,.08)',
              color: '#E8EEF8',
            }}
          />
        </div>
      ))}

      <div>
        <label htmlFor="city" className="font-mono text-[9px] tracking-[.14em] uppercase block mb-2"
          style={{ color: 'rgba(232,238,248,.35)' }}>
          City
        </label>
        <select id="city" name="city" required defaultValue=""
          className="w-full rounded-xl px-4 py-3 font-b text-[14px] outline-none transition-colors duration-300 appearance-none"
          style={{ background: 'rgba(255,255,255,.03)', border: '0.5px solid rgba(255,255,255,.08)', color: '#E8EEF8' }}>
          <option value="" disabled>Select your city</option>
          <option value="delhi">Delhi</option>
          <option value="mumbai">Mumbai</option>
          <option value="bangalore">Bangalore</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="font-mono text-[9px] tracking-[.14em] uppercase block mb-3"
          style={{ color: 'rgba(232,238,248,.35)' }}>
          What are you into?
        </label>
        <div className="flex flex-wrap gap-2">
          {['Techno', 'Comedy', 'Art', 'Food Walks', 'Meetups', 'Rooftops'].map(tag => (
            <label key={tag} className="cursor-pointer">
              <input type="checkbox" name="interests" value={tag} className="sr-only peer" />
              <span className="font-mono text-[9px] tracking-[.08em] uppercase px-3 py-2 rounded-full border block transition-all duration-200 peer-checked:bg-goldDim peer-checked:border-goldBdr peer-checked:text-gold"
                style={{ borderColor: 'rgba(255,255,255,.08)', color: 'rgba(232,238,248,.35)' }}>
                {tag}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isLoading}
        className="w-full font-mono text-[11px] font-bold tracking-[.12em] uppercase py-4 rounded-full transition-all hover:opacity-90 mt-2 disabled:opacity-50"
        style={{ background: '#C9A84C', color: '#050505' }}>
        {isLoading ? 'Joining...' : 'Join Waitlist'}
      </button>
      <p className="font-mono text-[9px] text-center tracking-[.06em]"
        style={{ color: 'rgba(232,238,248,.2)' }}>
        Zero spam. Unsubscribe anytime.
      </p>
    </form>
  );
}
