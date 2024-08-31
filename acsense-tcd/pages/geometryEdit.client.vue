<template>
<div id="map" style="width: 800px; height: 600px">
    
</div>
</template>

<script>

import * as L from "leaflet";
import '~/assets/css/leaflet.css'
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';

import { addBuildings, addLabelsToMap, addOverlays, addSpaces, addZoomHandling } from '~/utils/adminMapUtils'

L.PM.setOptIn(false);

// The view when the map is first opened. Defined as what looks good on mobile, because 
    // that automatically looks alright on desktop, but not the other way around.
    const campusBounds = [
                        [53.34631744552114, -6.255028994837502],
                        [53.34163690316516, -6.258745992827823]
                    ];

const buildings = [
    {
        canonical: "string", 
        display_name: "string", 
        UUID: "string", 
        always_display: true, 
        geometry: {
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
        map_label_1: "string",
        map_label_2: "string",
        map_label_3: "string"
    },
    {
        canonical: "string", 
        display_name: "string", 
        UUID: "string", 
        always_display: true, 
        geometry: {
            "coordinates": [
                [
                    [
                        -6.259532757442253,
                        53.34403918942865
                    ],
                    [
                        -6.259522544984657,
                        53.34415532567437
                    ],
                    [
                        -6.2593114572687455,
                        53.34414873151707
                    ],
                    [
                        -6.2593216697263415,
                        53.34403259527135
                    ]
                ]
            ]
        },
        map_label_1: "string",
        map_label_2: "string",
        map_label_3: "string"
    },
]


export default {
    data() {
        return {
            map: {},
        }
    },
    mounted() {
        // console.log(this.$refs.welcome);
        // Check if the user has indicated they want to skip the welcome modal
        this.InitMap();
    },

    methods: {

        async InitMap(){

            // Wait 

            // Check if there is already a map object, remove if there is
            try {
                this.map.remove();
            }
            catch (error) {
                console.log("No map to remove");
            }

            // Initialise the map
            let map = L.map('map', {
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxZoom: 20,
                renderer: L.canvas({padding: 1}),
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
                pmIgnore: false,
            }).fitBounds(campusBounds);

            // add Leaflet-Geoman controls with some options to the map  
            map.pm.addControls({  
                position: 'topleft',  
                drawControls: false,
                cutPolygon: false,
                removalMode: false,
            }); 

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            // Add the buildings
            addBuildings(L, map, buildings, null, true, (active, space) => {
                console.log(space);
            });

            // Add zoom handling
            addZoomHandling(map);

            this.map = map;

        },
    }
};
</script>