-- These buckets need to be manually recreated when the database is spun up
INSERT INTO STORAGE.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
    ('gallery-images', 'gallery-images',NULL, '2023-08-05 23:31:30.842151+00', '2023-08-05 23:31:30.842151+00', true, false, NULL, '{"image/jpeg", "image/png", "image/jpg"}'),
    ('icons', 'icons',NULL, '2023-08-11 04:02:04.888579+00', '2023-08-11 04:02:04.888579+00', true, false, NULL, NULL),
    ('primary-images', 'primary-images',NULL, '2023-08-11 04:31:08.827236+00', '2023-08-11 04:31:08.827236+00', true, false, NULL, NULL),
    ('overlays', 'overlays', NULL, '2023-09-22 01:48:52.85444+00', '2023-09-22 01:48:52.85444+00', true, false, NULL, NULL),
    ('floorplans', 'floorplans', NULL, '2023-11-10 16:50:37.521601+00', '2023-11-10 16:50:37.521601+00', true, false, NULL,  NULL);

-- Site setting table

-- Site setting table

INSERT INTO public.site_settings (key, data)
VALUES
    ('welcome', '{"mainContent": "This map provides information about the sensory environments in different areas of Trinity. It also provides physical access information for buildings across campus. Click on each building or use the search bar in bottom corner to find your desired building."}'),
    ('internal_welcome', '{"mainContent": "Internal map test. Click on spaces to open the same modals as on the overworld map. Navigate between floors either by using the layer selection in the top right corner, or by stepping through floors with stairs and lifts"}');

-- Order of seeding is important due to relationships between tables

