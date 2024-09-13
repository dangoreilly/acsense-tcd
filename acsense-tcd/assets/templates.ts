import type { UserProfile_Template } from "~/assets/types/permissions";
export const user_template: UserProfile_Template = { 
    email: "template@template.ie",
    is_admin: false,
    buildings: {
        general: {
            name: false,
            aka: false,
            desc: false,
        },
        primary_image: {
            image: false,
            alt: false
        },
        tabs: {
            physical: false,
            wayfinding: false,
            sensory: false
        },
        gallery: {
            images: false,
            captions: false,
            alt: false
        },
        times: false,
        tips: false,
        further: false,
        map: {
            labels: false,
            location: false
        }
    },
    spaces: {
        general: {
            name: false,
            aka: false,
            desc: false,
        },
        primary_image: {
            image: false,
            alt: false
        },
        gallery: {
            images: false,
            captions: false,
            alt: false
          },
        tabs: {
            physical: false,
            wayfinding: false,
            sensory: false
        },
        times: false,
        tips: false,
        further: false,
        map: {
            labels: false,
            location: false
        },
        facilities: false
    },
  }

  import type { Building, Building_Template, Space, Space_Template } from "~/assets/types/supabase_types"
export const space_template: Space_Template = {
    "name": "New Space",
    "canonical": "new-space",
    "description": "",
    "type": "Study Space",
    "food_drink_allowed": false,
    "microwave": false,
    "kettle": false,
    "wheelchair": false,
    "location": [
        53.34395445092419,
        -6.255415678024292
    ],
    "outlets": false,
    "icon_override": "",
    "seating": false,
    "food_drink_allowed_note": "",
    "microwave_note": "",
    "kettle_note": "",
    "wheelchair_note": "",
    "seating_note": "",
    "outlets_note": "",
    "primary_image_url": null,
    "primary_image_alt": null,
    "tips": [],
    "primary_image_panorama": false,
    "sense_exp": "",
    "sense_exp_display": false,
    "wayfinding": "",
    "wayfinding_display": true,
    "phys_access": "",
    "phys_access_display": false,
    "further_info": "",
    "further_info_display": false,
    "aka": null,
    "phys_access_video": null,
    "sense_exp_video": null,
    "wayfinding_video": null,
    "opening_times": {
        "weekday": {
            "open": false,
            "times": [
            "08:00",
            "17:00"
            ]
        },
        "sat": {
            "open": false,
            "times": [
            "08:00",
            "17:00"
            ]
        },
        "holidays": {
            "open": false,
            "times": [
            "08:00",
            "17:00"
            ]
        },
        "note": ""
        },
    "floor": 0,
    "location_internal": [
        0,
        0
    ],
    "clickthrough": false,
    "published": false,
}

export const building_template: Building_Template = {
    canonical: "example-building-A",
    display_name: "New Building",
    aka: "New Building",
    description: "Description of New Building",
    map_label_1: "New Building",
    map_label_2: "New Bld",
    map_label_3: "New",
    geometry: {"coordinates":[[[-6.2534308433532715,53.34358614911305],[-6.253425478935243,53.343762293854404],[-6.253774166107179,53.34375268597821],[-6.253795623779298,53.34357974383601]]]},
    always_display: true,
    sense_exp: "Sensory Experience for New Building",
    sense_exp_display: true,
    sense_exp_video: "",
    wayfinding: "Wayfinding information for New Building",
    wayfinding_display: true,
    wayfinding_video: "",
    phys_access: "Physical Access Information for New Building",
    phys_access_display: true,
    phys_access_video: "",
    tips: ["Tip 1", "Tip 2", "Tip 3"],
    further_info: "Further Information",
    furtherinfo_display: true,
    opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"},
    primary_image_url: "",
    primary_image_alt: "",
    entry_floor: 1,
    internal_map_size: [100,100],
    published: false,
    floorplans_published: false,
    rooms_published: false,
}