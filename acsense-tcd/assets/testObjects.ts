// Data for testing
import type { UserProfile } from '~/assets/types/permissions';
export const user_all: UserProfile = { 
    email: "user.all@acsense.ie",
    user_id: "0",
    is_admin: false,
    is_super_admin: false,
    buildings: {
        general: {
            name: true,
            aka: true,
            desc: true,
        },
        primary_image: {
            image: true,
            alt: true
        },
        tabs: {
            physical: true,
            wayfinding: true,
            sensory: true
        },
        gallery: {
            images: true,
            captions: true,
            alt: true
        },
        times: true,
        tips: true,
        further: true,
        map: {
            labels: true,
            location: true
        }
    },
    spaces: {
        general: {
            name: true,
            aka: true,
            desc: true,
        },
        primary_image: {
            image: true,
            alt: true
        },
        tabs: {
            physical: true,
            wayfinding: true,
            sensory: true
        },
        gallery: {
            images: true,
            captions: true,
            alt: true
        },
        times: true,
        tips: true,
        further: true,
        map: {
            labels: true,
            location: true
        },
        facilities: true
    },
  }
  
export const user_buildingsOnly: UserProfile = { 
      email: "user.buildingsOnly@acsense.ie",
      is_admin: false,
      user_id: "0",
      buildings: {
          general: {
              name: true,
              aka: true,
              desc: true,
          },
          primary_image: {
              image: true,
              alt: true
          },
          tabs: {
              physical: true,
              wayfinding: true,
              sensory: true
          },
          gallery: {
              images: true,
              captions: true,
              alt: true
          },
          times: true,
          tips: true,
          further: true,
          map: {
              labels: true,
              location: true
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
          },
          facilities: false
        },
  }
    
export const user_admin: UserProfile = { 
    email: "admin@acsense.ie",
    user_id: "0",
    is_admin: true,
    buildings: {
        general: {
            name: true,
            aka: true,
            desc: true,
        },
        primary_image: {
            image: true,
            alt: true
        },
        tabs: {
            physical: true,
            wayfinding: true,
            sensory: true
        },
        gallery: {
            images: true,
            captions: true,
            alt: true
        },
        times: true,
        tips: true,
        further: true,
        map: {
            labels: true,
            location: true
        }
    },
    spaces: {
        general: {
            name: true,
            aka: false,
            desc: true,
        },
        primary_image: {
            image: true,
            alt: true
        },
        gallery: {
            images: false,
            captions: false,
            alt: false
          },
        tabs: {
            physical: true,
            wayfinding: true,
            sensory: true
        },
        times: true,
        tips: true,
        further: true,
        map: {
            labels: true,
            location: true
        },
        facilities: false
    },
  }
  
export const user_none: UserProfile = { 
    email: "user.none@acsense.ie",
    user_id: "0",
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
  
export const user_superadmin: UserProfile = { 
    email: "superadmin@acsense.ie",
    user_id: "0",
    is_admin: true,
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
  
import type { Building } from '~/assets/types/supabase_types';

// Buildings
export const building: Building = {
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

    created_at: "2021-09-01T12:00:00.000Z",
    updated_at: "2021-09-01T12:00:00.000Z",
    UUID: "00000000-0000-0000-0000-000000000000",
}

import type { Space } from '~/assets/types/supabase_types';
//   Spaces

export const space_inside: Space = {
    "name": "Example Space 1",
    "canonical": "example-space-1",
    "description": "Description for Example Space 1",
    "type": "CSC Space",
    "updated_at": "2024-08-01 14:51:30.697118+00",
    "food_drink_allowed": true,
    "microwave": false,
    "kettle": false,
    "wheelchair": false,
    "location": [
        53.3446430066463,
        -6.25911171722129
    ],
    "building": "example-building-1",
    "outlets": true,
    "icon_override": "",
    "seating": true,
    "UUID": "49cdcd7f-6b4d-4a11-abd0-2d41d2bbfbfb",
    "building_uuid": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
    "food_drink_allowed_note": "Food and Drink Note",
    "microwave_note": "Microwave Note\\n",
    "kettle_note": "Kettle Note\\n",
    "wheelchair_note": "Wheelchair note",
    "seating_note": "Seating Note\\n\\n",
    "outlets_note": "Outlets Note",
    "primary_image_url": "/images/ex-primary-portrait.jpg",
    "primary_image_alt": "Alt Text for Primary Image",
    "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
    ],
    "primary_image_panorama": false,
    "sense_exp": "Sensory Experience for space 1",
    "sense_exp_display": false,
    "wayfinding": "Wayfinding for Space 1",
    "wayfinding_display": true,
    "phys_access": "Physical Access for Space 1",
    "phys_access_display": false,
    "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
    "further_info_display": false,
    "aka": "Ex Space 1",
    "phys_access_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
    "sense_exp_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
    "wayfinding_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
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
        "note": "This area can be booked through the CSC."
        },
    "floor": 1,
    "location_internal": [
        454,
        350
    ],
    "clickthrough": false,
    "published": true,
    "updated_by": null
}

export const space_outside: Space = {
    "name": "Example Space 2",
    "canonical": "example-space-2",
    "description": "Description for Example Space 2",
    "type": "CSC Space",
    "updated_at": "2024-08-01 14:51:30.697118+00",
    "food_drink_allowed": true,
    "microwave": true,
    "kettle": false,
    "wheelchair": true,
    "location": [
        53.3450721473786,
        -6.25781334419746
    ],
    "building": null,
    "outlets": true,
    "icon_override": "",
    "seating": true,
    "UUID": "b416eab6-5fb2-4d44-9683-24c7500a18ec",
    "building_uuid": null,
    "food_drink_allowed_note": "\"\"",
    "microwave_note": "\"\"",
    "kettle_note": "\"\"",
    "wheelchair_note": "\"\"",
    "seating_note": "\"\"",
    "outlets_note": "\"\"",
    "primary_image_url": "/images/ex-primary-landscape.jpg",
    "primary_image_alt": "",
    "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
    ],
    "primary_image_panorama": false,
    "sense_exp": "Sensory Experience for space 2",
    "sense_exp_display": true,
    "wayfinding": "Wayfinding for Space 2",
    "wayfinding_display": false,
    "phys_access": "Physical Access for Space 2",
    "phys_access_display": false,
    "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
    "further_info_display": false,
    "aka": "Ex Space 2",
    "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
    "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
    "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
    "opening_times": {
        "weekday": {
            "open": true,
            "times": [
            "07:00",
            "22:00"
            ]
        },
        "sat": {
            "open": true,
            "times": [
            "07:00",
            "22:00"
            ]
        },
        "holidays": {
            "open": true,
            "times": [
            "07:00",
            "22:00"
            ]
        },
        "note": "These areas can be booked through the CSC."
    },
    "floor": 2,
    "location_internal": [
        454,
        350
    ],
    "clickthrough": false,
    "published": true,
    "updated_by": null
}