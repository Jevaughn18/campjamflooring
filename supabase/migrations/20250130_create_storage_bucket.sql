-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'gallery-images',
    'gallery-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for gallery-images bucket
-- Anyone can view images (public bucket)
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery-images');

-- Authenticated users (admins) can upload images
CREATE POLICY "Authenticated users can upload gallery images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated users (admins) can update images
CREATE POLICY "Authenticated users can update gallery images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'gallery-images');

-- Authenticated users (admins) can delete images
CREATE POLICY "Authenticated users can delete gallery images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'gallery-images');
