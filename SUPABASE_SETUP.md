# Supabase Setup Instructions

## Quick Setup (2 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/bwhjvxiuemwbtwqgzpfh
   - Or go to: https://supabase.com and click on your "campjamflooring" project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar (it has a `</>` icon)
   - Click "New query" button

3. **Copy and Paste This SQL**
   ```sql
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

   -- Create index for faster sorting
   CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);
   ```

4. **Click "Run" or press Cmd/Ctrl + Enter**

5. **Verify It Worked**
   - You should see "Success. No rows returned"
   - Click "Table Editor" in the left sidebar
   - You should see a "reviews" table with columns: id, name, rating, comment, created_at

## Done!

Your reviews system is now fully functional. All customer reviews will be stored in this Supabase database and visible to all users across all devices!

## Troubleshooting

If you get an error:
- Make sure you're logged into the correct Supabase project
- Make sure you have database access permissions
- Try refreshing the SQL Editor page and running again

Need help? The SQL script is also saved in `supabase-setup.sql` in your project root.
