<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'floorplans'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminBuildingSelector 
            @activeBuildingChanged="getBuilding($event)"
            :supabase_client="supabase"/> <!--   -->
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
                        <!-- <button 
                            type="button" 
                            class="btn btn-primary me-2" 
                            @click="loadTestData()">
                                Pull test data
                        </button> -->

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

                    <!-- TODO: Handle by setting map size to [0,0] or [1080,1920] -->
                    <!-- <div class="mb-3 ps-3">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Display floorplan for {{ building.display_name }}</label>
                        </div>
                    </div> -->

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
                            <input type="number" class="form-control" id="width" v-model="building.internal_map_size[0]">
                        </div>
                        <div class="col-md-3">
                            <label for="height" class="form-label">Height</label>
                            <input type="number" class="form-control" id="height" v-model="building.internal_map_size[1]">
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
                            <span>
                                <!-- <input type="text" style="width:95%" :value="floor.url"> -->
                                <!-- Floor svg file display -->
                                <!-- File input that will show the current URL on load -->
                                <!-- On change, it will update the URL for the selected floor -->
                                
                                <!-- <input 
                                :id="'floorSVGInput_' + index"
                                type="file" 
                                style="width:90%"
                                class="form-control" 
                                @change="handleFloorImageSelect(index)">  -->
                                <div class="input-group input-group-sm"
                                    style="width:90%">
                                    <!-- File input -->
                                    <input 
                                    :id="'floorSVGInput_' + index"
                                    type="file" 
                                    class="form-control" 
                                    @change="handleFloorImageSelect(index)">
                                    <!-- Preview Button -->
                                    <a class="btn btn-outline-secondary" type="button" :href="floor.url"
                                    target="_blank">
                                        <i class="bi bi-image"></i>
                                        View
                                    </a>
                                </div>
                            </span>
                            
                            <span>
                                <!-- Allow hovering to show the actual database ID, for debugging -->
                                <input 
                                type="text" 
                                style="width:95%" 
                                :title="'id: '+floor.id"
                                v-model="floor.label">
                            </span>
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
                                @click="deleteFloor(index)"
                                >Delete</button>
                            </div>
                        </div>

                        <!-- Input a new floor -->
                        <!-- File select and label input same as edit -->
                        <!-- No entry floor or rearrange buttons -->
                        <!-- Replace Delete button with Add button that calls addNewFloor() -->
                        <div class="floors-list-row mb-1">
                            <div>  
                                <!-- Empty Div for layout -->
                            </div>
                            <span>
                                <!-- Floor svg file display -->
                                <div class="input-group input-group-sm"
                                    style="width:90%">
                                    <!-- File input -->
                                    <input 
                                    id="newFloorSVGInput"
                                    type="file" 
                                    class="form-control" 
                                    @change="handleNewFloorImageSelect()">
                                    <!-- Preview Button -->
                                    <!-- Disabled if there is no url -->
                                    <a class="btn btn-outline-secondary" 
                                    type="button" 
                                    :href="newFloor.url"
                                    :disabled="newFloor.url.length == 0"
                                    target="_blank">
                                        <i class="bi bi-image"></i>
                                        View
                                    </a>
                                </div>
                            </span>
                            
                            <span><input type="text" style="width:95%" v-model="newFloor.label"></span>
                            <div>
                                <!-- Empty Div for layout -->
                            </div>
                            <div>
                                <button class="btn btn-sm btn-success"
                                :disabled="!newFloorIsValid"
                                @click="addNewFloor()"
                                >Add</button>
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
                            <span></span>
                        </div>
                        <!-- Nodes -->
                        <div class="nav-list-row border-top border-primary-subtle my-1 py-1" 
                        :class="checkNodeValid(node) ? '' : 'bg-warning'"
                        v-for="node in navigationNodes">
                            <!-- Node label -->
                            <span><input type="text" style="width:95%" v-model="node.label"></span>
                            <!-- Lift or stair -->
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio1" value="lift" v-model="node.node_type">
                                    <!-- @change="node.lift = Boolean(this.$event.value)"> -->
                                    <label class="form-check-label" for="inlineRadio1">Lift</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio2" value="stairs" v-model="node.node_type">
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
                                    :title="floor.label"
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
                                v-if="node.node_type == 'stairs'"
                                class="form-control"
                                type="text" 
                                :value="coordinatesToString(node.location_down)" 
                                disabled readonly>
                            </div>
                            <!-- Delete Button -->
                            <div>
                                <button class="btn btn-sm btn-danger"
                                @click="deleteNavNode(node)"
                                >X</button>
                            </div>
                        </div>
                        <!-- Insert a new node -->
                        <div class="nav-list-row border-top border-primary-subtle my-1 py-1">
                            <!-- Node label -->
                            <span><input type="text" style="width:95%" v-model="newNode.label" placeholder="New Node"></span>
                            <!-- Lift or stair -->
                            <div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio1" value="lift" v-model="newNode.node_type">
                                    <!-- @change="node.lift = Boolean(this.$event.value)"> -->
                                    <label class="form-check-label" for="inlineRadio1">Lift</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" id="inlineRadio2" value="stairs" v-model="newNode.node_type">
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
                                    :title="floor.label"
                                    v-model="newNode.presence[index]">
                                </div>
                            </div>
                                <!-- UP Location -->
                                <input 
                                class="form-control"
                                type="text" 
                                value="-----" 
                                disabled readonly>
                                <!-- UP Location -->
                            <div>
                                <!-- Only display the DOWN location if the node is a stair -->
                                <input 
                                v-if="newNode.node_type == 'stairs'"
                                class="form-control"
                                type="text" 
                                value="-----" 
                                disabled readonly>
                            </div>
                            <!-- Add Button -->
                            <div>
                                <!-- Only enable if the new node is valid -->
                                <button class="btn btn-sm btn-success"
                                @click="addNewNavNode()"
                                :disabled="!checkNodeValid(newNode)"
                                >+</button>
                                <!--  -->
                            </div>
                        </div>
                    </div>


                    <!-- Map -->
                    <div class="mb-3 position-relative">
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
                building: {},
                building_clean: {},
                floors: [],
                deleted_floors: [],
                floors_clean: [],
                floor_layers_object: {},
                supabase: {},
                newFloor: {
                    label: "",
                    url: "",
                },
                newNode: {
                    label: "",
                    node_type: "",
                    presence: [],
                    location_up: [0,0],
                    location_down: [0,0],
                },
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
            // this.loadTestData();
        },
        computed: {
            buildingHasBeenChanged(){

                // I'm fully aware that this code is inefficient
                // I don't care
                let floorplans_changed = false;

                // Check if the building details (map size, entry floor) have changed
                if (this.checkBuildingChanges()) {
                    floorplans_changed = true;
                }
                
                // Check if the floors have changed
                if (this.checkFloorChanges()) {
                    floorplans_changed = true;
                }

                // Check if the spaces have changed
                if (this.checkSpaceChanges()) {
                    floorplans_changed = true;
                }

                // Check if the navigation nodes have changed
                if (this.checkNavNodeChanges()) {
                    floorplans_changed = true;
                }

                return floorplans_changed;

            },
            newFloorIsValid(){
                // Check the input fields of the new floor
                // Check that the label is not empty
                // And that a file has been selected
                return (this.newFloor.label != "") && (this.newFloor.url != "");
            },

            
        },
        methods: {

            printNewNavNodeValidity(){
                // Test function
                // Print the 3 components of the validity check
                console.log("Label: " + (this.newNode.label != ""));
                console.log(this.newNode.label)
                console.log("Type: " + (this.newNode.node_type != ""));
                console.log(this.newNode.node_type)
                console.log("Presence: " + (this.newNode.presence.includes(true)));
                console.log(this.newNode.presence)
            },

            checkNodeValid(node){
                // Check the fields of the node
                // Check that the label is not empty
                // And that a node type has been selected
                // And that at least two floors have been selected
                let floors_selected = 0;
                node.presence.forEach(floor => {
                    if (floor) {
                        floors_selected++;
                    }
                });

                return (node.label != "") && (node.node_type != "") && (floors_selected >= 2);
            },

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
                    // console.log("nodes", nodes);   
                    // Validate all the nodes
                    for (let i = 0; i < nodes.length; i++) {
                        nodes[i] = this.validateNavigationNode(nodes[i]);
                    }
                    
                    // Copy the nodes to the navigationNodes array
                    this.navigationNodes = JSON.parse(JSON.stringify(nodes));
                    this.navigationNodes_clean = JSON.parse(JSON.stringify(nodes));
                }

                // Set up the empty "new node" object
                this.setUpNewNode();


            },

            setUpNewNode(){
                // Set up the empty "new node" object
                this.newNode = {
                    label: "",
                    node_type: "",
                    building: this.building.UUID,
                    presence: [],
                    location_up: [0,0],
                    location_down: [0,0],
                }

                // Update the locations to be the center of the map
                this.newNode.location_up = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];
                this.newNode.location_down = [this.building.internal_map_size[0]/2, this.building.internal_map_size[1]/2];

                // Set the presence array to the correct length
                this.newNode = this.validateNavigationNode(this.newNode);

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
                            node.presence.push(false);
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

            setEntryFloor(newEntryFloor, init=false){

                // Set the entry floor to the new value
                this.building.entry_floor = newEntryFloor;

                // Set all floors to entryFloor = false
                this.floors.forEach((floor, index) => {
                    floor.isEntry = false;
                });

                // Set the entry floor to true by checking newEntryfloor
                this.floors[newEntryFloor].isEntry = true;

                // If this is the initial call, repeat for the clean copy of the floors
                // So we can compare them properly
                if (init) {
                    this.floors_clean.forEach((floor, index) => {
                        floor.isEntry = false;
                    });
                    this.floors_clean[newEntryFloor].isEntry = true;
                }
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

                // Make space for the map
                let map_container = document.getElementById("internal-map");
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

            async uploadFloorImage(file, floor_label){
                // Get the file object from the primary image upload input
                // Upsert to the storage bucket as the canonical name
                // TODO: Check if the file already exists under a different extension, and if so, delete it

                // Get the file name
                let fileName = file.name;
                // Get the file extension
                let fileExtension = fileName.split('.').pop();
                // Create a new file name
                // Replace any spaces in the floor label with underscores
                // Replace any special characters with nothing
                floor_label = floor_label.replace(/[^a-zA-Z0-9]/g, '');
                floor_label = floor_label.replace(" ", "_");
                let newFileName = this.building.UUID + "_" + floor_label + "." + fileExtension;
                
                // Build the new url for the file
                let newUrl = this.supabase.storageUrl + "/object/public/floorplans/" + newFileName;

                // Upload the file to the storage bucket
                const { data, error:upload_error } = await this.supabase.storage
                .from('floorplans')
                .upload(newFileName, file, {
                    upsert: true
                })
                if (upload_error) {
                    console.error(upload_error)
                    throw upload_error;
                }
    

                return newUrl;

            },

            async addNewFloor(){

    
                // Get the file from the input
                let file = document.getElementById("newFloorSVGInput").files[0];
                // Upload the file to the storage bucket
                try {
                    // Set the url of the new floor
                    this.newFloor.url = await this.uploadFloorImage(file, this.newFloor.label)
                    // Add the new floor to the floors array
                    this.floors.push(this.newFloor);
                    // Reset the new floor object
                    this.newFloor = {
                        label: "",
                        url: "",
                    }
                    // Reset the new floor input
                    document.getElementById("newFloorSVGInput").value = "";
                }
                catch (error) {
                    console.log(error);
                    alert("Error uploading file");

                }

            },

            deleteFloor(floorIndex){

                // Add it to the deleted_floors array
                // This will let us track later if it needs to be deleted from the database
                this.deleted_floors.push(this.floors[floorIndex]);
                // Delete the floor at the given index
                // Remove it from the floors array
                this.floors.splice(floorIndex, 1);

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
                    if (this.navigationNodes[i].node_type == "lift") {
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
                    else if (this.navigationNodes[i].node_type == "stairs"){
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
                    else {
                        // If it's neither, throw an error
                        throw "Invalid node type: " + this.navigationNodes[i].node_type;
                    }
                }


            },

            addNewNavNode(){
                // Add the new node to the navigationNodes array
                this.navigationNodes.push(this.newNode);
                // Set up the new node object
                this.setUpNewNode();
            },

            deleteNavNode(node){
                this.navigationNodes.splice(this.navigationNodes.indexOf(node), 1)
            },


            removeMap(){
                // Delete with the leaflet method, if it exists
                try {
                    this.map.remove();
                }
                catch (error) {
                    // console.log(error);
                }
                // Fallback delete
                this.map = {};

                // Find the map container, and empty it's innerHTML and classlist
                try {
                    let map_container = document.getElementById("internal-map");
                    map_container.innerHTML = "";
                    map_container.classList = [];
                    map_container.style.height = "0px";
                }
                catch (error) {
                    // console.log(error);
                }
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
            // It will save the current state of the building, floorplans, navnodes and spaces to the database
            async updateBuilding() {

                // Check if the building details have changed
                if (this.checkBuildingChanges()) {
                    
                    // Update the building in the database
                    const { data:building_update_response, error:building_update_error } = await this.supabase
                        .from('buildings')
                        .update(this.building)
                        .eq('UUID', this.building.UUID)
                        .select()
                    
                    // If there is an error, log it
                    if (building_update_error) {
                        console.error("Error updating building details: " + this.building.canonical)
                        console.error(building_update_error)
                        alert(building_update_error.message)
                        throw building_update_error
                    }

                    // Set the clean building to the current building
                    this.building_clean = JSON.parse(JSON.stringify(this.building));

                }

                // Check if the relevant floor details have changed
                let floorEquivalence = (f, cf) => {

                    if (f.label != cf.label) {
                        // console.log("Label mismatch")
                        // console.log(`${f.label} != ${cf.label}`)
                        return false
                    }
                    if (f.url != cf.url) {
                        // console.log("URL mismatch")
                        // console.log(`${f.url} != ${cf.url}`)
                        return false
                    }
                    if (f.level != cf.level) {
                        // console.log("Level mismatch")
                        // console.log(`${f.level} != ${cf.level}`)
                        return false
                    }

                    return true;
                }

                // Cycle through the floors
                for (let i = 0; i < this.floors.length; i++) {
                    // Check if the floor has changed
                    // Since the order of the floors is mutable,
                    // We need to compare them by their id property
                    let floor = this.floors[i];
                    
                    let deleted_floor = this.deleted_floors.find(f => f.id == floor.id);
                    let clean_floor = this.floors_clean.find(f => f.id == floor.id);

                    // Copy the floor to a new variable with only the properties we want to update
                    let floor_update_vehicle = {
                        label: floor.label,
                        url: floor.url,
                        level: floor.level,
                    }

                    // Check if the floor has a new image
                    // We can check for the floor option being null
                    // Or for the floor url to have the prefix "blob:"
                    if (floor.file != undefined || floor.url.startsWith("blob:")) {
                        // console.log("Uploading new floor")
                        // Upload the new floor image
                        // Set the url of the new floor
                        floor_update_vehicle.url = await this.uploadFloorImage(floor.file, floor.label)
                        // console.log("New floor url: " + floor_update_vehicle.url)
                    }

                    // Check if the clean_floor is undefined - then the floor is new
                    if (clean_floor == undefined) {
                        console.log("Uploading new floor")
                        console.log(floor_update_vehicle)
                        // Insert the new floor into the database
                        const { data:floor_insert_response, error:floor_insert_error } = await this.supabase
                            .from('floorplans')
                            .insert(floor_update_vehicle)
                        // If there is an error, log it
                        if (floor_insert_error) {
                            console.error("Error inserting new floor: " + floor.id)
                            console.error(floor_insert_error)
                            alert(floor_insert_error.message)
                            throw floor_insert_error
                        }
                    }
                    // Check if the floor has changed
                    else if (!floorEquivalence(floor, clean_floor)) {

                        console.log("Updating existing floor")
                        // console.log(floor_update_vehicle)
                        console.log("floor", JSON.parse(JSON.stringify(floor_update_vehicle)))
                        // console.log("clean_floor", JSON.parse(JSON.stringify(clean_floor)))

                        // Update the floor in the database
                        const { data:floor_update_response, error:floor_update_error } = await this.supabase
                            .from('floorplans')
                            .update(floor_update_vehicle)
                            .eq('id', floor.id)
                            .select()
                        // If there is an error, log it
                        if (floor_update_error) {
                            console.error("Error updating floor: " + floor.id)
                            console.error(floor_update_error)
                            alert(floor_update_error.message)
                            throw floor_update_error
                        }
                        else {
                            // console.log("floor_update_response", floor_update_response)
                            alert(floor.label + " updated successfully")
                        }
                    }
                    // Check if the floor is deleted
                    // A floor that was created and deleted in the same session will also be
                    // In the deleted_floors array, so we'll check for that
                    else if (deleted_floor != undefined && floor.id == deleted_floor.id) {
                        
                        console.log("Deleting existing floor")
                        console.log(floor_update_vehicle)

                        // Delete the floor from the database
                        const { data:floor_delete_response, error:floor_delete_error } = await this.supabase
                            .from('floorplans')
                            .delete()
                            .eq('id', floor.id)
                        // If there is an error, log it
                        if (floor_delete_error) {
                            console.error("Error deleting floor: " + floor.id)
                            console.error(floor_delete_error)
                            alert(floor_delete_error.message)
                            throw floor_delete_error
                        }

                    }

                    
                }
                // Set the clean floors to the current floors
                this.floors_clean = JSON.parse(JSON.stringify(this.floors));
                
                // Cycle through the spaces
                for (let i = 0; i < this.spaces.length; i++) {
                    // Check if the space has changed
                    if (this.checkSpaceChanges(i)) {
                        
                        console.log("Updating " + this.spaces[i].name)

                        let space_update_vehicle = {
                            floor: this.spaces[i].floor,
                            location_internal: this.spaces[i].location_internal,
                        }
                        // Update the space in the database
                        const { data:space_update_response, error:space_update_error } = await this.supabase
                            .from('spaces')
                            .update(space_update_vehicle)
                            .eq('UUID', this.spaces[i].UUID)
                            .select()
                        // If there is an error, log it
                        if (space_update_error) {
                            console.warn("Error updating space: " + this.spaces[i].name)
                            console.error(space_update_error)
                            alert(space_update_error.message)
                            throw space_update_error
                        }
                        else {
                            // console.log("space_update_response", space_update_response)
                            alert(this.spaces[i].name + " updated successfully")
                        }
                    }
                }

                // Set the clean spaces to the current spaces
                this.spaces_clean = JSON.parse(JSON.stringify(this.spaces));

                // Check if the navigation nodes have changed
                if (this.checkNavNodeChanges()) {
                    // Update the navigation nodes in the database
                    // First, delete all the nodes for this building
                    const { data:delete_response, error:navNode_delete_error } = await this.supabase
                        .from('nav_nodes')
                        .delete()
                        .eq('building', this.building.UUID)
                    // If there is an error, log it
                    if (navNode_delete_error) {
                        console.error(navNode_delete_error)
                        alert(navNode_delete_error.message)
                        throw navNode_delete_error
                    }

                    // Create a new array of nodes without UUIDs to insert
                    let nodes_update_vehicle = []
                    
                    this.navigationNodes.map(node => {
                        nodes_update_vehicle.push(JSON.parse(JSON.stringify({
                            label: node.label,
                            node_type: node.node_type,
                            presence: node.presence,
                            location_up: node.location_up,
                            location_down: node.location_down,
                            building: node.building,
                        })));
                    });

                    // console.log("nodes_update_vehicle", nodes_update_vehicle)

                    // Then, insert the new nodes
                    const { data:insert_response, error:navNode_insert_error } = await this.supabase
                        .from('nav_nodes')
                        .insert(nodes_update_vehicle)
                    // If there is an error, log it
                    if (navNode_insert_error) {
                        console.error(navNode_insert_error)
                        alert(navNode_insert_error.message)
                        throw navNode_insert_error
                    }
                    else {
                        alert("Navigation nodes updated successfully")
                    }

                    // Set the clean nodes to the current nodes
                    this.navigationNodes_clean = JSON.parse(JSON.stringify(this.navigationNodes));
                }

                // Call the getBuilding function to refresh the building object and all the dependent objects
                this.getBuilding(this.building.canonical);
                // Remove the map, if it exists
                this.removeMap();

            },
            
            handleFloorImageSelect(floor) { 
                // Get the file from the input specified by the floor number
                // Set the image of the floor to the file to preview

                // Get the file
                let input_id = "floorSVGInput_" + floor;
                let file_input = document.getElementById(input_id);
                const file = file_input.files[0];
                // Set the floor image to the file
                this.floors[floor].url = URL.createObjectURL(file);
                // Attach the file to the floor object
                this.floors[floor].file = file;
                // Refresh the map
                this.mapInit();
            },

            handleNewFloorImageSelect() { 
                // Get the file from the input
                // Set the image of the floor to the file to preview

                // Get the file
                let file_input = document.getElementById("newFloorSVGInput");
                const file = file_input.files[0];
                // Set the floor image to the file
                this.newFloor.url = URL.createObjectURL(file);
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {

                // Call the getBuilding function to refresh the building object and all the dependent objects
                this.getBuilding(this.building.canonical);

            },

            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns a list of the fields that have been changed
            getChanges() {},

            // This function adds a log entry to the database
            logChange() {},

            // This function fetches the building from the database based on it's canonical name
            async getBuilding(canonical){

                // Remove the map, if it exists
                this.removeMap();
                
                // For testing: Set canonical to "arts-building"
                // canonical = "arts-building";
                // console.log("Fetching floorplans for: " + canonical);

                // Try run this.map.remove, print to the console if it fails
                try {
                    this.removeMap();
                }
                catch (error) {
                    console.log("Attempted to clear map before loading new building, but there was no map to clear");
                }

                // Get the relevant building fields from the database
                // Since we are using the canonical name, we should only get one result
                let { data: bld, error } = await this.supabase
                    .from('buildings')
                    .select('canonical, entry_floor, display_name, UUID, internal_map_size')
                    // .select('canonical, display_name, UUID')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Deep copy the building object to the vue instance
                    this.building = JSON.parse(JSON.stringify(bld[0]));
                    // console.log("Building", this.building);
                    // Deep copy the building object so we have comparison data
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    
                    // Call the getFloors and getSpaces functions
                    this.getSpaces(this.building.UUID);
                    // Floors need to be awaited because we use the floor count to validate the navigation nodes
                    await this.getFloorplans(this.building.UUID);
                    this.getNavigationNodes(this.building.UUID);

                }
                
            },

            async getFloorplans(building_uuid){

                // Null the floors arrays
                this.floors = [];
                this.floors_clean = [];
                this.floor_layers_object = {};
                this.deleted_floors = [];

                // Fetch the floorplans for the building from the database
                let { data: flr, error } = await this.supabase
                    .from('floorplans')
                    .select('*')
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

                    // If there is only one floor, don't try to sort the floors
                    if (this.floors.length > 1) {
                        // Sort the floors by level
                        this.floors.sort((a, b) => (a.level > b.level) ? 1 : -1)
                        this.floors_clean.sort((a, b) => (a.level > b.level) ? 1 : -1)
                    }

                    // If there are no floors, don't try to set the entry floor
                    if (this.floors.length > 0) {
                        // Set the entry floor
                        this.setEntryFloor(this.building.entry_floor, true);
                    }
                }
            },

            // Check if the building details (map size, entry floor) have changed
            checkBuildingChanges(){
                // Dump the building and building_clean to JSON and compare
                if (JSON.stringify(this.building) != JSON.stringify(this.building_clean)) {
                    return true;
                }

                return false;
            },
                
            // Check if the floors have changed
            checkFloorChanges(){
                // Dump the floors and floors_clean to JSON and compare
                if (JSON.stringify(this.floors) != JSON.stringify(this.floors_clean)) {
                    return true;
                }

                return false;
            },

            // Check if the spaces have changed
            checkSpaceChanges(i = null){

                // If i is null, check all the spaces
                if (i == null) {
                    // Dump the spaces and spaces_clean to JSON and compare
                    if (JSON.stringify(this.spaces) != JSON.stringify(this.spaces_clean)) {
                        return true
                    }
                    return false;
                }
                // If i is not null, check only the space at index i
                else {
                    // Dump the space and space_clean to JSON and compare
                    // console.log("Space:", this.spaces[i])
                    // console.log("Space_clean:", this.spaces_clean[i])
                    if (JSON.stringify(this.spaces[i]) != JSON.stringify(this.spaces_clean[i])) {
                        return true
                    }
                    return false;
                }
            },

            // Check if the navigation nodes have changed
            checkNavNodeChanges(){
                // Dump the navigationNodes and navigationNodes_clean to JSON and compare
                if (JSON.stringify(this.navigationNodes) != JSON.stringify(this.navigationNodes_clean)) {
                    return true
                }
                return false;
            }

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
    grid-template-columns:  8rem 10rem auto 8rem 8rem 2rem;
    grid-template-rows: auto;
    row-gap: 1rem;
    column-gap: 1rem;
}

.show-this{
    border-color: black;
    border-width: 1px;
    border-style: solid;
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