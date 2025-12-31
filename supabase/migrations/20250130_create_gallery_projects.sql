-- Create gallery_projects table
CREATE TABLE IF NOT EXISTS gallery_projects (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT,
    display_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for efficient sorting
CREATE INDEX IF NOT EXISTS gallery_projects_display_order_idx ON gallery_projects(display_order DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS gallery_projects_published_idx ON gallery_projects(is_published);

-- Enable Row Level Security
ALTER TABLE gallery_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read published gallery projects
CREATE POLICY "Anyone can view published gallery projects"
    ON gallery_projects FOR SELECT
    USING (is_published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can insert gallery projects"
    ON gallery_projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery projects"
    ON gallery_projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery projects"
    ON gallery_projects FOR DELETE
    TO authenticated
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_projects_updated_at BEFORE UPDATE
    ON gallery_projects FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
