<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'buildings'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminBuildingSelector 
            @activeBuildingChanged="getBuilding($event)"
            :supabase_client="supabase"/>
            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Building Management | 
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
                    <!-- Two columns -->
                    <!-- Column 1 contains input boxes -->
                    <!-- Column 2 contains infoPage components -->
                    <!-- The input boxes are paired to the components to allow for live editing -->
                    <!-- The input boxes and components are left aligned in their respective colum -->
                
                    <!-- <Summary> -->
                    <div class="row border-b">
                        <!-- Input -->
                        <div class="col d-flex flex-column">
                            <!-- Building Name -->
                            <div class="mb-3">
                                <label for="TitleInput" class="form-label">Building Name</label>
                                <input id="TitleInput" type="text" class="form-control" 
                                v-model="building.display_name">
                            </div>

                            <!-- Aka -->
                            <div class="mb-3">
                                <label for="AkaInput" class="form-label">AKA <small>(optional)</small></label>
                                <input id="AkaInput" type="text" class="form-control" 
                                v-model="building.aka">
                            </div>

                            <!-- Primary Image -->
                            <div class="mb-3">
                                <label for="PrimaryImageInput" class="form-label">Primary Image</label>
                                <input id="PrimaryImageInput" type="file" class="form-control" 
                                @change="handlePrimaryImageSelect">
                            </div>
                            <!-- Primary image alt text -->
                            <div class="mb-3">
                                <label for="PrimaryImageAltInput" class="form-label">Primary Image Alt Text</label>
                                <input id="PrimaryImageAltInput" type="text" class="form-control" 
                                v-model="building.primary_image_alt">
                            </div>
                        </div>

                        <!-- Preview -->
                        <div class="col">
                            <!-- Name -->
                            <div class="info-page-title" style="grid-area: title;">
                                <h1>{{building.display_name}}</h1>
                                <p v-if="building.aka" id="aka" style="display:block"><b>Also Known as:</b> {{building.aka}}</p>
                            </div>

                            <!-- Primary Image -->
                            <div class="mb-3">
                                <!-- MainPicure component preprocesses for null image, so we can't use it -->
                                <!-- Because we want to dynamically change the image and alt text -->
                                <img 
                                class="primary-image-preview"
                                :src="building.primary_image_url"
                                :alt="building.primary_image_alt">
                            </div>    
                        </div>
                    </div>

                                <!-- Description -->
                    <div class="row border-bottom mb-3">
                        <!-- Input -->
                        <div class="col">
                            <label for="descInput" class="form-label">Description</label>
                            <textarea class="form-control" id="descInput" rows="4" 
                            v-model="building.description"></textarea>
                        </div>
                        <!-- Preview -->
                        <div class="col" id="description" style="grid-area: desc; justify-self: start;">
                            <h3>Description</h3>
                            <p>{{building.description}}</p>
                        </div>
                    </div>
                           
                
                    <!-- Opening Times -->
                    <div class="row mt-3 pb-3 border-bottom"><label class="form-label d-block">Opening Times</label>
                        <div class="col d-flex flex-column">
                            <!-- Weekdays -->
                            <div class="row">
                                <div class="col">
                                    <label for="weekDay-checkbox" >Weekdays</label>
                                    <input type="checkbox" id="weekDay-checkbox" class="form-check-input form-control"
                                    v-model="building.opening_times.weekday.open" />
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Opening Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="building.opening_times.weekday.times[0]" 
                                    :disabled="!building.opening_times.weekday.open"/>
                                </div>
                                <div class="col">
                                    <label for="weekDay-open">Closing Time</label>
                                    <input type="time" id="weekDay-open" class="form-control"
                                    v-model="building.opening_times.weekday.times[1]" 
                                    :disabled="!building.opening_times.weekday.open"/>
                                </div>
                            </div>
                            <!-- Saturdays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sat-checkbox">Saturday</label>
                                    <input type="checkbox" id="sat-checkbox" class="form-check-input form-control"
                                    v-model="building.opening_times.sat.open" />
                                </div>
                                <div class="col">
                                    <label for="sat-open">Opening Time</label>
                                    <input type="time" id="sat-open" class="form-control"
                                    v-model="building.opening_times.sat.times[0]" 
                                    :disabled="!building.opening_times.sat.open"/>
                                </div>
                                <div class="col">
                                    <label for="sat-close">Closing Time</label>
                                    <input type="time" id="sat-close" class="form-control"
                                    v-model="building.opening_times.sat.times[1]" 
                                    :disabled="!building.opening_times.sat.open"/>
                                </div>
                            </div>
                            <!-- Sundays -->
                            <div class="row">
                                <div class="col">
                                    <label for="sunday-checkbox">Sunday & Public Holidays</label>
                                    <input type="checkbox" id="sunday-checkbox" class="form-check-input form-control"
                                    v-model="building.opening_times.holidays.open" />
                                </div>
                                <div class="col">
                                    <label for="sunday-open">Opening Time</label>
                                    <input type="time" id="sunday-open" class="form-control"
                                    v-model="building.opening_times.holidays.times[0]" 
                                    :disabled="!building.opening_times.holidays.open"/>
                                </div>
                                <div class="col">
                                    <label for="sunday-close">Closing Time</label>
                                    <input type="time" id="sunday-close" class="form-control"
                                    v-model="building.opening_times.holidays.times[1]" 
                                    :disabled="!building.opening_times.holidays.open"/>
                                </div>
                            </div>

                            <!-- Note -->
                            <div class="mt-3">
                                <label for="timeNoteInput" class="form-label">Note <small>(optional)</small></label>
                                <input id="timeNoteInput" type="text" class="form-control" 
                                v-model="building.opening_times.note">
                            </div>
                        </div>

                        <div class="col">
                            <Timebox
                                :times="building.opening_times"/>
                        </div>
                    </div>

                    <!-- Infobox -->
                    <div class="row mt-3 border-bottom">
                        <div class="col">
                            <!-- Sensory -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="building.sense_exp_display" id="SenseDisplay">
                                    <label class="form-check-label" for="SenseDisplay">
                                        Sensory Experience
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.sense_exp"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Sensory Experience Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control" 
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="building.sense_exp_video">
                                </div>
                            </div>
                            <!-- Wayfinding -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="building.wayfinding_display" id="WayfindDisplay">
                                    <label class="form-check-label" for="WayfindDisplay">
                                        Wayfinding
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.wayfinding"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Sensory Experience Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control" 
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="building.wayfinding_video">
                                </div>
                            </div>
                            <!-- Physical -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="building.phys_access_display" id="PhysicalDisplay">
                                    <label class="form-check-label" for="PhysicalDisplay">
                                        Physical Experience
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.phys_access"></textarea>
                                <!-- video link -->
                                <div class="mt-3">
                                    <!-- <label for="videolink" class="form-label"><small>Youtube link</small></label> -->
                                    <input id="videolink" type="text" class="form-control"
                                    placeholder="Youtube link" 
                                    title="Youtube link for embedding"
                                    v-model="building.phys_access_video">
                                </div>
                            </div>
                        </div>

                        <div class="col">
                            <Infobox
                            :contentArray="infoBoxContent"
                            />
                        </div>
                    </div>
                    
                    <!-- Tips -->
                    <div class="row mt-3 pb-3 border-bottom">
                        <!-- Edit -->
                        <div class="col">
                            <!-- Loop through the tips as text inputs -->
                            <div class="mb-3">
                                <div v-for="(tip, index) in building.tips" :key="index" class="input-group mb-2">
                                    <input type="text" class="form-control" v-model="building.tips[index]" placeholder="New Tip">
                                    <button class="btn btn-warning" type="button" @click="removeTip(index)">Remove</button>
                                </div>
                                <!-- Button to add a new tip -->
                                <button class="btn btn-success" type="button" @click="addTip()">Add Tip</button>
                            </div>
                            
                        </div>
                        <!-- Display -->
                        <div class="col">
                            <AccessTips :tips="building.tips" entity="building"/>
                        </div>
                        
                    </div>


                <!-- Additional Information -->
                    <div class="row mt-3 border-b">
                        <!-- Edit -->
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="building.furtherinfo_display" id="furtherInfoDisplay">
                                <label class="form-check-label" for="furtherInfoDisplay">
                                    Further Information
                                </label>
                            </div>
                            <textarea class="form-control" id="descInput" rows="4" 
                            v-model="building.further_info"></textarea>
                        </div>
                        <!-- Display -->
                        <div class="col">
                            <div
                            v-if="building.furtherinfo_display">
                                <AdditionalInfo 
                                :info="building.further_info"/>
                            </div>
                        </div>
                    </div>

                    <!-- Map Preview-->
                    <div class="map-section border-top border-1 border-black pt-3 mt-3" v-if="building.geometry" style="display: none;">
                        <!-- Space type and location -->
                        <!-- Inputs -->
                        <div style="grid-area: 'input';" class="me-2">    
                            <!-- Lat and long inputs -->
                            <div class="mb-3">
                                <label for="coordinates">Building Shape</label>
                                <textarea 
                                class="form-control" 
                                id="coordinates" 
                                rows="4" 
                                v-model="building.further_info">
                                </textarea>
                                
                            </div>
                            <!-- Display Settings -->
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" v-model="building.always_display" id="always_display">
                                <label class="form-check-label" for="always_display">
                                    Always Display
                                </label>
                            </div>
                        </div>
                        <!-- Map -->
                        <div  id="building-placement-map" style="height: 600px; padding-top: 30px; grid-area: 'input';"></div>
                    </div>
                    <p></p>
                    <!-- Gallery -->
                    <div class="row">
                        <h3 class="mt-3">Gallery Images</h3>

                        <table class="table w-100 mx-2">
                            <thead>
                                <tr>
                                    <th scope="col">File</th>
                                    <th scope="col">Alt Text <span class="fw-normal text-danger text-small">*Required</span></th>
                                    <th scope="col">Caption</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(image, index) in gallery">
                                    <td style="white-space: nowrap; text-overflow: ellipsis; overflow: clip; max-width: 400px;">
                                        <a :href="image.url" target="_blank"> {{ image.url }}</a>
                                    </td>
                                    <td><input type="text" placeholder="Alt Text" v-model="image.alt"></td>
                                    <td><input type="text" placeholder="Caption" v-model="image.caption"></td>
                                    <td>
                                        <div class="btn-group" role="group">
                                            <!-- Save -->
                                            <!-- To be a valid edit, alt must be provided -->
                                            <button 
                                            type="button" 
                                            class="btn" 
                                            :class="galleryImageHasBeenChanged(index) ? 'btn-success' : 'btn-outline-secondary'"
                                            @click="updateGalleryImage(index)"
                                            :disabled="!(galleryImageHasBeenChanged(index) && image.alt.length > 0)">
                                                Save Changes
                                            </button>
                                            <!-- Cancel -->
                                            <button 
                                            type="button" 
                                            class="btn"
                                            :class="galleryImageHasBeenChanged(index) ? 'btn-warning' : 'btn-outline-secondary'"
                                            @click="revertGalleryImage(index)"
                                            :disabled="!galleryImageHasBeenChanged(index)">
                                                Cancel
                                            </button>
                                            <!-- Delete -->
                                            <button 
                                            class="btn btn-danger" 
                                            type="button" 
                                            title="This cannot be undone"
                                            @click="removeGalleryImage(index, image.url)">Remove</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input 
                                        type="file" 
                                        id="myFile" 
                                        name="newGalleryImage" 
                                        accept="image/png, image/jpg, image/jpeg"
                                        @change="handleFileUpload">
                                    </td>
                                    <td><input type="text" placeholder="Alt Text" v-model="newGalleryImage.alt"></td>
                                    <td><input type="text" placeholder="Caption" v-model="newGalleryImage.caption"></td>
                                    <td>
                                        <!-- The add button will only become active when a file has been uploaded, and alt text have been provided -->
                                        <button 
                                        class="btn btn-success" 
                                        type="button"
                                        @click="addGalleryImage()"
                                        :disabled="!(newGalleryImage.selectedFile && newGalleryImage.alt.length > 0)">
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                </div>
                <AdminMarkdownModal 
                :modalOpen="markdownModalOpen" 
                @modalClose="markdownModalOpen = false"
                />
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
                building: {},
                building_clean: {},
                gallery: [],
                gallery_clean: [],
                markdownModalOpen: false,
                supabase: {},
                newGalleryImage: {
                    selectedFile: null,
                    alt: "",
                    caption: "",
                },
            }
        },
        created() {
            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

            // this.mapInit();
            
        },
        computed: {
            infoBoxContent() {
                // return [
                //     {
                //         title: "Sensory Experience",
                //         content: this.building.sense_exp || "No information provided",
                //         display: this.building.sense_exp_display || false
                //     },
                //     {
                //         title: "Wayfinding",
                //         content: this.building.wayfinding || "No information provided",
                //         display: this.building.wayfinding_display || false
                //     },
                //     {
                //         title: "Physical Access",
                //         content: this.building.phys_access || "No information provided",
                //         display: this.building.phys_access_display || false
                //     },
                // ];
                return setInfoBoxContent(this.building);
            },
            buildingHasBeenChanged() {
                // This function compares the current state of the building against the state it was in when the page was loaded
                return JSON.stringify(this.building) !== JSON.stringify(this.building_clean);
            },
            
        },
        methods: {
            // Create the map
            async mapInit(){
                // Initialise the map
                // Wait for this function to have loaded
                while (typeof buildingSelectMapInit !== "function") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Once the function is loaded, we can call it
                // This function will initialise the map and add the marker
                // We provide a callback function to update the space's location when the marker is moved
                buildingSelectMapInit(this.updateBuildingGeometry, this.supabase);
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

            // Attempts to create a new building with the given canonical name
            async newBuilding(canonical) {
                // Check if the building already exists
                let { data: bld, error } = await this.supabase
                    .from('buildings')
                    .select('*')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // If the building already exists, return false
                    if (bld.length > 0) {
                        return false;
                    }
                    // If the building does not exist, create it
                    else {
                        let { data: bld, error } = await this.supabase
                            .from('buildings')
                            .insert([
                                { canonical: canonical }
                            ])
                        if (error) {
                            console.error(error)
                            alert(error.message)
                            throw error
                        }
                        else {
                            return true;
                        }
                    }
                }
            },

            // This function adds a log entry to the database
            logChange() {},

            // This function fetches the building from the database based on it's canonical name
            async getBuilding(canonical){
                console.log("Fetching building: " + canonical);

                // Fetch the building from the database
                // Since we are using the canonical name, we should only get one result
                let { data: bld, error } = await this.supabase
                    .from('buildings')
                    .select('*')
                    .eq('canonical', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    // Fill in the gaps with sensible defaults, but only on hot copy
                    // This will highlight to the user when a field is about to be set to a default
                    this.building = this.fillInTheGaps( JSON.parse( JSON.stringify(bld[0]) ) );

                    // Grab all the images for this building, attach them to the building object
                    this.getGallery(canonical);

                    // Deep copy the building object so we have comparison data
                    this.building_clean = JSON.parse(JSON.stringify(this.building));
                    
                    // Update the map to show the building
                    // this.loadBuildingToMap();

                }
                
            },

            // this function fetches all the images for a given building
            async getGallery(canonical){
                let { data: imgs, error } = await this.supabase
                    .from('building_gallery_images')
                    .select('*')
                    .eq('building', canonical)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    // console.log(imgs);
                    this.gallery = JSON.parse(JSON.stringify(imgs));
                    this.gallery_clean = JSON.parse(JSON.stringify(imgs));
                }
            },
            galleryImageHasBeenChanged(index){
                // Check the gallery images array against the clean copy
                return JSON.stringify(this.gallery[index]) !== JSON.stringify(this.gallery_clean[index]);
            },

            revertGalleryImage(index){
                // Deep copy the clean copy back into the gallery
                this.gallery[index] = JSON.parse(JSON.stringify(this.gallery_clean[index]));

            },


            // Once a building has been fetched, this function will fill in any gaps in object data
            // For example, if a building has no opening times, this function will add sensible defaults
            // and will generate a full empty template for new buildings
            // Protects against render errors when fields are updated
            fillInTheGaps(b){

                // Deep copy the building
                let gapsFilled = JSON.parse( JSON.stringify(b) );

                // Cycle through every section of the model
                // If no data exists, populate with a sensible default
                // Display Name
                if (!b.display_name) gapsFilled.display_name = "Building Name";
                // Description
                if (!b.description) gapsFilled.description = "Descritpion";
                
                // Opening Times
                if (!b.opening_times) gapsFilled.opening_times = {
                    weekday: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    sat: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    holidays: {
                        open: false,
                        times: ["08:00", "17:00"],
                    },
                    note: "",
                }
                  
                return gapsFilled;

            },
            
            // This function adds a new tip to the building
            addTip() {
                this.building.tips.push("");
            },

            // This function removes a tip from the building
            removeTip(index) {
                this.building.tips.splice(index, 1);
            },
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

.primary-image-preview{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
    width: min(25rem, calc(100vw - 6rem));
    margin: 0 min(3rem, 3vw) 0 min(3rem, 3vw);
}

</style>