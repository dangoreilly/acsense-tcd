create policy "Enable UPDATE for authenticated users only"
on "public"."site_settings"
as permissive
for update
to authenticated
with check (true);



