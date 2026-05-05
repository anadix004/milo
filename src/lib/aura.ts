export const OFFICIAL_CATEGORIES = [
  'club', 'dj_night', 'house_party', 'comedy', 
  'open_mic', 'networking', 'sports', 'other'
] as const

export type EventCategory = typeof OFFICIAL_CATEGORIES[number]

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  club: 'Club', dj_night: 'DJ Night', house_party: 'House Party',
  comedy: 'Comedy', open_mic: 'Open Mic', networking: 'Networking',
  sports: 'Sports', other: 'Other',
}

// All aura colors are radial gradients, never solid fills
const CATEGORY_AURA: Record<EventCategory, { primary: string, secondary: string, glow: string }> = {
  club:        { primary: 'rgba(249,100,60,0.18)',  secondary: 'rgba(232,60,160,0.12)',  glow: 'rgba(249,100,60,0.35)'  },
  dj_night:    { primary: 'rgba(249,100,60,0.18)',  secondary: 'rgba(232,60,160,0.12)',  glow: 'rgba(249,100,60,0.35)'  },
  house_party: { primary: 'rgba(232,60,160,0.18)',  secondary: 'rgba(180,140,255,0.12)', glow: 'rgba(232,60,160,0.35)'  },
  comedy:      { primary: 'rgba(255,200,60,0.18)',  secondary: 'rgba(249,100,60,0.10)',  glow: 'rgba(255,200,60,0.35)'  },
  open_mic:    { primary: 'rgba(180,140,255,0.18)', secondary: 'rgba(240,180,130,0.10)', glow: 'rgba(180,140,255,0.35)' },
  networking:  { primary: 'rgba(180,140,255,0.18)', secondary: 'rgba(60,230,180,0.10)',  glow: 'rgba(180,140,255,0.35)' },
  sports:      { primary: 'rgba(60,230,180,0.18)',  secondary: 'rgba(80,160,255,0.12)',  glow: 'rgba(60,230,180,0.35)'  },
  other:       { primary: 'rgba(80,160,255,0.18)',  secondary: 'rgba(60,230,180,0.12)',  glow: 'rgba(80,160,255,0.35)'  },
}

export function normalizeCategory(label: string): EventCategory {
  const normalized = label.trim().toLowerCase();
  switch (normalized) {
    case 'club': return 'club';
    case 'dj night': return 'dj_night';
    case 'house party': return 'house_party';
    case 'comedy': return 'comedy';
    case 'open mic': return 'open_mic';
    case 'networking': return 'networking';
    case 'sports': return 'sports';
    case 'music': return 'dj_night';
    case 'nightlife': return 'club';
    default: return 'other';
  }
}

export function getCategoryColour(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other;
  return c.glow.replace(/[\d.]+\)$/, '1)');
}

// Hero banner — large radial from top-left + smaller from bottom-right
export function getCategoryHeroAura(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other
  return `radial-gradient(ellipse at 20% 20%, ${c.primary} 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, ${c.secondary} 0%, transparent 50%)`
}

// Card background — subtle ambient, not distracting
export function getCategoryCardAura(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other
  return `radial-gradient(ellipse at 0% 0%, ${c.primary.replace(/[\d.]+\)$/, '0.12)')} 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, ${c.secondary.replace(/[\d.]+\)$/, '0.08)')} 0%, transparent 50%)`
}

export function getCategoryPillAura(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other
  return `radial-gradient(ellipse 120% 100% at 50% 50%, ${c.primary.replace(/[\d.]+\)$/, '0.3)')} 0%, transparent 70%)`
}

export function getCategoryButtonGlow(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other
  return `0 0 24px ${c.glow.replace(/[\d.]+\)$/, '0.4)')}, 0 4px 16px rgba(0,0,0,0.4)`
}

// Border glow — box-shadow only, never a solid border color
export function getCategoryBorderGlow(category: string): string {
  const cat = normalizeCategory(category);
  const c = CATEGORY_AURA[cat] ?? CATEGORY_AURA.other
  return `0 4px 32px ${c.glow.replace(/[\d.]+\)$/, '0.2)')}, 0 0 120px ${c.glow.replace(/[\d.]+\)$/, '0.1)')}`
}
