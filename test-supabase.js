const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  console.log("Testing Supabase Connection...");
  
  // Test 1: Profiles
  const { data: profiles, error: profileErr } = await supabase.from('profiles').select('id').limit(1);
  if (profileErr) {
    console.error("❌ Error accessing 'profiles':", profileErr.message);
  } else {
    console.log("✅ 'profiles' table accessible. Found", profiles.length, "records.");
  }

  // Test 2: Events
  const { data: events, error: eventsErr } = await supabase.from('events').select('id, title').limit(1);
  if (eventsErr) {
    console.error("❌ Error accessing 'events':", eventsErr.message);
  } else {
    console.log("✅ 'events' table accessible. Found", events.length, "records.");
  }

  // Test 3: RSVPs (testing the join as well)
  const { data: rsvps, error: rsvpsErr } = await supabase
    .from('rsvps')
    .select(`
      id,
      event:events (
        id,
        title
      )
    `)
    .limit(1);
    
  if (rsvpsErr) {
    console.error("❌ Error accessing 'rsvps' with events join:", rsvpsErr.message);
  } else {
    console.log("✅ 'rsvps' table and join accessible. Found", rsvps.length, "records.");
  }

  console.log("Done testing.");
}

testSupabase();
