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
                            <label for="floorSelect" class="form-label">Set Active Floor</label>
                            <select class="form-select" id="floorSelect" 
                            v-model="activeFloor"
                            @change="moveToFloor(activeFloor)">
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
                            <input 
                            type="number" 
                            style="width:95%" 
                            :value="space.floor" 
                            min="0" max="5">
                            <!-- Space internal location -->
                            <input 
                            class="form-control"
                            type="text" 
                            :value="coordinatesToString(space.location_internal)" 
                            disabled readonly>
                        </div>
                    </div>


                    <!-- Map -->
                    <div  id="internal-map" style="height: 600px; padding-top: 30px;"></div>
                    

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
                EntryFloor: 1,
                supabase: {},
                spaces: [],
                spaces_clean: [],
                map: {},
                activeFloor: 0,
                activeFloor_object: {},
            }
        },
        created() {
            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

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
                this.getFloorplans(this.building.UUID);
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
                this.EntryFloor = newEntryFloor;

                // Set all floors to entryFloor = false
                this.floors.forEach((floor, index) => {
                    floor.isEntry = false;
                });

                // Set the entry floor to true by checking this.entryfloor
                this.floors[this.EntryFloor].isEntry = true;
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
                // Initialise the map
                // this.map = L.map('internal-map', {
                //     crs: L.CRS.Simple,
                //     zoomSnap: 0.25,
                //     zoomDelta: 0.25,
                //     maxBounds: bounds,
                //     maxZoom: 20,
                //     minZoom: -1,
                //     renderer: L.canvas({padding: 1})
                // }).fitBounds(bounds);

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

            removeMap(){
                this.map.remove();
            },

            coordinatesToString(coordinates){
                // Takes in an array of coordinates, returns a string
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
    grid-template-columns:  auto 6rem 18rem;
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


.map-section{
    /* Define the grid to give enough room for the map */
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-areas: "input map";
    grid-template-rows: auto;
}

.primary-image-preview{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
    width: min(25rem, calc(100vw - 6rem));
    margin: 0 min(3rem, 3vw) 0 min(3rem, 3vw);
}

</style>