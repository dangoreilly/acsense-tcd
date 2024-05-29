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
