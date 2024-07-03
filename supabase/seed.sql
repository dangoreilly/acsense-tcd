-- These buckets need to be manually recreated when the database is spun up
INSERT INTO STORAGE.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
    ('gallery-images', 'gallery-images',NULL, '2023-08-05 23:31:30.842151+00', '2023-08-05 23:31:30.842151+00', true, false, NULL, '{"image/jpeg", "image/png", "image/jpg"}'),
    ('icons', 'icons',NULL, '2023-08-11 04:02:04.888579+00', '2023-08-11 04:02:04.888579+00', true, false, NULL, NULL),
    ('primary-images', 'primary-images',NULL, '2023-08-11 04:31:08.827236+00', '2023-08-11 04:31:08.827236+00', true, false, NULL, NULL),
    ('overlays', 'overlays', NULL, '2023-09-22 01:48:52.85444+00', '2023-09-22 01:48:52.85444+00', true, false, NULL, NULL),
    ('floorplans', 'floorplans', NULL, '2023-11-10 16:50:37.521601+00', '2023-11-10 16:50:37.521601+00', true, false, NULL,  NULL);

-- -- Order of seeding is important due to relations
--     -- Buildings, building_gallery_images, floorplans, rooms, nav_nodes  
--     -- space_styles, spaces, space_gallery_images 
--     -- overlays, flyovers, 

-- -- Setting up the dummy profiles is especially annoying

-- Seed the auth.users and auth.identities table
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, raw_app_meta_data, raw_user_meta_data, email_confirmed_at, created_at)
VALUES
    ('00000000-0000-0000-0000-000000000000', '18258c6b-5687-4328-baa5-12b8f18c8ef4', 'authenticated', 'authenticated', 'acsense-test-user@tcd.ie', '$2a$10$6yjGL6Snc3Yar9gEjzPoxOazeBD02mzf8WqohBWwYlrsPvO22ANbu', '{"provider":"email","providers":["email"]}', '{}', timezone('utc'::text, now()), timezone('utc'::text, now())),
    ('00000000-0000-0000-0000-000000000000', '52eb8eab-dd2a-4487-8ff9-dea022eabf83', 'authenticated', 'authenticated', 'acsense-test-observer@tcd.ie', '$2a$10$6yjGL6Snc3Yar9gEjzPoxOazeBD02mzf8WqohBWwYlrsPvO22ANbu', '{"provider":"email","providers":["email"]}', '{}', timezone('utc'::text, now()), timezone('utc'::text, now())),
    ('00000000-0000-0000-0000-000000000000', 'f2ea8521-6ac1-4cca-9353-a8fb890fd38c', 'authenticated', 'authenticated', 'acsense-test-admin@tcd.ie', '$2a$10$6yjGL6Snc3Yar9gEjzPoxOazeBD02mzf8WqohBWwYlrsPvO22ANbu', '{"provider":"email","providers":["email"]}', '{}', timezone('utc'::text, now()), timezone('utc'::text, now()));

insert into auth.identities (id, user_id, provider_id, identity_data, provider, created_at)
VALUES 
    ('18258c6b-5687-4328-baa5-12b8f18c8ef4', '18258c6b-5687-4328-baa5-12b8f18c8ef4', '18258c6b-5687-4328-baa5-12b8f18c8ef4',	'{"sub": "18258c6b-5687-4328-baa5-12b8f18c8ef4"}', 'email', timezone('utc'::text, now())),
    ('52eb8eab-dd2a-4487-8ff9-dea022eabf83', '52eb8eab-dd2a-4487-8ff9-dea022eabf83', '52eb8eab-dd2a-4487-8ff9-dea022eabf83',	'{"sub": "52eb8eab-dd2a-4487-8ff9-dea022eabf83"}', 'email', timezone('utc'::text, now())),
    ('f2ea8521-6ac1-4cca-9353-a8fb890fd38c', 'f2ea8521-6ac1-4cca-9353-a8fb890fd38c', 'f2ea8521-6ac1-4cca-9353-a8fb890fd38c',	'{"sub": "f2ea8521-6ac1-4cca-9353-a8fb890fd38c"}', 'email', timezone('utc'::text, now()));

-- Then the dummy users table
INSERT INTO PUBLIC.profiles (created_at, bld_general, bld_tabs, bld_gallery, sense_general, bld_map, email, bld_times, bld_tips, bld_further, sense_map, sense_facilities, sense_photos, user_id, is_admin, name)
VALUES
    ('2023-10-01 07:14:47.376721+00', true, true, true, true, true, 'acsense-test-user@tcd.ie', true, true, true, true, true, true, '18258c6b-5687-4328-baa5-12b8f18c8ef4', false, NULL),
    ('2024-05-15 00:37:54.874856+00', false, false, false, true, false, 'acsense-test-observer@tcd.ie', false, false, false, false, false, false, '52eb8eab-dd2a-4487-8ff9-dea022eabf83', false, NULL),
    ('2023-08-06 03:20:47.950794+00', true, true, true, true, true, 'acsense-test-admin@tcd.ie', true, true, true, true, true, true, 'f2ea8521-6ac1-4cca-9353-a8fb890fd38c', true, NULL);
