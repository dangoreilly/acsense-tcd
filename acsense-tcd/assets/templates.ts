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
    "building": null,
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
    display_name: "Example Building A",
    aka: "Ex Building A",
    description: "Description of Example Building A",
    map_label_1: "Example Building A",
    map_label_2: "Ex Building A",
    map_label_3: "A",
    geometry: {"coordinates":[[[-6.2,53.3],[-6.2,54.3],[-7.2,54.3],[-7.2,53.3]]]},
    always_display: true,
    sense_exp: "Sensory Experience for Example Building A",
    sense_exp_display: true,
    sense_exp_video: "https://youtu.be/Q3YC90i2HbM",
    wayfinding: "Wayfinding information for Example Building A",
    wayfinding_display: true,
    wayfinding_video: "https://youtu.be/hnpsEwAAs3M",
    phys_access: "Physical Access Information for Example Building A",
    phys_access_display: true,
    phys_access_video: "https://youtu.be/WyYjD8VGGWM",
    tips: ["Tip 1", "Tip 2", "Tip 3"],
    further_info: "Further Information",
    furtherinfo_display: true,
    opening_times: {"weekday":{"open":true,"times":["08:00","17:00"]},"sat":{"open":true,"times":["08:00","17:00"]},"holidays":{"open":false,"times":["08:00","17:00"]},"note":"Tcdard access only on weekends"},
    primary_image_url: "/images/ex-primary-portrait.jpg",
    primary_image_alt: "Primary Image Alt Text",
    entry_floor: 1,
    internal_map_size: [100,100],
    published: true,
    floorplans_published: false,
    rooms_published: false,
}