import type { C } from "vitest/dist/reporters-yx5ZTtEV";
import type { Database } from "~/assets/types/supabase_types.gen";
import type { ChangesObject } from "~/utils/getChanges";
export type Building = Database['public']['Tables']['buildings']['Row'];
export type Space = Database['public']['Tables']['spaces']['Row'];
export type Building_Gallery_Image = Database['public']['Tables']['building_gallery_images']['Row'];

type Log = Database['public']['Tables']['logs']['Row'];

export interface Audit_Log extends Log {
    data: ChangesObject | null | Building | Space | Building_Gallery_Image;
}