-- Seed buildings  
INSERT INTO public.buildings (canonical, display_name, aka, map_label_1, map_label_2, map_label_3, geometry, description, sense_exp, wayfinding, phys_access, tips, further_info, opening_times, sense_exp_display, phys_access_display, wayfinding_display, furtherinfo_display, primary_image_url, primary_image_alt, "UUID", always_display, sense_exp_video, wayfinding_video, phys_access_video, entry_floor, internal_map_size, published, floorplans_published, rooms_published)
VALUES
    ('example-building-1', 'Example Building 1', 'Ex. B1', 'Example Building 1', 'Ex. B1', null, '{"coordinates":[[[-6.256193640124138,53.343154781958496],[-6.256199060058748,53.343119247175885],[-6.256247839470518,53.343119247175885],[-6.256258679339794,53.343002951523715],[-6.256302038816955,53.34300618195849],[-6.256307458751564,53.3429867993498],[-6.256350818228725,53.342967416741104],[-6.256372497967277,53.34293511239328],[-6.256583875418244,53.34294480369763],[-6.2566272348953476,53.342909268915015],[-6.256806092738486,53.342915729784586],[-6.256903651562027,53.3429867993498],[-6.256925331300579,53.342967416741104],[-6.257082509405166,53.34297064717589],[-6.2571150290129935,53.34299649065415],[-6.257152968555488,53.34299649065415],[-6.257190908097982,53.34301910369763],[-6.257505264307156,53.34302556456719],[-6.257499844372489,53.343051408045454],[-6.257564883588202,53.34305463848023],[-6.257581143392088,53.343070790654146],[-6.257581143392088,53.343070790654146],[-6.25759740319603,53.343090173262844],[-6.257662442411686,53.34309340369763],[-6.257678702215628,53.34310955587154],[-6.257982218555526,53.343119247175885],[-6.257982218555526,53.34314832108893],[-6.25802557803263,53.34314832108893],[-6.258052677705848,53.343174164567195],[-6.258106877052228,53.343174164567195],[-6.258106877052228,53.3432096993498],[-6.257976798620859,53.34320646891502],[-6.257971378686193,53.34324846456719],[-6.25792259927448,53.34324846456719],[-6.257906339470537,53.34356181674111],[-6.25744564502611,53.343545664567195],[-6.257461904829995,53.34339706456719],[-6.2573643460064545,53.34339383413241],[-6.257358926071845,53.3434325993498],[-6.257180068228706,53.34342936891502],[-6.257185488163373,53.34338737326284],[-6.25706624960128,53.343384142828064],[-6.257082509405166,53.34318062543676]]]}'::jsonb, 'Description of Example Building 9', 'Sensory information for Example Building 1', 'Wayfinding information for Example Building 1', 'Physical Access Information for Example Building 1', '{"Tip 1", "Tip 2", "Tip 3"}', '*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', '{"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}', true, true, true, true, 'http://localhost:3000/images/ex-primary-landscape.jpg', 'Primary Image Alt Text', 'e5172612-24ac-43ad-a01c-503bbc7edaf0', false, 'https://www.youtube.com/watch?v=Q3YC90i2HbM', 'https://www.youtube.com/watch?v=hnpsEwAAs3M', 'https://www.youtube.com/watch?v=WyYjD8VGGWM', 0, '{0,0}', true, true, false),
    ('example-building-2', 'Example Building 2', 'Ex. B2', 'Example Building 2', 'Ex. B2', null, '{"coordinates":[[[-6.258532757442253,53.34403918942865],[-6.258522544984657,53.34415532567437],[-6.2583114572687455,53.34414873151707],[-6.2583216697263415,53.34403259527135]]]}'::jsonb, 'Description of Example Building 2', 'Sensory information for Example Building 2', 'Wayfinding information for Example Building 2', 'Physical Access Information for Example Building 2', '{"Tip 1", "Tip 2", "Tip 3"}', '*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', '{"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}', true, true, true, true, 'http://localhost:3000/images/ex-primary-portrait.jpg', 'Primary Image Alt Text', '028a15f7-af94-4c50-90b1-ebcf456e3eb4', false, 'https://youtu.be/Q3YC90i2HbM', 'https://youtu.be/hnpsEwAAs3M', 'https://youtu.be/WyYjD8VGGWM', 0, '{0,0}', true, false, true),
    ('example-building-3', 'Example Building 3', 'Ex. B3', 'Example Building 3', 'Ex. B3', null, '{"coordinates":[[[-6.247904114163589,53.343727572804454],[-6.246464411684428,53.34342864531794],[-6.246453707576791,53.34300887480497],[-6.248144956585747,53.34339684452151]]]}'::jsonb, 'Description of Example Building 3', 'Sensory information for Example Building 3', 'Wayfinding information for Example Building 3', 'Physical Access Information for Example Building 3', '{"Tip 1", "Tip 2", "Tip 3"}', '*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', '{"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}', true, true, true, true, 'http://localhost:3000/images/ex-primary-landscape.jpg', 'Primary Image Alt Text', '0383d758-a424-42aa-a9eb-66fe74bf4648', true, 'https://www.youtube.com/watch?v=Q3YC90i2HbM', 'https://www.youtube.com/watch?v=hnpsEwAAs3M', 'https://www.youtube.com/watch?v=WyYjD8VGGWM', 0, '{0,0}', true, false, false),
    ('example-building-4', 'Example Building 4', 'Ex. B4', 'Example Building 4', 'Ex. B4', null, '{"coordinates":[[[-6.256578201317549,53.344875587077944],[-6.256589041186825,53.344730217512726],[-6.2567245395528595,53.34473344794751],[-6.256729959487469,53.344710834904035],[-6.25697927648093,53.3447172957736],[-6.25697385654632,53.344739908817076],[-6.257093095108413,53.34474313925186],[-6.257082255239137,53.34488850881708],[-6.2569630166770445,53.34488527838229],[-6.2569630166770445,53.344901430556206],[-6.2567136996835835,53.34489496968664],[-6.2567136996835835,53.34487881751273]]]}'::jsonb, 'Description of Example Building 4', 'Sensory information for Example Building 4', 'Wayfinding information for Example Building 4', 'Physical Access Information for Example Building 4', '{"Tip 1", "Tip 2", "Tip 3"}', '*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', '{"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}', true, true, true, true, 'http://localhost:3000/images/ex-primary-portrait.jpg', 'Primary Image Alt Text', '06e481da-e5c6-400d-a796-2f903d506d3c', false, 'https://youtu.be/Q3YC90i2HbM', 'https://youtu.be/hnpsEwAAs3M', 'https://youtu.be/WyYjD8VGGWM', 0, '{0,0}', true, false, false),
    ('example-building-5', 'Example Building 5', 'Ex. B5', 'Example Building 5', 'Ex. B5', null, '{"coordinates":[[[-6.293479668466603,53.34096184866016],[-6.293462340993017,53.34093840338546],[-6.293837769587185,53.3408580195865],[-6.293855097060771,53.34088816351111],[-6.293889752007885,53.34088146486119],[-6.293959061902228,53.34099199258477],[-6.294057250919138,53.340971896635025],[-6.294224749830391,53.3409350540605],[-6.294299835549225,53.341058979083904],[-6.294357593794473,53.34115276018269],[-6.2944211278642115,53.34125323993139],[-6.294253628953015,53.34128673318096],[-6.294184319058672,53.34130013048079],[-6.294253628953015,53.34141065820436],[-6.294374921268059,53.341383863604705],[-6.294629057547127,53.34179583057439],[-6.2947156949149985,53.3417790839496],[-6.2948831938262515,53.342047029946144],[-6.29475034986217,53.342077173870756],[-6.294767677335756,53.34210731779537],[-6.29423630147943,53.34221784551894],[-6.294218974005844,53.342194400244246],[-6.29409190586631,53.342221194843894],[-6.293941734428643,53.3419733447971],[-6.294034147621062,53.341953248847354],[-6.294016820147476,53.34192980357266],[-6.2942940597246775,53.34186951572344],[-6.294242077303977,53.34178243327456],[-6.293953286077681,53.34183937179883],[-6.293953286077681,53.34183937179883],[-6.293953286077681,53.34183937179883],[-6.293814666289052,53.34161831635168],[-6.293964837726719,53.34158482310211],[-6.293964837726719,53.341588172427066],[-6.294103457515348,53.34155802850246],[-6.294063026743686,53.34148769267836],[-6.293756908043804,53.34155132985254],[-6.293647167377856,53.34137046630488],[-6.293935958604095,53.34131017845566],[-6.293895527832433,53.34124654128148],[-6.293883976183395,53.3412297946567],[-6.293595184957098,53.34129008250592],[-6.29358363330806,53.341263287906266],[-6.293496995940188,53.341280034531046],[-6.293456565168526,53.34121974668182],[-6.293416134396807,53.34122644533174],[-6.293364151976107,53.341146061532775],[-6.293294842081821,53.341035533809205],[-6.293277514608235,53.34100538988459]]]}'::jsonb, 'Description of Example Building 5', 'Sensory information for Example Building 5', 'Wayfinding information for Example Building 5', 'Physical Access Information for Example Building 5', '{"Tip 1", "Tip 2", "Tip 3"}', '*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', '{"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"}', true, true, true, true, 'http://localhost:3000/images/ex-primary-landscape.jpg', 'Primary Image Alt Text', 'e462d596-8a16-4df1-ab44-1eb2947b66d1', true, 'https://www.youtube.com/watch?v=Q3YC90i2HbM', 'https://www.youtube.com/watch?v=hnpsEwAAs3M', 'https://www.youtube.com/watch?v=WyYjD8VGGWM', 0, '{0,0}', true, false, false);

