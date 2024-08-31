<template>
    <div class="map-section border-top border-1 border-black pt-3 mt-3" v-if="building.geometry">
        
        <!-- Inputs -->
        <div style="grid-area: 'input';" class="me-2">    
            <!-- Lat and long inputs -->
            <!-- <div class="mb-3">
                <label for="coordinates">Building Shape</label>
                <textarea 
                class="form-control" 
                id="coordinates" 
                rows="4" 
                :value="JSON.stringify(building.geometry.coordinates)">
                </textarea>
                <button 
                type="button" 
                class="btn btn-sm btn-primary mx-1 mt-1" 
                @click="console.print('Geometry Update')">
                    Geometry Editor
                </button>
                <button 
                title="Warning: Confirm new geometry renders as expected in preview before saving"
                type="button" 
                class="btn btn-sm btn-warning mx-1 mt-1" 
                @click="console.print('Geometry Update')">
                    Update geometry
                </button>
            </div> -->
            <!-- Views -->
            <div>
                <span class="d-block">Center map</span>
                <button 
                type="button" 
                class="btn btn-sm btn-outline-primary mx-1" 
                @click="centerViewOnCampus()">
                    Campus
                </button>

                <button 
                type="button" 
                class="btn btn-sm btn-outline-primary mx-1" 
                @click="centerViewOnBuilding()">
                    Building
                </button>
            </div>
            <!-- Labels -->
            <div class="mt-3">
                <label for="coordinates">Primary Label</label>
                <input  
                :disabled="!checkPermission('map_label_1')"
                @input="updateCurrentBuildingLabels()"
                type="text" class="form-control mb-2" v-model="building.map_label_1">
                
                    <label for="coordinates">Secondary Label</label>
                <input  
                :disabled="!checkPermission('map_label_2')"
                @input="updateCurrentBuildingLabels()"
                type="text" class="form-control" v-model="building.map_label_2">
                
                    <!-- <label for="coordinates">Tertiary Label</label>
                <input  
                :disabled="!checkPermission('map_label_3')"
                    type="text" class="form-control" v-model="building.map_label_3"> -->
            </div>
            <!-- Display Settings -->
            <div class="form-check mb-3 mt-3" title="Select for satellite buildings that are not already included in an overlay">
                <input  
                :disabled="!checkPermission('always_display')"
                class="form-check-input" type="checkbox" v-model="building.always_display" id="always_display">
                <label class="form-check-label" for="always_display">
                    Always Display
                </label>
            </div>
        </div>
        <!-- Map -->
        <div style="grid-area: 'input';">
            <span class="fw-bold">{{hover.active ? hover.space : "Hover over space or building to see what it is"}}</span>
            <div id="building-placement-map" style="height: 600px; padding-top: 30px; "></div>
        </div>
    </div>
</template>
    
