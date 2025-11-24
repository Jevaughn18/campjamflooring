-- Create admin_users table to manage who can access the admin panel
CREATE TABLE IF NOT EXISTS admin_users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read admin_users (needed for login check)
CREATE POLICY "Anyone can read admin_users"
  ON admin_users
  FOR SELECT
  USING (true);

-- Policy: Authenticated users can insert admin_users
CREATE POLICY "Authenticated users can insert admin_users"
  ON admin_users
  FOR INSERT
  WITH CHECK (true);

-- Policy: Authenticated users can update admin_users
CREATE POLICY "Authenticated users can update admin_users"
  ON admin_users
  FOR UPDATE
  USING (true);

-- Policy: Authenticated users can delete admin_users
CREATE POLICY "Authenticated users can delete admin_users"
  ON admin_users
  FOR DELETE
  USING (true);

-- Insert initial admin (you)
INSERT INTO admin_users (email, created_by)
VALUES ('stewartjevaughn1@gmail.com', 'system')
ON CONFLICT (email) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users(email);
