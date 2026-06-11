# Milo Event Scraper (standalone)

Scrapes public event pages and outputs a CSV (no website integration).

## Usage (recommended: seed URLs)

Scrape event pages starting from listing/search pages:

```bash
node scraper/scrape.cjs \
  --seed "https://allevents.in/delhi" \
  --seed "https://insider.in/all-events-in-delhi" \
  --max-events 60 \
  --out ./events.csv
```

## Usage (direct event URLs)

```bash
node scraper/scrape.cjs \
  --event-url "https://example.com/events/some-event" \
  --event-url "https://example.com/event/another" \
  --out ./events.csv
```

## Usage (presets)

```bash
node scraper/scrape.cjs --preset district --city delhi --out ./events.csv
```

## Notes
- This scraper only uses normal HTTP fetch + HTML parsing (JSON-LD + OpenGraph). No login scraping, no CAPTCHA bypass.
- Output includes the exact source URL and best-effort canonical URL.
