import { Interface } from "readline/promises"

export interface Permission {
    key: string,
    label: string,
    value: boolean
}

export interface PermissionsArray {
    email: string,
    uuid: string,
    isAdmin: boolean,
    buildings: Permission[],
    spaces: Permission[],
    map_misc: Permission[],
    general: Permission[]
}

export interface UserProfile {
    email: string,
    user_id: string,
    is_admin: boolean,
    buildings: PermissionsObject,
    spaces: PermissionsObject,
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
