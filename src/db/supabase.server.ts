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
          // Get auth cookies - Supabase looks for these specific names
          const allCookies: { name: string; value: string }[] = [];
          
          const accessToken = cookies.get('sb-access-token')?.value;
          const refreshToken = cookies.get('sb-refresh-token')?.value;
          
          if (accessToken) {
            allCookies.push({ name: 'sb-access-token', value: accessToken });
          }
          if (refreshToken) {
            allCookies.push({ name: 'sb-refresh-token', value: refreshToken });
          }
          
          return allCookies;
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, {
              path: '/',
              secure: import.meta.env.PROD,
              httpOnly: false, // Need to be accessible by JS for auth
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

