-- Add delete policy for reviews
-- Run this in Supabase SQL Editor to allow the admin to delete reviews

CREATE POLICY "Anyone can delete reviews"
  ON reviews
  FOR DELETE
  USING (true);
