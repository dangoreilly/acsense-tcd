<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'flyovers'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">
                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Flyovers
                    </h1>

                    <!-- Buttons -->
                    <!-- <div class="d-flex align-items-center m-3 fs-5">
                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="contentHasChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updateContent()"
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
                        </div>
                    </div> -->

                </div>
                <!-- Main Matter -->
                <div class="row border-b">
                <!-- Full preview map -->
                    <div class="container w-75">
                        <AdminOverlayPreview :overlays="overlays" :supabase_client="supabase"/>
                    </div>
                </div>

                <div class="row border-b mt-2">
                <!-- Operation notes -->
                    <div class="card">
                        <div class="card-body">
                            <span class="card-text d-block">To update the size of the overlays on the map, click on the red circles. Click once to begin resizing, and again to stop</span>
                            <span class="card-text d-block">To move the overlay, click anywhere within the red rectangle. Click once to begin moving the overlay, and again to stop</span>
                            <span class="card-text d-block">If using an SVG format image, the red rectangle will not relate to the actual dimensions of the overlay</span>
                            <span class="card-text d-block">For best results, always use SVG format overlays, as these will remain sharp on any screen and will not distort through resizing</span>
                            <!-- <span class="card-text d-block">To see changes reflected on the full preview map above, you need to click the "Save Bounds" button</span> -->
                        </div>
                    </div>
                </div>

                <div class="mt-3"  v-for="overlay, index in overlays">
                    <!-- We can calculate if an overlay is existing or new -->
                    <!-- Based on if it has an id field -->
                    <AdminOverlayEdit 
                    :overlay_array="overlays" 
                    :overlay="overlay" 
                    :overlay_clean="overlays_clean[index]"
                    :newOverlay="overlay.id == undefined"
                    :index="index"
                    @bounds-save="updateOverlayBounds"
                    @overlay-delete="deleteOverlay(index)"
                    @overlay-update="updateContent(index)"
                    @overlay-create="pushNewContent(index)"
                    @overlay-edit-cancel="cancelChanges(index)"
                    @overlay-url-edit="updateOverlayUrl"
                    @overlay-url-reset="resetOverlay"/>
                </div>
                <div class="container my-3">
                    <div class="row">
                        <div class="col-12">
                            <button class="btn btn-outline-primary w-100" @click="addNewOverlay()">Add New Overlay</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script lang=ts>
import type { Overlay, Space, Space_Type, Building } from "~/assets/types/supabase_types";
import {createClient} from '@supabase/supabase-js';
import { getBuildingList, addBuildings, getOverlays, addOverlays, getSpaces, addSpaces } from '~/utils/adminMapUtils'

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

