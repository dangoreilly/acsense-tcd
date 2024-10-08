<template>
    <div class="row border-bottom border-top my-1 py-2">
        <!-- input -->
        <div class="col-4">
            <!-- Files -->
            <!-- Lightmode -->
            <label class="form-label" for="light-overlay">Lightmode Overlay (Default)</label>
            <div class="input-group mx-0 px-0 mb-2">
                <input :id="'light-'+index" type="file" class="form-control" 
                @change="handleLightOverlaySelect">
                <button class="btn" type="button"
                :class="(overlay.url == overlay_clean.url) ? 'btn-outline-secondary' : 'btn-warning'"
                :disabled="overlay.url == overlay_clean.url"
                @click="$emit('overlay-url-reset', 'light', index);">
                Reset</button>
            </div>
            <!-- Add a download link for the current overlay, if it exists -->
            <a class="text-muted" :href="overlay_clean.url" target="none">Current Overlay</a>
            <!-- Darkmode -->
            <label class="form-label" for="light-overlay">Darkmode Overlay (Optional)</label>
            <div class="input-group mx-0 px-0 mb-2">
                <input :id="'dark-'+index" type="file" class="form-control" 
                @change="handleDarkOverlaySelect">
                <button class="btn" type="button"
                :class="(overlay.url_dark == overlay_clean.url_dark) ? 'btn-outline-secondary' : 'btn-warning'"
                :disabled="overlay.url_dark == overlay_clean.url_dark"
                @click="$emit('overlay-url-reset', 'dark', index);">
                Reset</button>
            </div>
            <!-- Add a download link for the current overlay, if it exists -->
            <a class="text-muted" v-if="overlay_clean.url_dark" :href="overlay_clean.url_dark" target="none">Current Overlay</a>
            <!-- Selection -->
             <div class="row">
                <div class="col">
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
                </div>
                <div class="col" v-if="overlay_object?.options">
                    <!-- Opacity Control -->
                    <label class="form-label">Preview Opacity</label>
                    <input type="range" class="form-range"
                    min="0.1" max="1" step="0.1" 
                    v-model="preview_opacity"
                    @change="overlay_object.setOpacity(preview_opacity)">
                </div>
             </div>
            
            <!-- Bounds -->
            <div class="row my-3 border rounded-3 pb-2">
                <div class="row">
                    <span class="fw-bold text-decoration-underline">Bounds</span>
                    <div class="col">
                        <label class="form-label">Lat-1</label>
                        <input type="number" class="form-control" v-model="overlay.bounds[0][0]">
                        <label class="form-label">Lng-2</label>
                        <input type="number" class="form-control" v-model="overlay.bounds[0][1]">
                    </div>
                    <div class="col">
                        <label class="form-label">Lat-2</label>
                        <input type="number" class="form-control" v-model="overlay.bounds[1][0]">
                        <label class="form-label">Lng-2</label>
                        <input type="number" class="form-control" v-model="overlay.bounds[1][1]">
                    </div>
                </div>
                <!-- <div class="row">
                    <button class="btn btn-primary m-2" type="button" 
                    :disabled="!boundsHaveChanged"
                    @click="$emit('bounds-save', overlay.id, latLngToBoundsArray(overlay_object.getBounds()))">
                        Save Bounds</button>
                </div> -->
            </div>
            <!-- Etc -->
            <!-- Buttons for if this is a new overlay -->
             <div class="btn-group mt-2" v-if="newOverlay" role="group">
                <button 
                type="button" 
                class="btn" 
                :class="contentHasChanged ? 'btn-success' : 'btn-outline-secondary'"
                @click="$emit('overlay-create')"
                :disabled="!contentHasChanged">
                    Upload new overlay
                </button>

                <button 
                type="button" 
                class="btn btn-warning"
                @click="cancelChanges()">
                    Cancel
                </button>
            </div>

            <!-- Buttons for if this is an existing overlay being modified -->
            <div class="btn-group mt-2" v-else role="group">
                <button 
                type="button" 
                class="btn" 
                :class="contentHasChanged ? 'btn-success' : 'btn-outline-secondary'"
                @click="$emit('overlay-update')"
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
                @click="$emit('overlay-delete');">
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
        overlay_array: {
            type: Array as () => Overlay[],
            required: true,
        },
        overlay: {
            type: Object as () => Overlay,
            required: true,
        },
        overlay_clean: {
            type: Object as () => Overlay,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        newOverlay: {
            type: Boolean,
            default: false,
        }
    },
    data(){
        return {
            map: {} as any,
            overlay_object: {} as any,
            mode: "light",
            divID: "overlay-edit-map",
            boundsHaveChanged: false,
            preview_opacity: 0.5,
            preserved_view: null as any,
        }
    },
    watch: {
        overlay: {
            handler: function(){
                this.refreshMap().then(() => {
                    this.checkBoundsHaveChanged();
                });
                // this.checkBoundsHaveChanged()

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
        this.divID = "overlay-edit-map-" + this.index;
    },
    mounted(){
        this.refreshMap();
    },
    computed: {
        contentHasChanged(){
            let url_match = JSON.stringify(this.overlay.url) == JSON.stringify(this.overlay_clean.url);
            let dark_match = JSON.stringify(this.overlay.url_dark) == JSON.stringify(this.overlay_clean.url_dark);
            let bounds_match = JSON.stringify(this.overlay.bounds) == JSON.stringify(this.overlay_clean.bounds);

            // For new overlays, we only care if it has a default overlay
            if (this.newOverlay){
                return !(url_match);
            }
            return !(url_match && dark_match && bounds_match);
        },
    },
    methods:{

        async initMap(){

            // Wait for the div to exist
            while (!document.getElementById(this.divID)) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if there is already a map object, remove if there is
            try {
                this.preserved_view = {
                    center: this.map.getCenter(),
                    zoom: this.map.getZoom(),
                }
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
            })
            
            // Check if there's a preserved view
            if (this.preserved_view){
                map.setView(this.preserved_view.center, this.preserved_view.zoom);
            }
            else {
                map.fitBounds(this.overlay.bounds);
            }


            L.tileLayer(`https://{s}.basemaps.cartocdn.com/${this.mode == "ref" ? "light" : this.mode}_nolabels/{z}/{x}/{y}.png`, { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            this.map = map;
        },

        async refreshMap(){
            await this.initMap();

            // Add the other overlays
            addOverlays(L, this.map, this.overlay_array, this.overlay, true, this.mode === "dark");

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
            this.overlay_object = L.imageOverlay(url, this.overlay.bounds, {opacity: this.preview_opacity}).addTo(this.map);
        },

        addOverlayResizeHandles(){
            // let bounds = JSON.parse(JSON.stringify(this.overlay.bounds)) as [[number, number], [number, number]];
            let bounds = this.latLngToBoundsArray(this.overlay_object.getBounds());
            let overlay = this.overlay_object;
            let map = this.map;

            // To add the draggability to the markers
            // Leaflet does not suppose draggability in the way we want, so we have to do it ourselves
            let dragging = false;
            let dragMarker:any = null;
            let draffingAnchor = false;
            let dragOffset = [0, 0];
            let dragBounds = null;

            // First, add a rectangle that traces the overlay
            let rectangle = L.rectangle(bounds, {color: "#de1d0b", weight: 1, fillOpacity: 0, interactive: true}).addTo(map);

            // Add the resize handles in the top left and bottom right corners, and in the center
            let marker_topLeft = L.circleMarker(bounds[0], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            let marker_bottomRight = L.circleMarker(bounds[1], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            let center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
            // let marker_center = L.circleMarker([center[0] + dragOffset[0], center[1] + dragOffset[1]], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);

            // Toggle dragging on click
            marker_topLeft.on('click', (e: Event) => {
                dragging = !dragging;
                dragMarker = marker_topLeft;
                
                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit('bounds-save', this.index, this.latLngToBoundsArray(this.overlay_object.getBounds()))
                }
            });
            marker_bottomRight.on('click', (e: Event) => {
                dragging = !dragging;
                dragMarker = marker_bottomRight;
                
                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit('bounds-save', this.index, this.latLngToBoundsArray(this.overlay_object.getBounds()))
                }
            });
            rectangle.on('click', (e: Event) => {
                // Don't confuse the two modes
                if (draffingAnchor){
                    return;
                }
                dragging = !dragging;
                dragMarker = rectangle;
                // Calculate the drag offset
                let latlng = (e as any).latlng;
                let bounds = this.latLngToBoundsArray(this.overlay_object.getBounds());
                let center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];
                dragOffset = [latlng.lat - center[0], latlng.lng - center[1]];

                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit('bounds-save', this.index, this.latLngToBoundsArray(this.overlay_object.getBounds()))
                    console.log(`Bounds have changed: ${this.boundsHaveChanged}`);
                }
            });

            // Move the marker on mousemove
            map.on('mousemove', (e: Event) => {
                if (dragging){
                    let latlng = (e as any).latlng;
                    let lat = latlng.lat;
                    let lng = latlng.lng;
                    let bounds = this.latLngToBoundsArray(this.overlay_object.getBounds());

                    // Calculate the new bounds
                    let newBounds = JSON.parse(JSON.stringify(bounds)) as [[number, number], [number, number]];
                    if (dragMarker === marker_topLeft){
                        newBounds[0] = [lat, lng];
                    }
                    else if (dragMarker === marker_bottomRight){
                        newBounds[1] = [lat, lng];
                    }
                    else if (dragMarker === rectangle){
                        // We need to move based on the anchor position rather than the true centre
                        let center = [
                            ((bounds[0][0] + bounds[1][0]) / 2) + dragOffset[0],
                            ((bounds[0][1] + bounds[1][1]) / 2) + dragOffset[1]
                        ];
                        let lat_diff = lat - center[0];
                        let lng_diff = lng - center[1];
                        newBounds[0] = [bounds[0][0] + lat_diff, bounds[0][1] + lng_diff];
                        newBounds[1] = [bounds[1][0] + lat_diff, bounds[1][1] + lng_diff];
                    }

                    // Update the overlay
                    overlay.setBounds(newBounds);
                    rectangle.setBounds(newBounds);
                    marker_topLeft.setLatLng(newBounds[0]);
                    marker_bottomRight.setLatLng(newBounds[1]);

                    this.checkBoundsHaveChanged()

                    // console.log(`Bounds have changed: ${this.boundsHaveChanged}`);
                }
            });
        },

        checkBoundsHaveChanged(){
            // Check if the bounds have changed
            this.boundsHaveChanged = JSON.stringify(this.overlay.bounds) != JSON.stringify(this.latLngToBoundsArray(this.overlay_object.getBounds()))
        },

        latLngToBoundsArray(latlngBounds: L.LatLngBounds){
            return [[latlngBounds._northEast.lat, latlngBounds._northEast.lng],[latlngBounds._southWest.lat, latlngBounds._southWest.lng]];
        },

        handleLightOverlaySelect(evt: Event){
            // Get the file from the input
            const target = evt.target as HTMLInputElement;
            if (target && target.files) {
                const file = target.files[0];
                // Update the overlay
                let url = URL.createObjectURL(file);
                this.$emit('overlay-url-edit', this.index, "light", url);
            }
        },

        handleDarkOverlaySelect(evt: Event){
            // Get the file from the input
            const target = evt.target as HTMLInputElement;
            if (target && target.files) {
                const file = target.files[0];
                // Update the overlay
                let url = URL.createObjectURL(file);
                this.$emit('overlay-url-edit', this.index, "dark", url);
            }
        },

        cancelChanges(){

            // Recenter the map on the overlay
            this.map.fitBounds(this.overlay.bounds);
            // Cancel the changes
            this.$emit('overlay-edit-cancel');
        },
    }
}
</script>