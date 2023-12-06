<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'floorplans'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminBuildingSelector 
            
            :supabase_client="supabase"/> <!-- @activeBuildingChanged="getBuilding($event)"  -->
            <!-- TODO: Replace building selector functionality -->
            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Floorplan | 
                        <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4">
                            <NuxtLink 
                            :to="'/info/' + building.canonical"
                            class="link-dark text-decoration-none">
                                {{ building.canonical }}
                            </NuxtLink>
                        </span>
                    </h1>

                    <!-- Construction Badge -->
                    <div class="d-flex align-items-center m-3 fs-5">
                        <!-- Test data puller -->
                        <button 
                            type="button" 
                            class="btn btn-primary me-2" 
                            @click="loadTestData()">
                                Pull test data
                        </button>

                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="buildingHasBeenChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updateBuilding()"
                            :disabled="!buildingHasBeenChanged">
                                Save Changes
                            </button>

                            <button 
                            type="button" 
                            class="btn"
                            :class="buildingHasBeenChanged ? 'btn-warning' : 'btn-outline-secondary'"
                            @click="cancelChanges()"
                            :disabled="!buildingHasBeenChanged">
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Main Matter -->
                <!-- Don't render anything until some data has been pulled -->
                <div class="mainMatter-admin" v-if="building.display_name">

                    <div class="border-bottom border-1 border-secondary mb-3">
                        <!-- <h3 class="fs-4">Floorplans</h3> -->
                        <ContentDoc path="admincopy/floorplans"></ContentDoc>
                        
                    </div>
                    
                    <div class="mb-3 ps-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Display floorplan for {{ building.display_name }}</label>
                        </div>
                    </div>

                    <!-- Floorplan size -->
                    <div class="row g-3 mb-2">
                        <!-- Button to remake the map -->
                        <div class="col-md-2 d-flex">
                            <button class="btn btn-outline-secondary flex-fill" @click="mapInit()">Re-generate Map</button>
                        </div>
                        <div class="col-md-3">
                            <label for="floorSelect" class="form-label">Entry Floor</label>
                            <select class="form-select" id="floorSelect" 
                            @change="setEntryFloor($event.target.value)"
                            v-model="building.entry_floor">
                            <!-- @change="moveToFloor(activeFloor)"> -->
                                <option 
                                v-for="(floor, index) in floors"
                                :value="index">
                                    {{ floor.label }}
                                </option>
                            </select>
                        </div>
                        <!-- Map dimensions -->
                        <div class="col-md-3">
                            <label for="width" class="form-label">Width</label>
                            <input type="number" class="form-control" id="width" v-model="building.internalMapSize[0]">
                        </div>
                        <div class="col-md-3">
                            <label for="height" class="form-label">Height</label>
                            <input type="number" class="form-control" id="height" v-model="building.internalMapSize[1]">
                        </div>
                    </div>
                    <!-- <div>
                        <div class="mb-3 ps-3">
                            <label for="lat" class="form-label">Latitude</label>
                            <input 
                            type="text" 
                            id="lat"
                            class="form-control"
                            placeholder="Latitude"
                            v-model="space.location[0]" 
                            disabled>
                        </div>
                        
                        <div class="mb-3">
                            <label for="long" class="form-label">Longitude</label>
                            <input 
                            type="text" 
                            id="long" 
                            class="form-control"
                            placeholder="Longitude"
                            v-model="space.location[1]"  
                            disabled>
                        </div>
                    </div> -->
                    
                    <!-- Floor arranging -->
                    <div class="container text-center">
                        <!-- Header -->
                        <div class="floors-list-row">
                            <span>Entry floor</span>
                            <span>SVG file</span>
                            <span>Label</span>
                            <span>Arrange</span>
                            <span>Delete</span>
                        </div>

                        
                        <div v-for="(floor, index) in floors" :key="index" class="floors-list-row mb-1">
                            <div class="form-check">
                                <input 
                                class="form-radio-input" 
                                type="radio" 
                                @change="setEntryFloor(index)"
                                :checked="floor.isEntry">
                                <!-- :disabled="floor.isEntry"> -->
                                <!-- Disable the checkbox if this is the entry floor, to avoid it being deselected -->
                                <!-- The only way the checkbox can change therefor is to change the floor -->
                              </div>
                            <span><input type="text" style="width:95%" :value="floor.url"> </span>
                            <span><input type="text" style="width:95%" :value="floor.label"></span>
                            <div>
                                <div class="btn-group" role="group">
                                    <!-- Swap upwards -->
                                    <button 
                                    type="button" 
                                    class="btn btn-sm btn-secondary"
                                    :disabled="index == 0"
                                    @click="swapFloors(index, index-1)"
                                    >&#x2191;</button>
                                    <!-- Swap downwards -->
                                    <button 
                                    type="button" 
                                    class="btn btn-sm btn-secondary"
                                    :disabled="index == floors.length - 1"
                                    @click="swapFloors(index, index+1)"
                                    >&#x2193;</button>
                                </div>
                            </div>
                            <div>
                                <!-- Don't allow the entry floor to be deleted, because I don't want to deal with that logic -->
                                <button class="btn btn-sm btn-danger"
                                :disabled="floor.isEntry"
                                >Delete</button>
                            </div>
                        </div>
                        <!-- Input a new floor -->
                        <div class="row g-3 mb-2">
                            <div class="col d-flex">
                                <button 
                                class="btn btn-outline-success flex-fill"
                                @click="console.log('Add new floor')">
                                    Add new floor
                                </button>
                            </div>
                        </div>

                    </div>

                    <!-- Internal spaces management -->
                    <div class="border-bottom border-1 border-secondary mt-3">
                        <h3 class="fs-4">Spaces</h3>
                    </div>
                    <ContentDoc path="admincopy/floorplans/spaces"></ContentDoc>
                    <div class="container text-center">
                        <!-- Header -->
                        <div class="spaces-list-row">
                            <span>Space</span>
                            <span>Floor</span>
                            <span>Location</span>
                        </div>
                        <!-- Spaces -->
                        <div class="spaces-list-row border-top border-primary-subtle my-1 py-1" v-for="space in spaces">
                            <!-- Space name + icon -->
                            <span class="spaces-list-space">
                                <div class="space-list-space-icon">
                                    <img :src="space.icon" style="width: 2rem; margin-right: .25rem;"/>
                                </div>

                                <div class="spaces-list-space-name">
                                    {{ space.name }}
                                </div>
                            </span>
                            <!-- Floor number input -->
                            <!-- <input 
                            type="number" 
                            style="width:95%" 
                            v-model="space.floor" 
                            min="0" max="5"> -->
                            <!-- <div>
                                <div class="form-check form-check-inline" v-for="(floor, index) in floors">
                                    <input 
                                    class="form-check-input" 
                                    type="radio"
                                    :value="index"
                                    :title="floor.label"
                                    v-model="space.floor">
                                </div>
                            </div> -->
                            <select class="form-select" v-model="space.floor">
                                <option v-for="(floor, index) in floors"
                                :value="index">
                                    {{ floor.label }}
                                </option>
                            </select>
                            <!-- Space internal location -->
                            <input 
                            class="form-control"
                            type="text" 
                            :value="coordinatesToString(space.location_internal)" 
                            disabled readonly>
                        </div>
                    </div>

                    <!-- Navigation nodes -->
                    <div class="border-bottom border-1 border-secondary mt-3">
                        <h3 class="fs-4">Navigation</h3>
                    </div>
                    <ContentDoc path="admincopy/floorplans/navigation"></ContentDoc>

                    <div class="container text-center">
                        <!-- Header -->
                        <div class="nav-list-row">
                            <span>Node</span>
                            <span>Type</span>
                            <span>Floors</span>
                            <span>UP Location</span>
                            <span>DOWN Location</span>
                        </div>
                        <!-- Nodes -->
                        <div class="nav-list-row border-top border-primary-subtle my-1 py-1" v-for="node in navigationNodes">
                            <!-- Node label -->
                            <span><input type="text" style="width:95%" :value="node.label"></span>
                            <!-- Lift or stair -->
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio1" value="1" v-model="node.lift">
                                    <!-- @change="node.lift = Boolean(this.$event.value)"> -->
                                    <label class="form-check-label" for="inlineRadio1">Lift</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio2" value="0" v-model="node.lift">
                                    <!-- @change="node.lift = Boolean(this.$event.value)"> -->
                                    <label class="form-check-label" for="inlineRadio2">Stairs</label>
                                </div>
                            </div>
                            <!-- Active floors -->
                            <div>
                                <div class="form-check form-check-inline" v-for="(floor, index) in floors">
                                    <input 
                                    class="form-check-input" 
                                    type="checkbox"
                                    v-model="node.presence[index]">
                                </div>
                            </div>
                            <!-- UP Location -->
                            <input 
                            class="form-control"
                            type="text" 
                            :value="coordinatesToString(node.location_up)" 
                            disabled readonly>
                            <!-- UP Location -->
                            <div>
                                <!-- Only display the DOWN location if the node is a stair -->
                                <input 
                                v-if="node.lift == 0"
                                class="form-control"
                                type="text" 
                                :value="coordinatesToString(node.location_down)" 
                                disabled readonly>
                            </div>
                        </div>
                    </div>


                    <!-- Map -->
                    <div class="mb-3 position-relative">
                        <!-- Leaflet instance -->
                        <div id="internal-map" style="height: 600px; padding-top: 30px;">
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
                    

                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
    definePageMeta({
        middleware: 'auth'
    })
