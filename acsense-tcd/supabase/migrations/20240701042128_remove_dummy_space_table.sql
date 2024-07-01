drop policy "Enable read access for all users" on "public"."space_dummy";

revoke delete on table "public"."space_dummy" from "anon";

revoke insert on table "public"."space_dummy" from "anon";

revoke references on table "public"."space_dummy" from "anon";

revoke select on table "public"."space_dummy" from "anon";

revoke trigger on table "public"."space_dummy" from "anon";

revoke truncate on table "public"."space_dummy" from "anon";

revoke update on table "public"."space_dummy" from "anon";

revoke delete on table "public"."space_dummy" from "authenticated";

revoke insert on table "public"."space_dummy" from "authenticated";

revoke references on table "public"."space_dummy" from "authenticated";

revoke select on table "public"."space_dummy" from "authenticated";

revoke trigger on table "public"."space_dummy" from "authenticated";

revoke truncate on table "public"."space_dummy" from "authenticated";

revoke update on table "public"."space_dummy" from "authenticated";

revoke delete on table "public"."space_dummy" from "service_role";

revoke insert on table "public"."space_dummy" from "service_role";

revoke references on table "public"."space_dummy" from "service_role";

revoke select on table "public"."space_dummy" from "service_role";

revoke trigger on table "public"."space_dummy" from "service_role";

revoke truncate on table "public"."space_dummy" from "service_role";

revoke update on table "public"."space_dummy" from "service_role";

alter table "public"."space_dummy" drop constraint "space_dummy_pkey";

drop index if exists "public"."space_dummy_pkey";

drop table "public"."space_dummy";


