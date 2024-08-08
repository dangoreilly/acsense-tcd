import type { Database } from "~/assets/types/supabase_types.gen";

export type Building = Database['public']['Tables']['buildings']['Row'];
export type Space = Database['public']['Tables']['spaces']['Row'];
export type Building_Gallery_Images = Database['public']['Tables']['building_gallery_images']['Row'];