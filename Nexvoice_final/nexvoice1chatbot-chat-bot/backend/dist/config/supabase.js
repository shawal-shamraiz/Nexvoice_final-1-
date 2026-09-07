import { createClient } from '@supabase/supabase-js';
import { config } from './env.js';
export const isSupabaseConfigured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const supabaseClient = isSupabaseConfigured
    ? createClient(config.supabaseUrl, config.supabaseAnonKey)
    : null;
export const supabaseAdmin = isSupabaseConfigured && config.supabaseServiceRoleKey
    ? createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
    : null;
