/*
  # Video Platform Schema

  ## Overview
  Creates the core tables for a free video editing and publishing platform.

  ## New Tables

  ### profiles
  - Extends Supabase auth.users
  - Stores display name, avatar URL, plan, and storage quota

  ### projects
  - User video editing projects
  - Stores title, thumbnail, template used, status, duration, dimensions
  - Links to owning user via user_id

  ### published_videos
  - Videos published/shared publicly by users
  - Stores title, description, view count, likes, share URL
  - Links to project and user

  ## Security
  - RLS enabled on all tables
  - Users can only read/write their own data
  - Published videos are publicly readable for view counts
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  plan text DEFAULT 'free',
  storage_used bigint DEFAULT 0,
  storage_limit bigint DEFAULT 5368709120,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Project',
  thumbnail_url text DEFAULT '',
  template_id text DEFAULT '',
  template_name text DEFAULT '',
  status text DEFAULT 'draft',
  duration integer DEFAULT 30,
  width integer DEFAULT 1920,
  height integer DEFAULT 1080,
  aspect_ratio text DEFAULT '16:9',
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Published videos table
CREATE TABLE IF NOT EXISTS published_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  share_slug text UNIQUE DEFAULT gen_random_uuid()::text,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE published_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view public published videos"
  ON published_videos FOR SELECT
  USING (is_public = true);

CREATE POLICY "Authenticated users can view own published videos"
  ON published_videos FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own published videos"
  ON published_videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own published videos"
  ON published_videos FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own published videos"
  ON published_videos FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_published_videos_user_id ON published_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_published_videos_share_slug ON published_videos(share_slug);
CREATE INDEX IF NOT EXISTS idx_published_videos_created_at ON published_videos(created_at DESC);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
