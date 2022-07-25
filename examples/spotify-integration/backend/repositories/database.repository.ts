import { createClient, SupabaseClient } from "@supabase/supabase-js@^1.33.2";

export class DatabaseRepository {
  client: SupabaseClient;
  constructor() {
    this.client = createClient(
      // Supabase API URL - env var exported by default when deployed.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default when deployed.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );
  }
}

export default new DatabaseRepository();
