-- These buckets need to be manually recreated when the database is spun up
INSERT INTO STORAGE.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
    ('gallery-images', 'gallery-images',NULL, '2023-08-05 23:31:30.842151+00', '2023-08-05 23:31:30.842151+00', true, false, NULL, '{"image/jpeg", "image/png", "image/jpg"}'),
    ('icons', 'icons',NULL, '2023-08-11 04:02:04.888579+00', '2023-08-11 04:02:04.888579+00', true, false, NULL, NULL),
    ('primary-images', 'primary-images',NULL, '2023-08-11 04:31:08.827236+00', '2023-08-11 04:31:08.827236+00', true, false, NULL, NULL),
    ('overlays', 'overlays', NULL, '2023-09-22 01:48:52.85444+00', '2023-09-22 01:48:52.85444+00', true, false, NULL, NULL),
    ('floorplans', 'floorplans', NULL, '2023-11-10 16:50:37.521601+00', '2023-11-10 16:50:37.521601+00', true, false, NULL,  NULL);

-- Site setting table
INSERT INTO public.site_settings (key, data)
VALUES
    ('welcome', '{"mainContent": "This map provides information about the sensory environments in different areas of Trinity. It also provides physical access information for buildings across campus. Click on each building or use the search bar in bottom corner to find your desired building."}'),
    ('internal_welcome', '{"mainContent": "Internal map test. Click on spaces to open the same modals as on the overworld map. Navigate between floors either by using the layer selection in the top right corner, or by stepping through floors with stairs and lifts"}');

-- All other seeding is handled by seed_tables.ts
-- to allow for type checking