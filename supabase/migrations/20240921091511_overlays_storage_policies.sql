create policy "Allow Auth users to manage overlays 8rforn_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'overlays'::text));


create policy "Allow Auth users to manage overlays 8rforn_1"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'overlays'::text));


create policy "Allow Auth users to manage overlays 8rforn_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'overlays'::text));


create policy "Allow Auth users to manage overlays 8rforn_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'overlays'::text));



