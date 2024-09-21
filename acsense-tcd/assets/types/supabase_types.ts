import type { Database } from "~/assets/types/supabase_types.gen";
import type { ChangesObject } from "~/utils/getChanges";
export type Building = Database['public']['Tables']['buildings']['Row'];
export type Building_Template = Database['public']['Tables']['buildings']['Insert'];
export type Space = Database['public']['Tables']['spaces']['Row'];
export type Space_Template = Database['public']['Tables']['spaces']['Insert'];
export type Building_Gallery_Image = Database['public']['Tables']['building_gallery_images']['Row'];
export type Space_Type = Database['public']['Tables']['space_styles']['Row'];
export type Flyover = Database['public']['Tables']['flyovers']['Row'];

type Log = Database['public']['Tables']['logs']['Row'];

export interface Audit_Log extends Log {
    data: ChangesObject | null | Building | Space | Building_Gallery_Image;
}

type _overlay = Database['public']['Tables']['overlays']['Row'];
export interface Overlay extends Omit<_overlay, 'bounds'> {
    bounds: [[number, number], [number, number]];  
}