import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          avatar: string;
          role: 'user' | 'admin';
          online: boolean;
          warned: boolean;
          can_post: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          avatar?: string;
          role?: 'user' | 'admin';
          online?: boolean;
          warned?: boolean;
          can_post?: boolean;
        };
        Update: {
          name?: string;
          avatar?: string;
          role?: 'user' | 'admin';
          online?: boolean;
          warned?: boolean;
          can_post?: boolean;
        };
      };
    };
  };
}
