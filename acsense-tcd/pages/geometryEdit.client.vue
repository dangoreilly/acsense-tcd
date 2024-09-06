<template>
<main class="geometry-edit-main" style="height:100vh">
    <!-- Map input side -->
    <div class="geometry-edit-input" id="map"></div>
    <!-- Textbox output side -->
    <div class="geometry-edit-output mx-2">
        <!-- Don't try and log the UI until there's something to load, or the renderer gets sad -->
        <div v-if="building.display_name">
            <label for="buildingName">Building Name</label>
            <input type="text" class="form-control" id="buildingName" disabled
            :value="building.display_name"
            >
            <label for="coordinates">Building Shape</label>
            <textarea class="form-control" id="coordinates" style="height:80dvh; user-select: all;" readonly 
            :value="JSON.stringify(building.geometry.coordinates)">
            </textarea>
        </div>
    </div>

</main>
</template>

<script>
import { createClient } from '@supabase/supabase-js';
import * as L from "leaflet";
import '~/assets/css/leaflet.css'
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';

import { getBuildingList, addBuildings, addLabelsToMap, getOverlays, addOverlays, getSpaces, getSpaceTypes, addSpaces, addZoomHandling } from '~/utils/adminMapUtils'

L.PM.setOptIn(false);

// The view when the map is first opened. Defined as what looks good on mobile, because 
    // that automatically looks alright on desktop, but not the other way around.
    const campusBounds = [
                        [53.34631744552114, -6.255028994837502],
                        [53.34163690316516, -6.258745992827823]
                    ];

const buildings = [
    {
        canonical: "string1", 
        display_name: "string1", 
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
        canonical: "string2", 
        display_name: "string2", 
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
            supabase: {},
            map: {},
            building: {},
            buildings: [],
            spaces: [],
            overlays: [],
            spaceTypes: [],
        }
    },
    computed: {
        // building_shape() {
        //     return JSON.stringify(this.building.geometry.coordinates);
        // }
    },
    created() {
        // Init supabase
        // this.initSupabase();
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)

    },
    mounted() {
        this.makeAndPopulateMap();
    },

    methods: {
        async initSupabase() {
            // Create the supabase client that will gather all our data
            
        },
        async makeAndPopulateMap(){

            // Get all the map data
            this.buildings = await getBuildingList(this.supabase);
            this.building = this.buildings[0];
            this.spaces = await getSpaces(this.supabase);
            this.overlays = await getOverlays(this.supabase);
            this.spaceTypes = await getSpaceTypes(this.supabase);

            this.InitMap();
            
        },

        InitMap(){

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

            // Add zoom handling
            addZoomHandling(map);

            // Add all the map elements
            addBuildings(L, map, this.buildings, null, true, (active, space) => {console.log(space)}, this.updateBuilding);
            addLabelsToMap(L, map, this.buildings, null);
            addOverlays(L, map, this.overlays);
            addSpaces(L, map, this.spaces, this.spaceTypes, null, true, (active, space) => {console.log(space)});

            this.map = map;

        },

        updateBuilding(feature, layer){

            let update = (target) => {

                // Convert the leaflet LatLngs to a list of coordinates, also for leaflet
                // GeoJSON is a strange standard and I should never have adopted it
                let coords = [];
                let LatLngs = target.getLatLngs()[0];

                LatLngs.forEach((latlng) => {
                    coords.push([latlng.lng, latlng.lat]);
                });

                this.building = {
                    canonical:              target.feature.properties.canonical, 
                    display_name:           target.feature.properties.name, 
                    UUID:                   target.feature.properties.UUID, 
                    always_display:         target.feature.properties.always_display, 
                    geometry: { 
                        coordinates: [coords] 
                    },
                    map_label_1:            target.feature.properties.map_label_1,
                    map_label_2:            target.feature.properties.map_label_2,
                    map_label_3:            target.feature.properties.map_label_3
                };
            }

            // On click, update the building
            layer.on('click', (e) => {
                update(e.target);
            });

            // On edit, update the building
            layer.on('pm:edit', (e) => {
                // e.target.feature.
                update(e.target);
                // console.log(e)
                // console.log(e.target.getLatLngs())
            });

        }
    }
};
</script>


<style >
.geometry-edit-main {
    display: grid;
    grid-template-columns: 3fr 1fr;
}

.geometry-edit-input {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #F5F5F5;
}

:root{
    /* --primary-label-opacity: 1;
    --secondary-label-opacity: 0;
    --tertiary-label-opacity: 0; */
    transition: opacity 0.5s ease-in-out;
}

#map { height: 100dvh; }

.map-label { 
    color: #000;
    /* Text outline for improved readability */
    -webkit-text-stroke: 0.2px #ccc;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .map-label {
        color: #fff;
        /* Text outline for improved readability */
        -webkit-text-stroke: 1px black;
    }
}

.primary-label {
    opacity: var(--primary-label-opacity);
    transition: opacity 0.5s ease-in-out;
    /* display: var(--primary-label-display); */
}
.secondary-label {
    opacity: var(--secondary-label-opacity);
    transition: opacity 0.5s ease-in-out;
    /* display: var(--primary-label-display); */
}
.tertiary-label {
    opacity: var(--tertiary-label-opacity);
    transition: opacity 0.5s ease-in-out;
    /* display: var(--primary-label-display); */
}

</style>
