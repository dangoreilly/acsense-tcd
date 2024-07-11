set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.extension(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION storage.filename(name text)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION storage.foldername(name text)
 RETURNS text[]
 LANGUAGE plpgsql
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

create policy "Allow Auth users to manage bucket contents 19x13oe_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (true);


create policy "Allow Auth users to manage bucket contents 19x13oe_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow Auth users to manage bucket contents 19x13oe_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using (true);


create policy "Allow authenticated users to manage bucket content 19x13oe_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'floorplans'::text));


create policy "Allow authenticated users to manage bucket content 19x13oe_1"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'floorplans'::text));


create policy "Allow authenticated users to manage bucket content 19x13oe_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'floorplans'::text));


create policy "Allow authenticated users to manage bucket content 19x13oe_3"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'floorplans'::text));


create policy "Auth Users can manage icons 1njz16_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'icons'::text));


create policy "Auth Users can manage icons 1njz16_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'icons'::text));


create policy "Auth Users can manage icons 1njz16_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'icons'::text));


create policy "Auth Users can manage icons 1njz16_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'icons'::text));


create policy "Give auth users access to images in folder kkwf4z_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'primary-images'::text));


create policy "Give auth users access to images in folder kkwf4z_1"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'primary-images'::text));


create policy "Give auth users access to images in folder kkwf4z_2"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'primary-images'::text));


create policy "Give users authenticated access to folder 1ndp9hv_0"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'gallery-images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1ndp9hv_1"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'gallery-images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Give users authenticated access to folder 1ndp9hv_2"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'gallery-images'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Service Role upload kkwf4z_0"
on "storage"."objects"
as permissive
for insert
to service_role
with check ((bucket_id = 'primary-images'::text));


create policy "Service Role upload kkwf4z_1"
on "storage"."objects"
as permissive
for select
to service_role
using ((bucket_id = 'primary-images'::text));


create policy "Service role can upload 1ndp9hv_0"
on "storage"."objects"
as permissive
for select
to service_role
using ((bucket_id = 'gallery-images'::text));


create policy "Service role can upload 1ndp9hv_1"
on "storage"."objects"
as permissive
for insert
to service_role
with check ((bucket_id = 'gallery-images'::text));



