-- Transition floorplans table
ALTER TABLE "public"."floorplans" DROP CONSTRAINT "floorplans_building_fkey";

ALTER TABLE "public"."floorplans" DROP COLUMN "building";

ALTER TABLE "public"."floorplans" ADD COLUMN "building" text not null;

ALTER TABLE "public"."floorplans" ADD CONSTRAINT "floorplans_building_fkey" foreign key (building) references buildings (canonical) on update cascade on delete cascade;

-- Transition Navnodes table

ALTER TABLE "public"."nav_nodes" DROP CONSTRAINT "nav_nodes_building_fkey";

ALTER TABLE "public"."nav_nodes" DROP COLUMN "building";

ALTER TABLE "public"."nav_nodes" ADD COLUMN "building" text not null;

ALTER TABLE "public"."nav_nodes" ADD CONSTRAINT "nav_nodes_building_fkey" foreign key (building) references buildings (canonical) on update cascade on delete cascade;

