// Supabase-Zugriff im Browser, nur für öffentliche Abfragen (z. B. den Anfragen-Zähler).
// Der Publishable Key darf öffentlich sein; was jemand sehen darf, regelt Row Level Security.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const browserClient = url && key ? createClient(url, key) : null;
