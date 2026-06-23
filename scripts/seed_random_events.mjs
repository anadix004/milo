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

const CATEGORIES = ['Music', 'Comedy', 'Art', 'Nightlife', 'Workshops', 'Sports', 'Food', 'Culture'];

const CATEGORY_IMAGES = {
  Music: [
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
  ],
  Comedy: [
    'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=800'
  ],
  Art: [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800'
  ],
  Nightlife: [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800'
  ],
  Workshops: [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=800'
  ],
  Sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'
  ],
  Food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'
  ],
  Culture: [
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800'
  ]
};

const CITY_LOCATIONS = {
  delhi: [
    'Connaught Place, New Delhi',
    'Sector 29, Gurugram',
    'DLF CyberHub, Gurugram',
    'Hauz Khas Village, New Delhi',
    'Sector 18, Noida',
    'Saket, New Delhi',
    'Siri Fort Auditorium, New Delhi'
  ],
  mumbai: [
    'Bandra West, Mumbai',
    'Juhu Beach, Mumbai',
    'Colaba Social, Mumbai',
    'Lower Parel, Mumbai',
    'Andheri West, Mumbai',
    'Nariman Point, Mumbai',
    'Powai Lake Area, Mumbai'
  ],
  bengaluru: [
    'Koramangala 5th Block, Bengaluru',
    'Indiranagar 100ft Road, Bengaluru',
    'HSR Layout, Bengaluru',
    'Whitefield, Bengaluru',
    'MG Road, Bengaluru',
    'Phoenix Marketcity, Whitefield',
    'Jayanagar 4th Block, Bengaluru'
  ]
};

const EVENT_TITLES = {
  Music: [
    'Acoustic Evening Showcase',
    'Live Jazz & Blues Night',
    'Indie Rock Fest',
    'Symphony Under the Stars',
    'Techno Warehouse Session',
    'Bollywood Beats Live'
  ],
  Comedy: [
    'Standup Open Mic Night',
    'Improv Comedy Showdown',
    'Late Night Comedy Special',
    'LOL Weekend Special',
    'Hilarious Standup Hour'
  ],
  Art: [
    'Midnight Art & Gallery Walk',
    'Canvas Painting & Wine',
    'Clay Pottery Exhibition',
    'Abstract Art Workshop',
    'Visual Arts Festival'
  ],
  Nightlife: [
    'Neon Glow Party',
    'Silent Disco Dance Off',
    'Rooftop Lounge Mixer',
    'Retro Dance Party',
    'Underground Bass Showcase'
  ],
  Workshops: [
    'Photography Masterclass',
    'UI/UX Design Boot Camp',
    'Financial Literacy Workshop',
    'Creative Writing Seminar',
    'Culinary Baking Class'
  ],
  Sports: [
    'Weekend Marathon / Run',
    'Midnight Football League',
    'Cyclothon Event',
    'Trekking & Adventure Camp',
    'Yoga & Wellness Session'
  ],
  Food: [
    'Street Food Festival',
    'Wine & Cheese Tasting',
    'Gourmet Chef Pop-up',
    'Dessert Extravaganza',
    'Barbecue & Grill Night'
  ],
  Culture: [
    'Heritage Walk tour',
    'Folk Dance Showcase',
    'Spoken Word Poetry Slam',
    'Theatre Play & Drama',
    'Handloom & Craft Fair'
  ]
};

const DESCRIPTIONS = [
  'Join us for an exciting and memorable experience featuring talented hosts, interactive zones, and a fantastic crowd.',
  'An exclusive gathering designed to inspire, connect, and entertain. Limited passes available, reserve yours now!',
  'Unwind this weekend with a special curated lineup that promises to be the talk of the town.',
  'Perfect for friends and families looking to try something new. All safety guidelines and age limits strictly followed.',
  'An immersive event featuring top-notch sound, spectacular visuals, and unforgettable moments.',
  'Learn, network, and grow while having a great time. Refreshments and materials will be provided.'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice() {
  const prices = ['Free', '₹199', '₹299', '₹499', '₹799', '₹999', '₹1199', '₹1499', '₹1999'];
  return getRandomElement(prices);
}

// Generate date between today and next 30 days
function getRandomDate() {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * 30) + 1; // 1 to 30 days in future
  const eventDate = new Date(today);
  eventDate.setDate(today.getDate() + randomDays);
  
  // Set random time (e.g. 10am to 10pm)
  const randomHour = Math.floor(Math.random() * 12) + 10; // 10 to 21
  const randomMinute = getRandomElement(['00', '30']);
  
  const day = String(eventDate.getDate()).padStart(2, '0');
  const month = String(eventDate.getMonth() + 1).padStart(2, '0');
  const year = eventDate.getFullYear();
  
  return `${day}/${month}/${year} ${randomHour}:${randomMinute}:00`;
}

async function seed() {
  console.log("Generating 10 random demo events for each city (Delhi, Mumbai, Bengaluru)...");
  
  const { data: adminUsers } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['owner', 'admin'])
    .limit(1);
    
  const userId = adminUsers && adminUsers.length > 0 ? adminUsers[0].id : null;
  console.log(`Using admin userId: ${userId}`);

  const cities = ['delhi', 'mumbai', 'bengaluru'];
  const generatedEvents = [];

  for (const city of cities) {
    for (let i = 0; i < 10; i++) {
      const category = getRandomElement(CATEGORIES);
      const title = `${getRandomElement(EVENT_TITLES[category])} - ${city.toUpperCase()}`;
      const description = getRandomElement(DESCRIPTIONS);
      const location = getRandomElement(CITY_LOCATIONS[city]);
      const date = getRandomDate();
      const price = getRandomPrice();
      const image = getRandomElement(CATEGORY_IMAGES[category]);

      generatedEvents.push({
        title,
        description,
        location,
        cityId: city,
        date,
        price,
        category,
        image,
        is_verified: true,
        featured: Math.random() < 0.2, // 20% chance of being featured
        user_id: userId
      });
    }
  }

  console.log(`Generated ${generatedEvents.length} demo events. Commencing database insertion...`);

  let successCount = 0;
  for (const event of generatedEvents) {
    const { error } = await supabase.from('events').insert(event);
    if (error) {
      console.error(`✗ Failed to insert "${event.title}": ${error.message}`);
    } else {
      console.log(`✓ Inserted "${event.title}" for ${event.cityId} (${event.date})`);
      successCount++;
    }
  }

  console.log(`\nSuccessfully inserted ${successCount}/${generatedEvents.length} demo events.`);
  process.exit(0);
}

seed();
