<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'overlays'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">
                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Overlays
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

                <div class="mt-3"  v-for="overlay, index in overlays">
                    <AdminOverlayEdit 
                    :overlay_array="overlays" 
                    :overlay="overlay" 
                    :overlay_clean="overlays_clean[index]"
                    @overlay-edit-cancel="overlays[index] = JSON.parse(JSON.stringify(overlays_clean[index]))"
                    @bounds-save="updateOverlayBounds"/>
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
                url: '',
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

        updateOverlayBounds(id: number, bounds: any){
            // Update the bounds of the overlay with the given id
            for (let i = 0; i < this.overlays.length; i++){
                if (this.overlays[i].id == id){
                    this.overlays[i].bounds = bounds;
                    break;
                }
            }
        },

        handleOverlaySelect(evt: Event){
            // Get the file from the input
            // Set the iconOverride to the file to preview
            // const file = evt.target.files[0];

            // // Get the index of the space type
            // const index = evt.target.getAttribute("data-index");

            // if (index == "new")
            //     this.new_space.icon = URL.createObjectURL(file);
            // else
            //     this.space_types[index].icon = URL.createObjectURL(file);
             
        },

        async uploadNewCustomIcon(index: number){
            // Get the file object from the primary image upload input
            // Upsert to the storage bucket as the canonical name
            // TODO: Check if the file already exists under a different extension, and if so, delete it

            // // Get the file
            // let file = document.getElementById(`IconOverrideInput-${index}`).files[0];
            // // Get the file extension
            // let extension = file.name.split('.').pop();
            
            // // Make a canonical name for the space type
            // let spaceType_canonical = "";
            // if (index == "new")
            //     spaceType_canonical = this.new_space.category.toLowerCase().replace(/ /g, "_");
            // else
            //     spaceType_canonical = this.space_types[index].category.toLowerCase().replace(/ /g, "_");

            // // Build the new url for the file
            // let newUrl = this.supabase.storageUrl + "/object/public/icons/" + spaceType_canonical + "." + extension;
            // // Upsert the image
            // const {data, error} =  upsertImage(this.supabase, 'icons', `${spaceType_canonical}.${extension}`, file)
            
            // if (error) {
            //     console.error(error)
            //     alert(error.message)
            //     throw error
            // }

            // // Clear the icon input
            // document.getElementById(`IconOverrideInput-${index}`).value = "";

            // return newUrl;

        },

        cancelChanges(){
            // Reset the space types
            this.overlays = JSON.parse(JSON.stringify(this.overlays_clean));

        },

        async deleteOverlay(index: number){
            // let category = this.space_types[index].category;
            // // Confirm the deletion
            // if (!confirm("Are you sure you want to delete type '" + category + "'?")) {
            //     return;
            // }

            // let url = this.space_types[index].icon;

            // // Remove the database entry
            // const access_token = await getSessionAccessToken(this.supabase);
            // const {data: img, error:db_delete_error} = await removeFromTable(
            //     access_token, 
            //     "space_styles", 
            //     { 
            //         col: 'category', 
            //         eq: category,
            //     }
            // )
            

            // if (db_delete_error) {
            //     console.error(db_delete_error)
            //     alert(db_delete_error.message)
            //     throw db_delete_error
            // }

            // // Get the path by subtracting the supabase url from the image url
            // let path = url.replace(this.supabase.storageUrl + "/object/public/icons/", "");
            
            // // Delete the image from the storage bucket
            // const { data:storage_response, error:storage_error } = await this.supabase.storage
            // .from('icons')
            // .remove([path])

            // if (storage_error) {
            //     console.error(storage_error)
            //     alert(storage_error.message)
            //     throw storage_error
            // }
            // console.log("storage_response")
            // console.log(storage_response)


            // // Remove the space type at index
            // this.space_types.splice(index, 1);
            // // Remove the space count at index
            // this.space_counts.splice(index, 1);

            // alert("'"+category+"' deleted successfully")
        },

        async addNewOverlay(){

            // Upload the new 
            // this.new_space.icon = await this.uploadNewCustomIcon("new");

            // // Add the new space type to the database
            // const access_token = await getSessionAccessToken(this.supabase);
            // const {data, error} = await insertToTable(access_token, 'space_styles', 
            //     {
            //         category: this.new_space.category,
            //         descriptor: this.new_space.descriptor,
            //         icon: this.new_space.icon,
            //         colour: this.new_space.colour,
            //     }
            // )
            
            // if (error) {
            //     console.error(error)
            //     alert(error.message)
            //     throw error
            // }

            // // Get the new space fresh from the DB and add it to the space_types array
            // const { data:new_space, error:new_space_error } = await this.supabase
            //     .from('space_styles')
            //     .select('*')
            //     .eq('category', this.new_space.category)
            //     .single()

            // if (new_space_error) {
            //     console.error(new_space_error)
            //     alert(new_space_error.message)
            //     throw new_space_error
            // }

            // this.space_types.push(JSON.parse(JSON.stringify(new_space)));
            // this.space_types_clean.push(JSON.parse(JSON.stringify(new_space)));

            // // Refresh the count
            // this.countSpaces();

            // // Clear the new space type input
            // this.new_space.category = '';
            // this.new_space.descriptor = '';
            // this.new_space.icon = '';
            // this.new_space.colour = '#000000';

        },
        
        async updateContent() {

            const access_token = await getSessionAccessToken(this.supabase)
            
            // Update the overlays
            // for (let i = 0; i < this.overlays.length; i++) {

            //     // If the icon has been updated, upload the new icon
            //     if (this.overlays[i].icon !== this.overlays_clean[i].icon) {
            //         this.overlays[i].icon = await this.uploadNewOverlay(i);
            //     }

            //     let {data, error} = await updateTable(access_token, 'overlays',
            //         this.overlays[i],
            //         {col:'id', eq:this.overlays[i].id},
            //     )

            //     if (error) {
            //         console.error(error)
            //         alert(error.message)
            //         throw error
            //     }
            // }

        },
    },
}
</script>

<style>


</style>