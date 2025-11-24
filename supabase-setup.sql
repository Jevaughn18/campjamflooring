-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read reviews
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert reviews
CREATE POLICY "Anyone can insert reviews"
  ON reviews
  FOR INSERT
  WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);
