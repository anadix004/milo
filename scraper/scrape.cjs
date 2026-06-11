const { writeFile } = require("node:fs/promises");
const { resolve: resolvePath } = require("node:path");

const DEFAULT_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const cityAliases = {
  delhi: "delhi",
  "new-delhi": "delhi",
  ncr: "delhi",
  mumbai: "mumbai",
  bombay: "mumbai",
  bengaluru: "bengaluru",
  bangalore: "bengaluru",
  blr: "bengaluru",
};

function presetSeedUrls({ presets, city }) {
  const cityKey = cityAliases[String(city).toLowerCase()] ?? "delhi";
  const presetSet = new Set((presets ?? []).map((p) => String(p).toLowerCase().trim()).filter(Boolean));

  const out = [];
  if (presetSet.has("district")) out.push(`https://www.district.in/events/?city=${encodeURIComponent(cityKey)}`);
  if (presetSet.has("allevents")) {
    if (cityKey === "delhi") out.push("https://allevents.in/new-delhi");
    if (cityKey === "mumbai") out.push("https://allevents.in/mumbai/events");
    if (cityKey === "bengaluru") out.push("https://allevents.in/bangalore");
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));
const options = {
  seedUrls: (args.seed ?? []).map(canonicalizeUrl).filter(Boolean),
  eventUrls: (args["event-url"] ?? []).map(canonicalizeUrl).filter(Boolean),
  preset: (args.preset ?? []).map((s) => String(s).toLowerCase().trim()).filter(Boolean),
  city: String(args.city ?? "delhi"),
  outPath: String(args.out ?? "./events.csv"),
  maxEvents: numArg(args["max-events"], 80),
  maxPerSeed: numArg(args["max-per-seed"], 120),
  concurrency: numArg(args.concurrency, 6),
  delayMs: numArg(args["delay-ms"], 300),
  userAgent: String(args["user-agent"] ?? DEFAULT_UA),
  sameHostOnly: boolArg(args["same-host-only"], true),
  dryRun: boolArg(args["dry-run"], false),
  verbose: boolArg(args.verbose, true),
};

const presetSeeds = presetSeedUrls({ presets: options.preset, city: options.city });
options.seedUrls.unshift(...presetSeeds);

if (!options.seedUrls.length && !options.eventUrls.length) {
  usageAndExit("Provide at least one --seed or --event-url.");
}

