<template>
    <div class="row border-bottom border-top my-1 py-2">
        <!-- input -->
        <div class="col-4">
            <!-- Files -->
            <!-- Lightmode -->
            <label class="form-label" for="light-overlay">Lightmode Overlay (Default)</label>
            <div class="input-group mx-0 px-0 mb-2">
                <input :id="'light-'+overlay.id" type="file" class="form-control" 
                @change="handleLightOverlaySelect">
                <button class="btn" type="button"
                :class="(overlay.url == overlay_clean.url) ? 'btn-outline-secondary' : 'btn-warning'"
                :disabled="overlay.url == overlay_clean.url"
                @click="resetLightOverlay()">
                Reset</button>
            </div>
            <!-- Darkmode -->
            <label class="form-label" for="light-overlay">Darkmode Overlay (Optional)</label>
            <div class="input-group mx-0 px-0 mb-2">
                <input :id="'dark-'+overlay.id" type="file" class="form-control" 
                @change="handleDarkOverlaySelect">
                <button class="btn" type="button"
                :class="(overlay.url_dark == overlay_clean.url_dark) ? 'btn-outline-secondary' : 'btn-warning'"
                :disabled="overlay.url_dark == overlay_clean.url_dark"
                @click="resetDarkOverlay()">
                Reset</button>
            </div>
            <!-- Selection -->
            <label class="form-label">Display mode</label>
            <div class="input-group mx-0 px-0">

                <button class="btn btn-light border" type="button"
                :disabled="mode == 'light'"
                @click="mode = 'light'">
                Light</button>

                <button class="btn btn-dark" type="button"
                :disabled="mode == 'dark'"
                @click="mode = 'dark'">
                Dark</button>

                <!-- <button class="btn btn-outline-primary" type="button"
                :disabled="mode == 'ref'"
                @click="mode = 'ref'">
                Reference Marks</button> -->

            </div>
            <!-- Etc -->
            <div class="btn-group mt-4" role="group">
                <button 
                type="button" 
                class="btn" 
                :class="contentHasChanged ? 'btn-success' : 'btn-outline-secondary'"
                @click="updateContent()"
                :disabled="!contentHasChanged">
                    Save Changes
                </button>

                <button 
                type="button" 
                class="btn"
                :class="contentHasChanged ? 'btn-warning' : 'btn-outline-secondary'"
                @click="cancelChanges()"
                :disabled="!contentHasChanged">
                    Cancel
                </button>

                <button 
                type="button" 
                class="btn btn-danger"
                @click="deleteOverlay()">
                    Delete
                </button>
            </div>
        </div>
        <!-- Preview -->
        <div class="col-8">
            <!-- Map with layer switcher -->
                <div class="container">
                <div :id="divID" style="height: 60dvh; padding-top: 30px;"></div>
                </div>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import * as L from "leaflet";
import '~/assets/css/leaflet.css'
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import type { Overlay, Space, Space_Type, Building } from "~/assets/types/supabase_types";
import type { Building_Partial, Space_Partial } from '~/utils/adminMapUtils'

import { getBuildingList, addBuildings, getOverlays, addOverlays, getSpaces, addSpaces, getSpaceTypes } from '~/utils/adminMapUtils'

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

export default {
    props: {
        overlay: {
            type: Object as () => Overlay,
            required: true,
        },
        overlay_clean: {
            type: Object as () => Overlay,
            required: true,
        },
    },
    data(){
        return {
            map: {} as any,
            overlay_object: {} as any,
            mode: "light",
            divID: "overlay-edit-map",
        }
    },
    watch: {
        overlay: {
            handler: function(){
                this.refreshMap();
            },
            deep: true,
        },
        mode: {
            handler: function(){
                this.refreshMap();
            },
            deep: true,
        }
    },
    created(){
        // Update the divID
        this.divID = "overlay-edit-map-" + this.overlay.id;
    },
    mounted(){
        this.refreshMap();
    },
    computed: {
        contentHasChanged(){
            let url_match = JSON.stringify(this.overlay.url) == JSON.stringify(this.overlay_clean.url);
            let dark_match = JSON.stringify(this.overlay.url_dark) == JSON.stringify(this.overlay_clean.url_dark);
            let bounds_match = JSON.stringify(this.overlay.bounds) == JSON.stringify(this.overlay_clean.bounds);
            return !(url_match && dark_match && bounds_match);
        }
    },
    methods:{

        async initMap(){

            // Wait for the div to exist
            while (!document.getElementById(this.divID)) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if there is already a map object, remove if there is
            try {
                // @ts-ignore
                this.map.remove();
            }
            catch (error) {
                console.log("No map to remove");
            }

            // Initialise the map
            let map = L.map(this.divID, {
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxZoom: 20,
                renderer: L.canvas({padding: 1}),
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
            }).fitBounds(this.overlay.bounds);


            L.tileLayer(`https://{s}.basemaps.cartocdn.com/${this.mode == "ref" ? "light" : this.mode}_nolabels/{z}/{x}/{y}.png`, { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            this.map = map;
        },

        async refreshMap(){
            await this.initMap();

            // Figure out if we're showing the reference marks or the overlay
            if (this.mode === "ref"){
                return;
            }
            else {
                // Add the overlay to the map
                this.addOverlay(this.mode === "dark");
            }

            this.addOverlayResizeHandles();

        },

        addOverlay(darkmode: boolean){
            // Add the overlay to the map

            // Figure out if the dark or light mode should be used
            let url = this.overlay.url;
            // If darkmode is enabled and the dark overlay exists, use it
            if (darkmode && this.overlay.url_dark != null && this.overlay.url_dark.length > 0){
                url = this.overlay.url_dark;
            }

            // Save the overlay object so it can be manipulated later
            this.overlay_object = L.imageOverlay(url, this.overlay.bounds, {opacity: 0.5}).addTo(this.map);
        },

        addOverlayResizeHandles(){
            let bounds = JSON.parse(JSON.stringify(this.overlay.bounds)) as [[number, number], [number, number]];
            let overlay = this.overlay_object;
            let map = this.map;

            // First, add a rectangle that traces the overlay
            let rectangle = L.rectangle(bounds, {color: "#de1d0b", weight: 1, fillOpacity: 0, }).addTo(map);

            // Add the resize handles in the top left and bottom right corners, and in the center
            let marker_topLeft = L.circleMarker(bounds[0], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            let marker_bottomRight = L.circleMarker(bounds[1], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            let center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
            let marker_center = L.circleMarker(center, {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            
        },

        handleLightOverlaySelect(e: Event){
            // Handle the selection of a new overlay
        },

        handleDarkOverlaySelect(e: Event){
            // Handle the selection of a new overlay
        },

        resetLightOverlay(){
            // Reset the overlay to the original
        },

        resetDarkOverlay(){
            // Reset the overlay to the original
        },

        updateContent(){
            // Update the content
        },

        cancelChanges(){
            // Cancel the changes
        },

        deleteOverlay(){
            // Delete the overlay
        }
        
    }
}
</script>