# Milo (baharmilo.com) Comprehensive Audit Report

## 1. Overview
Milo is a premium, localized events platform for Indian cities (Bengaluru, Delhi, Mumbai). It focuses on high-quality UX, curated events, and social validation ("Vibe Check" stories, digital passports). The platform is hosted on Vercel and accessible via `baharmilo.com`.

### Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Database & Auth:** Supabase (PostgreSQL, GoTrue for Auth)
*   **Styling:** Tailwind CSS v4, Framer Motion (animations)
*   **Icons:** Lucide React
*   **Date Handling:** date-fns

---

## 2. Core Features & Implementation

### Authentication
*   **Implementation:** Handled via Supabase GoTrue. Utilizes `AuthContext.tsx` for state management and UI (Modal/Toast), relying on `@supabase/ssr` to manage cookies in `middleware.ts` and Server Components.
*   **Methods:** Email/Password (OTP), Google OAuth.

### City Selection & Personalization
*   **Implementation:** Users select a city (`CitySelector.tsx`). This preference is stored locally (likely cookies/local storage) and used to filter the main feed (`EventListing.tsx`) based on the `city` column in the `events` table.

### Event Feed & Discovery
*   **Implementation:** `EventListing.tsx` fetches approved events from the `events` table. Includes client-side filtering (Upcoming/Past, Categories). Features smooth scrolling (`SmoothScroll.tsx`) and intersection observers for lazy loading.

### Event Submission (UGC)
*   **Implementation:** Users can submit events (`EventSubmission.tsx`). Submissions go to the `events` table with `status = 'pending'`. Requires identity verification (Aadhaar/Govt ID).

### Admin Dashboard & Moderation
*   **Implementation:** Located at `/admin`. Uses `AdminGuard.tsx` to verify `role = 'admin'` in the `profiles` table. Admins can approve/reject events, manage users, and trigger scrape/sync jobs.

### Scrape & Sync
*   **Implementation:** A dedicated API route (`/api/admin/scrape-sync/route.ts`) designed to ingest bulk event data (e.g., from Luma/BookMyShow CSVs) and upsert it into the `events` table.

### Social Features (Vibe Check & Passport)
*   **Implementation:** "Vibe Check" acts like Instagram stories for events (`VibeCheck.tsx`). "Digital Passport" (`DigitalPassport.tsx`) tracks user attendance and reputation.

---

## 3. Technical Bugs (Production & Functional)

### The Google Auth Issue (baharmilo.com vs Vercel)
*   **The Bug:** Google Sign-In works on `<app-name>.vercel.app` but fails on `baharmilo.com`.
*   **The Cause:** Supabase requires explicit whitelisting of redirect URIs for OAuth providers to prevent open redirect attacks.
*   **The Fix:** You must log into the Supabase Dashboard -> Authentication -> URL Configuration. Add `https://baharmilo.com/auth/callback` to the **Redirect URLs** list. The code in `src/app/auth/callback/route.ts` already correctly handles the `x-forwarded-host` header for the dynamic redirect.

### Missing Database Tables
*   **The Bug:** Attempting to "Save" or "Bookmark" an event crashes or fails silently. Attempting to post a "Vibe Check" fails.
*   **The Cause:** `EventListing.tsx` queries a `bookmarks` table, and `VibeCheck.tsx` queries a `vibe_checks` table. These tables *do not exist* in `supabase_setup.sql` or `migration_v2.sql`.
*   **The Fix:** Create the missing tables, or refactor the frontend. (e.g., use the existing `rsvps` table with a `type = 'bookmark'` enum instead of a separate table).

### Broken Scrape/Sync Job
*   **The Bug:** The `/api/admin/scrape-sync` endpoint fails to insert data.
*   **The Cause:** The backend utility `scrapeSync.ts` maps incoming CSV data to column names that do not match the database schema (e.g., mapping to `event_url` when the DB column might be `url`, or date format mismatches).

---

## 4. Nuanced Bugs (Security, Performance, & Architecture)

### CRITICAL: Admin Authentication Bypass
*   **The Bug:** Any user (or even unauthenticated users, depending on routing) can access the `/admin` dashboard.
*   **The Cause:** `src/components/admin/AdminGuard.tsx` has hardcoded `const isAuthorized = true;`. The actual role check against the `profiles` table has been commented out or bypassed during development and pushed to production.
*   **The Fix:** Restore the server-side role check in `AdminGuard` and ensure API routes also verify the `admin` role.

### Performance: Massive Landing Page Payload
*   **The Bug:** The initial load of the landing page (`src/app/page.tsx`) on mobile devices is extremely slow and consumes excessive bandwidth.
*   **The Cause:** The `HeroSection` and city selection components are preloading approximately 56MB of unoptimized high-resolution images and videos (`CITY_IMAGES`).
*   **The Fix:** Implement Next.js `<Image>` component for automatic WebP/AVIF conversion and lazy loading. Remove aggressive preloads for off-screen assets.

### Security: Plain Text PII Storage
*   **The Bug:** Sensitive user data is exposed if the database is compromised.
*   **The Cause:** `EventSubmission.tsx` collects Aadhaar IDs/Government IDs for verification. These are currently stored in plain text in the database.
*   **The Fix:** Aadhaar IDs must be encrypted at rest (e.g., using Supabase Vault or application-level encryption) or hashed if only used for deduplication. Never store in plain text.

### Reliability: Race Condition in User Creation
*   **The Bug:** Creating a new team member via the admin panel sometimes fails to create their profile.
*   **The Cause:** `src/app/api/admin/team/route.ts` uses an unreliable `setTimeout` (e.g., 2000ms) to wait for Supabase Auth to create the user before attempting to insert into the `profiles` table. In a serverless environment (Vercel), this timeout can be suspended or fail unpredictably.
*   **The Fix:** Remove the `setTimeout`. Use a Supabase Database Trigger (`after insert on auth.users`) to automatically create the corresponding `profiles` row.
