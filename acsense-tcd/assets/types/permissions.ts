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
    bld_general: boolean,
    bld_tabs: boolean,
    bld_gallery: boolean,
    bld_times: boolean,
    bld_tips: boolean,
    bld_further: boolean,
    bld_map: boolean,
    sense_general: boolean,
    sense_map: boolean,
    sense_facilities: boolean,
    sense_photos: boolean,
}