-- Seed building_gallery_images
-- We want a good mix of landscape and portrait images for each building
INSERT INTO public.building_gallery_images (building, url, alt, caption)
VALUES
    ('example-building-1', 'http://localhost:3000/images/ex-landscape-1.PNG', 'Ex Landscape 1', 'Example Landscape 1'),
    ('example-building-1', 'http://localhost:3000/images/ex-landscape-2.PNG', 'Ex Landscape 2', 'Example Landscape 2'),
    ('example-building-1', 'http://localhost:3000/images/ex-landscape-3.PNG', 'Ex Landscape 3', 'Example Landscape 3'),
    ('example-building-1', 'http://localhost:3000/images/ex-portrait-1.PNG', 'Ex Portrait 1', 'Example Portrait 1'),
    ('example-building-1', 'http://localhost:3000/images/ex-portrait-2.PNG', 'Ex Portrait 2', 'Example Portrait 2'),
    ('example-building-1', 'http://localhost:3000/images/ex-portrait-3.PNG', 'Ex Portrait 3', 'Example Portrait 3'),
    ('example-building-2', 'http://localhost:3000/images/ex-landscape-1.PNG', 'Ex Landscape 1', 'Example Landscape 1'),
    ('example-building-2', 'http://localhost:3000/images/ex-landscape-2.PNG', 'Ex Landscape 2', 'Example Landscape 2'),
    ('example-building-2', 'http://localhost:3000/images/ex-landscape-3.PNG', 'Ex Landscape 3', 'Example Landscape 3'),
    ('example-building-2', 'http://localhost:3000/images/ex-portrait-1.PNG', 'Ex Portrait 1', 'Example Portrait 1'),
    ('example-building-2', 'http://localhost:3000/images/ex-portrait-2.PNG', 'Ex Portrait 2', 'Example Portrait 2'),
    ('example-building-2', 'http://localhost:3000/images/ex-portrait-3.PNG', 'Ex Portrait 3', 'Example Portrait 3'),
    ('example-building-3', 'http://localhost:3000/images/ex-landscape-1.PNG', 'Ex Landscape 1', 'Example Landscape 1'),
    ('example-building-3', 'http://localhost:3000/images/ex-landscape-2.PNG', 'Ex Landscape 2', 'Example Landscape 2'),
    ('example-building-3', 'http://localhost:3000/images/ex-landscape-3.PNG', 'Ex Landscape 3', 'Example Landscape 3'),
    ('example-building-3', 'http://localhost:3000/images/ex-portrait-1.PNG', 'Ex Portrait 1', 'Example Portrait 1'),
    ('example-building-3', 'http://localhost:3000/images/ex-portrait-2.PNG', 'Ex Portrait 2', 'Example Portrait 2'),
    ('example-building-3', 'http://localhost:3000/images/ex-portrait-3.PNG', 'Ex Portrait 3', 'Example Portrait 3'),
    ('example-building-4', 'http://localhost:3000/images/ex-landscape-1.PNG', 'Ex Landscape 1', 'Example Landscape 1'),
    ('example-building-4', 'http://localhost:3000/images/ex-landscape-2.PNG', 'Ex Landscape 2', 'Example Landscape 2'),
    ('example-building-4', 'http://localhost:3000/images/ex-landscape-3.PNG', 'Ex Landscape 3', 'Example Landscape 3'),
    ('example-building-4', 'http://localhost:3000/images/ex-portrait-1.PNG', 'Ex Portrait 1', 'Example Portrait 1'),
    ('example-building-4', 'http://localhost:3000/images/ex-portrait-2.PNG', 'Ex Portrait 2', 'Example Portrait 2'),
    ('example-building-4', 'http://localhost:3000/images/ex-portrait-3.PNG', 'Ex Portrait 3', 'Example Portrait 3'),
    ('example-building-5', 'http://localhost:3000/images/ex-landscape-1.PNG', 'Ex Landscape 1', 'Example Landscape 1'),
    ('example-building-5', 'http://localhost:3000/images/ex-landscape-2.PNG', 'Ex Landscape 2', 'Example Landscape 2'),
    ('example-building-5', 'http://localhost:3000/images/ex-landscape-3.PNG', 'Ex Landscape 3', 'Example Landscape 3'),
    ('example-building-5', 'http://localhost:3000/images/ex-portrait-1.PNG', 'Ex Portrait 1', 'Example Portrait 1'),
    ('example-building-5', 'http://localhost:3000/images/ex-portrait-2.PNG', 'Ex Portrait 2', 'Example Portrait 2'),
    ('example-building-5', 'http://localhost:3000/images/ex-portrait-3.PNG', 'Ex Portrait 3', 'Example Portrait 3')
