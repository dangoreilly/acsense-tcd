
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
        case "building_gallery_images":
            return {
                url: "buildings.gallery.images",
                alt: "buildings.gallery.alt",
                caption: "buildings.gallery.caption",

                building: "service",

                created_at: "service",
                // updated_at: "service",
                id: "service",
            } as PermissionsKey
        case "spaces":
            return {
                name:                       "spaces.general.name",
                canonical:                  "is_super_admin",
                description:                "spaces.general.desc",
                aka:                "spaces.general.aka",
                type:                       "spaces.map.labels",
                food_drink_allowed:         "spaces.facilities",
                microwave:                  "spaces.facilities",
                kettle:                     "spaces.facilities",
                wheelchair:                 "spaces.facilities",
                location:                   "spaces.map.location",
                building:                   "spaces.map.location",
                outlets:                    "spaces.facilities",
                icon_override:              "spaces.map.labels",
                seating:					"spaces.facilities",
                building_uuid:				"spaces.map.location",
                food_drink_allowed_note:	"spaces.facilities",
                microwave_note:             "spaces.facilities",
                kettle_note:                "spaces.facilities",
                wheelchair_note:            "spaces.facilities",
                seating_note:               "spaces.facilities",
                outlets_note:               "spaces.facilities",
				sense_exp: 					"spaces.tabs.sensory",
                sense_exp_display: 			"spaces.tabs.sensory",
                sense_exp_video: 			"spaces.tabs.sensory",
                wayfinding: 				"spaces.tabs.wayfinding",
                wayfinding_display: 		"spaces.tabs.wayfinding",
                wayfinding_video: 			"spaces.tabs.wayfinding",
                phys_access: 				"spaces.tabs.physical",
                phys_access_display: 		"spaces.tabs.physical",
                phys_access_video: 			"spaces.tabs.physical",
                tips: 						"spaces.tips",
                further_info: 				"spaces.further",
                further_info_display: 		"spaces.further",
                opening_times: 				"spaces.times",
                primary_image_url: 			"spaces.primary_image.image",
                primary_image_alt: 			"spaces.primary_image.alt",
                primary_image_panorama:     "is_admin",
                floor: 						"spaces.map.location",
                location_internal: 			"spaces.map.location",
                clickthrough: 				"spaces.map.location",
                published: 					"is_admin",

                updated_at: "service",
                UUID: "service",
                updated_by: "service" 
            } as PermissionsKey

        case "profiles":
            return {
                email: "is_admin",
                user_id: "service",
                is_admin: "is_admin",
                is_super_admin: "service",
                buildings: "is_admin",
                spaces: "is_admin",
                map: "is_admin",
            } as PermissionsKey

        case "overlays":
            return {
                url: "map.overlays",
                url_dark: "map.overlays",
                bounds: "map.overlays",
                high_detail: "map.overlays",

                id: "service",
                created_at: "service",
            } as PermissionsKey

        case "flyovers":
            return {
                label: "map.jumps",
                location: "map.jumps",
                target: "map.jumps",

                id: "service",
                created_at: "service",
            } as PermissionsKey
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