export default {
    data() {
        return {
            supabase: Object as any,
            overlays: [] as Overlay[],
            overlays_clean: [] as Overlay[],
            new_overlay: {
                url: useRuntimeConfig().public.supabaseUrl + '/storage/v1/object/public/overlays/alignment/alignment_marks.svg',
                url_dark: '',
                high_detail: false,
                bounds: campusBounds,
            }
        }
    },
    computed: {
        contentHasChanged() {
            // Check if either the welcome text or the space types have changed
            // let welcomeChanged = this.welcome.mainContent !== this.welcome_clean.mainContent
            // let spaceTypesChanged = JSON.stringify(this.space_types) !== JSON.stringify(this.space_types_clean);

            // // Return true if either has changed
            // return welcomeChanged || spaceTypesChanged;
            return false
        }
    },
    created() {
        // Initialise the supabase client
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)
    },
    mounted() {
        // Get the overlays
        this.getOverlays();
    },
    methods: {
        async getOverlays() {
            // Get the overlays from the database
            const overlays = await getOverlays(this.supabase);

            // Set the overlays
            this.overlays = overlays;
            this.overlays_clean = JSON.parse(JSON.stringify(overlays));
        },

        resetOverlay(type: string, index: number){
            // Reset the overlay to the original value
            if (type == 'light')
                this.overlays[index].url = this.overlays_clean[index].url;
            else
                this.overlays[index].url_dark = this.overlays_clean[index].url_dark;
            // Clear the input
            // @ts-ignore
            document.getElementById(`${type}-${index}`).value = "";
        },

        updateOverlayBounds(index: number, bounds: any){
            // Update the bounds of the overlay 
            this.overlays[index].bounds = bounds;
            console.log("Bounds updated on overlay with id: " + this.overlays[index].id)
        },

        updateOverlayUrl(index: number, type: string, url: string){
            // Update the url of the overlay
            if (type == 'light'){
                this.overlays[index].url = url;
            }

            else
                this.overlays[index].url_dark = url;
        },

        async uploadNewOverlay(index: number, type: string){

            // Get the file
            // @ts-ignore
            let file = document.getElementById(`${type}-${index}`).files[0];
            // Get the file extension
            let extension = file.name.split('.').pop();
            
            // Make a canonical name for the space type
            let canonical = "";
            // Set the canonical name by the id
            canonical = `${type}-${this.overlays[index].id}`;
            // Build the new url for the file
            let newUrl = this.supabase.storageUrl + "/object/public/overlays/" + canonical + "." + extension;
            // Upsert the image
            const {data, error} = await upsertImage(this.supabase, 'overlays', `${canonical}.${extension}`, file)
            
            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            // Clear the icon input
            // @ts-ignore
            document.getElementById(`${type}-${index}`).value = "";

            return newUrl;

        },

        cancelChanges(index: number){

            // Check if this was a new overlay
            // If it was, remove it from the list
            if (this.overlays[index].id == undefined) {
                this.overlays.splice(index, 1);
                this.overlays_clean.splice(index, 1);
                return;
            }
            else{
                // Reset the overlay
                this.overlays[index] = JSON.parse(JSON.stringify(this.overlays_clean[index]))
            }

        },

        async deleteOverlay(index: number){
            // Confirm the deletion
            if (!confirm("Are you sure you want to delete this overlay?")) {
                return;
            }

            // let url = this.space_types[index].icon;
            let overlay_id = JSON.stringify(this.overlays[index].id);

            // Remove the database entry
            const access_token = await getSessionAccessToken(this.supabase);
            const {data: img, error:db_delete_error} = await removeFromTable(
                access_token, 
                "overlays", 
                { 
                    col: 'id', 
                    eq: overlay_id
                }
            )
            

            if (db_delete_error) {
                console.error(db_delete_error)
                alert(db_delete_error.message)
                throw db_delete_error
            }

            // Get the path by subtracting the supabase url from the image url
            let path_light = this.overlays[index].url.replace(this.supabase.storageUrl + "/object/public/overlays/", "");
            let path_dark = this.overlays[index].url_dark?.replace(this.supabase.storageUrl + "/object/public/overlays/", "");

            // Delete the image from the storage bucket
            const { data:storage_response, error:storage_error } = await this.supabase.storage
            .from('overlays')
            .remove([path_light, path_dark])

            if (storage_error) {
                console.error(storage_error)
                alert(storage_error.message)
                throw storage_error
            }
            // console.log("storage_response")
            // console.log(storage_response)


            // Remove the overlay at index
            this.overlays.splice(index, 1);
            this.overlays_clean.splice(index, 1);

            alert("Overlay deleted successfully")
        },

        async addNewOverlay(){

            // Add a new overlay to the list with the alignment marks
            this.overlays.push(JSON.parse(JSON.stringify(this.new_overlay)));
            this.overlays_clean.push(JSON.parse(JSON.stringify(this.new_overlay)));

        },
        
        async updateContent(index: number){

            const access_token = await getSessionAccessToken(this.supabase)
            
            // Update the overlays
            // for (let i = 0; i < this.overlays.length; i++) {

            // If the overlay has been updated, upload the new overlay
            if (this.overlays[index].url !== this.overlays_clean[index].url) {
                this.overlays[index].url = await this.uploadNewOverlay(index, 'light');
            }
            if (this.overlays[index].url_dark !== this.overlays_clean[index].url_dark) {
                this.overlays[index].url_dark = await this.uploadNewOverlay(index, 'dark');
            }

            let {data, error} = await updateTable(access_token, 'overlays',
                this.overlays[index],
                {
                    col:'id', 
                    eq: JSON.stringify(this.overlays[index].id)
                },
            )

            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            // Update the clean overlay
            this.overlays_clean[index] = JSON.parse(JSON.stringify(this.overlays[index]));

        },

        async pushNewContent(index: number) {

            // Add the new overlay to the database
            // Only upload the bounds for now, in case the image upload fails
            const access_token = await getSessionAccessToken(this.supabase);
            let {data, error} = await insertToTable(access_token, 'overlays', {
                url: "",
                url_dark: "",
                high_detail: false,
                bounds: this.overlays[index].bounds
            })

            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            console.log(data)
            // Update the id of the overlay
            this.overlays[index].id = data[0].id;

            // Upload the new default overlay
            this.overlays[index].url = await this.uploadNewOverlay(index, 'light');
            // If a dark version is included, upload the new overlay
            if (this.overlays[index].url_dark !== this.overlays_clean[index].url_dark) {
                this.overlays[index].url_dark = await this.uploadNewOverlay(index, 'dark');
            }

            // Now that we have the correct urls, update the overlay in the database
            let {data:image_add_data, error:image_add_error} = await updateTable(access_token, 'overlays',
                this.overlays[index],
                {
                    col:'id', 
                    eq: JSON.stringify(this.overlays[index].id)
                },
            )

            if (image_add_error) {
                console.error(image_add_error)
                alert(image_add_error.message)
                throw image_add_error
            }


            // Update the clean overlay
            this.overlays_clean[index] = JSON.parse(JSON.stringify(this.overlays[index]));

        }
    },
}
</script>

<style>


</style>