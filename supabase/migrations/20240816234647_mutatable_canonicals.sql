alter table "public"."rooms" drop constraint "public_rooms_building_fkey";

alter table "public"."spaces" drop constraint "public_spaces_type_fkey";

alter table "public"."building_gallery_images" drop constraint "building_gallery_images_building_fkey";

alter table "public"."spaces" drop constraint "spaces_building_fkey";

alter table "public"."building_gallery_images" alter column "building" set not null;

alter table "public"."rooms" add constraint "rooms_building_fkey" FOREIGN KEY (building) REFERENCES buildings(canonical) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."rooms" validate constraint "rooms_building_fkey";

alter table "public"."spaces" add constraint "spaces_type_fkey" FOREIGN KEY (type) REFERENCES space_styles(category) ON UPDATE CASCADE not valid;

alter table "public"."spaces" validate constraint "spaces_type_fkey";

alter table "public"."building_gallery_images" add constraint "building_gallery_images_building_fkey" FOREIGN KEY (building) REFERENCES buildings(canonical) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."building_gallery_images" validate constraint "building_gallery_images_building_fkey";

alter table "public"."spaces" add constraint "spaces_building_fkey" FOREIGN KEY (building) REFERENCES buildings(canonical) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."spaces" validate constraint "spaces_building_fkey";