void (async () => {
  const startedAt = Date.now();
  if (options.verbose) {
    console.log(
      `Seeds: ${options.seedUrls.length} | Direct event URLs: ${options.eventUrls.length} | maxEvents=${options.maxEvents} maxPerSeed=${options.maxPerSeed}`
    );
  }

  const discovered = [];
  for (const seedUrl of options.seedUrls) {
    if (options.verbose) console.log(`Discovering: ${seedUrl}`);
    const links = await discoverEventLinks({
      seedUrl,
      maxLinks: options.maxPerSeed,
      userAgent: options.userAgent,
      sameHostOnly: options.sameHostOnly,
    });
    if (options.verbose) console.log(`- found ${links.length} candidate links`);
    discovered.push(...links);
  }

  const allEventUrls = Array.from(new Set([...options.eventUrls, ...discovered]))
    .slice(0, options.maxEvents)
    .filter(Boolean);

  if (!allEventUrls.length) {
    usageAndExit("No event URLs found from seeds. Try --same-host-only false or pass direct --event-url.");
  }

  if (options.verbose) console.log(`Scraping ${allEventUrls.length} event pages...`);

  const results = await mapConcurrent(
    allEventUrls,
    options.concurrency,
    async (url) => {
      await sleep(options.delayMs);
      return scrapeEventPage({ url, userAgent: options.userAgent });
    },
    { stopOnError: false }
  );

  const okRows = results.filter((r) => r.ok).map((r) => r.value);
  const failRows = results.filter((r) => !r.ok);

  console.log(
    `Scraped ${okRows.length}/${allEventUrls.length} pages in ${Math.round((Date.now() - startedAt) / 1000)}s`
  );
  if (failRows.length) {
    console.log(`Failed: ${failRows.length}`);
    for (const f of failRows.slice(0, 10)) console.log(`- ${f.error.url}: ${f.error.message}`);
  }

  if (!options.dryRun) {
    const csv = toCsv(okRows, [
      "source_host",
      "url",
      "canonical_url",
      "title",
      "description",
      "start_date",
      "end_date",
      "venue",
      "address",
      "city_guess",
      "price",
      "currency",
      "image",
      "images",
      "organizer",
      "tags",
      "scraped_at",
    ]);
    const outAbs = resolvePath(process.cwd(), options.outPath);
    await writeFile(outAbs, csv, "utf8");
    console.log(`Wrote CSV: ${outAbs}`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

function usageAndExit(message) {
  console.error(message);
  console.error(
    `\nUsage:\n` +
      `  node scraper/scrape.cjs --seed <url> [--seed <url> ...] --out ./events.csv\n` +
      `  node scraper/scrape.cjs --preset district --city delhi --out ./events.csv\n` +
      `\nFlags:\n` +
      `  --seed <url>             Listing/search page(s) to discover event links\n` +
      `  --event-url <url>        Direct event page(s)\n` +
      `  --preset <name>          district, allevents (best-effort; sites may change)\n` +
      `  --city <city>            delhi, mumbai, bengaluru\n` +
      `  --out <path>             CSV output path (default: ./events.csv)\n` +
      `  --max-events <n>         Max event pages to scrape (default: 80)\n` +
      `  --max-per-seed <n>       Max links discovered per seed (default: 120)\n` +
      `  --concurrency <n>        Concurrent fetches (default: 6)\n` +
      `  --delay-ms <n>           Delay between requests (default: 300)\n` +
      `  --same-host-only <bool>  Only follow seed host links (default: true)\n` +
      `  --dry-run <bool>         Do not write CSV\n`
  );
  process.exit(1);
}

function parseArgs(argv) {
  const out = {};
  let i = 0;
  while (i < argv.length) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      i += 1;
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    const isBool = next == null || next.startsWith("--");
    const value = isBool ? "true" : next;
    if (out[key] == null) out[key] = [];
    out[key].push(value);
    i += isBool ? 1 : 2;
  }
  for (const [k, v] of Object.entries(out)) {
    if (Array.isArray(v) && v.length === 1) out[k] = v[0];
  }
  for (const k of ["seed", "event-url", "preset"]) {
    if (out[k] == null) out[k] = [];
    if (!Array.isArray(out[k])) out[k] = [out[k]];
  }
  return out;
}

function numArg(v, def) {
  const raw = Array.isArray(v) ? v.at(-1) : v;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : def;
}

function boolArg(v, def) {
  const raw = Array.isArray(v) ? v.at(-1) : v;
  if (raw == null) return def;
  const s = String(raw).toLowerCase().trim();
  if (["1", "true", "yes", "y"].includes(s)) return true;
  if (["0", "false", "no", "n"].includes(s)) return false;
  return def;
}

async function fetchHtml({ url, userAgent, timeoutMs = 35_000, retries = 2 }) {
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    attempt += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: {
          "user-agent": userAgent,
          accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "accept-language": "en-US,en;q=0.9",
        },
      });
      if (res.status === 429 || res.status >= 500) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return await res.text();
    } catch (e) {
      const isAbort = e?.name === "AbortError" || String(e?.message || "").toLowerCase().includes("aborted");
      const canRetry = attempt <= retries + 1;
      if (!canRetry) throw e;
      // linear backoff
      await sleep(Math.min(2000 * attempt, 6000));
      // retry
      if (options.verbose) console.log(`Retrying fetch (${attempt}/${retries + 1}): ${url}${isAbort ? " (timeout)" : ""}`);
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function discoverEventLinks({ seedUrl, maxLinks, userAgent, sameHostOnly }) {
  const html = await fetchHtml({ url: seedUrl, userAgent });
  const seedHost = new URL(seedUrl).host;

  const rawHrefs = [];
  const hrefRe = /href\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRe.exec(html))) {
    rawHrefs.push(match[1]);
    if (rawHrefs.length >= maxLinks * 25) break;
  }

  // SPA fallback: also scan for embedded route strings / absolute URLs
  const urlish = [];
  const absUrlRe = /https?:\/\/[^\s"'<>]+/gi;
  while ((match = absUrlRe.exec(html))) {
    urlish.push(match[0]);
    if (urlish.length >= maxLinks * 25) break;
  }
  const routeRe = /["'](\/events\/[^\n"']+)["']/gi;
  while ((match = routeRe.exec(html))) {
    urlish.push(match[1]);
    if (urlish.length >= maxLinks * 25) break;
  }

  const links = [...rawHrefs, ...urlish]
    .map((href) => resolveUrl(seedUrl, href))
    .map((u) => canonicalizeUrl(u))
    .filter(Boolean);

  const scored = links
    .map((u) => ({ url: u, score: scoreCandidate(u) }))
    .filter((x) => x.score > 0)
    .filter((x) => (sameHostOnly ? new URL(x.url).host === seedHost : true))
    .filter((x) => isLikelyEventUrl(x.url))
    .sort((a, b) => b.score - a.score);

  const uniq = [];
  const seen = new Set();
  for (const item of scored) {
    if (seen.has(item.url)) continue;
    seen.add(item.url);
    uniq.push(item.url);
    if (uniq.length >= maxLinks) break;
  }
  return uniq;
}

function isLikelyEventUrl(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  const host = u.host.toLowerCase();
  const path = u.pathname.toLowerCase();

  // District: event detail pages usually include "buy-tickets". Category pages often include "book-tickets".
  if (host.includes("district.in")) {
    if (!path.startsWith("/events/")) return false;
    if (path.includes("book-tickets") && !path.includes("buy-tickets")) return false;
    if (!path.includes("buy-tickets")) return false;
    return true;
  }

  // AllEvents: keep /event/ pages and city event listings; discovery still may include noise.
  if (host.includes("allevents.in")) {
    if (path.includes("/event/") || path.includes("/events/")) return true;
  }

  return true;
}

function scoreCandidate(url) {
  const u = url.toLowerCase();
  if (u.startsWith("mailto:") || u.startsWith("tel:")) return 0;
  if (u.includes("/privacy") || u.includes("/terms") || u.includes("/careers")) return 0;
  if (u.includes("#")) return 0;
  if (u.match(/\\.(png|jpg|jpeg|gif|webp|svg|pdf)(\\?|$)/)) return 0;

  let score = 0;
  if (u.includes("/event")) score += 4;
  if (u.includes("/events")) score += 2;
  if (u.includes("ticket") || u.includes("tickets")) score += 1;
  if (u.includes("show") || u.includes("gig") || u.includes("concert")) score += 1;
  if (u.includes("utm_")) score -= 1;
  if (u.split("/").length >= 5) score += 1;
  return score;
}

	async function scrapeEventPage({ url, userAgent }) {
	  try {
	    const html = await fetchHtml({ url, userAgent });
	    const canonical =
	      canonicalizeUrl(extractFirstHref(html, /<link[^>]+rel=["']canonical["'][^>]*>/i)) ||
	      canonicalizeUrl(extractAttr(html, "link", "rel", "canonical", "href")) ||
	      url;
	    const host = new URL(url).host;
	    const district = host.includes("district.in") ? extractDistrictEvent(html) : null;

	    const { event, og } = extractMetadata(html);
	    const title = district?.title || event.name || og.title || extractTitle(html);
	    const description = district?.description || event.description || og.description || "";

	    const images = (
	      district?.images?.length
	        ? district.images
	        : event.images?.length
	          ? event.images
	          : og.image
	            ? [og.image]
	            : []
	    )
	      .map((u) => canonicalizeUrl(u))
	      .filter(Boolean);

	    const startDate = district?.startDate || event.startDate || "";
	    const endDate = district?.endDate || event.endDate || "";
	    const venue = district?.venue || event.venue || "";
	    const address = district?.address || event.address || "";
	    const cityGuess = district?.city || event.city || guessCityFromText(`${title} ${description} ${venue} ${address}`);

	    return {
	      ok: true,
	      value: {
	        source_host: host,
	        url,
	        canonical_url: canonical,
	        title,
	        description,
	        start_date: startDate,
	        end_date: endDate,
	        venue,
	        address,
	        city_guess: cityGuess,
	        price: district?.price || event.price || "",
	        currency: district?.currency || event.currency || "",
	        image: images[0] || "",
	        images: images.length ? JSON.stringify(images) : "",
	        organizer: district?.organizer || event.organizer || "",
	        tags:
	          district?.tags?.length
	            ? district.tags.join("|")
	            : event.tags?.length
	              ? event.tags.join("|")
	              : "",
	        scraped_at: new Date().toISOString(),
	      },
	    };
	  } catch (e) {
	    return { ok: false, error: { url, message: e instanceof Error ? e.message : String(e) } };
	  }
	}

	function extractMetadata(html) {
  const og = {
    title: extractOg(html, "og:title"),
    description: extractOg(html, "og:description"),
    image: extractOg(html, "og:image"),
  };

  const jsonLdBlocks = extractJsonLdBlocks(html);

  const events = jsonLdBlocks.flatMap((block) => parseJsonLdForEvents(block));
  const best = events[0] || null;

  return {
    og,
    event: {
      name: safeStr(best?.name),
      description: safeStr(best?.description),
      startDate: safeStr(best?.startDate),
      endDate: safeStr(best?.endDate),
      images: normalizeImages(best?.image),
      venue: extractVenue(best),
      address: extractAddress(best),
      city: extractCity(best),
      price: extractPrice(best),
      currency: extractCurrency(best),
      organizer: extractOrganizer(best),
      tags: extractKeywords(best),
    },
  };
	}

	function extractDistrictEvent(html) {
	  const needle = '\\"eventData\\":';
	  const pos = html.indexOf(needle);
	  if (pos === -1) return null;
	  const start = html.indexOf("{", pos);
	  if (start === -1) return null;
	  const end = findJsonObjectEnd(html, start);
	  if (end === -1) return null;

	  const escaped = html.slice(start, end);
	  const jsonText = escaped.replace(/\\"/g, '"').replace(/\\\//g, "/");

	  let eventData;
	  try {
	    eventData = JSON.parse(jsonText);
	  } catch {
	    return null;
	  }

	  const data = eventData?.data || {};
	  const venueObj = data?.venue || {};

	  const leastStart = typeof data?.least_show_start_time === "number" ? data.least_show_start_time : null;
	  const maxEnd = typeof data?.max_show_end_time === "number" ? data.max_show_end_time : null;

	  const images = [];
	  if (typeof data?.horizontal_cover_image === "string") images.push(data.horizontal_cover_image);
	  if (typeof data?.cover_image === "string") images.push(data.cover_image);
	  if (Array.isArray(data?.images)) {
	    for (const img of data.images) {
	      const u = img?.xlarge || img?.large || img?.medium || img?.small;
	      if (typeof u === "string") images.push(u);
	    }
	  }

	  const ticketCfg = deepFind(eventData, (k, v) => k === "ticket_price_config" && v && typeof v === "object");
	  const priceDisplay = ticketCfg?.price_display_string || "";
	  const minPrice = ticketCfg?.min_price;

	  const organizer =
	    (typeof data?.brand_details?.name === "string" && data.brand_details.name) ||
	    (typeof data?.brand_id?.name === "string" && data.brand_id.name) ||
	    "";

	  const keywordsMeta = extractMeta(html, "keywords");
	  const tags = keywordsMeta
	    ? keywordsMeta
	        .split(",")
	        .map((s) => s.trim())
	        .filter(Boolean)
	        .slice(0, 15)
	    : [];

	  const descHtml = typeof data?.description === "string" ? data.description : "";
	  const descText = descHtml ? stripHtml(descHtml) : "";

	  const city = typeof venueObj?.city === "string" ? venueObj.city : "";
	  const venue = typeof venueObj?.name === "string" ? venueObj.name : "";
	  const address = city || "";

	  return {
	    title: typeof data?.name === "string" ? data.name.trim() : "",
	    description: descText || (typeof data?.meta_description === "string" ? data.meta_description : ""),
	    startDate: leastStart ? new Date(leastStart * 1000).toISOString() : "",
	    endDate: maxEnd ? new Date(maxEnd * 1000).toISOString() : "",
	    venue,
	    address,
	    city,
	    price: priceDisplay || (typeof minPrice === "number" ? String(minPrice) : ""),
	    currency: priceDisplay || typeof minPrice === "number" ? "INR" : "",
	    images: Array.from(new Set(images)).slice(0, 25),
	    organizer,
	    tags,
	  };
	}

	function findJsonObjectEnd(text, startIdx) {
	  let brace = 0;
	  let inStr = false;
	  let esc = false;
	  for (let i = startIdx; i < text.length; i += 1) {
	    const ch = text[i];
	    if (esc) {
	      esc = false;
	      continue;
	    }
	    if (ch === "\\\\") {
	      esc = true;
	      continue;
	    }
	    if (ch === '"') {
	      inStr = !inStr;
	      continue;
	    }
	    if (inStr) continue;
	    if (ch === "{") brace += 1;
	    else if (ch === "}") {
	      brace -= 1;
	      if (brace === 0) return i + 1;
	    }
	  }
	  return -1;
	}

	function deepFind(root, predicate) {
	  const seen = new Set();
	  const stack = [root];
	  while (stack.length) {
	    const cur = stack.pop();
	    if (!cur || typeof cur !== "object") continue;
	    if (seen.has(cur)) continue;
	    seen.add(cur);
	    if (Array.isArray(cur)) {
	      for (const v of cur) stack.push(v);
	    } else {
	      for (const [k, v] of Object.entries(cur)) {
	        if (predicate(k, v)) return v;
	        stack.push(v);
	      }
	    }
	  }
	  return null;
	}

	function extractMeta(html, name) {
	  const re = new RegExp(
	    `<meta[^>]+name=[\"']${escapeRe(name)}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`,
	    "i"
	  );
	  const m = html.match(re);
	  return m?.[1] ? decodeHtml(m[1]).trim() : "";
	}

	function stripHtml(input) {
	  return decodeHtml(String(input).replace(/<[^>]+>/g, " "))
	    .replace(/\\s+/g, " ")
	    .trim();
	}

function extractTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? decodeHtml(m[1]).trim() : "";
}

function extractOg(html, prop) {
  const re = new RegExp(
    `<meta[^>]+property=[\"']${escapeRe(prop)}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`,
    "i"
  );
  const m = html.match(re);
  if (m?.[1]) return decodeHtml(m[1]).trim();
  // Some sites use name= instead of property=
  const re2 = new RegExp(
    `<meta[^>]+name=[\"']${escapeRe(prop)}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`,
    "i"
  );
  const m2 = html.match(re2);
  return m2?.[1] ? decodeHtml(m2[1]).trim() : "";
}

function extractJsonLdBlocks(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    const text = (m[1] || "").trim();
    if (text) blocks.push(text);
    if (blocks.length >= 20) break;
  }
  return blocks;
}

function escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeHtml(s) {
  return String(s)
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractFirstHref(html, tagRe) {
  const m = html.match(tagRe);
  if (!m) return "";
  const tag = m[0];
  const href = tag.match(/href\s*=\s*["']([^"']+)["']/i);
  return href?.[1] || "";
}

function extractAttr(html, tagName, keyAttr, keyValue, outAttr) {
  const re = new RegExp(
    `<${escapeRe(tagName)}\\b[^>]*\\b${escapeRe(keyAttr)}\\s*=\\s*["']${escapeRe(keyValue)}["'][^>]*>`,
    "i"
  );
  const m = html.match(re);
  if (!m) return "";
  const tag = m[0];
  const attr = tag.match(new RegExp(`${escapeRe(outAttr)}\\s*=\\s*["']([^"']+)["']`, "i"));
  return attr?.[1] || "";
}

function parseJsonLdForEvents(block) {
  let parsed;
  try {
    parsed = JSON.parse(block);
  } catch {
    return [];
  }
  const items = [];
  const visit = (node) => {
    if (!node) return;
    if (Array.isArray(node)) return node.forEach(visit);
    if (typeof node !== "object") return;
    const type = node["@type"];
    if (type === "Event" || (Array.isArray(type) && type.includes("Event"))) items.push(node);
    for (const v of Object.values(node)) visit(v);
  };
  visit(parsed);
  return items
    .map((it) => ({ it, score: (it?.name ? 2 : 0) + (it?.startDate ? 2 : 0) + (it?.location ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.it);
}

function normalizeImages(imageField) {
  if (!imageField) return [];
  if (typeof imageField === "string") return [imageField];
  if (Array.isArray(imageField)) return imageField.filter((x) => typeof x === "string");
  if (typeof imageField === "object") {
    const url = imageField?.url;
    if (typeof url === "string") return [url];
  }
  return [];
}

function extractVenue(event) {
  const loc = event?.location;
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  return safeStr(loc?.name);
}

function extractAddress(event) {
  const loc = event?.location;
  const addr = loc?.address;
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  const parts = [
    safeStr(addr?.streetAddress),
    safeStr(addr?.addressLocality),
    safeStr(addr?.addressRegion),
    safeStr(addr?.postalCode),
    safeStr(addr?.addressCountry),
  ].filter(Boolean);
  return parts.join(", ");
}

function extractCity(event) {
  const loc = event?.location;
  const addr = loc?.address;
  if (typeof addr === "string") return guessCityFromText(addr);
  const locality = safeStr(addr?.addressLocality);
  return locality || "";
}

function extractPrice(event) {
  const offers = event?.offers;
  const offer = Array.isArray(offers) ? offers[0] : offers;
  const price = offer?.price;
  if (price == null) return "";
  if (typeof price === "number") return String(price);
  if (typeof price === "string") return price;
  return "";
}

function extractCurrency(event) {
  const offers = event?.offers;
  const offer = Array.isArray(offers) ? offers[0] : offers;
  const cur = offer?.priceCurrency;
  return typeof cur === "string" ? cur : "";
}

function extractOrganizer(event) {
  const organizer = event?.organizer;
  if (!organizer) return "";
  if (typeof organizer === "string") return organizer;
  return safeStr(organizer?.name);
}

function extractKeywords(event) {
  const keywords = event?.keywords;
  if (!keywords) return [];
  if (typeof keywords === "string") return keywords.split(",").map((s) => s.trim()).filter(Boolean);
  if (Array.isArray(keywords)) return keywords.filter((x) => typeof x === "string");
  return [];
}

function safeStr(v) {
  return typeof v === "string" ? v.trim() : "";
}

function guessCityFromText(text) {
  const t = String(text || "").toLowerCase();
  if (t.includes("delhi") || t.includes("new delhi")) return "Delhi";
  if (t.includes("mumbai")) return "Mumbai";
  if (t.includes("bengaluru") || t.includes("bangalore")) return "Bengaluru";
  if (t.includes("pune")) return "Pune";
  if (t.includes("hyderabad")) return "Hyderabad";
  if (t.includes("chennai")) return "Chennai";
  if (t.includes("kolkata")) return "Kolkata";
  return "";
}

function resolveUrl(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return href;
  }
}

function canonicalizeUrl(input) {
  if (!input) return null;
  try {
    const u = new URL(input);
    u.hash = "";
    for (const key of Array.from(u.searchParams.keys())) {
      const k = key.toLowerCase();
      if (k.startsWith("utm_") || k === "fbclid" || k === "gclid" || k === "igshid") u.searchParams.delete(key);
    }
    return u.toString();
  } catch {
    return null;
  }
}

async function sleep(ms) {
  if (!ms) return;
  await new Promise((r) => setTimeout(r, ms));
}

async function mapConcurrent(items, concurrency, fn, options) {
  const stopOnError = Boolean(options?.stopOnError);
  const results = new Array(items.length);
  let idx = 0;

  const workers = new Array(Math.min(concurrency, items.length)).fill(0).map(async () => {
    while (true) {
      const cur = idx++;
      if (cur >= items.length) return;
      try {
        results[cur] = await fn(items[cur], cur);
      } catch (e) {
        if (stopOnError) throw e;
        results[cur] = {
          ok: false,
          error: { url: String(items[cur]), message: e instanceof Error ? e.message : String(e) },
        };
      }
    }
  });
  await Promise.all(workers);
  return results;
}

function toCsv(rows, columns) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };
  const header = columns.join(",");
  const lines = rows.map((r) => columns.map((c) => esc(r?.[c] ?? "")).join(","));
  return [header, ...lines].join("\n") + "\n";
}
