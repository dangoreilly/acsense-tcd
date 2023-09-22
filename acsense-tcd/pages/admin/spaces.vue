<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'spaces'">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminStudentSpaceSelector 
            @activeSpaceChanged="getStudentSpace($event)"/>
            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Space Management | <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4">{{ space.canonical }}</span>
                    </h1>

                    <div class="d-flex align-items-center m-3 fs-5">
                        <!-- <span 
                        @click="updateSpace()"
                        :disabled="!spaceHasBeenChanged"
                        class="badge rounded-pill text-bg-info" 
                        style="cursor: pointer;">
                            Save Changes
                        </span> -->
                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="spaceHasBeenChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updateSpace()"
                            :disabled="!spaceHasBeenChanged">
                                Save Changes
                            </button>

                            <button 
                            type="button" 
                            class="btn"
                            :class="spaceHasBeenChanged ? 'btn-warning' : 'btn-outline-secondary'"
                            @click="cancelChanges()"
                            :disabled="!spaceHasBeenChanged">
                                Cancel
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Main Matter -->
                <!-- Only render if the space has loaded -->
                <div class="mainMatter-admin" v-if="space">

                    <!-- Two columns -->
                    <!-- Column 1 contains input boxes -->
                    <!-- Column 2 contains a modal preview -->
                    <!-- The input boxes are paired to the components to allow for live editing -->

                    <div class="row border-b">
                        <!-- Edit block -->
                        <div class="col d-flex flex-column">
                            <div class="row d-flex">
                                <!-- Typey bits -->
                                <div class="flex-fill">
                                    <div class="col flex-column" style="grid-column: auto;">
                                        <!-- Space Name -->
                                        <div class="mb-2">
                                            <label for="nameInput" class="form-label">Name</label>
                                            <input id="nameInput" type="text" class="form-control" 
                                            v-model="space.name">
                                        </div>

                                        <!-- Description -->
                                        <div class="mb-2">
                                            <label for="descInput" class="form-label">Description</label>
                                            <textarea class="form-control" id="descInput" rows="4" 
                                            v-model="space.description"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                            <!-- clicky bits -->
                                <div class="col">
                                    <!-- Seating -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.seating" id="seating">
                                        <label class="form-check-label" for="seating">
                                            Seating
                                        </label>
                                    </div>
                                    <!-- sockets -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.outlets" id="sockets">
                                        <label class="form-check-label" for="sockets">
                                            Plug Sockets
                                        </label>
                                    </div>
                                    <!-- eating -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.food_drink_allowed" id="eating">
                                        <label class="form-check-label" for="eating">
                                            Food/Drink Allowed
                                        </label>
                                    </div>
                                </div>
                                <div class="col">
                                    <!-- microwave -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.microwave" id="microwave">
                                        <label class="form-check-label" for="microwave">
                                            Microwave
                                        </label>
                                    </div>
                                    <!-- kettle -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.kettle" id="kettle">
                                        <label class="form-check-label" for="kettle">
                                            Kettle
                                        </label>
                                    </div>
                                    <!-- wheelchair -->
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="space.wheelchair" id="access">
                                        <label class="form-check-label" for="access">
                                            Wheelchair Access
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <!-- Building selector -->
                            <div class="row ms-1 pt-2 border-top mt-2">
                                <label for="buildingSelect" class="form-label">Building</label>
                                <select 
                                class="form-select" 
                                id="buildingSelect" 
                                v-model="space.building">
                                    <option value="null">None</option>
                                    <option 
                                    v-for="bld in buildings"
                                    :key="bld.canonical"
                                    :value="bld.canonical">
                                    {{ bld.display_name }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Preview block -->
                        <div class="col">
                            <admin-space-modal-preview :space="space"/>
                        </div>
                    </div>

                    <!-- Map Preview-->
                    <div class="map-section border-top border-1 border-black pt-3 mt-3" v-if="space.location">
                        <!-- Space type and location -->
                        <!-- Inputs -->
                        <div style="grid-area: 'input';" class="me-2">    
                            <!-- Lat and long inputs -->
                            <div>
                                <div class="mb-3">
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
                            </div>
                            <!-- Space Type -->
                            <div class="mb-3">
                                <label for="spaceType" class="form-label">Space Type</label>
                                <select 
                                class="form-select" 
                                id="spaceType" 
                                @update="updateSpaceIcon()"
                                v-model="space.type">
                                    <option disabled value="">Select Space Type</option>
                                    <option 
                                    v-for="type in space_types"
                                    :key="type.category"
                                    :value="type.category">
                                    {{ type.category }}
                                    </option>
                                </select>

                                <!-- Icon Display -->
                                <div class="mt-3">
                                    <img 
                                    :src="getImageForSpaceType(space.type)" 
                                    style="width: 100%;">
                                </div>
                            </div>
                        </div>
                        <!-- Map -->
                        <div  id="space-placement-map" style="height: 600px; padding-top: 30px; grid-area: 'input';"></div>
                    </div>

                </div>

                <!-- <AdminMarkdownModal 
                :modalOpen="markdownModalOpen" 
                @modalClose="markdownModalOpen = false"
                /> -->

            </div>
        </main>
    </NuxtLayout>
</template>

<script setup>
    
//Script setup needed for UseHead
import '~/assets/css/leaflet.css'

useHead({

    link: [
        {
            rel:"stylesheet",
            href:"https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css"
        },
    ],
    script: [
        {
            src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
            crossorigin: "",
        },
        {
            src: 'https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.min.js',
            body: true,
        },
        // {
        //     src: '/javascript/mapInit.js',
        //     body: true,
        // },
        // {
        //     src: 'https://unpkg.com/@supabase/supabase-js@2',
        // },
        {
            src: '/javascript/adminMapFunctions.js',
        },
        {
            src: '/javascript/mapFunctions.js',
        },
    ]
});



</script>

<script>
import {createClient} from '@supabase/supabase-js';

    export default {
        data() {
            return {
                space: {},
                space_clean: {},
                markdownModalOpen: false,
                supabase: {},
                space_types: [],
                buildings: [], 
                user: {},
            }
        },
        created() {


            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)
            // Get the user's api key
            this.user = this.getUserData();
            // Grab all the space types
            this.getSpaceTypes();
            // Grab all the buildings
            this.getBuildingList();

            this.mapInit();

        },
        computed: {
            spaceHasBeenChanged() {
                // This function compares the current state of the space against the state it was in when the page was loaded
                // console.log("Checking if space has been changed")
                // console.log(this.space)
                // console.log(this.space_clean)
                return JSON.stringify(this.space) !== JSON.stringify(this.space_clean);
            },
        },
        // mounted() {
        // },
        methods: {
            async mapInit(){
                // Initialise the map
                // Wait for this function to have loaded
                while (typeof spaceSelectMapInit !== "function") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Once the function is loaded, we can call it
                // This function will initialise the map and add the marker
                // We provide a callback function to update the space's location when the marker is moved
                spaceSelectMapInit(this.updateSpaceLocation, this.supabase);
            },

            async getUserData(){
                
                const { data, error } = await this.supabase.auth.getSession()

                return data;
            },

            // This function fetches the student space from the database based on it's canonical name
            async getStudentSpace(canonical){
                console.log("Fetching space: " + canonical);

                // Fetch the space from the database
                // Since we are using the canonical name, we should only get one result
                let { data: space, error } = await this.supabase
                    .from('spaces')
                    .select('*')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    // Update the space object with the new data
                    this.space = space[0];

                    // Deep copy the space object so we have comparison data
                    this.space_clean = JSON.parse(JSON.stringify(this.space));

                    // Update the map to show the space
                    this.loadSpaceToMap();

                }
                
            },

            async getBuildingList(){
                // Fetch the building list from the database
                let { data: buildings, error } = await this.supabase
                    .from('buildings')
                    .select('canonical, display_name, UUID')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Update the space object with the new data
                    // console.log("Buildings:")
                    // console.log(buildings);
                    this.buildings = sortArrayOfObjectsByKey(buildings, "display_name");
                }
            },

            async getSpaceTypes(){
                // Fetch the space types from the database
                let { data: space_types, error } = await this.supabase
                    .from('space_styles')
                    .select('*')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // Update the space object with the new data
                    console.log("Space types:")
                    console.log(space_types);
                    this.space_types = space_types;
                }
            },

            getImageForSpaceType(type){
                // Cycle through space types
                // When the category field matches the input, return the image
                // If there are no matches, return the placeholder image
                for (let i = 0; i < this.space_types.length; i++) {
                    if (this.space_types[i].category == type){
                        return this.space_types[i].icon;
                    }
                }    
                return '/images/red-dot.png';
            },

            async updateSpaceIcon(){
                // Update the space icon on the map
                // This function is called when the space type is changed
                // It will update the icon on the map to match the new space type
                console.log("Updating map icon")
                let newIcon = this.getImageForSpaceType(this.space.type);

                
                // Wait for this function to have loaded
                while (typeof spaceSelectMapUpdateIcon !== "function" ) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Wait for the leaflet object L to have loaded
                while (typeof L === "undefined") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // If Leaflet is loaded and the function is defined, we're ready to rock
                spaceSelectMapUpdateIcon(newIcon);
            },

            async loadSpaceToMap(){
                // When the space selection is changed, this function is called
                // It will update the marker's location to the space's location
                // It will also update the icon to match the space type

                // Update the marker's location
                // Wait for this function to have loaded
                while (typeof spaceSelectMapUpdateMarkerLocation !== "function") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Wait for the leaflet object L to have loaded
                while (typeof L === "undefined") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // If Leaflet is loaded and the function is defined, we're ready to rock

                spaceSelectMapUpdateMarkerLocation(this.space.location);

                // Update the marker's icon
                this.updateSpaceIcon();
            },

            // Function to be passed to the marker on init
            updateSpaceLocation(newLocation){
                this.space.location = newLocation;
            },

            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            async updateSpace() {

                // Create an empty object to store the update query
                // Only contains the things we want to update
                let update_vehicle = {
                    name: this.space.name,
                    description: this.space.description,
                    type: this.space.type,
                    seating: this.space.seating,
                    outlets: this.space.outlets,
                    food_drink_allowed: this.space.food_drink_allowed,
                    microwave: this.space.microwave,
                    kettle: this.space.kettle,
                    wheelchair: this.space.wheelchair,
                    building_uuid: this.space.building_uuid,
                    building: this.space.building,
                    location: this.space.location,
                }

                // Match the building's UUID to the building's canonical name, since that wasn't done earlier
                // This is needed for the update query
                for (let i = 0; i < this.buildings.length; i++) {
                    if (this.buildings[i].canonical == this.space.building){
                        update_vehicle.building_uuid = this.buildings[i].UUID;
                    }
                }

                // Update the space in the database
                const { data, error } = await this.supabase
                    .from('spaces')
                    .update(update_vehicle)
                    .eq('UUID', this.space.UUID)
                    .select()
                
                // If there is an error, log it
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // If the update was successful, update the clean space object
                    this.space_clean = JSON.parse(JSON.stringify(this.space));
                    alert(this.space.name + " updated successfully")
                    console.log(data)
                }
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {

                // console.log("Current copy:")
                // console.log(JSON.parse(JSON.stringify(this.space)))

                // console.log("Clean copy:")
                // console.log(JSON.parse(JSON.stringify(this.space_clean)))

                // Deep copy the space_clean object back into the space object
                this.space = JSON.parse(JSON.stringify(this.space_clean));

                // Update the map to show the space
                this.loadSpaceToMap();
            },

            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns a list of the fields that have been changed
            getChanges() {},

            // This function adds a log entry to the database
            logChange() {},
        },
    }

    definePageMeta({
        middleware: 'auth'
    })


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