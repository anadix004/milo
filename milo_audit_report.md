# Milo Project: Comprehensive System Audit & Gap Analysis

**Date:** April 9, 2026  
**Status:** Audit Complete  
**Objective:** Evaluate launch readiness and identify flaws in technical architecture, security, and UI performance.

---

## 1. Project Overview & Architecture Deep Dive

Milo is a "FOMO Prevention Engine" designed as a premium, immersive events radar for Indian metropolitan cities. 

### Core Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Database/Auth**: Supabase (JS SDK + SSR)
- **Styling**: TailwindCSS 4 + Framer Motion
- **Scrolling**: Lenis (Smooth Scroll)
- **Visual Evolution**: Currently uses canvas frame scrubbing (Hero) and SVG monuments (City Selection).

### Technical Vision vs. Implementation Gap
> [!IMPORTANT]
> **Vision**: The technical specification (README) calls for a 3D-heavy experience using **Three.js** and **React Three Fiber** for the event "nebula" and 3D city Selection.
> **Current State**: The project has pivoted (likely for performance or complexity reasons) to a **2D Canvas-based animation** system. This is a significant architectural deviation.

---

## 2. Bug & Flaw Registry

Issues are ranked by severity:  
🔴 **CRITICAL**: Security risks or breaking functional gaps.  
🟠 **HIGH**: Performance bottlenecks or vision-breaking technical gaps.  
🟡 **MEDIUM**: UX friction or missing secondary features.  
⚪ **LOW**: Aesthetic polish or asset optimization.

### 🔴 Severity: CRITICAL

| Issue ID | Location | Description | Impact |
| :--- | :--- | :--- | :--- |
| **SEC-01** | `supabase_setup.sql` | **Exploitable RLS Policies**: The `events` table policy for UPDATE/DELETE only checks `auth.uid() IS NOT NULL`, allowing ANY logged-in user to modify ANY event. | Potential data destruction/vandalism. |
| **DB-01** | `EventListing.tsx` / `IdentityScan.tsx` | **Missing Schema Components**: The `rsvps` table and `avatars` storage bucket are utilized in the frontend but missing from the SQL setup script. | Features like "Join Plan" and "Identity Scan" will crash in production. |
| **AUTH-01** | `middleware.ts` | **Unprotected Routes**: Redirect logic for unauthenticated users is commented out, allowing access to `/admin` and `/chat` subfolders (though gated at component level). | Security-by-obscurity only; not robust. |

### 🟠 Severity: HIGH

| Issue ID | Location | Description | Impact |
| :--- | :--- | :--- | :--- |
| **PERF-01** | `src/app/page.tsx` | **Aggressive Asset Bloat**: Landing page preloads 240+ JPEGs (~32MB) and 3 PNGs (~24MB). Total payload ~56MB + Video. | Unacceptable load times on mobile/slow 4G. |
| **GAP-01** | Project Root | **Missing 3D Stack**: `Three.js` and `GSAP` are listed in README but not installed or used. Core visual philosophy of "3D Event Nebula" is missing. | Vision target not met; basic grid implementation. |
| **GAP-02** | `IdentityScan.tsx` | **Missing Character Sync**: Feature to update 3D Model (Boy/Girl) based on gender is not implemented. | Onboarding experience is incomplete. |

### 🟡 Severity: MEDIUM

| Issue ID | Location | Description | Impact |
| :--- | :--- | :--- | :--- |
| **UI-01** | `CitySelector.tsx` | **Low-Fidelity Monuments**: Uses basic SVGs instead of "neon-lit digital skyline" 3D buildings described in vision. | Loss of "Premium" feel. |
| **FEAT-01** | `Comments.tsx` | **Mock Comms Channel**: The secure comments section uses `MOCK_COMMENTS` and is not connected to Supabase Realtime. | User interaction is an illusion. |
| **UX-01** | `IdentityScan.tsx` | **No Camera Fallback**: If permissions are denied, the UI shows a "Retry" button but no alternative (e.g., photo upload). | Hard block for users with hardware issues. |

### ⚪ Severity: LOW

| Issue ID | Location | Description | Impact |
| :--- | :--- | :--- | :--- |
| **ASSET-01** | `HeroSection.tsx` | **Non-Optimized Sequences**: Frames are JPEGs instead of WebP. | Sub-optimal compression. |
| **CODE-01** | `src/components` | **Leftover Branding**: References to "PigeonLogo" and "radar_live" channel names suggest project reuse or inconsistent naming. | Internal maintenance friction. |

---

## 3. Recommended Fixes & Implementation Steps

### 🛠 FixSEC-01: Hardening Database RLS
Update `supabase_setup.sql` to restrict modifications to the creator or admins:
```sql
-- Fix: Only owners or admins can modify events
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
CREATE POLICY "Users can update their own events"
  ON public.events FOR UPDATE
  USING (auth.uid() = user_id OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'owner'));
```

### 🛠 FixDB-01: Missing Infrastructure
Run the following SQL to enable missing features:
```sql
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'join',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, profile_id)
);

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
```

### 🛠 FixPERF-01: Asset Optimization Strategy
1. **Convert PNGs**: Convert `delhi.png`, `mumbai.png`, and `banglore.png` from ~8MB each to WebP (<500KB).
2. **Lazy Sequence**: Modify `HeroSection.tsx` to only load the first 20 frames initially and load the rest in the background.

---

## 4. Suggestions for "Premium" Excellence

1. **True 3D Integration**: Re-introduce `React Three Fiber`. Replace the static SVG monuments in `CitySelector` with interactive low-poly 3D buildings that react to hover with neon emission.
2. **Haptic Feedback**: Add subtle vibrations (for mobile) and soundscapes (Web Audio API) as mentioned in README.
3. **Advanced Shader Transitions**: Use glsl shaders for the "Liquid Morph" when expanding event cards to full screen.
4. **Dynamic Onboarding**: Finish the "Identity Scan" by generating a unique "Digital Passport" card for the user once the avatar is uploaded.

---

> [!TIP]
> **Audit Conclusion**: The application has a strong stylistic foundation but is currently "smoke and mirrors" in several areas (Mock comments, 2D fallbacks). Prioritize fixing the **CRITICAL** database gaps before scaling the visual complexity.
