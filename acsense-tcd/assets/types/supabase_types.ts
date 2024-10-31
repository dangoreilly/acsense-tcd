import type { Database } from "~/assets/types/supabase_types.gen";
import type { ChangesObject } from "~/utils/getChanges";
import type { OpeningTimes } from "./infoPageTypes";
// Simple types and their templates
export type Building_Gallery_Image =          Database['public']['Tables']['building_gallery_images']['Row'];
export type Building_Gallery_Image_Template = Database['public']['Tables']['building_gallery_images']['Insert'];
export type Space_Type =          Database['public']['Tables']['space_styles']['Row'];
export type Space_Type_Template = Database['public']['Tables']['space_styles']['Insert'];
export type Floorplan =          Database['public']['Tables']['floorplans']['Row'] & {isEntry?: boolean};
export type Floorplan_Template = Database['public']['Tables']['floorplans']['Insert'];
export type Room =          Database['public']['Tables']['rooms']['Row'];
export type Room_Template = Database['public']['Tables']['rooms']['Insert'];
export type Nav_Node =          Database['public']['Tables']['nav_nodes']['Row'];
export type Nav_Node_Template = Database['public']['Tables']['nav_nodes']['Insert'];


// More complex types that require further definition
type Point = [number, number];

type _Building = Database['public']['Tables']['buildings']['Row'];
type _Building_Template = Omit<Database['public']['Tables']['buildings']['Insert'], "UUID">;
export type Building = _Building & {opening_times: OpeningTimes, geometry: {coordinates:[Point[]]};}
export type Building_Template = _Building_Template & {opening_times: OpeningTimes, geometry: {coordinates:[Point[]]};}
// Building partial for passing to map render methods
export type Building_Partial = Omit<Building, "created_at" | "sense_exp" | "wayfinding" | "phys_access" | "tips" | "further_info" | "opening_times" | "sense_exp_display" | "phys_access_display" | "wayfinding_display" | "furtherinfo_display" | "primary_image_url" | "primary_image_alt" | "sense_exp_video" | "wayfinding_video" | "phys_access_video" | "rooms_published" | "updated_at">;
export const Building_Partial_Fields = "always_display, canonical, display_name, entry_floor, internal_map_size, floorplans_published, geometry, UUID, map_label_1, map_label_2, map_label_3, published, aka, description";

type _Space = Database['public']['Tables']['spaces']['Row'];
type _Space_Template = Database['public']['Tables']['spaces']['Insert'];
export type Space = _Space & {opening_times: OpeningTimes, location_internal: Point, location: Point, icon?: string;}
export type Space_Template = _Space_Template & {opening_times: OpeningTimes, location_internal: Point, location: Point;}
// Space partial for passing to map render methods
export type Space_Partial = Omit<Space, "building" | "updated_at" | "UUID"  | "food_drink_allowed_note" | "microwave_note" | "kettle_note" | "wheelchair_note" | "seating_note" | "outlets_note" | "primary_image_url" | "primary_image_alt" | "tips" | "primary_image_panorama" | "sense_exp" | "sense_exp_display" | "wayfinding" | "wayfinding_display" | "phys_access" | "phys_access_display" | "further_info" | "further_info_display" | "aka" | "phys_access_video" | "sense_exp_video" | "wayfinding_video" | "opening_times">
export const Space_Partial_Fields = "canonical, published, floor, icon_override, location, location_internal, name, type, description, food_drink_allowed, microwave, kettle, wheelchair, outlets, seating, clickthrough";

// Overlays and Flyovers basically just need to accomodate tuples of points
export type Overlay = Database['public']['Tables']['overlays']['Row'] & {
    bounds: [Point, Point];  
}
export type Overlay_Template = Omit<Overlay, "id" | "created_at">;

export type Flyover = Database['public']['Tables']['flyovers']['Row'] & {
    target: [Point, Point], 
    location: Point
};
export type Flyover_Template = Omit<Flyover, "id" | "created_at">;


// Audit Logs need to be able to store changes to any of the above types
export type Audit_Log = Database['public']['Tables']['logs']['Insert'] & {
    data: ChangesObject | null | Building | Space | Building_Gallery_Image;
}