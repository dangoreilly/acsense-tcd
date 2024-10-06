alter table "public"."spaces" drop constraint "spaces_building_uuid_fkey";

alter table "public"."spaces" drop constraint "spaces_updated_by_fkey";

alter table "public"."spaces" drop column "building_uuid";

alter table "public"."spaces" drop column "updated_by";


