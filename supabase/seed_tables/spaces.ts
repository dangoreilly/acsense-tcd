import type { Space_Template } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';

export default [
    {
      "name": "Example Space 1",
      "canonical": "example-space-1",
      "description": "Description for Example Space 1",
      "type": "CSC Space",
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
      "food_drink_allowed_note": "Food and Drink Note",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "Wheelchair note",
      "seating_note": "Seating Note\\n\\n",
      "outlets_note": "Outlets Note",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-portrait.jpg",
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
      "published": true
    },
    {
      "name": "Example Space 2",
      "canonical": "example-space-2",
      "description": "Description for Example Space 2",
      "type": "CSC Space",
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
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "\"\"",
      "kettle_note": "\"\"",
      "wheelchair_note": "\"\"",
      "seating_note": "\"\"",
      "outlets_note": "\"\"",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
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
      "published": true
    },
    {
      "name": "Example Space 3",
      "canonical": "example-space-3",
      "description": "Description for Example Space 3",
      "type": "Outdoor Space",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3433235319657,
        -6.25222860439137
      ],
      "building": "example-building-1",
      "outlets": false,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "Food and Drink Note",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "Wheelchair note",
      "seating_note": "Seating Note\\n",
      "outlets_note": "Outlets Note",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-portrait.jpg",
      "primary_image_alt": "Alt Text for Primary Image",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 3",
      "sense_exp_display": true,
      "wayfinding": "Wayfinding for Space 3",
      "wayfinding_display": true,
      "phys_access": "Physical Access for Space 3",
      "phys_access_display": true,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 3",
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
        "note": "This area is outside and is subject to Campus closing times."
      },
      "floor": 3,
      "location_internal": [
        454,
        1662
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 4",
      "canonical": "example-space-4",
      "description": "Description for Example Space 4",
      "type": "Outdoor Space",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3437494833523,
        -6.25461079803
      ],
      "building": null,
      "outlets": false,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "\"\"",
      "seating_note": "\"\"",
      "outlets_note": "\"\"",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
      "primary_image_alt": "",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 4",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 4",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 4",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 4",
      "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
      "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
      "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
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
        "note": "\tThis area is outside and is subject to Campus closing times."
      },
      "floor": 1,
      "location_internal": [
        454,
        1662
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 5",
      "canonical": "example-space-5",
      "description": "Description for Example Space 5",
      "type": "Quiet Space",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3445693477281,
        -6.26130047504146
      ],
      "building": "example-building-1",
      "outlets": true,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "\"\"",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "Wheelchair note",
      "seating_note": "Seating Note",
      "outlets_note": "Outlets Note",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-portrait.jpg",
      "primary_image_alt": "Alt Text for Primary Image",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 5",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 5",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 5",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 5",
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
        "note": ""
      },
      "floor": 2,
      "location_internal": [
        294,
        1478
      ],
      "clickthrough": false,
      "published": false
    },
    {
      "name": "Example Space 6",
      "canonical": "example-space-6",
      "description": "Description for Example Space 6",
      "type": "Quiet Space",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3431858174492,
        -6.25771141037807
      ],
      "building": null,
      "outlets": true,
      "icon_override": "",
      "seating": false,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "\"\"",
      "kettle_note": "\"\"",
      "wheelchair_note": "\"\"",
      "seating_note": "",
      "outlets_note": "\"\"",
      "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
      "primary_image_alt": "",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 6",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 6",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 6",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 6",
      "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
      "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
      "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
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
        "note": "Opening based on Exhibitions, please see The Douglas Hyde website."
      },
      "floor": 3,
      "location_internal": [
        294,
        1478
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 7",
      "canonical": "example-space-7",
      "description": "Description for Example Space 7",
      "type": "Respite Room",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": true,
      "wheelchair": true,
      "location": [
        53.3430737239098,
        -6.25747003891791
      ],
      "building": "example-building-1",
      "outlets": true,
      "icon_override": "",
      "seating": false,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "\"\"",
      "kettle_note": "\"\"",
      "wheelchair_note": "\"\"",
      "seating_note": "",
      "outlets_note": "\"\"",
      "primary_image_url": "",
      "primary_image_alt": "Alt Text for Primary Image",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 7",
      "sense_exp_display": true,
      "wayfinding": "Wayfinding for Space 7",
      "wayfinding_display": true,
      "phys_access": "Physical Access for Space 7",
      "phys_access_display": true,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 7",
      "phys_access_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
      "sense_exp_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
      "wayfinding_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
      "opening_times": {
        "weekday": {
          "open": true,
          "times": [
            "08:30",
            "21:45"
          ]
        },
        "sat": {
          "open": true,
          "times": [
            "08:00",
            "18:00"
          ]
        },
        "holidays": {
          "open": false,
          "times": [
            "08:00",
            "17:00"
          ]
        },
        "note": "\t4. This area can be booked through the Disability Service Booking Link."
      },
      "floor": 1,
      "location_internal": [
        350,
        454
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 8",
      "canonical": "example-space-8",
      "description": "Description for Example Space 8",
      "type": "Respite Room",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.34501,
        -6.25536
      ],
      "building": null,
      "outlets": true,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "Food and Drink Note",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "There is an assisted door to enter the room",
      "seating_note": "There are multiple types of different seating options, such as couches, a bed to rest on, and a rocking chair",
      "outlets_note": "There are many sockets available for usage",
      "primary_image_url": "",
      "primary_image_alt": "",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 8",
      "sense_exp_display": true,
      "wayfinding": "Wayfinding for Space 8",
      "wayfinding_display": true,
      "phys_access": "Physical Access for Space 8",
      "phys_access_display": true,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 8",
      "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
      "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
      "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
      "opening_times": {
        "weekday": {
          "open": true,
          "times": [
            "09:00",
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
        "note": "\tThis area can be booked through the Disability Service Booking Link."
      },
      "floor": 2,
      "location_internal": [
        350,
        454
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 9",
      "canonical": "example-space-9",
      "description": "Description for Example Space 9",
      "type": "Social Space",
      "food_drink_allowed": true,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3434164089466,
        -6.25767384957506
      ],
      "building": "example-building-1",
      "outlets": true,
      "icon_override": baseUrl+"/storage/v1/object/public/icons/custom/example-space-9.png",
      "seating": true,
      "food_drink_allowed_note": "Food and Drink Note",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "Wheelchair note",
      "seating_note": "Seating Note\\n\\n",
      "outlets_note": "Outlets Note",
      "primary_image_url": "",
      "primary_image_alt": "Alt Text for Primary Image",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 9",
      "sense_exp_display": true,
      "wayfinding": "Wayfinding for Space 9",
      "wayfinding_display": true,
      "phys_access": "Physical Access for Space 9",
      "phys_access_display": true,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 9",
      "phys_access_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
      "sense_exp_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
      "wayfinding_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
      "opening_times": {
        "weekday": {
          "open": true,
          "times": [
            "08:30",
            "21:45"
          ]
        },
        "sat": {
          "open": true,
          "times": [
            "08:00",
            "18:00"
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
      "floor": 3,
      "location_internal": [
        662,
        1454
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 10",
      "canonical": "example-space-10",
      "description": "Description for Example Space 10",
      "type": "Social Space",
      "food_drink_allowed": true,
      "microwave": true,
      "kettle": true,
      "wheelchair": true,
      "location": [
        53.3414915722363,
        -6.29497296951239
      ],
      "building": null,
      "outlets": true,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "\"\"",
      "seating_note": "\"\"",
      "outlets_note": "\"\"",
      "primary_image_url": "",
      "primary_image_alt": "",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 10",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 10",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 10",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 10",
      "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
      "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
      "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
      "opening_times": {
        "weekday": {
          "open": true,
          "times": [
            "08:00",
            "18:00"
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
      "floor": 1,
      "location_internal": [
        662,
        1454
      ],
      "clickthrough": true,
      "published": true
    },
    {
      "name": "Example Space 11",
      "canonical": "example-space-11",
      "description": "Description for Example Space 11",
      "type": "Study Space",
      "food_drink_allowed": false,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3414691526612,
        -6.29406091739995
      ],
      "building": "example-building-1",
      "outlets": false,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "Wheelchair note",
      "seating_note": "Seating Note\\n\\n",
      "outlets_note": "Outlets Note",
      "primary_image_url": "",
      "primary_image_alt": "Alt Text for Primary Image",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 11",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 11",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 11",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 11",
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
        "note": ""
      },
      "floor": 2,
      "location_internal": [
        478,
        1294
      ],
      "clickthrough": false,
      "published": true
    },
    {
      "name": "Example Space 12",
      "canonical": "example-space-12",
      "description": "Description for Example Space 12",
      "type": "Study Space",
      "food_drink_allowed": false,
      "microwave": false,
      "kettle": false,
      "wheelchair": true,
      "location": [
        53.3432883027131,
        -6.25605921141141
      ],
      "building": null,
      "outlets": false,
      "icon_override": "",
      "seating": true,
      "food_drink_allowed_note": "\"\"",
      "microwave_note": "Microwave Note\\n",
      "kettle_note": "Kettle Note\\n",
      "wheelchair_note": "\"\"",
      "seating_note": "\"\"",
      "outlets_note": "\"\"",
      "primary_image_url": "",
      "primary_image_alt": "",
      "tips": [
        "Tip 1",
        "Tip 2",
        "Tip 3"
      ],
      "primary_image_panorama": false,
      "sense_exp": "Sensory Experience for space 12",
      "sense_exp_display": false,
      "wayfinding": "Wayfinding for Space 12",
      "wayfinding_display": false,
      "phys_access": "Physical Access for Space 12",
      "phys_access_display": false,
      "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
      "further_info_display": false,
      "aka": "Ex Space 12",
      "phys_access_video": "https://youtu.be/Q3YC90i2HbM",
      "sense_exp_video": "https://youtu.be/hnpsEwAAs3M",
      "wayfinding_video": "https://youtu.be/WyYjD8VGGWM",
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
      "floor": 3,
      "location_internal": [
        478,
        1294
      ],
      "clickthrough": true,
      "published": true
    }
  ] as Space_Template[];