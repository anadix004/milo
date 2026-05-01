import { NextRequest } from "next/server";
import * as XLSX from "xlsx";
import * as cheerio from "cheerio";
import { getSupabaseAdmin } from "@/utils/supabaseAdmin";
import { isValidUrl, normalizeCategory, COMMON_URL_COLUMNS } from "@/utils/scrapeSync";

// ── Constants ─────────────────────────────────────────────────────────────────
const CONCURRENCY = 3;
const SCRAPE_TIMEOUT_MS = 15_000;
const IMAGE_TIMEOUT_MS = 10_000;

const SCRAPE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "no-cache",
};

// ── SSE helpers ───────────────────────────────────────────────────────────────
function sse(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

// ── Scraper ───────────────────────────────────────────────────────────────────
interface ScrapedData {
  title: string;
  description: string;
  image: string;
  date: string;
  price: string;
  venue: string;
}

/**
 * Detects if a URL points to the project's Supabase instance
 */
function isProjectSupabaseUrl(url: string): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;
  try {
    const projectHost = new URL(supabaseUrl).hostname;
    return new URL(url).hostname === projectHost;
  } catch {
    return false;
  }
}

async function scrapeUrl(url: string): Promise<ScrapedData> {
  const headers: Record<string, string> = { ...SCRAPE_HEADERS };
  
  // If target is our own Supabase, we MUST include the API key
  if (isProjectSupabaseUrl(url)) {
    headers["apikey"] = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    headers["Authorization"] = `Bearer ${headers["apikey"]}`;
  }

  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
  });
  
  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(`HTTP 403: Forbidden. The site blocked our scraper. Try a different URL or manual entry.`);
    }
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Open Graph (BookMyShow + District.in SSR these for social crawlers)
  const ogTitle = $('meta[property="og:title"]').attr("content") ?? "";
  const ogDesc = $('meta[property="og:description"]').attr("content") ?? "";
  const ogImage =
    $('meta[property="og:image"]').attr("content") ??
    $('meta[property="og:image:url"]').attr("content") ??
    "";

  // Twitter Card fallback
  const twTitle = $('meta[name="twitter:title"]').attr("content") ?? "";
  const twImage = $('meta[name="twitter:image"]').attr("content") ?? "";

  // Standard meta
  const pageTitle = $("title").text().trim();
  const metaDesc = $('meta[name="description"]').attr("content") ?? "";

  // JSON-LD structured data (Event / MusicEvent)
  let ld: Record<string, unknown> = {};
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html() ?? "{}";
      const parsed: unknown = JSON.parse(raw);
      const obj = Array.isArray(parsed) ? parsed[0] : parsed;
      if (
        obj &&
        typeof obj === "object" &&
        "name" in obj &&
        ["Event", "MusicEvent", "SocialEvent"].includes(
          (obj as Record<string, unknown>)["@type"] as string
        )
      ) {
        ld = obj as Record<string, unknown>;
      }
    } catch {
      // ignore
    }
  });

  const title =
    ogTitle ||
    twTitle ||
    (ld?.name as string) ||
    pageTitle ||
    $("h1").first().text().trim();
  const description =
    ogDesc || metaDesc || (ld?.description as string) || "";
  const image = ogImage || twImage || (ld?.image as string) || "";

  // Date from JSON-LD
  let date = "";
  if (ld?.startDate) {
    date = String(ld.startDate).split("T")[0];
  }

  // Price from JSON-LD offers
  let price = "Free";
  if (ld?.offers) {
    const offer = Array.isArray(ld.offers)
      ? (ld.offers as Record<string, unknown>[])[0]
      : (ld.offers as Record<string, unknown>);
    if (offer?.price != null && offer.price !== "" && offer.price !== 0) {
      price = `₹${offer.price}`;
    } else if (offer?.availability === "http://schema.org/InStock") {
      price = "Paid";
    }
  }

  // Venue from JSON-LD location
  let venue = "";
  if (ld?.location && typeof ld.location === "object") {
    const loc = ld.location as Record<string, unknown>;
    venue =
      (loc?.name as string) ??
      ((loc?.address as Record<string, string>)?.streetAddress ?? "");
  }

  return { title, description, image, date, price, venue };
}

