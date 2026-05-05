const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thfeoltkysxrdrkagjuf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoZmVvbHRreXN4cmRya2FnanVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTQwMzUxMywiZXhwIjoyMDkwOTc5NTEzfQ.72yreHJ2HeyoDzL8GZCX82l3ETvfvsG2vpTbb_utKm0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Starting query...");
  try {
    const { count, error } = await supabase
      .from('rsvps')
      .select('*', { count: 'exact', head: true });
    
    console.log("Query finished:", { count, error });
  } catch (err) {
    console.log("Query threw an error:", err);
  }
}

run();
