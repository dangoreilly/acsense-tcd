import type { Building } from "../../acsense-tcd/assets/types/supabase_types";
require('dotenv').config();

let baseUrl = process.env.BASE_URL || 'http://127.0.0.1:54321';

export default [
    [
        {
          "created_at": "2024-09-21 09:15:43.671368+00",
          "canonical": "example-building-1",
          "display_name": "Example Building 1",
          "aka": "Ex. B1",
          "map_label_1": "Example Building 1",
          "map_label_2": "Ex. B1",
          "map_label_3": null,
          "geometry": {
            "coordinates": [
              [
                [
                  -6.256193640124138,
                  53.343154781958496
                ],
                [
                  -6.256199060058748,
                  53.343119247175885
                ],
                [
                  -6.256247839470518,
                  53.343119247175885
                ],
                [
                  -6.256258679339794,
                  53.343002951523715
                ],
                [
                  -6.256302038816955,
                  53.34300618195849
                ],
                [
                  -6.256307458751564,
                  53.3429867993498
                ],
                [
                  -6.256350818228725,
                  53.342967416741104
                ],
                [
                  -6.256372497967277,
                  53.34293511239328
                ],
                [
                  -6.256583875418244,
                  53.34294480369763
                ],
                [
                  -6.2566272348953476,
                  53.342909268915015
                ],
                [
                  -6.256806092738486,
                  53.342915729784586
                ],
                [
                  -6.256903651562027,
                  53.3429867993498
                ],
                [
                  -6.256925331300579,
                  53.342967416741104
                ],
                [
                  -6.257082509405166,
                  53.34297064717589
                ],
                [
                  -6.2571150290129935,
                  53.34299649065415
                ],
                [
                  -6.257152968555488,
                  53.34299649065415
                ],
                [
                  -6.257190908097982,
                  53.34301910369763
                ],
                [
                  -6.257505264307156,
                  53.34302556456719
                ],
                [
                  -6.257499844372489,
                  53.343051408045454
                ],
                [
                  -6.257564883588202,
                  53.34305463848023
                ],
                [
                  -6.257581143392088,
                  53.343070790654146
                ],
                [
                  -6.257581143392088,
                  53.343070790654146
                ],
                [
                  -6.25759740319603,
                  53.343090173262844
                ],
                [
                  -6.257662442411686,
                  53.34309340369763
                ],
                [
                  -6.257678702215628,
                  53.34310955587154
                ],
                [
                  -6.257982218555526,
                  53.343119247175885
                ],
                [
                  -6.257982218555526,
                  53.34314832108893
                ],
                [
                  -6.25802557803263,
                  53.34314832108893
                ],
                [
                  -6.258052677705848,
                  53.343174164567195
                ],
                [
                  -6.258106877052228,
                  53.343174164567195
                ],
                [
                  -6.258106877052228,
                  53.3432096993498
                ],
                [
                  -6.257976798620859,
                  53.34320646891502
                ],
                [
                  -6.257971378686193,
                  53.34324846456719
                ],
                [
                  -6.25792259927448,
                  53.34324846456719
                ],
                [
                  -6.257906339470537,
                  53.34356181674111
                ],
                [
                  -6.25744564502611,
                  53.343545664567195
                ],
                [
                  -6.257461904829995,
                  53.34339706456719
                ],
                [
                  -6.2573643460064545,
                  53.34339383413241
                ],
                [
                  -6.257358926071845,
                  53.3434325993498
                ],
                [
                  -6.257180068228706,
                  53.34342936891502
                ],
                [
                  -6.257185488163373,
                  53.34338737326284
                ],
                [
                  -6.25706624960128,
                  53.343384142828064
                ],
                [
                  -6.257082509405166,
                  53.34318062543676
                ]
              ]
            ]
          },
          "description": "Description of Example Building 9",
          "sense_exp": "Sensory information for Example Building 1",
          "wayfinding": "Wayfinding information for Example Building 1",
          "phys_access": "Physical Access Information for Example Building 1",
          "tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
          ],
          "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
          "opening_times": {
            "weekday": {
              "open": true,
              "times": [
                "08:00",
                "17:00"
              ]
            },
            "sat": {
              "open": true,
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
            "note": "Tcdard access only on weekends"
          },
          "sense_exp_display": true,
          "phys_access_display": true,
          "wayfinding_display": true,
          "furtherinfo_display": true,
          "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
          "primary_image_alt": "Primary Image Alt Text",
          "UUID": "e5172612-24ac-43ad-a01c-503bbc7edaf0",
          "always_display": false,
          "sense_exp_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
          "wayfinding_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
          "phys_access_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
          "entry_floor": 0,
          "internal_map_size": [
            0,
            0
          ],
          "published": true,
          "floorplans_published": true,
          "rooms_published": false,
          "updated_at": null
        },
        {
          "created_at": "2024-09-21 09:15:43.671368+00",
          "canonical": "example-building-2",
          "display_name": "Example Building 2",
          "aka": "Ex. B2",
          "map_label_1": "Example Building 2",
          "map_label_2": "Ex. B2",
          "map_label_3": null,
          "geometry": {
            "coordinates": [
              [
                [
                  -6.258532757442253,
                  53.34403918942865
                ],
                [
                  -6.258522544984657,
                  53.34415532567437
                ],
                [
                  -6.2583114572687455,
                  53.34414873151707
                ],
                [
                  -6.2583216697263415,
                  53.34403259527135
                ]
              ]
            ]
          },
          "description": "Description of Example Building 2",
          "sense_exp": "Sensory information for Example Building 2",
          "wayfinding": "Wayfinding information for Example Building 2",
          "phys_access": "Physical Access Information for Example Building 2",
          "tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
          ],
          "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
          "opening_times": {
            "weekday": {
              "open": true,
              "times": [
                "08:00",
                "17:00"
              ]
            },
            "sat": {
              "open": true,
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
            "note": "Tcdard access only on weekends"
          },
          "sense_exp_display": true,
          "phys_access_display": true,
          "wayfinding_display": true,
          "furtherinfo_display": true,
          "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-portrait.jpg",
          "primary_image_alt": "Primary Image Alt Text",
          "UUID": "028a15f7-af94-4c50-90b1-ebcf456e3eb4",
          "always_display": false,
          "sense_exp_video": "https://youtu.be/Q3YC90i2HbM",
          "wayfinding_video": "https://youtu.be/hnpsEwAAs3M",
          "phys_access_video": "https://youtu.be/WyYjD8VGGWM",
          "entry_floor": 0,
          "internal_map_size": [
            0,
            0
          ],
          "published": true,
          "floorplans_published": false,
          "rooms_published": true,
          "updated_at": null
        },
        {
          "created_at": "2024-09-21 09:15:43.671368+00",
          "canonical": "example-building-3",
          "display_name": "Example Building 3",
          "aka": "Ex. B3",
          "map_label_1": "Example Building 3",
          "map_label_2": "Ex. B3",
          "map_label_3": null,
          "geometry": {
            "coordinates": [
              [
                [
                  -6.247904114163589,
                  53.343727572804454
                ],
                [
                  -6.246464411684428,
                  53.34342864531794
                ],
                [
                  -6.246453707576791,
                  53.34300887480497
                ],
                [
                  -6.248144956585747,
                  53.34339684452151
                ]
              ]
            ]
          },
          "description": "Description of Example Building 3",
          "sense_exp": "Sensory information for Example Building 3",
          "wayfinding": "Wayfinding information for Example Building 3",
          "phys_access": "Physical Access Information for Example Building 3",
          "tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
          ],
          "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
          "opening_times": {
            "weekday": {
              "open": true,
              "times": [
                "08:00",
                "17:00"
              ]
            },
            "sat": {
              "open": true,
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
            "note": "Tcdard access only on weekends"
          },
          "sense_exp_display": true,
          "phys_access_display": true,
          "wayfinding_display": true,
          "furtherinfo_display": true,
          "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
          "primary_image_alt": "Primary Image Alt Text",
          "UUID": "0383d758-a424-42aa-a9eb-66fe74bf4648",
          "always_display": true,
          "sense_exp_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
          "wayfinding_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
          "phys_access_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
          "entry_floor": 0,
          "internal_map_size": [
            0,
            0
          ],
          "published": true,
          "floorplans_published": false,
          "rooms_published": false,
          "updated_at": null
        },
        {
          "created_at": "2024-09-21 09:15:43.671368+00",
          "canonical": "example-building-4",
          "display_name": "Example Building 4",
          "aka": "Ex. B4",
          "map_label_1": "Example Building 4",
          "map_label_2": "Ex. B4",
          "map_label_3": null,
          "geometry": {
            "coordinates": [
              [
                [
                  -6.256578201317549,
                  53.344875587077944
                ],
                [
                  -6.256589041186825,
                  53.344730217512726
                ],
                [
                  -6.2567245395528595,
                  53.34473344794751
                ],
                [
                  -6.256729959487469,
                  53.344710834904035
                ],
                [
                  -6.25697927648093,
                  53.3447172957736
                ],
                [
                  -6.25697385654632,
                  53.344739908817076
                ],
                [
                  -6.257093095108413,
                  53.34474313925186
                ],
                [
                  -6.257082255239137,
                  53.34488850881708
                ],
                [
                  -6.2569630166770445,
                  53.34488527838229
                ],
                [
                  -6.2569630166770445,
                  53.344901430556206
                ],
                [
                  -6.2567136996835835,
                  53.34489496968664
                ],
                [
                  -6.2567136996835835,
                  53.34487881751273
                ]
              ]
            ]
          },
          "description": "Description of Example Building 4",
          "sense_exp": "Sensory information for Example Building 4",
          "wayfinding": "Wayfinding information for Example Building 4",
          "phys_access": "Physical Access Information for Example Building 4",
          "tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
          ],
          "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
          "opening_times": {
            "weekday": {
              "open": true,
              "times": [
                "08:00",
                "17:00"
              ]
            },
            "sat": {
              "open": true,
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
            "note": "Tcdard access only on weekends"
          },
          "sense_exp_display": true,
          "phys_access_display": true,
          "wayfinding_display": true,
          "furtherinfo_display": true,
          "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-portrait.jpg",
          "primary_image_alt": "Primary Image Alt Text",
          "UUID": "06e481da-e5c6-400d-a796-2f903d506d3c",
          "always_display": false,
          "sense_exp_video": "https://youtu.be/Q3YC90i2HbM",
          "wayfinding_video": "https://youtu.be/hnpsEwAAs3M",
          "phys_access_video": "https://youtu.be/WyYjD8VGGWM",
          "entry_floor": 0,
          "internal_map_size": [
            0,
            0
          ],
          "published": true,
          "floorplans_published": false,
          "rooms_published": false,
          "updated_at": null
        },
        {
          "created_at": "2024-09-21 09:15:43.671368+00",
          "canonical": "example-building-5",
          "display_name": "Example Building 5",
          "aka": "Ex. B5",
          "map_label_1": "Example Building 5",
          "map_label_2": "Ex. B5",
          "map_label_3": null,
          "geometry": {
            "coordinates": [
              [
                [
                  -6.293479668466603,
                  53.34096184866016
                ],
                [
                  -6.293462340993017,
                  53.34093840338546
                ],
                [
                  -6.293837769587185,
                  53.3408580195865
                ],
                [
                  -6.293855097060771,
                  53.34088816351111
                ],
                [
                  -6.293889752007885,
                  53.34088146486119
                ],
                [
                  -6.293959061902228,
                  53.34099199258477
                ],
                [
                  -6.294057250919138,
                  53.340971896635025
                ],
                [
                  -6.294224749830391,
                  53.3409350540605
                ],
                [
                  -6.294299835549225,
                  53.341058979083904
                ],
                [
                  -6.294357593794473,
                  53.34115276018269
                ],
                [
                  -6.2944211278642115,
                  53.34125323993139
                ],
                [
                  -6.294253628953015,
                  53.34128673318096
                ],
                [
                  -6.294184319058672,
                  53.34130013048079
                ],
                [
                  -6.294253628953015,
                  53.34141065820436
                ],
                [
                  -6.294374921268059,
                  53.341383863604705
                ],
                [
                  -6.294629057547127,
                  53.34179583057439
                ],
                [
                  -6.2947156949149985,
                  53.3417790839496
                ],
                [
                  -6.2948831938262515,
                  53.342047029946144
                ],
                [
                  -6.29475034986217,
                  53.342077173870756
                ],
                [
                  -6.294767677335756,
                  53.34210731779537
                ],
                [
                  -6.29423630147943,
                  53.34221784551894
                ],
                [
                  -6.294218974005844,
                  53.342194400244246
                ],
                [
                  -6.29409190586631,
                  53.342221194843894
                ],
                [
                  -6.293941734428643,
                  53.3419733447971
                ],
                [
                  -6.294034147621062,
                  53.341953248847354
                ],
                [
                  -6.294016820147476,
                  53.34192980357266
                ],
                [
                  -6.2942940597246775,
                  53.34186951572344
                ],
                [
                  -6.294242077303977,
                  53.34178243327456
                ],
                [
                  -6.293953286077681,
                  53.34183937179883
                ],
                [
                  -6.293953286077681,
                  53.34183937179883
                ],
                [
                  -6.293953286077681,
                  53.34183937179883
                ],
                [
                  -6.293814666289052,
                  53.34161831635168
                ],
                [
                  -6.293964837726719,
                  53.34158482310211
                ],
                [
                  -6.293964837726719,
                  53.341588172427066
                ],
                [
                  -6.294103457515348,
                  53.34155802850246
                ],
                [
                  -6.294063026743686,
                  53.34148769267836
                ],
                [
                  -6.293756908043804,
                  53.34155132985254
                ],
                [
                  -6.293647167377856,
                  53.34137046630488
                ],
                [
                  -6.293935958604095,
                  53.34131017845566
                ],
                [
                  -6.293895527832433,
                  53.34124654128148
                ],
                [
                  -6.293883976183395,
                  53.3412297946567
                ],
                [
                  -6.293595184957098,
                  53.34129008250592
                ],
                [
                  -6.29358363330806,
                  53.341263287906266
                ],
                [
                  -6.293496995940188,
                  53.341280034531046
                ],
                [
                  -6.293456565168526,
                  53.34121974668182
                ],
                [
                  -6.293416134396807,
                  53.34122644533174
                ],
                [
                  -6.293364151976107,
                  53.341146061532775
                ],
                [
                  -6.293294842081821,
                  53.341035533809205
                ],
                [
                  -6.293277514608235,
                  53.34100538988459
                ]
              ]
            ]
          },
          "description": "Description of Example Building 5",
          "sense_exp": "Sensory information for Example Building 5",
          "wayfinding": "Wayfinding information for Example Building 5",
          "phys_access": "Physical Access Information for Example Building 5",
          "tips": [
            "Tip 1",
            "Tip 2",
            "Tip 3"
          ],
          "further_info": "*Further* _information_\\n *Bullet Point 1\\n *Bullet Point 2\\n *Bullet Point 3",
          "opening_times": {
            "weekday": {
              "open": true,
              "times": [
                "08:00",
                "17:00"
              ]
            },
            "sat": {
              "open": true,
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
            "note": "Tcdard access only on weekends"
          },
          "sense_exp_display": true,
          "phys_access_display": true,
          "wayfinding_display": true,
          "furtherinfo_display": true,
          "primary_image_url": baseUrl+"/storage/v1/object/public/primary-images/ex-primary-landscape.jpg",
          "primary_image_alt": "Primary Image Alt Text",
          "UUID": "e462d596-8a16-4df1-ab44-1eb2947b66d1",
          "always_display": true,
          "sense_exp_video": "https://www.youtube.com/watch?v=Q3YC90i2HbM",
          "wayfinding_video": "https://www.youtube.com/watch?v=hnpsEwAAs3M",
          "phys_access_video": "https://www.youtube.com/watch?v=WyYjD8VGGWM",
          "entry_floor": 0,
          "internal_map_size": [
            0,
            0
          ],
          "published": true,
          "floorplans_published": false,
          "rooms_published": false,
          "updated_at": null
        }
      ]
] as Building[]