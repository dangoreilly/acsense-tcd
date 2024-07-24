
// Definition of permissions needed to update each field in the database
export default function (table:string) : PermissionsKey | null {
    // Buildings table
    switch (table) {
        case "buildings":
            return {
                canonical: "is_super_admin",
                display_name: "buildings.general.name",
                aka: "buildings.general.aka",
                description: "buildings.general.desc",
                map_label_1: "buildings.map.labels",
                map_label_2: "buildings.map.labels",
                map_label_3: "buildings.map.labels",
                geometry: "buildings.map.location",
                always_display: "buildings.map.location",
                sense_exp: "buildings.tabs.sensory",
                sense_exp_display: "buildings.tabs.sensory",
                sense_exp_video: "buildings.tabs.sensory",
                wayfinding: "buildings.tabs.wayfinding",
                wayfinding_display: "buildings.tabs.wayfinding",
                wayfinding_video: "buildings.tabs.wayfinding",
                phys_access: "buildings.tabs.physical",
                phys_access_display: "buildings.tabs.physical",
                phys_access_video: "buildings.tabs.physical",
                tips: "buildings.tips",
                further_info: "buildings.further",
                furtherinfo_display: "buildings.further",
                opening_times: "buildings.times",
                primary_image_url: "buildings.primary_image.image",
                primary_image_alt: "buildings.primary_image.alt",
                entry_floor: "is_admin",
                internal_map_size: "is_admin",
                published: "is_admin",
                floorplans_published: "is_admin",
                rooms_published: "is_admin",

                created_at: "service",
                updated_at: "service",
                UUID: "service",
            } as PermissionsKey
        case "spaces":
            return null

        default:
            return null
    }
}

// export interface BuildingPermissions {
//     canonical: string,
//     display_name: string,
//     aka: string,
//     description: string,
//     map_label_1: string,
//     map_label_2: string,
//     map_label_3: string,
//     geometry: string,
//     always_display: string,
//     sense_exp: string,
//     sense_exp_display: string,
//     sense_exp_video: string,
//     wayfinding: string,
//     wayfinding_display: string,
//     wayfinding_video: string,
//     phys_access: string,
//     phys_access_display: string,
//     phys_access_video: string,
//     tips: string,
//     further_info: string,
//     furtherinfo_display: string,
//     opening_times: string,
//     primary_image_url: string,
//     primary_image_alt: string,
//     entry_floor: string,
//     internal_map_size: string,
//     published: string,
//     floorplans_published: string,
//     rooms_published: string,
// }
export interface PermissionsKey {
    [key: string]: string
}