import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {  // ✅ Make function async
  const cookieStore = await cookies();  // ✅ Await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {  // ✅ Make getAll async
          return await cookieStore.getAll();
        },
        async setAll(cookiesToSet) {  // ✅ Make setAll async
          try {
            for (const { name, value, options } of cookiesToSet) {
              await cookieStore.set(name, value, options);
            }
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        },
      },
    }
  );
}
