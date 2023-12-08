<template>
    <div id="internal-map"></div>
</template>

<script>
import L from 'leaflet';
// import "leaflet/dist/leaflet.css";
import '~/assets/css/leaflet.css'

export default {
    props: {
        navNodes: {
            type: Array,
            default: () => []
        },
        studentSpaces: {
            type: Array,
            default: () => []
        },
        spaceStyles: {
            type: Object,
            default: () => {}
        },
        floorplans: {
            type: Array,
            default: () => []
        },
        entryFloor: {
            type: Number,
            default: 0
        },
        building: {
            type: Object,
            default: () => {}
        },
    },
    data() {
        return {
            map: null,
            floor_layers_object: {},
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

            console.log("Map initialised", map);

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
            // this.addNavNodesToMap();
            
        },

        // Emit the various openModal events
        emitOpenModal(space){
            // Method for emtting the openmodal event for the space modal
            this.$emit('openSpaceModal', space);
           
        },

        // Emit that a space is being hovered over
        emitSpaceHover(space){
            this.$emit('spaceHover', space);
            // console.log('spaceHover', space)
        },
        // Emit that a space is no longer being hovered over
        emitSpaceUnhover(){
            this.$emit('spaceUnhover');
        },

        addFloorsToMap(bounds){

            // Init the floor layers object
            // The floor layers array needs to be stored in the vue instance
            // Otherwise it will be garbage collected and the layer functions can't be called later
            this.floor_layers_object = {};

            // Create a the floors
            for (let i = 0; i < this.floorplans.length; i++) {
                const floor = this.floorplans[i];
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
            this.activeFloor = this.EntryFloor;

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

            for (let i = 0; i < this.studentSpaces.length; i++) {
                
                const space = this.studentSpaces[i];

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
                marker.on('mouseover', (e) => {
                    emitSpaceHover(space.name);
                });
                // And close it on mouseout
                marker.on('mouseout', (e) => {
                    emitSpaceUnhover();
                });

                // Add an event listener to the marker, to open the space modal when it is clicked
                marker.on('click', (e) => {
                    emitOpenModal(space);
                });
                
                // Add the marker to the map
                // marker.addTo(this.map);

                // Get the name of the floor for this space (this is how they're stored in the layer control)
                let floor_label = this.floorplans[space.floor].label;

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
                let updateToast = (e) => {
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
                if (this.navigationNodes[i].lift) {
                    // If it's a lift, use the lift icon
                    let marker = L.marker(this.navigationNodes[i].location_up, {
                        icon: lift_icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });

                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker.on('dragend', (e) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_up = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker.on('mouseover', (e) => {
                        updateToast(e);
                    });
                    // And close it on mouseout
                    marker.on('mouseout', (e) => {
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
                else {
                    // If it's a stairs, create two markers, one for up and one for down
                    // Stairs UP
                    let marker_up = L.marker(this.navigationNodes[i].location_up, {
                        icon: stair_up_icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });
                    
                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker_up.on('dragend', (e) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_up = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker_up.on('mouseover', (e) => {
                        updateToast(e);
                    });
                    // And close it on mouseout
                    marker_up.on('mouseout', (e) => {
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
                    marker_down.on('dragend', (e) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.navigationNodes[i].location_down = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // Add an event listener to update the toast when the mouse hovers over the marker
                    marker_down.on('mouseover', (e) => {
                        updateToast(e);
                    });
                    // And close it on mouseout
                    marker_down.on('mouseout', (e) => {
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
