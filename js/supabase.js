// Supabase connection.
// anon / publishable key frontend mein daalna safe hai (RLS policies data ko protect karti hain).
// service_role / secret key KABHI yahan ya GitHub par mat daalna.
const SUPABASE_URL = 'https://hsepifttbjbapallygfq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_wXM-BnzQg3dsVsywq8i9sQ_6GAHcyXa';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);