ORDER BY RANDOM();

-- Only seed example-building-1 and example-building-2 for these more in-depth features for now
INSERT INTO public.floorplans (building, level, label, url)
VALUES
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 3, 'Fourth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts04.svg'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 4, 'Fifth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts05.svg'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 5, 'Sixth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts06.svg'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 0, 'Lower Concourse', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts01.svg'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 1, 'Main Concourse', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/b5694bc5-90c0-440f-b95c-7c0672992211_MainConcourse.svg'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 2, 'Third Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts03.svg');
INSERT INTO public.floorplans (building, level, label, url)
VALUES
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 3, 'Fourth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts04.svg'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 4, 'Fifth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts05.svg'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 5, 'Sixth Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts06.svg'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 0, 'Lower Concourse', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts01.svg'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 1, 'Main Concourse', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/b5694bc5-90c0-440f-b95c-7c0672992211_MainConcourse.svg'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 2, 'Third Floor', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/floorplans/Arts03.svg');

-- Seed Rooms in a random order so that we can test the ordering functionality
INSERT INTO public.rooms (building, room_code, room_name, aka, capacity, hearing_loop, wheelchair, outlets, projector, whiteboard, lecturn, room_type)
VALUES
    ('example-building-1', 'EX1ROOM1', 'EXAMPLE ROOM 1.1', 'Ex room 1', 22, false, true, false, true, true, true, 'Flat'),
    ('example-building-1', 'EX1ROOM2', 'EXAMPLE ROOM 1.2', 'Ex room 2', 148, false, false, false, true, true, true, 'Tiered'),
    ('example-building-1', 'EX1ROOM3', 'EXAMPLE ROOM 1.3', 'Ex room 3', 35, false, true, true, true, true, true, 'Lab'),
    ('example-building-1', 'EX1ROOM4', 'EXAMPLE ROOM 1.4', 'Ex room 4', 122, false, true, true, true, true, true, 'Flat'),
    ('example-building-1', 'EX1ROOM5', 'EXAMPLE ROOM 1.5', 'Ex room 5', 50, true, true, true, true, true, true, 'Flat'),
    ('example-building-1', 'EX1ROOM6', 'EXAMPLE ROOM 1.6', 'Ex room 6', 80, true, true, true, true, true, true, 'Tiered'),
    ('example-building-1', 'EX1ROOM7', 'EXAMPLE ROOM 1.7', 'Ex room 7', 30, false, true, true, true, true, true, 'Lab'),
    ('example-building-1', 'EX1ROOM8', 'EXAMPLE ROOM 1.8', 'Ex room 8', 90, true, true, true, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM1', 'EXAMPLE ROOM 2.1', 'Ex room 1', 22, false, true, false, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM2', 'EXAMPLE ROOM 2.2', 'Ex room 2', 148, false, false, false, true, true, true, 'Tiered'),
    ('example-building-2', 'EX2ROOM3', 'EXAMPLE ROOM 2.3', 'Ex room 3', 35, false, true, true, true, true, true, 'Lab'),
    ('example-building-2', 'EX2ROOM4', 'EXAMPLE ROOM 2.4', 'Ex room 4', 122, false, true, true, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM5', 'EXAMPLE ROOM 2.5', 'Ex room 5', 50, true, true, true, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM6', 'EXAMPLE ROOM 2.6', 'Ex room 6', 80, true, true, true, true, true, true, 'Tiered'),
    ('example-building-2', 'EX2ROOM7', 'EXAMPLE ROOM 2.7', 'Ex room 7', 30, false, true, true, true, true, true, 'Lab'),
    ('example-building-2', 'EX2ROOM8', 'EXAMPLE ROOM 2.8', 'Ex room 8', 90, true, true, true, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM9', 'EXAMPLE ROOM 2.9', 'Ex room 9', 60, true, true, true, true, true, true, 'Flat'),
    ('example-building-2', 'EX2ROOM10', 'EXAMPLE ROOM 2.10', 'Ex room 10', 75, true, true, true, true, true, true, 'Tiered')
ORDER BY RANDOM();
    
-- Seed nav_nodes
    -- example-building-1
INSERT INTO public.nav_nodes (building, label, node_type, presence, location_up, location_down)
VALUES
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Main Lift', 'lift', '{true, true, true, true, true, true}', '{262, 658}', '{0, 0}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Cafe Lift', 'lift', '{true, true, false, false, false, false}', '{582, 856}', '{0, 0}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Stairwell A', 'stairs', '{false, true, true, true, true, true}', '{425, 1774.5}', '{424, 1800.5}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Stairwell B', 'stairs', '{false, true, true, true, true, true}', '{512, 1240}', '{452, 1238}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Stairwell C', 'stairs', '{true, true, true, true, true, true}', '{510, 718}', '{454, 718}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Stairwell D', 'stairs', '{false, false, true, true, true, true}', '{428, 148}', '{428, 171}'),
    ('e5172612-24ac-43ad-a01c-503bbc7edaf0', 'Cafe Steps', 'stairs', '{true, true, false, false, false, false}', '{670, 806}', '{670, 806}');
    -- example-building-2
INSERT INTO public.nav_nodes (building, label, node_type, presence, location_up, location_down)
VALUES
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Main Lift', 'lift', '{true, true, true, true, true, true}', '{262, 658}', '{0, 0}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Cafe Lift', 'lift', '{true, true, false, false, false, false}', '{582, 856}', '{0, 0}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Stairwell A', 'stairs', '{false, true, true, true, true, true}', '{425, 1774.5}', '{424, 1800.5}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Stairwell B', 'stairs', '{false, true, true, true, true, true}', '{512, 1240}', '{452, 1238}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Stairwell C', 'stairs', '{true, true, true, true, true, true}', '{510, 718}', '{454, 718}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Stairwell D', 'stairs', '{false, false, true, true, true, true}', '{428, 148}', '{428, 171}'),
    ('028a15f7-af94-4c50-90b1-ebcf456e3eb4', 'Cafe Steps', 'stairs', '{true, true, false, false, false, false}', '{670, 806}', '{670, 806}');

-- Seed space_styles
INSERT INTO public.space_styles (category, icon, colour, descriptor)
VALUES
    ('CSC Space', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/csc.png', '#a5faad', null),
    ('Outdoor Space', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/outdoor.png', '#e97dff', null),
    ('Quiet Space', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/quiet.png', '#9000ad', null),
    ('Respite Room', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/respite.png', '#ff9100', null),
    ('Social Space', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/social.png', '#faff00', null),
    ('Study Space', 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/study.png', '#00e6ff', null);

-- Seed spaces
INSERT INTO public.spaces (name,	canonical,	description,	type,	food_drink_allowed,	microwave,	kettle,	wheelchair,	location,	building,	outlets,	icon_override,	seating,	"UUID",	building_uuid,	food_drink_allowed_note,	microwave_note,	kettle_note,	wheelchair_note,	seating_note,	outlets_note,	primary_image_url,	primary_image_alt,	tips,	primary_image_panorama,	sense_exp,	sense_exp_display,	wayfinding,	wayfinding_display,	phys_access,	phys_access_display,	further_info,	further_info_display,	aka,	phys_access_video,	sense_exp_video,	wayfinding_video,	opening_times,	floor,	location_internal,	clickthrough,	published)
VALUES
  ('Example Space 1', 	'example-space-1', 	'Description for Example Space 1', 	'CSC Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'FALSE', 	'{53.3446430066463,-6.25911171722129}', 	'example-building-1', 	'TRUE', 	'', 	'TRUE', 	'49cdcd7f-6b4d-4a11-abd0-2d41d2bbfbfb', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'Food and Drink Note', 	'Microwave Note\n', 	'Kettle Note\n', 	'Wheelchair note', 	'Seating Note\n\n', 	'Outlets Note', 	'http://localhost:3000/images/ex-primary-portrait.jpg', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 1', 	'FALSE', 	'Wayfinding for Space 1', 	'TRUE', 	'Physical Access for Space 1', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 1', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"This area can be booked through the CSC."}', 	'1', 	'{454,350}', 	'FALSE', 	'TRUE'),
  ('Example Space 2', 	'example-space-2', 	'Description for Example Space 2', 	'CSC Space', 	'TRUE', 	'TRUE', 	'FALSE', 	'TRUE', 	'{53.3450721473786,-6.25781334419746}', 	null,	'TRUE', 	'', 	'TRUE', 	'b416eab6-5fb2-4d44-9683-24c7500a18ec', 	null,	'""', 	'""', 	'""', 	'""', 	'""', 	'""', 	'http://localhost:3000/images/ex-primary-landscape.jpg', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 2', 	'TRUE', 	'Wayfinding for Space 2', 	'FALSE', 	'Physical Access for Space 2', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 2', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":true,"times":["07:00","22:00"]},"sat":{"open":true,"times":["07:00","22:00"]},"holidays":{"open":true,"times":["07:00","22:00"]},"note":"These areas can be booked through the CSC."}', 	'2', 	'{454,350}', 	'FALSE', 	'TRUE'),
  ('Example Space 3', 	'example-space-3', 	'Description for Example Space 3', 	'Outdoor Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3433235319657,-6.25222860439137}', 	'example-building-1', 	'FALSE', 	'', 	'TRUE', 	'7a98780f-2e93-4d99-a3e2-993acd1ebb3b', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'Food and Drink Note', 	'Microwave Note\n', 	'Kettle Note\n', 	'Wheelchair note', 	'Seating Note\n', 	'Outlets Note', 	'http://localhost:3000/images/ex-primary-portrait.jpg', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 3', 	'TRUE', 	'Wayfinding for Space 3', 	'TRUE', 	'Physical Access for Space 3', 	'TRUE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 3', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"This area is outside and is subject to Campus closing times."}', 	'3', 	'{454,1662}', 	'FALSE', 	'TRUE'),
  ('Example Space 4', 	'example-space-4', 	'Description for Example Space 4', 	'Outdoor Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3437494833523,-6.25461079803}', 	null,	'FALSE', 	'', 	'TRUE', 	'9375344d-c52f-43d7-a13b-69c5b03e81d3', 	null,	'""', 	'Microwave Note\n', 	'Kettle Note\n', 	'""', 	'""', 	'""', 	'http://localhost:3000/images/ex-primary-landscape.jpg', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 4', 	'FALSE', 	'Wayfinding for Space 4', 	'FALSE', 	'Physical Access for Space 4', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 4', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"\tThis area is outside and is subject to Campus closing times."}', 	'1', 	'{454,1662}', 	'FALSE', 	'TRUE'),
  ('Example Space 5', 	'example-space-5', 	'Description for Example Space 5', 	'Quiet Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3445693477281,-6.26130047504146}', 	'example-building-1', 	'TRUE', 	'', 	'TRUE', 	'eeeca3d4-c8f8-4f16-b791-9e1d34b80c12', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'""', 	'""', 	'Kettle Note\n', 	'Wheelchair note', 	'Seating Note', 	'Outlets Note', 	'http://localhost:3000/images/ex-primary-portrait.jpg', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 5', 	'FALSE', 	'Wayfinding for Space 5', 	'FALSE', 	'Physical Access for Space 5', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 5', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":""}', 	'2', 	'{294,1478}', 	'FALSE', 	'FALSE'),
  ('Example Space 6', 	'example-space-6', 	'Description for Example Space 6', 	'Quiet Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3431858174492,-6.25771141037807}', 	null,	'TRUE', 	'', 	'FALSE', 	'ca3e27ff-e8ac-4ea7-8924-d90f071ef5d5', 	null,	'""', 	'""', 	'""', 	'""', 	'', 	'""', 	'http://localhost:3000/images/ex-primary-landscape.jpg', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 6', 	'FALSE', 	'Wayfinding for Space 6', 	'FALSE', 	'Physical Access for Space 6', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 6', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Opening based on Exhibitions, please see The Douglas Hyde website."}', 	'3', 	'{294,1478}', 	'FALSE', 	'TRUE'),
  ('Example Space 7', 	'example-space-7', 	'Description for Example Space 7', 	'Respite Room', 	'TRUE', 	'FALSE', 	'TRUE', 	'TRUE', 	'{53.3430737239098,-6.25747003891791}', 	'example-building-1', 	'TRUE', 	'http://localhost:3000/images/red-dot.png', 	'FALSE', 	'0d0e68d8-d1b4-46db-91ab-d32601a16b87', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'""', 	'""', 	'""', 	'""', 	'', 	'""', 	'', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 7', 	'TRUE', 	'Wayfinding for Space 7', 	'TRUE', 	'Physical Access for Space 7', 	'TRUE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 7', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":true,"times":["08:30","21:45"]},"sat":{"open":true,"times":["08:00","18:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"\t4. This area can be booked through the Disability Service Booking Link."}', 	'1', 	'{350,454}', 	'FALSE', 	'TRUE'),
  ('Example Space 8', 	'example-space-8', 	'Description for Example Space 8', 	'Respite Room', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.34501,-6.25536}', 	null,	'TRUE', 	'', 	'TRUE', 	'008deb35-94a7-4a89-95ba-1dbbd77c8759', 	null,	'Food and Drink Note', 	'Microwave Note\n', 	'Kettle Note\n', 	'There is an assisted door to enter the room', 	'There are multiple types of different seating options, such as couches, a bed to rest on, and a rocking chair', 	'There are many sockets available for usage', 	'', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 8', 	'TRUE', 	'Wayfinding for Space 8', 	'TRUE', 	'Physical Access for Space 8', 	'TRUE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 8', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":true,"times":["09:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"\tThis area can be booked through the Disability Service Booking Link."}', 	'2', 	'{350,454}', 	'FALSE', 	'TRUE'),
  ('Example Space 9', 	'example-space-9', 	'Description for Example Space 9', 	'Social Space', 	'TRUE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3434164089466,-6.25767384957506}', 	'example-building-1', 	'TRUE', 	'', 	'TRUE', 	'e5ece38f-47f9-4c11-bcc2-ee7ddfe3ca09', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'Food and Drink Note', 	'Microwave Note\n', 	'Kettle Note\n', 	'Wheelchair note', 	'Seating Note\n\n', 	'Outlets Note', 	'', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 9', 	'TRUE', 	'Wayfinding for Space 9', 	'TRUE', 	'Physical Access for Space 9', 	'TRUE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 9', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":true,"times":["08:30","21:45"]},"sat":{"open":true,"times":["08:00","18:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":""}', 	'3', 	'{662,1454}', 	'FALSE', 	'TRUE'),
  ('Example Space 10', 	'example-space-10', 	'Description for Example Space 10', 	'Social Space', 	'TRUE', 	'TRUE', 	'TRUE', 	'TRUE', 	'{53.3414915722363,-6.29497296951239}', 	null,	'TRUE', 	'http://localhost:3000/images/red-dot.png', 	'TRUE', 	'b2efe3f8-a694-41eb-b066-4ecffa857252', 	null,	'""', 	'Microwave Note\n', 	'Kettle Note\n', 	'""', 	'""', 	'""', 	'', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 10', 	'FALSE', 	'Wayfinding for Space 10', 	'FALSE', 	'Physical Access for Space 10', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 10', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":true,"times":["08:00","18:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":""}', 	'1', 	'{662,1454}', 	'TRUE', 	'TRUE'),
  ('Example Space 11', 	'example-space-11', 	'Description for Example Space 11', 	'Study Space', 	'FALSE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3414691526612,-6.29406091739995}', 	'example-building-1', 	'FALSE', 	'http://localhost:3000/images/red-dot.png', 	'TRUE', 	'e2eca725-04cd-4f1f-a5c9-e41e13cd8a76', 	'e5172612-24ac-43ad-a01c-503bbc7edaf0', 	'""', 	'Microwave Note\n', 	'Kettle Note\n', 	'Wheelchair note', 	'Seating Note\n\n', 	'Outlets Note', 	'', 	'Alt Text for Primary Image', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 11', 	'FALSE', 	'Wayfinding for Space 11', 	'FALSE', 	'Physical Access for Space 11', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 11', 	'https://www.youtube.com/watch?v=Q3YC90i2HbM', 	'https://www.youtube.com/watch?v=hnpsEwAAs3M', 	'https://www.youtube.com/watch?v=WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":""}', 	'2', 	'{478,1294}', 	'FALSE', 	'TRUE'),
  ('Example Space 12', 	'example-space-12', 	'Description for Example Space 12', 	'Study Space', 	'FALSE', 	'FALSE', 	'FALSE', 	'TRUE', 	'{53.3432883027131,-6.25605921141141}', 	null,	'FALSE', 	'', 	'TRUE', 	'75d4961f-54a9-4345-b8ec-2a75019c5a72', 	null,	'""', 	'Microwave Note\n', 	'Kettle Note\n', 	'""', 	'""', 	'""', 	'', 	'', 	'{"Tip 1", "Tip 2", "Tip 3"}', 	'FALSE', 	'Sensory Experience for space 12', 	'FALSE', 	'Wayfinding for Space 12', 	'FALSE', 	'Physical Access for Space 12', 	'FALSE', 	'*Further* _information_\n *Bullet Point 1\n *Bullet Point 2\n *Bullet Point 3', 	'FALSE', 	'Ex Space 12', 	'https://youtu.be/Q3YC90i2HbM', 	'https://youtu.be/hnpsEwAAs3M', 	'https://youtu.be/WyYjD8VGGWM', 	'{"weekday":{"open":false,"times":["08:00","17:00"]},"sat":{"open":false,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":""}', 	'3', 	'{478,1294}', 	'TRUE', 	'TRUE');

-- Seed space_gallery_images


-- Seed overlays
INSERT INTO public.overlays (url, bounds, high_detail, url_dark)
VALUES
  ('https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/overlays/trinity_halls.svg', '{{53.3136106176529,-6.26387813086904},{53.3104789361038,-6.25674185560123}}', false, null),
  ('https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/overlays/Overworld_1.svg', '{{53.3458915634745,-6.24714287637749},{53.3416423399052,-6.26168888731324}}', false, 'https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/overlays/Overworld_1_dark.svg');

-- Seed flyovers
INSERT INTO public.flyovers (label, location, target)
VALUES
  ('James'' Hospital', '{53.3429651762271,-6.26000115437546}', '{{53.3428986439198,-6.29313647757954},{53.3401954879539,-6.29522860061115}}'),
  ('Halls', '{53.341843001674,-6.2582820733091}', '{{53.3144622228153,-6.2598393538806},{53.3099129450466,-6.26335787139572}}'),
  ('Main Campus', '{53.3424235755702,-6.29233360290527}', '{{53.3463174455211,-6.2550289948375},{53.3416369031652,-6.25874599282782}}'),
  ('Main Campus', '{53.313756146321,-6.26095505477957}', '{{53.3463174455211,-6.2550289948375},{53.3416369031652,-6.25874599282782}}');

-- Seeding the users table does not work. This is handled by the seed_users.js script