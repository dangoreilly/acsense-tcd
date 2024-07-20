import buildings from "~/server/api/get/buildings";

// Definition of permissions needed to update each field in the database
export default {
    // Buildings table
    buildings: {
        canonical: "is_super_admin" ,
        display_name: "buildings.general.name" ,
        aka: "buildings.general.aka" ,
        description: "buildings.general.desc" ,
        map_label_1: "buildings.map.labels",
        map_label_2: "buildings.map.labels",
        map_label_3: "buildings.map.labels",
        geometry: "buildings.map.location" ,
        always_display: "buildings.map.location" ,
        sense_exp: "buildings.tabs.sensory" ,
        sense_exp_display: "buildings.tabs.sensory" ,
        sense_exp_video: "buildings.tabs.sensory" ,
        wayfinding: "buildings.tabs.wayfinding" ,
        wayfinding_display: "buildings.tabs.wayfinding" ,
        wayfinding_video: "buildings.tabs.wayfinding" ,
        phys_access: "buildings.tabs.physical" ,
        phys_access_display: "buildings.tabs.physical" ,
        phys_access_video: "buildings.tabs.physical" ,
        tips: "buildings.tips" ,
        further_info: "buildings.further" ,
        furtherinfo_display: "buildings.further" ,
        opening_times: "buildings.times" ,
        primary_image_url: "buildings.primary_image.image" ,
        primary_image_alt: "buildings.primary_image.alt" ,
        entry_floor: "buildings.floorplans" ,
        internal_map_size: "buildings.floorplans" ,
        published: "is_admin" ,
        floorplans_published: "is_admin" ,
        rooms_published: "is_admin" ,
    }
}