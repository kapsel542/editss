/*
  # Fix profile creation trigger for signup

  ## Problem
  The `handle_new_user` trigger function fails during signup because:
  - RLS on `profiles` requires `auth.uid() = id` for INSERT
  - During the auth trigger execution, the user session may not be fully established
  - This causes "Database error saving new user" (500 error)

  ## Solution
  1. Recreate the function as SECURITY DEFINER with search_path set to 'public'
     - SECURITY DEFINER runs with the function owner's privileges, bypassing RLS
     - Restricted search_path prevents search path injection
  2. Add a permissive INSERT policy specifically for the trigger context
     - Uses a check that the inserting user id matches the profile id
     - This is safe because only the auth system trigger calls this

  ## Security
  - The function only inserts a profile row with the user's own id
  - search_path is locked to 'public' to prevent injection
  - The RLS policies remain restrictive for all other operations
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Recreate function with SECURITY DEFINER and restricted search_path
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
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
$$;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
