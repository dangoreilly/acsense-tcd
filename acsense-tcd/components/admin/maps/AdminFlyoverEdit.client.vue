<template>
    <div class="row border-bottom border-top my-1 py-2">
        <!-- input -->
        <div class="col-4">
            <!-- Label -->
            <div class="row my-3 border rounded-3 pb-2">
                <div class="row">
                    <div class="col">
                        <span class="fw-bold text-decoration-underline">Label</span>
                        <input 
                        type="text" 
                        class="form-control"
                        :value="flyover.label" 
                        @change.lazy="$emit('label-update', index, $event)">
                    </div>
                </div>
            </div>
            <!-- Location -->
            <div class="row my-3 border rounded-3 pb-2">
                <div class="row">
                    <span class="fw-bold text-decoration-underline">Location</span>
                    <div class="col">
                        <label class="form-label">Lat</label>
                        <input type="number" class="form-control" v-model="flyover.location[0]">
                    </div>
                    <div class="col">
                        <label class="form-label">Lng</label>
                        <input type="number" class="form-control" v-model="flyover.location[0]">
                    </div>
                </div>
            </div>
            <!-- Target -->
            <div class="row my-3 border rounded-3 pb-2">
                <div class="row">
                    <span class="fw-bold text-decoration-underline">Target</span>
                    <div class="col">
                        <label class="form-label">Lat-1</label>
                        <input type="number" class="form-control" v-model="flyover.target[0][0]">
                        <label class="form-label">Lng-1</label>
                        <input type="number" class="form-control" v-model="flyover.target[0][1]">
                    </div>
                    <div class="col">
                        <label class="form-label">Lat-2</label>
                        <input type="number" class="form-control" v-model="flyover.target[1][0]">
                        <label class="form-label">Lng-2</label>
                        <input type="number" class="form-control" v-model="flyover.target[1][1]">
                    </div>
                </div>
            </div>
            <!-- Etc -->
            <!-- Buttons for if this is a new overlay -->
             <div class="btn-group mt-2" v-if="newFlyover" role="group">
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
        <!-- Jump Arrow Placement -->
        <div class="col-4">
                <div class="container">
                <div :id="divID+'-location'" style="height: 60dvh; padding-top: 30px;"></div>
                </div>
        </div>
        <!-- Target placement -->
        <div class="col-4">
                <div class="container">
                <div :id="divID+'-target'" style="height: 60dvh; padding-top: 30px;"></div>
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
import type { Overlay, Space, Space_Type, Building, Flyover } from "~/assets/types/supabase_types";
import type { Building_Partial, Space_Partial } from '~/utils/adminMapUtils'

import { getBuildingList, addBuildings, getOverlays, addOverlays, getSpaces, addSpaces, getSpaceTypes } from '~/utils/adminMapUtils'
import Overlays from "~/pages/admin/overlays.vue";

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

