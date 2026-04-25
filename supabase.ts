import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  display_name: string;
  avatar_url: string;
  plan: string;
  storage_used: number;
  storage_limit: number;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string;
  template_id: string;
  template_name: string;
  status: string;
  duration: number;
  width: number;
  height: number;
  aspect_ratio: string;
  created_at: string;
  updated_at: string;
};

export type PublishedVideo = {
  id: string;
  user_id: string;
  project_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  share_slug: string;
  views: number;
  likes: number;
  is_public: boolean;
  created_at: string;
};