<script lang="ts">
    // @ts-ignore
    import * as L from "leaflet";
    import '~/assets/css/leaflet.css'
    import "@geoman-io/leaflet-geoman-free";
    import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
    import 'leaflet.fullscreen';
    import 'leaflet.fullscreen/Control.FullScreen.css';
    L.PM.setOptIn(false);
    
    import { addBuildings, addLabelsToMap, addOverlays, addSpaces, addZoomHandling } from '~/utils/adminMapUtils'
    import type { Building, Space, Space_Type, Overlay } from '~/assets/types/supabase_types'
    import type { Building_Partial, Space_Partial } from "~/utils/adminMapUtils";
    
    
    // The view when the map is first opened. Defined as what looks good on mobile, because 
    // that automatically looks alright on desktop, but not the other way around.
    const campusBounds = [
                        [53.34631744552114, -6.255028994837502],
                        [53.34163690316516, -6.258745992827823]
                    ];
    
    export default {
        props: {
            building: {
                type: Object as () => Building,
                required: true
            },
            checkPermission: {
                type: Function,
                required: true
            },
            buildings_list: {
                type: Array as () => Building_Partial[],
                required: true
            },
            space_types: {
                type: Array as () => Space_Type[],
                required: true
            },
            spaces_list: {
                type: Array as () => Space_Partial[],
                required: true
            },
            overlays: {
                type: Array as () => Overlay[],
                required: true
            }
        },
        data() {
            return {
                map: {} as any,
                hover: {
                    active: false,
                    space: ''
                },
                buildingLabels: { primary_label: {} as any, secondary_label: {} as any, tertiary_label: {} as any },
            }
        },
        watch: {
            building: {
                handler: function(){
                    // Update the map when the building changes
                    this.Init();
                },
                deep: true
            }
        },
        mounted() {
            // console.log(this.$refs.welcome);
            // Check if the user has indicated they want to skip the welcome modal
            this.Init();
        },
    
        methods: {
            async Init(){
                await this.InitMap();

                // addBuildings(L, this.map, this.buildings_list, null, true, (active, space) => {
                //     this.hover.active = active;
                //     this.hover.space = space;
                // });
                addSpaces(L, this.map, this.spaces_list, this.space_types, null, true, (active, space) => {
                    this.hover.active = active;
                    this.hover.space = space;
                });
                addOverlays(L, this.map, this.overlays, null, false);

                // Move the view to the building
                this.centerViewOnBuilding();
            },
    
            async InitMap(){
    
                // Wait for the DOM elements to be created
                while (document.getElementById('building-placement-map') == null) {
                    console.log("Waiting for map element to be created")
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
    
                // Check if there is already a map object, remove if there is
                try {
                    this.map.remove();
                }
                catch (error) {
                    console.log("No map to remove");
                }
    
                // Initialise the map
                let map = L.map('building-placement-map', {
                    zoomSnap: 0.25,
                    zoomDelta: 0.25,
                    maxZoom: 20,
                    renderer: L.canvas({padding: 1}),
                    fullscreenControl: true,
                    fullscreenControlOptions: {
                        position: 'topleft'
                    },

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

    
                // // Add the editable building to the map
                // this.addCurrentBuildingToMap(map);
                // // Add the editable labels to the map
                // this.addCurrentBuildingLabelsToMap(map);
                // Add the other buildings to the map
                addBuildings(L, map, JSON.parse(JSON.stringify(this.buildings_list)), null, true, (active, space) => {
                    this.hover.active = active;
                    this.hover.space = space;
                });

                // Add zoom handling
                addZoomHandling(map);
    
                this.map = map;
    
            },
            updateCurrentBuildingLabels(){
                // Remove the current labels from the map
                this.buildingLabels.primary_label?.remove();
                this.buildingLabels.secondary_label?.remove();
                this.buildingLabels.tertiary_label?.remove();
                // Add the new labels to the map
                this.addCurrentBuildingLabelsToMap(this.map);
            },

            centerViewOnCampus(){
                // When called, update the map to be centred on the campus
                this.map.fitBounds(campusBounds);
            },

            centerViewOnBuilding(){
                // When called, update the map to be centred on the building
                // @ts-ignore
                this.map.setView(getGeometricCenter(this.building.geometry.coordinates), 18);
            },

            addCurrentBuildingLabelsToMap(map: any){
                // @ts-ignore
                this.buildingLabels = makeLabels(L, map, this.building);
            },

            addCurrentBuildingToMap(map: any){
                // Add a new layer to the map for the building
                let building_geojson = {
                    "type": "Feature",
                    "geometry": {
                        // @ts-ignore
                        "coordinates": this.building.geometry.coordinates,
                        "type": "Polygon"
                    }
                }
                let buildingLayer = L.geoJSON(building_geojson, {
                    style: {
                        color: '#E53397',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.75,
                        fillColor: "#E53397"
                    },
                    // onEachFeature: function(feature, layer) {
                    //     layer.options.pmIgnore = false;
                    //     L.PM.reInitLayer(layer);
                    //     console.log(layer);
                    // }
                })
                // buildingLayer.options.pmIgnore = false;
                // L.PM.reInitLayer(buildingLayer);
                
                buildingLayer.addTo(map);

                // this.currentBuildingLayer = buildingLayer;
            },
        }
    };
</script>

<style>
.map-section{
    /* Define the grid to give enough room for the map */
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-areas: "input map";
    grid-template-rows: auto;
}
</style>