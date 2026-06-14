import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
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

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200";

function parseSheet(filePath, defaultCityId) {
  const absolutePath = path.resolve(__dirname, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found: ${absolutePath}`);
    return [];
  }
  
  const workbook = xlsx.readFile(absolutePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

  return data.map((row) => {
    // Determine cityId
    let cityId = defaultCityId;
    if (row['City']) {
      const cityLower = String(row['City']).toLowerCase().trim();
      if (cityLower.includes('delhi') || cityLower.includes('gurugram') || cityLower.includes('noida') || cityLower.includes('ncr') || cityLower.includes('noid')) {
        cityId = 'delhi';
      } else if (cityLower.includes('mumbai') || cityLower.includes('navi mumbai')) {
        cityId = 'mumbai';
      } else if (cityLower.includes('bangalore') || cityLower.includes('bengaluru')) {
        cityId = 'bengaluru';
      }
    }

    const title = row['Event Name'] ? String(row['Event Name']).trim() : 'Unknown Event';
    const description = row['Event Description'] ? String(row['Event Description']).trim() : '';
    const dateStr = row['Date'] ? String(row['Date']).trim() : '';
    const timeStr = row['Time'] ? String(row['Time']).trim() : '';
    const date = dateStr + (timeStr ? ` ${timeStr}` : '');
    
    let location = row['Location'] ? String(row['Location']).trim() : (row['City'] ? String(row['City']).trim() : 'Unknown');
    let category = row['Category'] ? String(row['Category']).trim().toLowerCase() : 'culture';
    category = category.charAt(0).toUpperCase() + category.slice(1);
    let price = row['Price'] ? String(row['Price']).trim() : 'TBA';
    // let source_url = row['Booking URL'] ? String(row['Booking URL']).trim() : ''; // skipped
    let image = row['Images (Links)'] ? String(row['Images (Links)']).trim() : FALLBACK_IMAGE;

    // Handle ticket links - skipped because the column is missing in the DB

    return {
      title,
      description,
      location,
      cityId,
      date: date || null,
      price,
      category,
      image,
      // venue_address,
      // ticket_links,
      // source_url,
      is_verified: true,
      featured: false,
    };
  }).filter(e => e.title && e.title !== 'Unknown Event');
}

async function run() {
  console.log("Parsing sheets...");
  
  // Parse the unified event_sheet.xlsx
  const allEvents = parseSheet('../Event_sheets/event_sheet.xlsx', 'unknown');

  // Filter for Mumbai and Bengaluru only
  const events = allEvents.filter(e => e.cityId === 'mumbai' || e.cityId === 'bengaluru');

  console.log(`Found ${events.length} events to insert for Mumbai and Bangalore.`);

  if (events.length === 0) {
    console.log("No events to insert.");
    return;
  }

  // Get admin user to associate events with
  const { data: adminUsers } = await supabase
    .from('profiles')
    .select('id')
    .in('role', ['owner', 'admin'])
    .limit(1);
    
  const userId = adminUsers && adminUsers.length > 0 ? adminUsers[0].id : null;

  // Wipe out existing events for mumbai and bengaluru
  console.log("Cleaning up old events for Mumbai and Bangalore...");
  const { error: deleteError } = await supabase
    .from('events')
    .delete()
    .in('cityId', ['mumbai', 'bengaluru']);
    
  if (deleteError) {
    console.error("Failed to delete old events:", deleteError);
  } else {
    console.log("Successfully deleted old events for Mumbai and Bangalore.");
  }

  let successCount = 0;
  for (const event of events) {
    const payload = { ...event };
    if (userId) payload.user_id = userId;

    const { error } = await supabase.from('events').insert(payload);

    if (error) {
      console.error(`✗ Failed to insert "${event.title}": ${error.message}`);
    } else {
      console.log(`✓ Inserted "${event.title}"`);
      successCount++;
    }
  }

  console.log(`\nDone! Successfully inserted ${successCount}/${events.length} events.`);
  process.exit(0);
}

run();
