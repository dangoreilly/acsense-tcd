alter table "public"."profiles" drop constraint "profiles_pkey";

drop index if exists "public"."profiles_pkey";

alter table "public"."profiles" drop column "bld_further";

alter table "public"."profiles" drop column "bld_gallery";

alter table "public"."profiles" drop column "bld_general";

alter table "public"."profiles" drop column "bld_map";

alter table "public"."profiles" drop column "bld_tabs";

alter table "public"."profiles" drop column "bld_times";

alter table "public"."profiles" drop column "bld_tips";

alter table "public"."profiles" drop column "name";

alter table "public"."profiles" drop column "sense_facilities";

alter table "public"."profiles" drop column "sense_general";

alter table "public"."profiles" drop column "sense_map";

alter table "public"."profiles" drop column "sense_photos";

alter table "public"."profiles" add column "buildings" json;

alter table "public"."profiles" add column "spaces" json;

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (user_id);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";


