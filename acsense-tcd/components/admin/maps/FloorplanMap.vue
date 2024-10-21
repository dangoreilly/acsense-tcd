<template>
    <div>
        <!-- Leaflet instance -->
        <div id="internal-map" style="height: 0px; padding-top: 30px;">
        </div>
        <!-- Toast in the bottom left corner to display what the current space is -->
        <div class="toast-container p-3 start-50 translate-middle-x space-name-toast bottom-0"
        :style="space_name_toast_showing ? 'opacity: 1;' : 'opacity: 0;'">
            <div class="toast show">
                <div class="toast-body">
                    {{ space_being_hovered_on  }}
                </div>
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
import type { Building, Space, Floorplan, Nav_Node, Space_Type, Floorplan_Template, Nav_Node_Template } from '~/assets/types/supabase_types';
import { build } from "nuxt";
import { building } from "~/assets/testObjects";

export default {
    props: {
        floors: {
            type: Array as () => Floorplan[],
            required: true,
        },
        spaces: {
            type: Array as () => Space[],
            required: true,
        },
        navigationNodes: {
            type: Array as () => Nav_Node[],
            required: true,
        },
        building: {
            type: Object as () => Building,
            required: true,
        }
    },
    data() {
        return {
            map: {} as any,
            activeFloor: 0,
            activeFloor_object: {},
            space_being_hovered_on: "",
            space_name_toast_showing: false,
            floor_layers_object: {} as any,
        };
    },
    methods: {
        
        moveToFloor(floorIndex: number){
                // Move the map to the floor with the given index
                // First, find the label of the floor as that is how
                // they are stored in the layer control
                let floorLabel = this.floors[floorIndex].label;
                // Then, get the layer group from the floor_layers_object
                let floorLayer = this.floor_layers_object[floorLabel];

                // Then remove all layers from the map
                this.map.eachLayer(function (layer: any) {
                    layer.remove();
                });
                // Then add the layer group to the map
                floorLayer.addTo(this.map);
            },
        // Create the map
        mapInit(){
            // Delete with the leaflet method, if it exists
            try {
                // @ts-ignore
                this.map.remove();
            }
            catch (error) {
                // We don't care if it fails, 
                // it just means this is the first time the map is being created
            }

            // Make space for the map
            let map_container = document.getElementById("internal-map");
            // @ts-ignore
                map_container.style.height = "600px";

            // Make sure there are floors to add
            // If there aren't, don't init the map
            if (this.floors.length == 0) {
                alert("No map to display");
                return;
            }

            const BUFFER = 200

            // Create the new map
            let map_size = [[0,0], this.building.internal_map_size]
            // Get the bounds by adding padding around the edges
            // Without this padding, it's not always possible to zoom into the edges
            let map_bounds = [[-BUFFER, -BUFFER],
                [this.building.internal_map_size[0] + BUFFER,
                this.building.internal_map_size[1] + BUFFER]
            ]

            let map_center = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2]

            let map = L.map('internal-map', {
                crs: L.CRS.Simple,
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxBounds: map_bounds,
                maxZoom: 20,
                minZoom: -1,
                renderer: L.canvas({padding: 1})
            }).fitBounds(map_size);// map_center, 1);

            // var info = L.control({position:"bottomleft"});

                // Cheap debug reporting
            map.on('click', function(e: Event) {
                let cheapDebugObject = {
                    // @ts-ignore
                    latlng: e.latlng,
                    bounds: map.getBounds(),
                    zoom: map.getZoom(),
                    center: map.getCenter()
                }
        
                console.log(cheapDebugObject);
                
            });

            this.map = map;

            // Add floors to the map
            this.addFloorsToMap(map_size);
            // Add spaces to the map
            this.addSpacesToMap();
            // Add navigation nodes to the map
            this.addNavNodesToMap();
            
        },

        addFloorsToMap(bounds: number[][]){

            // Init the floor layers object
            // The floor layers array needs to be stored in the vue instance
            // Otherwise it will be garbage collected and the layer functions can't be called later
            this.floor_layers_object = {};

            // Create a the floors
            for (let i = 0; i < this.floors.length; i++) {
                const floor = this.floors[i];
                // Create a layer group for each floor
                // Add the floor to the layer group
                // Add the layer group to the map
                let floor_layer = L.layerGroup( [L.imageOverlay(floor.url, bounds)] )
                this.floor_layers_object[floor.label] = floor_layer;

                // If this is the entry floor, add it to the map
                if (floor.isEntry) {
                    floor_layer.addTo(this.map);
                }

                // Add an event listener to the layer group
                // When the layer is added to the map, set the active floor to this floor
                floor_layer.on('add', () => {
                    this.activeFloor = i;
                    this.activeFloor_object = floor_layer;
                    console.log("Active floor set to: " + this.activeFloor)
                });
            }

            // Set the active floor to the entry floor
            // this.activeFloor = this.EntryFloor;

            // Add the layer control to the map
            let layers_control = L.control({position:"topright"});

            // TODO: Add a check for if mobile, and collapse the layer control
            layers_control = L.control.layers(this.floor_layers_object, null, {collapsed: false});
            
            layers_control.addTo(this.map);

        },
        addSpacesToMap(){

            // Cycle through all the spaces
            // Add a marker to the map for each space
            // On the layer specified by the floor

            for (let i = 0; i < this.spaces.length; i++) {
                
                // const space = this.spaces[i];

                // Create an icon for the space
                let icon = L.icon({
                    iconUrl: this.spaces[i].icon,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, -25],
                });

                // Set the starting position for the marker
                // If the space has a location, use that, otherwise use the center of the floor
                let marker_position = [];

                // Check equivalence to [0,0] because the array is not being compared correctly
                let equivalence = (this.spaces[i].location_internal[0] == 0) && (this.spaces[i].location_internal[1] == 0);

                if (equivalence)
                    marker_position = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
                else
                    marker_position = this.spaces[i].location_internal;
                
                // Create a draggable marker for the space with the icon
                let marker = L.marker(marker_position, {
                    icon: icon, 
                    draggable: true,
                    bubblingMouseEvents: false,
                });

                // Add an event listener to the marker, to update the space location when it is dragged
                marker.on('dragend', (e: any) => {
                    // Get the new coordinates
                    let new_coordinates = e.target.getLatLng();
                    // Update the space location
                    this.spaces[i].location_internal = [new_coordinates.lat, new_coordinates.lng];
                });

                // create a local function for updating the toast value
                let updateToast = () => {
                    // Get the name of the space
                    let space_name = this.spaces[i].name;
                    // Set the toast value
                    this.space_being_hovered_on = space_name;
                    // Set the toast to show
                    this.space_name_toast_showing = true;
                }
                // And a local function for setting the toast to not display
                let clearToast = () => {
                    this.space_name_toast_showing = false;
                }

                // Add an event listener to update the toast when the mouse hovers over the marker
                marker.on('mouseover', (e: any) => {
                    updateToast();
                });
                // And close it on mouseout
                marker.on('mouseout', (e: any) => {
                    clearToast();
                });
                
                // Add the marker to the map
                // marker.addTo(this.map);

                // Get the name of the floor for this space (this is how they're stored in the layer control)
                let floor_label = this.floors[this.spaces[i].floor].label;

                // Add the marker to the layer for the floor
                marker.addTo(this.floor_layers_object[floor_label]);
            }

        },

        addNavNodesToMap(){
            // Cycle through all the navigation nodes
            // Add a marker to the map for each node
            // On the layer specified by the floor

            // First, set up the icon for the nodes

            // Stair up icon
            let stair_up_icon = L.icon({
                iconUrl: "/images/icons/stair-up.svg",
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            // Stair down icon
            let stair_down_icon = L.icon({
                iconUrl: "/images/icons/stair-down.svg",
                iconSize: [30, 30],
                iconAnchor: [15, 15],
            });

            // Lift icon
            let lift_icon = L.icon({
                iconUrl: "/images/icons/lift.svg",
                iconSize: [50, 50],
                iconAnchor: [25, 25],
            });

            // Create a marker for each node
            for (let i = 0; i < this.navigationNodes.length; i++){

                // create a local function for updating the toast value
                let updateToast = () => {
                    // Get the name of the space
                    let node_name = this.navigationNodes[i].label;
                    // Set the toast value
                    this.space_being_hovered_on = node_name;
                    // Set the toast to show
                    this.space_name_toast_showing = true;
                }
                // And a local function for setting the toast to not display
                let clearToast = () => {
                    this.space_name_toast_showing = false;
                }

                // Check what sort of node it is
                if (this.navigationNodes[i].node_type == "lift") {
                    // If it's a lift, use the lift icon
                    let marker = L.marker(this.navigationNodes[i].location_up, {
                        icon: lift_icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });

                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker.on('dragend', (e: any) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_up = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker.on('mouseover', (e: any) => {
                        updateToast();
                    });
                    // And close it on mouseout
                    marker.on('mouseout', (e: any) => {
                        clearToast();
                    });

                    // Add the lift marker to ever floor it's on
                    for (let j = 0; j < this.navigationNodes[i].presence.length; j++) {
                        if (this.navigationNodes[i].presence[j]) {
                            // Get the name of the floor for this space (this is how they're stored in the layer control)
                            let floor_label = this.floors[j].label;
                            // Add the marker to the layer for the floor
                            marker.addTo(this.floor_layers_object[floor_label]);
                        }
                    }


                }
                else if (this.navigationNodes[i].node_type == "stairs"){
                    // If it's a stairs, create two markers, one for up and one for down
                    // Stairs UP
                    let marker_up = L.marker(this.navigationNodes[i].location_up, {
                        icon: stair_up_icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });
                    
                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker_up.on('dragend', (e: any) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_up = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker_up.on('mouseover', (e: any) => {
                        updateToast();
                    });
                    // And close it on mouseout
                    marker_up.on('mouseout', (e: any) => {
                        clearToast();
                    });

                    // ====================================================================================================
                    // Stairs DOWN
                    let marker_down = L.marker(this.navigationNodes[i].location_down, {
                        icon: stair_down_icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });
                    
                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker_down.on('dragend', (e: any) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_down = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker_down.on('mouseover', (e: any) => {
                        updateToast();
                    });
                    // And close it on mouseout
                    marker_down.on('mouseout', (e: any) => {
                        clearToast();
                    });

                    // ====================================================================================================
                    // Adding stairs to map
                    // UP stairs need to be added to every floor they're on, except the topmost floor they're on
                    // DOWN stairs need to be added to every floor they're on, except the bottommost floor they're on

                    // Calculate the topmost floor the stairs are on
                    let topmost_floor = 0;
                    for (let j = 0; j < this.navigationNodes[i].presence.length; j++) {
                        if (this.navigationNodes[i].presence[j]) {
                            topmost_floor = j;
                        }
                    }
                    // Calculate the bottommost floor the stairs are on
                    let bottommost_floor = this.navigationNodes[i].presence.length;
                    for (let j = this.navigationNodes[i].presence.length; j >= 0; j--) {
                        if (this.navigationNodes[i].presence[j]) {
                            bottommost_floor = j;
                        }
                    }

                    // UP stairs
                    // Add the lift marker to ever floor it's on, except the topmost floor
                    for (let j = 0; j < this.navigationNodes[i].presence.length; j++) {
                        if (this.navigationNodes[i].presence[j] && j != topmost_floor) {
                            // Get the name of the floor for this space (this is how they're stored in the layer control)
                            let floor_label = this.floors[j].label;
                            // Add the marker to the layer for the floor
                            marker_up.addTo(this.floor_layers_object[floor_label]);
                        }
                    }

                    // DOWN stairs
                    // Add the lift marker to ever floor it's on, except the bottommost floor
                    for (let j = 0; j < this.navigationNodes[i].presence.length; j++) {
                        if (this.navigationNodes[i].presence[j] && j != bottommost_floor) {
                            // Get the name of the floor for this space (this is how they're stored in the layer control)
                            let floor_label = this.floors[j].label;
                            // Add the marker to the layer for the floor
                            marker_down.addTo(this.floor_layers_object[floor_label]);
                        }
                    }

                }
                else {
                    // If it's neither, throw an error
                    throw "Invalid node type: " + this.navigationNodes[i].node_type;
                }
            }


        },
    }
}
</script>