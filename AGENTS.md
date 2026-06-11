# Milo Website — AI Agent Context

> **Read this entire file before writing a single line of code.**
> This is the authoritative context document for the Milo marketing website.

---

## ⚠️ Next.js Note
This project uses Next.js with the App Router. APIs, conventions, and file structure may differ from your training data. Read `node_modules/next/dist/docs/` before writing any code. Heed all deprecation notices.

---

## What This Project Is

The **Milo marketing website** — an immersive landing page that markets the Milo events app to GenZ students. This is NOT the mobile app. The design standard is "Lusion-level": cinematic, 3D, scroll-driven.

- **GitHub:** github.com/anadix004/milo
- **Local path:** ~/Documents/College/Milo Website/milo/
- **Related app:** github.com/A6AN/Events_App

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| 3D Engine | Three.js / React Three Fiber |
| Animation | GSAP (GreenSock) + Framer Motion |
| Scroll | Lenis (inertial smooth scroll) |
| Language | TypeScript |
| Backend | Supabase (event scraping/sync) |

---

## Design Philosophy: The "Lusion Standard"

- **Aesthetic:** Cyber-Metropolitan / Premium Dark Mode
- **Motion:** Physics-based spring animations — NO linear movement
- **Depth:** Multi-layer parallax + WebGL particle systems
- **Interactivity:** Zero-latency transitions between 3D and 2D UI
- **Performance target:** 60 FPS on MacBook Air M-series
- **Always dark** — same palette as the mobile app

---

## Page Sections (User Journey)

### Phase 1: The Metropolitan Hero
- Dark neon-lit 3D skyline
- Three 3D buildings: Mumbai · Delhi · Bangalore
- City click → "High-Speed Camera Dive" to street level
- Tech: Three.js + GSAP ScrollTrigger

### Phase 2: The Event Nebula
- Events as floating "data beads" in a 3D cloud
- Dynamic themes per category:
  - Techno: Neon/Glitch shaders
  - Social: Frosted Glass
  - Meetups: Neural Grid/Radar
- Card click → Liquid Morph → full-screen event overlay

### Phase 3: The Identity Scan
- Glassmorphism sidebar profile section
- Custom sign-up (phone OTP, no Apple Login)
- 3D avatar updates based on gender

### Phase 4: The Great Fall
- Scroll-scrubbed video: character falls through city vortex
- Lands at city-wise WhatsApp QR code
- City-specific community group links

---

## Shared Design Tokens (same as mobile app)

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Primary accent | `#C9A84C` (Gold) |
| Purple | `#b48cff` |
| Coral | `#f9643c` |
| Teal | `#3ce6b4` |
| Heading font | Syne 700/800 |
| UI font | DM Sans 300–600 |
| Borders | `0.5px rgba(255,255,255,0.08)` |

Full design doc: available via MCP tool `get_design_system`

---

## Key Files

```
milo/
  src/
    app/                    ← Next.js App Router pages
    components/             ← React components
  public/                   ← Static assets
  baharmilo_full_redesign.html  ← Standalone HTML prototype (active reference)
  migration_*.sql           ← Website's own Supabase migrations (event scraping)
  district_delhi_events*.csv ← Scraped Delhi event data
```

**Active design reference:** `baharmilo_full_redesign.html` — this standalone HTML file is the current most advanced design. Read it before doing any UI work.

---

## MCP Server

A local MCP server provides live context tools. Server at:
`~/Documents/College/milo-mcp/`

Available tools:
- `get_website_context` — full website project context
- `get_design_system` — shared Milo design doc
- `get_github_file` (repo: "website") — fetch any file from this repo
- `list_github_files` (repo: "website") — browse this repo

---

## Rules

1. **Never light mode** — always dark, same rules as the mobile app
2. **Performance first** — 60 FPS target, optimize all 3D assets
3. **Read `baharmilo_full_redesign.html`** before working on any UI section
4. **Spring physics for motion** — no CSS linear transitions for major movements
5. **Check Next.js App Router docs** — don't assume old Pages Router patterns work
