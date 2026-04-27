import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read env vars manually
const envPath = path.resolve(__dirname, '../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const EVENTS = [
  // ═══════════════════ DELHI (5 events) ═══════════════════
  {
    title: "Sufi Nights at Qutub",
    description: "Experience a magical evening of Sufi music under the stars, featuring renowned artists from across the country. Book via BookMyShow or Insider.",
    location: "Delhi",
    cityId: "delhi",
    date: "2026-05-15",
    price: "₹1,500",
    category: "Music",
    image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "Delhi Food Truck Festival 2026",
    description: "The biggest culinary gathering of the year! Over 50 food trucks bringing you the best street food from around the world. Entry passes on Zomato Live.",
    location: "Delhi",
    cityId: "delhi",
    date: "2026-05-22",
    price: "₹299",
    category: "Food",
    image: "https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Tech Startup Mixer NCR",
    description: "Connect with founders, VCs, and developers. An evening of networking, pitching, and shaping the future of Indian tech. Free registration on Luma.",
    location: "Delhi",
    cityId: "delhi",
    date: "2026-06-05",
    price: "Free",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Midnight Techno Rave",
    description: "An underground techno experience featuring international DJs and cutting-edge visual mapping. 21+ only. Tickets on Insider.",
    location: "Delhi",
    cityId: "delhi",
    date: "2026-06-12",
    price: "₹2,500",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "Pottery & Wine Workshop",
    description: "Unwind on a Sunday afternoon. Learn hand-building pottery techniques while sipping on fine wine. Limited seats — book on BookMyShow.",
    location: "Delhi",
    cityId: "delhi",
    date: "2026-05-30",
    price: "₹1,800",
    category: "Workshops",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },

  // ═══════════════════ BENGALURU (5 events) ═══════════════════
  {
    title: "Namma Ooru Indie Fest",
    description: "Celebrating the best of independent music. 10 bands, 2 stages, unlimited energy. Grab passes on Insider.",
    location: "Bengaluru",
    cityId: "bengaluru",
    date: "2026-05-18",
    price: "₹999",
    category: "Music",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "AI Hackathon Bangalore '26",
    description: "48 hours to build the next big thing in AI. Huge prizes, free food, and mentorship from industry leaders. Register on Devfolio.",
    location: "Bengaluru",
    cityId: "bengaluru",
    date: "2026-06-02",
    price: "Free",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "Koramangala Pub Crawl",
    description: "Join 100+ partygoers as we hit 4 of the best pubs in Koramangala. First drink on us at every stop! RSVP on Insider.",
    location: "Bengaluru",
    cityId: "bengaluru",
    date: "2026-05-24",
    price: "₹1,200",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Standup Comedy Open Mic",
    description: "Watch seasoned comics try out new material and first-timers take the stage. Walk-ins welcome, advance booking on BookMyShow.",
    location: "Bengaluru",
    cityId: "bengaluru",
    date: "2026-05-20",
    price: "₹199",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Cubbon Park Weekend Run",
    description: "A community 5K and 10K run through the lungs of the city. Open to all fitness levels. Register on Townscript.",
    location: "Bengaluru",
    cityId: "bengaluru",
    date: "2026-06-15",
    price: "₹499",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1552674605-15c3705be331?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },

  // ═══════════════════ MUMBAI (5 events) ═══════════════════
  {
    title: "Lollapalooza India 2026 Preview",
    description: "The official pre-party for Lollapalooza. Special surprise performances and an unmatched vibe. Tickets on BookMyShow.",
    location: "Mumbai",
    cityId: "mumbai",
    date: "2026-06-20",
    price: "₹3,999",
    category: "Music",
    image: "https://images.unsplash.com/photo-1470229722913-7c090be5c560?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "Bandra Pop-up Flea Market",
    description: "Shop from 80+ local brands, enjoy live acoustic sets, and eat from Mumbai's finest artisanal food stalls. Free entry.",
    location: "Mumbai",
    cityId: "mumbai",
    date: "2026-05-29",
    price: "Free",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Bollywood Night Extravaganza",
    description: "Dance the night away to the biggest Bollywood hits with DJ Chetas. VIP tables available — book on Insider.",
    location: "Mumbai",
    cityId: "mumbai",
    date: "2026-06-06",
    price: "₹2,000",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: true
  },
  {
    title: "Sunset Yacht Party",
    description: "A luxury yacht experience sailing past the Gateway of India. Premium drinks and deep house. Limited spots — DM or book on Insider.",
    location: "Mumbai",
    cityId: "mumbai",
    date: "2026-05-23",
    price: "₹5,500",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1513689408018-8fecaf94ce2d?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  },
  {
    title: "Acting Workshop by Neeraj Kabi",
    description: "An intensive 2-day acting workshop focusing on method and theatrical performance. Register on BookMyShow.",
    location: "Mumbai",
    cityId: "mumbai",
    date: "2026-06-10",
    price: "₹4,000",
    category: "Workshops",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=1200",
    is_verified: true,
    featured: false
  }
];

async function seed() {
  console.log("Starting to seed " + EVENTS.length + " events...");

  const { data: adminUsers } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['owner', 'admin'])
    .limit(1);
    
  const userId = adminUsers && adminUsers.length > 0 ? adminUsers[0].id : null;

  let successCount = 0;
  for (const event of EVENTS) {
    const payload = { ...event };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('events').insert(payload);

    if (error) {
      console.error("✗ " + event.title + ": " + error.message);
    } else {
      console.log("✓ " + event.title);
      successCount++;
    }
  }

  console.log("\nDone! " + successCount + "/" + EVENTS.length + " events seeded successfully.");
  process.exit(0);
}

seed();
