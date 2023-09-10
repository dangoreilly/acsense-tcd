<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'buildings'" >
        <main class="d-flex flex-nowrap" style="height:100vh">

            <!-- Sidebar for building selection -->
            <AdminBuildingSelector 
            @activeBuildingChanged="getBuilding($event)"/>
            <!-- Main section for editing -->
            <div class="pt-1 px-4" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Building Management | <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4">{{ building.canonical }}</span>
                    </h1>

                    <!-- Construction Badge -->
                    <div class="d-flex align-items-center m-3 fs-5">
                        <span 
                        @click="saveBuilding()"
                        :disabled="!isBuildingChanged()"
                        class="badge rounded-pill text-bg-info" 
                        style="cursor: pointer;">
                            Save Changes
                        </span>
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
                
                    <!-- <Summary> (and building selection dropdown) -->
                    <div class="row border-b">
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

                            <!-- Description -->
                            <div class="mb-3">
                                <label for="descInput" class="form-label">Description</label>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.description"></textarea>
                            </div>

                        </div>
                        <div class="col">
                            <div class="info-page-title" style="grid-area: title;">
                                <h1>{{building.display_name}}</h1>
                                <p v-if="building.aka" id="aka" style="display:block"><b>Also Known as:</b> {{building.aka}}</p>
                            </div>
                                
                            <div id="description" style="grid-area: desc; justify-self: start;">
                                <h3>Description</h3>
                                <p>{{building.description}}</p>
                            </div>
                        </div>
                    </div>
                
                    <!-- Opening Times -->
                    <div class="row mt-3 border-b"><label class="form-label d-block">Opening Times</label>
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
                    <div class="row mt-3 border-b">
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
                            </div>
                            <!-- Wayfinding -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="building.wayfinding_disp" id="WayfindDisplay">
                                    <label class="form-check-label" for="WayfindDisplay">
                                        Wayfinding
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.wayfinding"></textarea>
                            </div>
                            <!-- Physical -->
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" v-model="building.phys_access_disp" id="PhysicalDisplay">
                                    <label class="form-check-label" for="PhysicalDisplay">
                                        Physical Experience
                                    </label>
                                </div>
                                <textarea class="form-control" id="descInput" rows="4" 
                                v-model="building.phys_access"></textarea>
                            </div>
                        </div>

                        <div class="col">
                            <Infobox
                            :contentArray="infoBoxContent"
                            />
                        </div>
                    </div>
                    
                    <!-- Tips -->
                    <div class="row mt-3 border-b">
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
                            <AccessTips :tips="building.tips" />
                        </div>
                    </div>


                <!-- Additional Information -->
                    <div class="row mt-3 border-b">
                        <!-- Edit -->
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" v-model="building.furtherinfo_disp" id="furtherInfoDisplay">
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
                            v-if="building.furtherinfo_disp">
                                <AdditionalInfo 
                                :info="building.further_info"/>
                            </div>
                        </div>
                    </div>

                    <!-- Gallery -->
                    <div class="row">
                        <h3 class="mt-3">Gallery Images</h3>
                        <table class="table w-100 mx-2">
                            <thead>
                                <tr>
                                    <th scope="col">File</th>
                                    <th scope="col">Alt Text</th>
                                    <th scope="col">Caption</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="image in building.gallery">
                                    <td style="white-space: nowrap; text-overflow: ellipsis; overflow: clip; max-width: 400px;">
                                        <a :href="image.url" target="_blank"> {{ image.url }}</a>
                                    </td>
                                    <td><input type="text" placeholder="Alt Text" v-model="image.alt"></td>
                                    <td><input type="text" placeholder="Caption" v-model="image.caption"></td>
                                    <td><button class="btn btn-danger" type="button">Remove</button></td>
                                </tr>
                                <tr>
                                    <td><input type="file" id="myFile" name="newGalleryImage"></td>
                                    <td><input type="text" placeholder="Alt Text"></td>
                                    <td><input type="text" placeholder="Caption"></td>
                                    <td><button class="btn btn-success" type="button">Add</button></td>
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

<script>
import {createClient} from '@supabase/supabase-js';

    export default {
        data() {
            return {
                building: {},
                building_clean: {},
                markdownModalOpen: false,
                supabase: {},
            }
        },
        created() {
            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)
            
        },
        computed: {
            infoBoxContent() {
                return [
                    {
                        title: "Sensory Experience",
                        content: this.building.sense_exp || "No information provided",
                        display: this.building.sense_exp_display || false
                    },
                    {
                        title: "Wayfinding",
                        content: this.building.wayfinding || "No information provided",
                        display: this.building.wayfinding_disp || false
                    },
                    {
                        title: "Physical Access",
                        content: this.building.phys_access || "No information provided",
                        display: this.building.phys_access_disp || false
                    },
                ];
            }
        },
        methods: {
            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            saveBuilding() {

                // Update the whole building object

                // Loop through the gallery images, and update them individually

            },

            // Function to add a new gallery image to the building
            async addGalleryImage() {
                // Get the file from the input
                const file = document.getElementById("myFile").files[0];
                // Upload the file to the storage bucket
                // Get the URL of the uploaded file
                const { data, error } = await this.supabase.storage
                .from('gallery-images')
                .upload(`${this.building.id}_${file.name}`, file)
                // Add the image to the gallery
                this.building.gallery.push({
                    url: data.Location,
                    alt: "",
                    caption: "",
                })
            },

            // Function to remove a gallery image from the building
            async removeGalleryImage(index) {
                // Get the URL of the image to be removed
                const url = this.building.gallery[index].url;
                // Remove the image from the gallery
                this.building.gallery.splice(index, 1);
                // Delete the image from the storage bucket
                const { data, error } = await this.supabase.storage
                .from('gallery-images')
                .remove([url])
            },

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {},

            // This function checks the current state of the building against the state it was in when the page was loaded
            // It returns true if the building has been changed, and false if it has not
            isBuildingChanged() {},

            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns a list of the fields that have been changed
            getChanges() {},


            // This function compares the current state of the building against the state it was in when the page was loaded
            // It returns TRUE if the building has been changed, and FALSE if it has not
            isBuildingChanged() {
                // Just check equivalency of the whole building object to the clean copy
                return JSON.stringify(this.building) !== JSON.stringify(this.building_clean);
            },

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
                    this.building.gallery = await this.getGallery(canonical);

                    // Deep copy the building object so we have comparison data
                    this.building_clean = JSON.parse(JSON.stringify(this.building));

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
                    return imgs;
                }
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

</style>