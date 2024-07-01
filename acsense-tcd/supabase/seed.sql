-- These buckets need to be manually recreated when the database is spun up
INSERT INTO STORAGE.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id)
VALUES
    ('gallery-images', 'gallery-images', NULL, '2023-08-05 23:31:30.842151+00', '2023-08-05 23:31:30.842151+00', true, false, NULL, '{"image/jpeg", "image/png", "image/jpg"}', NULL),
    ('icons', 'icons', NULL, '2023-08-11 04:02:04.888579+00', '2023-08-11 04:02:04.888579+00', true, false, NULL, NULL, NULL),
    ('primary-images', 'primary-images', NULL, '2023-08-11 04:31:08.827236+00', '2023-08-11 04:31:08.827236+00', true, false, NULL, NULL, NULL),
    ('overlays', 'overlays', NULL, '2023-09-22 01:48:52.85444+00', '2023-09-22 01:48:52.85444+00', true, false, NULL, NULL, NULL),
    ('floorplans', 'floorplans', NULL, '2023-11-10 16:50:37.521601+00', '2023-11-10 16:50:37.521601+00', true, false, NULL, NULL, NULL);
