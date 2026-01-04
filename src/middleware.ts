import { defineMiddleware } from 'astro:middleware';
import { createSupabaseServer } from './db/supabase.server';

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServer(context.cookies);
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Add to locals for use in pages
  context.locals.supabase = supabase;
  context.locals.user = user;
  
  return next();
});

