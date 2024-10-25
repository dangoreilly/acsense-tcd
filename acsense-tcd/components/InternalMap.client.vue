<template>
    <div id="internal-map" style="background-color: var(--bs-body-bg);"></div>
</template>

<script lang="ts">
// @ts-ignore
import L from 'leaflet';
// import "leaflet/dist/leaflet.css";
import '~/assets/css/leaflet.css'
import type { Building_Partial, Space, Floorplan, Nav_Node, Space_Type, Space_Partial } from '~/assets/types/supabase_types';
import type { Lift } from '~/assets/types/otherTypes';

export default {
    props: {
        floors: {
            type: Array as () => Floorplan[],
            required: true,
        },
        spaces: {
            type: Array as () => Space_Partial[],
            required: true,
        },
        navigationNodes: {
            type: Array as () => Nav_Node[],
            required: true,
        },
        building: {
            type: Object as () => Building_Partial,
            required: true,
        }
    },
    data() {
        return {
            map: null as L.Map | null,
            floor_layers_object: {} as {[key: string]: L.LayerGroup},
            activeFloor: 0,
            
        }
    },
    mounted() {

        // This function first waits to make sure the map div exists
        // It then initialises the map
        // And calls all the functions to add the overlays, buildings, and student spaces
        this.initMap();
    },

    methods: {
        async initMap() {

            // Wait for the div to exist
            while (!document.getElementById('internal-map')) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            const BUFFER = 200

            // Create the new map
            let map_size = [[0,0], this.building.internal_map_size] as [[0, 0], [number, number]];
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

            // console.log("Map initialised", map);

            // var info = L.control({position:"bottomleft"});

            // Cheap debug reporting
            // map.on('click', function(e) {
            //     let cheapDebugObject = {
            //         latlng: e.latlng,
            //         bounds: map.getBounds(),
            //         zoom: map.getZoom(),
            //         center: map.getCenter()
            //     }
        
            //     console.log(cheapDebugObject);
                
            // });

            this.map = map;

            // Add floors to the map
            this.addFloorsToMap(map_size);
            // Add spaces to the map
            this.addSpacesToMap();
            // Add navigation nodes to the map
            this.addNavNodesToMap();
            
        },

        // Emit the various openModal events
        emitOpenModal(space: Space_Partial){
            // Method for emtting the openmodal event for the space modal
            this.$emit('openSpaceModal', space);
           
        },

        // Open lift modal
        emitOpenLiftModal(node: Nav_Node){

            // localise for transport nonsense
            // Basically, we're going to set the go to floor function for each valid floor
            // Then we're going to pass the node and the array of valid floors and their functions
            // back to the main instance, because the main instance can't pass eventst to this child
            let gotoFloor = this.moveToFloor;
            let closeModal = () => {this.$emit('dismissModals')};
            // Process the lift node to extract the array of valid floors
            let validFloors = [];
            for (let i = 0; i < node.presence.length; i++) {
                if (node.presence[i]){
                    // Get the name and the index of the floorplan
                    validFloors.push({
                        label: this.floors[i].label,
                        gotoFloor: () => {gotoFloor(i); closeModal();},
                        isCurrentFloor: i == this.activeFloor
                    });
                }
            }

            // Method for emtting the openmodal event for the lift modal
            // Transmits the node and the floor move as a callback
            this.$emit('openLiftModal', {
                label: node.label,
                validFloors: validFloors,
            } as Lift);
        },

        // Emit that a space is being hovered over
        emitSpaceHover(space_name: string){
            this.$emit('spaceHover', space_name);
            // console.log('spaceHover', space)
        },
        // Emit that a space is no longer being hovered over
        emitSpaceUnhover(){
            this.$emit('spaceUnhover');
        },

        addFloorsToMap(bounds: [[0,0], [number, number]]){

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
                if (i == this.building.entry_floor) {
                    floor_layer.addTo(this.map);
                }

                // Add an event listener to the layer group
                // When the layer is added to the map, set the active floor to this floor
                floor_layer.on('add', () => {
                    this.activeFloor = i;
                    // this.activeFloor_object = floor_layer;
                    // console.log("Active floor set to: " + this.activeFloor)
                });
            }

            // Set the active floor to the entry floor
            this.activeFloor = this.building.entry_floor;

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
                
                const space = this.spaces[i];

                // Create an icon for the space
                let icon = L.icon({
                    iconUrl: space.icon,
                    iconSize: [50, 50],
                    iconAnchor: [25, 25],
                    popupAnchor: [0, -25],
                });

                // Set the starting position for the marker
                // If the space has a location, use that, otherwise use the center of the floor
                let marker_position = [];

                // Check equivalence to [0,0] because the array is not being compared correctly
                let equivalence = (space.location_internal[0] == 0) && (space.location_internal[1] == 0);

                if (equivalence)
                    marker_position = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
                else
                    marker_position = space.location_internal;
                
                // Create a marker for the space with the icon
                let marker = L.marker(marker_position, {
                    icon: icon, 
                    bubblingMouseEvents: false,
                });

                // Localise the emitOpenModal function
                let emitOpenModal = this.emitOpenModal;
                // Localise the emitSpaceHover function
                let emitSpaceHover = this.emitSpaceHover;
                // Localise the emitSpaceUnhover function
                let emitSpaceUnhover = this.emitSpaceUnhover;

                // Add an event listener to update the toast when the mouse hovers over the marker
                marker.on('mouseover', (e: Event) => {
                    emitSpaceHover(space.name);
                });
                // And close it on mouseout
                marker.on('mouseout', (e: Event) => {
                    emitSpaceUnhover();
                });

                // Add an event listener to the marker, to open the space modal when it is clicked
                marker.on('click', (e: Event) => {
                    emitOpenModal(space);
                });
                
                // Add the marker to the map
                // marker.addTo(this.map);

                // Get the name of the floor for this space (this is how they're stored in the layer control)
                let floor_label = this.floors[space.floor].label;

                // Add the marker to the layer for the floor
                marker.addTo(this.floor_layers_object[floor_label]);
            }

        },

        nextValidFloor(direction: "up" | "down", node: Nav_Node){
            // This function takes a direction (up or down) and a node
            // It then returns the next valid floor in that direction
            // If there is no valid floor in that direction, it returns null

            // List of valid floors for this node
            let valid_floors = [];
            for (let i = 0; i < node.presence.length; i++) {
                if (node.presence[i]) {
                    valid_floors.push(i);
                }
            }
            console.log("Valid floors: " + valid_floors)
            console.log("Current floor: " + this.activeFloor)
            // Get the index of the current floor
            let current_floor_index = valid_floors.indexOf(this.activeFloor);

            if (direction == "up") {
                // If the current floor is the top floor, return null
                if (current_floor_index == valid_floors.length - 1) {
                    return null;
                }
                // Otherwise, return the next floor up
                else {
                    return valid_floors[current_floor_index + 1];
                }
            }
            else if (direction == "down") {
                // If the current floor is the bottom floor, return null
                if (current_floor_index == 0) {
                    return null;
                }
                // Otherwise, return the next floor down
                else {
                    return valid_floors[current_floor_index - 1];
                }
            }
            else {
                console.log("Invalid direction: " + direction);
                return null;
            }
        },

        moveToFloor(floorIndex: number){

            console.log("Moving to floor: " + floorIndex);
            // Move the map to the floor with the given index
            // First, find the label of the floor as that is how
            // they are stored in the layer control
            let floorLabel = this.floors[floorIndex].label;
            // Then, get the layer group from the floor_layers_object
            let floorLayer = this.floor_layers_object[floorLabel];
            // Then remove all layers from the map
            this.map.eachLayer(function (layer: L.Layer) {
                layer.remove();
            });
            // Then add the layer group to the map
            floorLayer.addTo(this.map);
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


                // Check what sort of node it is
                if (this.navigationNodes[i].node_type == "lift") {
                    // If it's a lift, use the lift icon
                    let marker = L.marker(this.navigationNodes[i].location_up, {
                        icon: lift_icon, 
                        draggable: false,
                        bubblingMouseEvents: false,
                    });

                    // Add the lift marker to every floor it's on
                    for (let j = 0; j < this.navigationNodes[i].presence.length; j++) {
                        if (this.navigationNodes[i].presence[j]) {
                            // Get the name of the floor for this space (this is how they're stored in the layer control)
                            let floor_label = this.floors[j].label;
                            // Add the marker to the layer for the floor
                            marker.addTo(this.floor_layers_object[floor_label]);
                        }
                    }

                    // Add an event listener to the marker, to open the lift modal when it is clicked
                    marker.on('click', (e: Event) => {
                        this.emitOpenLiftModal(this.navigationNodes[i]);
                    });


                }
                else {
                    // If it's a stairs, create two markers, one for up and one for down
                    // Stairs UP
                    let marker_up = L.marker(this.navigationNodes[i].location_up, {
                        icon: stair_up_icon, 
                        draggable: false,
                        bubblingMouseEvents: false,
                    });

                    // Add an event listener to the marker, to move to the next floor up when it is clicked
                    marker_up.on('click', (e: Event) => {
                        // Get the next valid floor up
                        let next_floor = this.nextValidFloor("up", this.navigationNodes[i]);
                        // If there is a valid floor, move to it
                        if (next_floor != null) {
                            this.moveToFloor(next_floor);
                        }
                    });
                    

                    // ====================================================================================================
                    // Stairs DOWN
                    let marker_down = L.marker(this.navigationNodes[i].location_down, {
                        icon: stair_down_icon, 
                        draggable: false,
                        bubblingMouseEvents: false,
                    });

                    // Add an event listener to the marker, to move to the next floor down when it is clicked
                    marker_down.on('click', (e: Event) => {
                        // Get the next valid floor down
                        let next_floor = this.nextValidFloor("down", this.navigationNodes[i]);
                        // If there is a valid floor, move to it
                        if (next_floor != null) {
                            this.moveToFloor(next_floor);
                        }
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
            }

        }
    },
    
};
</script>

<style>
#internal-map {
    height: 100dvh; /* dvh is important for some reason. Leaflet really doesn't like vh */
}


</style>