</script>

<script>
import {createClient} from '@supabase/supabase-js';
import L from 'leaflet';

    export default {
        data() {
            return {
                building: {
                    UUID: "b5694bc5-90c0-440f-b95c-7c0672992211",
                    entry_floor: 1,
                    internalMapSize: [1080, 1920],
                    canonical: "arts-building",
                    display_name: "Arts Building",
                },
                building_clean: {},
                gallery: [],
                gallery_clean: [],
                floors: [],
                floors_clean: [],
                floor_layers_object: {},
                supabase: {},
                spaces: [],
                spaces_clean: [],
                map: {},
                activeFloor: 0,
                activeFloor_object: {},
                space_being_hovered_on: "",
                space_name_toast_showing: false,

                navigationNodes: [],
                navigationNodes_clean: [],
            }
        },
        created() {
            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

        },
        mounted() {
            this.loadTestData();
        },
        computed: {
            buildingHasBeenChanged(){
                // Check the building object against the clean copy
                // return JSON.stringify(this.building) !== JSON.stringify(this.building_clean);
                return false;
            },
        },
        methods: {

            async loadTestData(){
                // Simulate the arts building being selected
                // Call the getFloors and getSpaces functions
                this.getSpaces(this.building.UUID);
                // Floors need to be awaited because we use the floor count to validate the navigation nodes
                await this.getFloorplans(this.building.UUID);
                this.getNavigationNodes(this.building.UUID);
            },

            async getSpaces(){
                // Get the spaces in this building

                // Null the spaces array
                this.spaces = [];

                const { data: spaces, error } = await this.supabase
                    .from('spaces')
                    .select('name, UUID, floor, location_internal, type, icon_override')
                    .eq('building_uuid', this.building.UUID)

                    if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {

                    // Calculate the icon for each space
                    
                    let spaceStyles = await getSpaceStyles(this.supabase);
                    // console.log("spaceStyles", spaceStyles);
                    spaces.forEach(space => {
                        space.icon = getIconForSpace(space, spaceStyles);
                    });

                    // console.log("spaces", spaces);

                    this.spaces = JSON.parse(JSON.stringify(spaces));
                    this.spaces_clean = JSON.parse(JSON.stringify(spaces));
                }
            },

            async getNavigationNodes(buildingUUID){
                // Get the navigation nodes in this building
                // Null the nodes array
                this.navigationNodes = [];

                const { data: nodes, error } = await this.supabase
                    .from('nav_nodes')
                    .select('*')
                    .eq('building', this.building.UUID)

                    if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    console.log("nodes", nodes);   
                    // Validate all the nodes
                    for (let i = 0; i < nodes.length; i++) {
                        nodes[i] = this.validateNavigationNode(nodes[i]);
                    }
                    
                    // Copy the nodes to the navigationNodes array
                    this.navigationNodes = JSON.parse(JSON.stringify(nodes));
                    this.navigationNodes_clean = JSON.parse(JSON.stringify(nodes));
                }


            },

            validateNavigationNode(node){
                // Takes in a lift or stair, checks it has the correct number of floors
                // Trims the presence array to the correct number of floors if too many
                // filles the presence array with 0s if too few

                // Check the presence array is the correct length
                if (node.presence.length != this.floors.length) {
                    // If it's too long, trim it
                    if (node.presence.length > this.floors.length) {
                        node.presence = node.presence.slice(0, this.floors.length);
                    }
                    // If it's too short, fill it with 0s
                    else {
                        let difference = this.floors.length - node.presence.length;
                        for (let i = 0; i < difference; i++) {
                            node.presence.push(0);
                        }
                    }
                }

                return node;

            },

            moveToFloor(floorIndex){
                // Move the map to the floor with the given index
                // First, find the label of the floor as that is how
                // they are stored in the layer control
                let floorLabel = this.floors[floorIndex].label;
                // Then, get the layer group from the floor_layers_object
                let floorLayer = this.floor_layers_object[floorLabel];
                // Then remove all layers from the map
                this.map.eachLayer(function (layer) {
                    layer.remove();
                });
                // Then add the layer group to the map
                floorLayer.addTo(this.map);
            },

            swapFloors(A, B){
                // Takes in the index of two floors, swaps them in the array
                let temp = this.floors[A];
                this.floors[A] = this.floors[B];
                this.floors[B] = temp;
                this.setFloorLevels();
            },

            setEntryFloor(newEntryFloor){

                // Set the entry floor to the new value
                this.building.entry_floor = newEntryFloor;

                // Set all floors to entryFloor = false
                this.floors.forEach((floor, index) => {
                    floor.isEntry = false;
                });

                // Set the entry floor to true by checking newEntryfloor
                this.floors[newEntryFloor].isEntry = true;
            },

            setFloorLevels(){
                // When the list is rearranged, the level of the floor will update to match the index
                // This function will update the level of each floor to match the index
                this.floors.forEach((floor, index) => {
                    floor.level = index;
                });
            },
            // Create the map
            mapInit(){
                // Try run this.map.remove, print to the console if it fails
                try {
                    this.removeMap();
                }
                catch (error) {
                    console.log(error);
                }


                const BUFFER = 200

                // Create the new map
                let map_size = [[0,0], this.building.internalMapSize]
                // Get the bounds by adding padding around the edges
                // Without this padding, it's not always possible to zoom into the edges
                let map_bounds = [[-BUFFER, -BUFFER],
                    [this.building.internalMapSize[0] + BUFFER,
                    this.building.internalMapSize[1] + BUFFER]
                ]

                let map_center = [this.building.internalMapSize[0]/2, this.building.internalMapSize[1]/2]

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
                map.on('click', function(e) {
                    let cheapDebugObject = {
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

            addFloorsToMap(bounds){

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
                        marker_position = [this.building.internalMapSize[0]/2, this.building.internalMapSize[1]/2];
                    else
                        marker_position = this.spaces[i].location_internal;
                    
                    // Create a draggable marker for the space with the icon
                    let marker = L.marker(marker_position, {
                        icon: icon, 
                        draggable: true,
                        bubblingMouseEvents: false,
                    });

                    // Add an event listener to the marker, to update the space location when it is dragged
                    marker.on('dragend', (e) => {
                        // Get the new coordinates
                        let new_coordinates = e.target.getLatLng();
                        // Update the space location
                        this.spaces[i].location_internal = [new_coordinates.lat, new_coordinates.lng];
                    });

                    // create a local function for updating the toast value
                    let updateToast = (e) => {
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
                    marker.on('mouseover', (e) => {
                        updateToast(e);
                    });
                    // And close it on mouseout
                    marker.on('mouseout', (e) => {
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


            },

            removeMap(){
                this.map.remove();
            },

            coordinatesToString(coordinates){
                // Takes in an array of coordinates, returns a string
        
                // Check if the coordinates are nested
                if (Array.isArray(coordinates[0])) {
                    // If they are, return a string of the first set of coordinates
                    return "[[" + coordinates[0][0] + ", " + coordinates[0][1] + "], [" + coordinates[1][0] + ", " + coordinates[1][1] + "]]";
                }
                // If they're not, return a string of the coordinates
                return "[" + coordinates[0] + ", " + coordinates[1] + "]";
            },


            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            async updateBuilding() {

                // Create an empty object to store the update query
                // Only contains the things we want to update
                let update_vehicle = {
                    display_name: this.building.display_name,
                    description: this.building.description,
                    aka: this.building.aka,
                    opening_times: this.building.opening_times,

                    sense_exp: this.building.sense_exp,
                    sense_exp_display: this.building.sense_exp_display,
                    wayfinding: this.building.wayfinding,
                    wayfinding_display: this.building.wayfinding_display,
                    phys_access: this.building.phys_access,
                    phys_access_display: this.building.phys_access_display,

                    further_info: this.building.further_info,
                    furtherinfo_display: this.building.furtherinfo_display,
                    tips: this.building.tips,

                    always_display: this.building.always_display,
                    coordinates: this.building.coordinates,
                }

                // If the primary image has been changed, upload the new image and update the url
                try {
                    if (document.getElementById("PrimaryImageInput").files[0]) {
                        // If the primary image has been changed, upload the new image and update the url, and the alt
                        // If uploading the primary image fails, we don't want to update the alt
                        update_vehicle.primary_image_url = await this.uploadNewPrimaryImage();
                        update_vehicle.primary_image_alt = this.building.primary_image_alt;
                    }
                    else{
                        // If the primary image has not been changed, update the alt
                    }
                }
                catch (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }

                // Update the building in the database
                const { data, error } = await this.supabase
                    .from('buildings')
                    .update(update_vehicle)
                    .eq('UUID', this.building.UUID)
                    .select()
                
                // If there is an error, log it
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // If the update was successful, update the clean building object
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    alert(this.building.display_name + " updated successfully")
                    console.log(data)
                }


            },

            handlePrimaryImageSelect(evt) { 
                // Get the file from the input
                // Set the primary image to the file to preview
                const file = evt.target.files[0];
                this.building.primary_image_url = URL.createObjectURL(file);
            },

            async uploadNewPrimaryImage(){
                // Get the file object from the primary image upload input
                // Upsert to the storage bucket as the canonical name
                // TODO: Check if the file already exists under a different extension, and if so, delete it

                // Get the file
                let file = document.getElementById("PrimaryImageInput").files[0];
                // Get the file extension
                let extension = file.name.split('.').pop();
                
                // Build the new url for the file
                let newUrl = this.supabase.storageUrl + "/object/public/primary-images/" + this.building.canonical + "." + extension;

                // Upload the file to the storage bucket
                const { data, error:upload_error } = await this.supabase.storage
                .from('primary-images')
                .upload(`${this.building.canonical}.${extension}`, file)
                if (upload_error) {
                    console.error(upload_error)
                    return error
                }
                
                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";

                return newUrl;

            },

            // Function to add a new gallery image to the building
            async addGalleryImage() {
                // Get the file from the input
                const file = document.getElementById("myFile").files[0];
                // Upload the file to the storage bucket
                // Get the URL of the uploaded file
                const { data, error:upload_error } = await this.supabase.storage
                .from('gallery-images')
                .upload(`${this.building.canonical}/${file.name}`, file)
                if (upload_error) {
                    console.error(upload_error)
                    alert(upload_error.message)
                    throw upload_error
                }
                console.log(data)
                // Create a new image object
                let newImage = {
                    url: "https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/gallery-images/" + data.path,
                    alt: this.newGalleryImage.alt,
                    caption: this.newGalleryImage.caption,
                }

                // Add the image to the database
                let { data: img, error:db_insert_error } = await this.supabase
                    .from('building_gallery_images')
                    .insert([
                        { 
                            building: this.building.canonical,
                            url: newImage.url,
                            alt: newImage.alt,
                            caption: newImage.caption,
                        }
                    ])

                if (db_insert_error) {
                    console.error(db_insert_error)
                    alert(db_insert_error.message)
                    throw db_insert_error
                }
                // Add a copy of the image to the gallery array
                this.gallery.push(JSON.parse(JSON.stringify(newImage)))
                // And to the clean gallery
                this.gallery_clean.push(JSON.parse(JSON.stringify(newImage)))
                

            },
            handleFileUpload(event) {
                this.newGalleryImage.selectedFile = event.target.files[0];
            },

            // Function to remove a gallery image from the building
            async removeGalleryImage(index, url) {
                // Remove the image from the gallery array
                this.gallery.splice(index, 1);
                // And from the clean copy
                this.gallery_clean.splice(index, 1);
                
                // Remove the database entry
                const { data:db_response, error:db_error } = await this.supabase
                .from('building_gallery_images')
                .delete()
                .eq('url', url)

                if (db_error) {
                    console.error(db_error)
                    alert(db_error.message)
                    throw db_error
                }
                console.log(db_response)

                // Get the path by subtracting the supabase url from the image url
                let path = url.replace(this.supabase.storageUrl + "/object/public/gallery-images/", "");
                console.log(path)
                // Delete the image from the storage bucket
                const { data:storage_response, error:storage_error } = await this.supabase.storage
                .from('gallery-images')
                .remove([path])

                if (storage_error) {
                    console.error(storage_error)
                    alert(storage_error.message)
                    throw storage_error
                }
                console.log("storage_response")
                console.log(storage_response)

                alert("Image deleted successfully")
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {

                // Deep copy the building_clean object back into the building object
                this.building = JSON.parse(JSON.stringify(this.building_clean));

                // Clear the primary image input
                document.getElementById("PrimaryImageInput").value = "";

            },

            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns a list of the fields that have been changed
            getChanges() {},

            // This function adds a log entry to the database
            logChange() {},

            // This function fetches the building from the database based on it's canonical name
            async getBuilding(canonical){
                console.log("Fetching floorplans for: " + canonical);

                // Fetch the building from the database
                // Since we are using the canonical name, we should only get one result
                let { data: bld, error } = await this.supabase
                    .from('buildings')
                    // .select('canonical, has_floorplan, entry_floor, display_name, UUID')
                    .select('canonical, display_name, UUID')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    this.building = JSON.parse(JSON.stringify(bld[0]));
                    // Deep copy the building object so we have comparison data
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    
                    // Get the floorplans for the building
                    this.getFloorplans(this.building.UUID);

                    // this.setEntryFloor(this.building.entry_floor);


                    // Update the map to show the building
                    // this.loadBuildingToMap();

                }
                
            },

            async getFloorplans(building_uuid){

                // Null the floors array
                this.floors = [];

                // Fetch the floorplans for the building from the database
                let { data: flr, error } = await this.supabase
                    .from('floorplans')
                    .select('level, url, label')
                    .eq('building', building_uuid)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {

                    // console.log("Floorplans", flr);
                    // load the floors into the vue instance
                    this.floors = JSON.parse(JSON.stringify(flr));
                    this.floors_clean = JSON.parse(JSON.stringify(flr));

                    // If there are no floors, don't try to set the entry floor
                    if (this.floors.length > 0) {
                        // Sort the floors by level
                        this.floors.sort((a, b) => (a.level > b.level) ? 1 : -1)
                        // Set the entry floor
                        this.setEntryFloor(this.building.entry_floor);
                    }
                }
            },

        },
    }


</script>

<style>

.floors-list-row {
    display: grid;
    /* padding-top: 2rem; */
    grid-template-columns:   6rem auto auto 6rem 4rem;
    grid-template-rows: auto;
    row-gap: 1rem;
}

.spaces-list-row {
    display: grid;
    /* padding-top: 2rem; */
    grid-template-columns:  auto 18rem 18rem;
    grid-template-rows: auto;
    row-gap: 1rem;
    column-gap: 2rem;
}

.spaces-list-space {
    display: grid;
    grid-template-columns:  2rem auto;
    grid-template-rows: auto;
    column-gap: 1rem;
    text-align: start;
    align-content: center;
}

.nav-list-row {
    display: grid;
    /* padding-top: 2rem; */
    grid-template-columns:  auto 10rem auto 8rem 8rem;
    grid-template-rows: auto;
    row-gap: 1rem;
    column-gap: 1rem;
}


.map-section{
    /* Define the grid to give enough room for the map */
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-areas: "input map";
    grid-template-rows: auto;
}

.space-name-toast {
    transition: all 0.2s ease-in-out;
}

</style>