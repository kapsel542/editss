/*
  # Custom OTP verification codes

  ## Overview
  Creates a table to store 6-digit verification codes for email-based signup/login.
  This replaces Supabase's default magic link with a proper code entry flow.

  ## New Tables
  - `otp_codes`
    - `id` (uuid, primary key)
    - `email` (text, not null) — the email address the code was sent to
    - `code` (text, not null) — the 6-digit verification code
    - `used` (boolean, default false) — whether the code has been consumed
    - `expires_at` (timestamptz) — when the code expires (5 minutes from creation)
    - `created_at` (timestamptz) — when the code was created

  ## Security
  - RLS enabled
  - Anyone can insert (needed for unauthenticated signup flow)
  - Anyone can read codes by email (needed for verification)
  - No update or delete from client side
*/

CREATE TABLE IF NOT EXISTS otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  used boolean DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE otp_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a new code (signup flow)
CREATE POLICY "Anyone can insert OTP codes"
  ON otp_codes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to read codes by email (verification flow)
CREATE POLICY "Anyone can read OTP codes by email"
  ON otp_codes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email ON otp_codes(email);
CREATE INDEX IF NOT EXISTS idx_otp_codes_expires ON otp_codes(expires_at);

-- Auto-cleanup: mark expired codes as used (runs periodically via edge function or manually)
