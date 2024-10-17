import type { Database } from "~/assets/types/supabase_types.gen";
import type { ChangesObject } from "~/utils/getChanges";
import type { OpeningTimes } from "./infoPageTypes";
// Simple types and their templates
export type Building_Gallery_Image =          Database['public']['Tables']['building_gallery_images']['Row'];
export type Building_Gallery_Image_Template = Database['public']['Tables']['building_gallery_images']['Insert'];
export type Space_Type =          Database['public']['Tables']['space_styles']['Row'];
export type Space_Type_Template = Database['public']['Tables']['space_styles']['Row'];
export type Floorplan =          Database['public']['Tables']['floorplans']['Insert'];
export type Floorplan_Template = Database['public']['Tables']['floorplans']['Insert'];

// More complex types that require further definition
type _Building = Database['public']['Tables']['buildings']['Row'];
type _Building_Template = Omit<Database['public']['Tables']['buildings']['Insert'], "UUID">;
export type Building = _Building & {opening_times: OpeningTimes, geometry: {coordinates:[[number, number][]]};}
export type Building_Template = _Building_Template & {opening_times: OpeningTimes, geometry: {coordinates:[[number, number][]]};}
export type Building_Partial = Omit<_Building, "created_at" | "aka" | "description" | "sense_exp" | "wayfinding" | "phys_access" | "tips" | "further_info" | "opening_times" | "sense_exp_display" | "phys_access_display" | "wayfinding_display" | "furtherinfo_display" | "primary_image_url" | "primary_image_alt" | "always_display" | "sense_exp_video" | "wayfinding_video" | "phys_access_video" | "entry_floor" | "internal_map_size" | "floorplans_published" | "rooms_published" | "updated_at">;

type _Space = Database['public']['Tables']['spaces']['Row'];
type _Space_Template = Database['public']['Tables']['spaces']['Insert'];
export type Space = _Space & {opening_times: OpeningTimes, location_internal: [number, number], location: [number, number];}
export type Space_Template = _Space_Template & {opening_times: OpeningTimes, location_internal: [number, number], location: [number, number];}
export type Space_Partial = Omit<_Space, "building" | "description"  | "updated_at"  | "food_drink_allowed"  | "microwave"  | "kettle"  | "wheelchair"  | "outlets"  | "seating"  | "UUID"  | "food_drink_allowed_note" | "microwave_note" | "kettle_note" | "wheelchair_note" | "seating_note" | "outlets_note" | "primary_image_url" | "primary_image_alt" | "tips" | "primary_image_panorama" | "sense_exp" | "sense_exp_display" | "wayfinding" | "wayfinding_display" | "phys_access" | "phys_access_display" | "further_info" | "further_info_display" | "aka" | "phys_access_video" | "sense_exp_video" | "wayfinding_video" | "opening_times" | "floor" | "location_internal" | "clickthrough">


type Log = Database['public']['Tables']['logs']['Row'];

export interface Audit_Log extends Log {
    data: ChangesObject | null | Building | Space | Building_Gallery_Image;
}

// Modify the flyover type to include tuples
// Required by limitations of postgres types
type _overlay = Database['public']['Tables']['overlays']['Row'];
export interface Overlay extends Omit<_overlay, 'bounds'> {
    bounds: [[number, number], [number, number]];  
}

// Modify the flyover type to include tuples
// Required by limitations of postgres types
type _flyover = Database['public']['Tables']['flyovers']['Row'];
export interface Flyover extends Omit<_flyover, "target"|"location"> {
    target: [[number, number], [number, number]],
    location: [number, number]
}