export type EventCategory =
  | 'club' | 'dj_night' | 'house_party' | 'comedy'
  | 'open_mic' | 'networking' | 'sports' | 'other'

const AURA_COLOURS: Record<EventCategory, [string, string]> = {
  club:        ['#f9643c', '#e83ca0'],
  dj_night:    ['#f9643c', '#b48cff'],
  house_party: ['#e83ca0', '#b48cff'],
  comedy:      ['#ffc83c', '#f9643c'],
  open_mic:    ['#b48cff', '#f0b482'],
  networking:  ['#b48cff', '#3ce6b4'],
  sports:      ['#3ce6b4', '#50a0ff'],
  other:       ['#50a0ff', '#3ce6b4'],
}

// Primary aura colour for the category
export function getCategoryColour(category: EventCategory | string): string {
  // Safe cast for runtime string matches
  const cat = normalizeCategory(category);
  return AURA_COLOURS[cat]?.[0] ?? '#b48cff'
}

// Radial glow for card backgrounds — subtle bloom from top-left corner
// Use as: background: getCategoryCardAura('club')
export function getCategoryCardAura(category: EventCategory | string): string {
  const cat = normalizeCategory(category);
  const [c1, c2] = AURA_COLOURS[cat] ?? ['#b48cff', '#3ce6b4']
  return `radial-gradient(ellipse 70% 60% at 0% 0%, ${c1}2e 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 100% 100%, ${c2}1a 0%, transparent 65%)`
}

// Radial glow for selected filter pill
export function getCategoryPillAura(category: EventCategory | string): string {
  const cat = normalizeCategory(category);
  const [c1] = AURA_COLOURS[cat] ?? ['#b48cff', '#3ce6b4']
  return `radial-gradient(ellipse 120% 100% at 50% 50%, ${c1}47 0%, transparent 70%)`
}

// Full-bleed aura for detail view / modal header
export function getCategoryHeroAura(category: EventCategory | string): string {
  const cat = normalizeCategory(category);
  const [c1, c2] = AURA_COLOURS[cat] ?? ['#b48cff', '#3ce6b4']
  return `radial-gradient(ellipse 80% 60% at 20% 20%, ${c1}40 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 80%, ${c2}30 0%, transparent 60%)`
}

// Glow box-shadow for CTA buttons
export function getCategoryButtonGlow(category: EventCategory | string): string {
  const cat = normalizeCategory(category);
  const [c1] = AURA_COLOURS[cat] ?? ['#b48cff', '#3ce6b4']
  return `0 0 24px ${c1}50, 0 4px 16px rgba(0,0,0,0.4)`
}

// Border glow for focused/hovered card
export function getCategoryBorderGlow(category: EventCategory | string): string {
  const cat = normalizeCategory(category);
  const [c1] = AURA_COLOURS[cat] ?? ['#b48cff', '#3ce6b4']
  return `0 0 0 0.5px ${c1}40, 0 8px 32px ${c1}20`
}

// Helper to normalize user-facing labels to internal keys
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
    case 'music': return 'dj_night'; // fallback for old labels
    case 'nightlife': return 'club'; // fallback for old labels
    default: return 'other';
  }
}
