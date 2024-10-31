export type table = "buildings" | "building_gallery_images" | "floorplans" | "nav_nodes" | "spaces" | "overlays" | "flyovers" | "logs" | "profiles";

import type { Database } from "~/assets/types/supabase_types.gen";

type _profile = Database['public']['Tables']['profiles']['Row']

export type UserProfile_Template = Omit<_profile, "created_at" | "user_id"> & {
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

export type PermissionsObject = {
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

export type BuildingsPermissions = PermissionsObject & {
    floorplans: boolean,
}

export type SpacesPermissions = PermissionsObject & {
    facilities: boolean,
}
