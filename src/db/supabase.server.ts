import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { Database } from './database.types';

export function createSupabaseServer(cookies: AstroCookies) {
  return createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          // Get all cookies from Astro
          const cookieHeader = cookies.get('sb-access-token')?.value;
          return parseCookieHeader(cookieHeader ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, {
              path: '/',
              secure: import.meta.env.PROD,
              httpOnly: true,
              sameSite: 'lax',
              ...options,
            });
          });
        },
      },
    }
  );
}

// For API routes
export function createSupabaseServerFromRequest(request: Request, setCookieCallback: (name: string, value: string, options: any) => void) {
  const cookieHeader = request.headers.get('cookie') ?? '';
  
  return createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(cookieHeader);
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookieCallback(name, value, options);
          });
        },
      },
    }
  );
}

