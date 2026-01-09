import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from './db/supabase.server';

// Decode JWT payload (without verification - Supabase already verified it)
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServer(context.cookies);
  
  // Try to get user from access token cookie
  let user = null;
  const accessToken = context.cookies.get('sb-access-token')?.value;
  
  if (accessToken) {
    const payload = decodeJwt(accessToken);
    if (payload && payload.exp * 1000 > Date.now()) {
      // Token is valid and not expired
      user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        aud: payload.aud
      };
    }
  }
  
  // Add to locals for use in pages
  context.locals.supabase = supabase;
  context.locals.user = user;
  
  return next();
});