export default {
    props: {
        flyover_array: {
            type: Array as () => Flyover[],
            required: true,
        },
        flyover: {
            type: Object as () => Flyover,
            required: true,
        },
        flyover_clean: {
            type: Object as () => Flyover,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        newFlyover: {
            type: Boolean,
            default: false,
        },
        staticMapElements: {
            type: Object as () => {
                buildings: Building_Partial[], 
                spaces: Space_Partial[], 
                space_types: Space_Type[],
                overlays: Overlay[],
            },
            required: true,
        }
    },
    data(){
        return {
            target_map: {} as any,
            location_map: {} as any,
            flyover_target: {} as any,
            flyover_location: {} as any,
            flyover_label: {} as any,
            divID: "overlay-edit-map",
            preserved_view: {
                target: null as any,
                location: null as any,
            },
        }
    },
    watch: {
        flyover_array: {
            handler: function(){
                this.refreshMap()
            },
            deep: true,
        },
    },
    created(){
        // Update the divID
        this.divID = "flyover-edit-map-" + this.index;
    },
    mounted(){
        this.refreshMap();
    },
    computed: {
        contentHasChanged(){
            let clean = JSON.stringify(this.flyover_clean);
            let current = JSON.stringify(this.flyover);
            return clean != current;
        },
    },
    methods:{

        async initMap(mapType: string){

            // Wait for the div to exist
            while (!document.getElementById(this.divID+'-'+mapType)) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if there is already a map object, remove if there is
            try {
                if(mapType == "target"){
                    this.preserved_view.target = {
                        center: this.target_map.getCenter(),
                        zoom: this.target_map.getZoom(),
                    }
                    // @ts-ignore
                    this.target_map.remove();
                }
                else {
                    this.preserved_view.location = {
                        center: this.location_map.getCenter(),
                        zoom: this.location_map.getZoom(),
                    }
                    // @ts-ignore
                    this.location_map.remove();
                }
            }
            catch (error) {
                console.log("No map to remove");
            }

            // Initialise the map
            let map = L.map(this.divID+'-'+mapType, {
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
            if(mapType == "target"){
                if (this.preserved_view.target){
                    map.setView(this.preserved_view.target.center, this.preserved_view.target.zoom);
                }
                else {
                    map.fitBounds(this.flyover.target);
                }
            }
            else if (this.preserved_view.location){
                map.setView(this.preserved_view.location.center, this.preserved_view.location.zoom);
            }
            else {
                map.setView(this.flyover.location, 17);
            }


            L.tileLayer(`https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png`, { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            // Add the static map elements
            addBuildings(L, map, this.staticMapElements.buildings, null, false, (active, text) => {return}, (feature, layer) => {return}, false);
            addSpaces(L, map, this.staticMapElements.spaces, this.staticMapElements.space_types, null, false, (active, text) => {return});
            addOverlays(L, map, this.staticMapElements.overlays, null, false, false);

            // Add the other flyovers
            addFlyovers(L, map, this.flyover_array, this.flyover, true);


            return map;
        },

        async refreshMap(){
            this.target_map = await this.initMap("target");
            this.location_map = await this.initMap("location");

            // Add the target rectangle
            this.addTargetResizeHandles();
            // Add the location marker
            this.addLocationMarker();
            // Add the label for the flyover
            this.addMarkerLabel();
        },

        addMarkerLabel(){
            // Add a label to the jump arrow
            let content = "<p align='center'  class='flyover-label  map-label' style='opacity:1;'>" + this.flyover.label + " </p>"
            let label = L.tooltip( {direction: "bottom", offset:[0,0], opacity:1, permanent: true})
                .setContent(content);

            // Add it to the map at the given layer location
            label.setLatLng(this.flyover.location)
                .addTo(this.location_map)
                .openTooltip();
                
            this.flyover_label = label;
        },

        addLocationMarker(){
            let location = this.flyover.location;
            let map = this.location_map;
            let target = this.flyover.target;
            this.flyover_location = JSON.parse(JSON.stringify(location));

            // Size of the image on the map, in degrees
            let width = 0.0002
            let height = 0.0003

            // Calculate the center point of flyover.target
            let targetCenter = {
                lat: (target[0][0] + target[1][0]) / 2,
                lng: (target[0][1] + target[1][1]) / 2
            };

            // Calculate the angle between targetCenter and flyover.location
            let angle = Math.atan2(location[1] - targetCenter.lng, location[0] - targetCenter.lat) * (180 / Math.PI);
            // Round to the nearest 30 degrees
            angle = Math.round(angle / 30) * 30;
            // If the angle is negative, add 360 to make it positive
            if (angle < 0) angle += 360;

            let target_rectangle_bounds = [
                [location[0] - width, location[1] - height],
                [location[0] + width, location[1] + height]
            ]

            // Add an image overlay to the map with the image corresponding to the angle
            let jumpArrow = L.imageOverlay(`/images/Chevrons/Chevron-${angle}.svg`, target_rectangle_bounds, {zIndex: 1000}).addTo(map)

            // Now draw an invisible rectangle over it that will handle the actual moving part
            let rectangle = L.rectangle(target_rectangle_bounds, {color: "#de1d0b", weight: 0, fillOpacity: 0, interactive: true}).addTo(map);
            
            // To add the draggability to the markers
            // Leaflet does not suppose draggability in the way we want, so we have to do it ourselves
            let dragging = false;
            let dragOffset = [0, 0];
            let dragMarker:any = null;

            rectangle.on('click', (e: Event) => {
                dragging = !dragging;
                dragMarker = rectangle;
                // Calculate the drag offset
                let latlng = (e as any).latlng;
                // let bounds = rectangle.getBounds();
                // let center = rectangle.getCenter();
                // let center = [_center.lat, _center.lng];
                dragOffset = [latlng.lat - this.flyover_location[0], latlng.lng - this.flyover_location[1]];

                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit("location-update", this.index, this.flyover_location)
                }
            });

            // this.flyover_location = rectangle;

            // Move the marker on mousemove
            map.on('mousemove', (e: Event) => {
                if (dragging){
                    let latlng = (e as any).latlng;
                    let lat = latlng.lat;
                    let lng = latlng.lng;
                    let currentLocation = this.flyover_target;

                    // Calculate the new location as the mouse location, plus the drag offset
                    let newLocation = [lat - dragOffset[0], lng - dragOffset[1]];
                    this.flyover_location = newLocation;

                    // Update the rectangle and the jump arrow
                    let target_rectangle_bounds = [
                        [newLocation[0] - width, newLocation[1] - height],
                        [newLocation[0] + width, newLocation[1] + height]
                    ]
                    rectangle.setBounds(target_rectangle_bounds);
                    jumpArrow.setBounds(target_rectangle_bounds);
                    // Update the label
                    this.flyover_label.setLatLng(newLocation);
                }
            });

        },

        addTargetResizeHandles(){
            let bounds = this.flyover.target;
            let map = this.target_map;

            // To add the draggability to the markers
            // Leaflet does not suppose draggability in the way we want, so we have to do it ourselves
            let dragging = false;
            let dragMarker:any = null;
            let draffingAnchor = false;
            let dragOffset = [0, 0];
            let dragBounds = null;

            // First, add a rectangle that traces the flyover
            let rectangle = L.rectangle(bounds, {color: "#de1d0b", weight: 1, fillOpacity: 0, interactive: true}).addTo(map);

            // Add the resize handles in the top left and bottom right corners, and in the center
            let marker_topLeft = L.circleMarker(bounds[0], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);
            let marker_bottomRight = L.circleMarker(bounds[1], {radius: 5, color: "#de1d0b", fillOpacity: 0.1}).addTo(map);

            // Toggle dragging on click
            marker_topLeft.on('click', (e: Event) => {
                dragging = !dragging;
                dragMarker = marker_topLeft;
                
                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit("target-update", this.index, this.latLngToBoundsArray(rectangle.getBounds()))
                }
            });
            marker_bottomRight.on('click', (e: Event) => {
                dragging = !dragging;
                dragMarker = marker_bottomRight;
                
                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit("target-update", this.index, this.latLngToBoundsArray(rectangle.getBounds()))
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
                let bounds = rectangle.getBounds();
                let center = rectangle.getCenter();
                // let center = [_center.lat, _center.lng];
                dragOffset = [latlng.lat - center.lat, latlng.lng - center.lng];

                // If dragging has ended, save the new bounds
                if (!dragging){
                    this.$emit("target-update", this.index, this.latLngToBoundsArray(rectangle.getBounds()))
                }
            });

            this.flyover_target = rectangle;

            // Move the marker on mousemove
            map.on('mousemove', (e: Event) => {
                if (dragging){
                    let latlng = (e as any).latlng;
                    let lat = latlng.lat;
                    let lng = latlng.lng;
                    let bounds = this.latLngToBoundsArray(this.flyover_target.getBounds());

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
                    rectangle.setBounds(newBounds);
                    marker_topLeft.setLatLng(newBounds[0]);
                    marker_bottomRight.setLatLng(newBounds[1]);

                    // this.checkBoundsHaveChanged()

                    // console.log(`Bounds have changed: ${this.boundsHaveChanged}`);
                }
            });
        },

        emitFlyoverUpdate(){

            // Create a new flyover object
            let flyover = {
                label: this.flyover.label,
                // location: this.flyover_location.,
                target: this.latLngToBoundsArray(this.flyover_target.getBounds()),
            } as Flyover;

            console.log(flyover)

            this.$emit('flyover-marker-update', this.flyover);
        },

        // checkBoundsHaveChanged(){
        //     // Check if the bounds have changed
        //     this.boundsHaveChanged = JSON.stringify(this.overlay.bounds) != JSON.stringify(this.latLngToBoundsArray(this.overlay_object.getBounds()))
        // },

        latLngToBoundsArray(latlngBounds: L.LatLngBounds){
            return [[latlngBounds._northEast.lat, latlngBounds._northEast.lng],[latlngBounds._southWest.lat, latlngBounds._southWest.lng]];
        },

        cancelChanges(){

            // Recenter the map on the overlay
            // this.target_map.fitBounds(this.flyover_cl.bounds);
            // Cancel the changes
            this.$emit('flyover-edit-cancel');
        },
    }
}
</script>