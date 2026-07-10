import { createClient } from "@supabase/supabase-js";

// ============================================
// Supabase Client — Frontend
// ============================================
// Used for auth and direct DB queries from the client.
// Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
// are set in your .env.local file.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        "[JobPrep AI] Supabase environment variables are missing. " +
        "Copy frontend/.env.local.example to frontend/.env.local and fill in your values."
    );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
