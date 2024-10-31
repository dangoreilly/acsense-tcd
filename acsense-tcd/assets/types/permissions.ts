export type table = "buildings" | "building_gallery_images" | "floorplans" | "nav_nodes" | "spaces" | "overlays" | "flyovers" | "logs";

import type { Database } from "~/assets/types/supabase_types.gen";

export type UserProfile_Template = Database['public']['Tables']['profiles']['Row'] & {
    buildings: BuildingsPermissions,
    spaces: SpacesPermissions,
    map: {
        overlays: boolean,
        jumps: boolean,
    },
}

export type UserProfile = UserProfile_Template & {
    user_id: string,
    is_super_admin?: boolean,
}

export interface PermissionsObject {
    general: {
        name: boolean,
        aka: boolean,
        desc: boolean,
    },
    primary_image: {
        image: boolean,
        alt: boolean
    },
    tabs: {
        physical: boolean,
        wayfinding: boolean,
        sensory: boolean
    },
    gallery: {
        images: boolean,
        captions: boolean,
        alt: boolean
    },
    times: boolean,
    tips: boolean,
    further: boolean,
    map: {
        labels: boolean,
        location: boolean
    }
}

export interface BuildingsPermissions extends PermissionsObject {
    floorplans: boolean,
}

export interface SpacesPermissions extends PermissionsObject {
    facilities: boolean,
}
