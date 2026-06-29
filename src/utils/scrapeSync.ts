// Shared types and utilities for the Scrape & Sync feature.
// Used by both the API route (server) and the BulkUploadStudio component (client).

export interface RowResult {
  rowIndex: number;
  sourceUrl: string;
  status: "success" | "failed" | "skipped";
  eventId?: string;
  title?: string;
  image?: string;
  error?: string;
}

export interface SSEEvent {
  type: "progress" | "row_result" | "complete" | "error";
  rowIndex?: number;
  total?: number;
  status?: "processing" | "success" | "failed" | "skipped";
  /** URL being processed (for progress events) */
  url?: string;
  sourceUrl?: string;
  title?: string;
  image?: string;
  error?: string;
  eventId?: string;
  summary?: {
    success: number;
    failed: number;
    skipped: number;
    total: number;
  };
  message?: string;
}

export const COMMON_URL_COLUMNS = [
  "Source URL",
  "URL",
  "Product Link",
  "Link",
  "Event URL",
  "source_url",
  "url",
  "link",
];

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    const hostname = parsed.hostname.toLowerCase();
    // Prevent SSRF / internal IP probe / cloud metadata scans
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "[::1]" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("169.254.") || // link-local metadata
      hostname.startsWith("127.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const CATEGORY_MAP: Record<string, string> = {
  music: "Music",
  concert: "Music",
  festival: "Music",
  band: "Music",
  dj: "Nightlife",
  nightlife: "Nightlife",
  party: "Nightlife",
  club: "Nightlife",
  rave: "Nightlife",
  comedy: "College",
  standup: "College",
  improv: "College",
  college: "College",
  workshop: "Workshops",
  hackathon: "Workshops",
  bootcamp: "Workshops",
  seminar: "Workshops",
  networking: "Networking",
  meetup: "Networking",
  tech: "Networking",
  startup: "Networking",
  conference: "Networking",
};

export function normalizeCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return value;
  }
  return "Music";
}
