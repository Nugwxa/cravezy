import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Supabase clients

// Standard client for public-facing operations.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// THIS CAN BYPASS RLS SO IT SHOULD BE USED CAREFULLY!
// Admin client for privileged operations.
// The only reasonable use case I can think of at the time of
// writing this is changing a users password from the admin dashboard.
//
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export { supabase, supabaseAdmin }
