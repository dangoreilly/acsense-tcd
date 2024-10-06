import { Interface } from "readline/promises"

// export interface Permission {
//     key: string,
//     label: string,
//     value: boolean
// }

// export interface PermissionsArray {
//     email: string,
//     uuid: string,
//     isAdmin: boolean,
//     buildings: Permission[],
//     spaces: Permission[],
//     map_misc: Permission[],
//     general: Permission[]
// }

// import type { user_profile } from "./supabase_types";
// import type { Json } from "./supabase_types.gen";

export type UserProfile_Template = {
    email: string,
    is_admin: boolean,
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
}

export interface SpacesPermissions extends PermissionsObject {
    facilities: boolean,
}