// ── Image re-hosting ──────────────────────────────────────────────────────────
async function reHostImage(
  imageUrl: string,
  supabase: ReturnType<typeof getSupabaseAdmin>
): Promise<string> {
  if (!imageUrl) return "";
  try {
    const headers: Record<string, string> = { ...SCRAPE_HEADERS };
    if (isProjectSupabaseUrl(imageUrl)) {
      headers["apikey"] = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
      headers["Authorization"] = `Bearer ${headers["apikey"]}`;
    }

    const res = await fetch(imageUrl, {
      headers,
      signal: AbortSignal.timeout(IMAGE_TIMEOUT_MS),
    });
    if (!res.ok) return imageUrl;

    const contentType = res.headers.get("content-type") ?? "image/jpeg";
    const ext = contentType.split("/")[1]?.split(";")[0] ?? "jpg";
    const buffer = await res.arrayBuffer();
    const fileName = `scrape_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("event-assets")
      .upload(fileName, buffer, { contentType });
    if (error) return imageUrl;

    return supabase.storage.from("event-assets").getPublicUrl(fileName).data
      .publicUrl;
  } catch {
    return imageUrl;
  }
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Parse form data before creating the stream (request body can only be read once)
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return new Response(
      `data: ${JSON.stringify({ type: "error", message: "Failed to parse form data." })}\n\n`,
      { headers: { "Content-Type": "text/event-stream" } }
    );
  }

  const file = formData.get("file") as File | null;
  const cityId = (formData.get("cityId") as string) || "delhi-ncr";
  const userId = (formData.get("userId") as string) || "";
  const urlColumnHint = (formData.get("urlColumn") as string) || "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (!file) {
          controller.enqueue(sse({ type: "error", message: "No file uploaded." }));
          controller.close();
          return;
        }

        // Parse workbook
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

        if (rows.length === 0) {
          controller.enqueue(sse({ type: "error", message: "Spreadsheet is empty." }));
          controller.close();
          return;
        }

        // Detect URL column
        const colNames = Object.keys(rows[0]);
        const urlCol =
          urlColumnHint && colNames.includes(urlColumnHint)
            ? urlColumnHint
            : COMMON_URL_COLUMNS.find((c) => colNames.includes(c)) ??
              colNames[0];

        const validRows = rows
          .map((row, i) => ({ row, originalIndex: i }))
          .filter(({ row }) => isValidUrl(row[urlCol] ?? ""));

        const total = validRows.length;
        if (total === 0) {
          controller.enqueue(
            sse({
              type: "error",
              message: `No valid URLs found in column "${urlCol}". Detected columns: ${colNames.join(", ")}`,
            })
          );
          controller.close();
          return;
        }

        const supabase = getSupabaseAdmin();
        
        // Quick connectivity check
        const { error: healthCheck } = await supabase.from("events").select("id", { count: "exact", head: true }).limit(1);
        if (healthCheck) {
          console.error("Supabase health check failed:", healthCheck);
          // If it's the "No API key" error, we want to give a clear message
          const errorMsg = healthCheck.message === "No API key found in request" 
            ? "Database authentication failed (No API key). Please check your SUPABASE_SERVICE_ROLE_KEY."
            : `Database connection failed: ${healthCheck.message}`;
          controller.enqueue(sse({ type: "error", message: errorMsg }));
          controller.close();
          return;
        }

        let successCount = 0, failedCount = 0, skippedCount = 0;

        // Process in concurrent batches of CONCURRENCY
        for (let i = 0; i < validRows.length; i += CONCURRENCY) {
          const batch = validRows.slice(i, i + CONCURRENCY);
          await Promise.all(
            batch.map(async ({ row, originalIndex }) => {
              const sourceUrl = row[urlCol];

              controller.enqueue(
                sse({
                  type: "progress",
                  rowIndex: originalIndex,
                  total,
                  status: "processing",
                  url: sourceUrl,
                })
              );

              try {
                // Deduplication check
                const { data: existing } = await supabase
                  .from("events")
                  .select("id")
                  .eq("source_url", sourceUrl)
                  .maybeSingle();

                if (existing) {
                  skippedCount++;
                  controller.enqueue(
                    sse({
                      type: "row_result",
                      rowIndex: originalIndex,
                      status: "skipped",
                      sourceUrl,
                      title: "(already synced)",
                    })
                  );
                  return;
                }

                // Scrape
                const scraped = await scrapeUrl(sourceUrl);

                // Re-host image
                const hostedImage = scraped.image
                  ? await reHostImage(scraped.image, supabase)
                  : "";

                // Merge spreadsheet overrides with scraped data
                const title =
                  (row["Event Title"] ??
                  row["Title"] ??
                  row["title"] ??
                  scraped.title) ||
                  "Untitled Event";
                const price =
                  row["Price"] ?? row["price"] ?? scraped.price ?? "Free";
                const date =
                  row["Date"] ??
                  row["date"] ??
                  scraped.date ??
                  new Date().toISOString().split("T")[0];
                const category = normalizeCategory(
                  row["Category"] ?? row["category"] ?? scraped.title ?? ""
                );

                const { data: inserted, error: insertError } = await supabase
                  .from("events")
                  .insert({
                    title,
                    description:
                      scraped.description || "Curated event by MILO.",
                    cityId,
                    location: scraped.venue || cityId,
                    venue_address: scraped.venue || null,
                    date,
                    price,
                    category,
                    image: hostedImage || scraped.image || "",
                    ticket_links: [sourceUrl],
                    source_url: sourceUrl,
                    user_id: userId || null,
                    is_verified: true,
                    featured: false,
                  })
                  .select("id")
                  .single();

                if (insertError) throw insertError;

                successCount++;
                controller.enqueue(
                  sse({
                    type: "row_result",
                    rowIndex: originalIndex,
                    status: "success",
                    sourceUrl,
                    title,
                    image: hostedImage || scraped.image,
                    eventId: inserted.id,
                  })
                );
              } catch (err: unknown) {
                failedCount++;
                const msg =
                  err instanceof Error ? err.message : "Unknown error";
                controller.enqueue(
                  sse({
                    type: "row_result",
                    rowIndex: originalIndex,
                    status: "failed",
                    sourceUrl,
                    error: msg,
                  })
                );
              }
            })
          );
        }

        controller.enqueue(
          sse({
            type: "complete",
            summary: {
              success: successCount,
              failed: failedCount,
              skipped: skippedCount,
              total,
            },
          })
        );
        controller.close();
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Internal server error";
        controller.enqueue(sse({ type: "error", message: msg }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
