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
                    <div class="col d-flex align-items-center">
                        <div class="container w-75">
                            <div class="card">
                                <div class="card-body">
                                    <span class="card-text d-block">To set up a jump point / flyover, you need to position the arrow and the target</span>
                                    <span class="card-text d-block">The arrow direction is set automatically</span>
                                    <span class="card-text d-block">When setting a target, you should shape the rectangle as the intended view on mobile. A target that's set up to look good on mobile will generally look good or at least okay on desktop, whereas a target that is set up to look good on desktop will generally look terrible on mobile</span>
                                    <span class="card-text d-block mt-3">Basically; set up the target rectangle to be in Portrait orientation</span>
                                    <!-- <span class="card-text d-block">To see changes reflected on the full preview map above, you need to click the "Save Bounds" button</span> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Full preview map -->
                    <div class="col">
                        <div class="me-auto" style="aspect-ratio: 9/16; width:45dvh;">
                            <AdminFlyoverPreview :flyovers="flyovers" :supabase_client="supabase"/>
                            
                        <!-- <AdminOverlayPreview :overlays="overlays" :supabase_client="supabase"/> -->
                        </div>
                    </div>
                    
                </div>

                <div class="mt-3"  v-for="flyover, index in flyovers">
                    <!-- We can calculate if an flyover is existing or new -->
                    <!-- Based on if it has an id field -->
                    <AdminFlyoverEdit 
                    :flyover_array="flyovers" 
                    :flyover="flyover" 
                    :flyover_clean="flyovers_clean[index]"
                    :staticMapElements="staticMapElements"
                    :newFlyover="flyover.id == undefined"
                    :index="index"
                    @target-update="updateFlyoverTarget"
                    @location-update="updateFlyoverLocation"
                    @label-update="updateFlyoverLabel"
                    @flyover-delete="deleteFlyover(index)"
                    @flyover-update="updateContent(index)"
                    @flyover-create="pushNewContent(index)"
                    @flyover-edit-cancel="cancelChanges(index)"/>
                </div>
                <div class="container my-3">
                    <div class="row">
                        <div class="col-12">
                            <button class="btn btn-outline-primary w-100" @click="addNewFlyover()">Add New Flyover</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script lang=ts>
import type { Overlay, Space, Space_Type, Building, Flyover } from "~/assets/types/supabase_types";
import {createClient} from '@supabase/supabase-js';
import { getFlyovers, getGeometricCenter, type Building_Partial, type Space_Partial } from '~/utils/adminMapUtils'

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ] as [[number, number], [number, number]];

export default {
    data() {
        return {
            supabase: Object as any,
            flyovers: [] as Flyover[],
            flyovers_clean: [] as Flyover[],
            new_flyover: {
                label: 'New Flyover',
                location: getGeometricCenter([[campusBounds[0], campusBounds[1]]]),
                target: campusBounds,
            },
            staticMapElements: {
                buildings: [] as Building_Partial[],
                spaces: [] as Space_Partial[],
                space_types: [] as Space_Type[],
                overlays: [] as Overlay[],
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
        // Get the static map elements
        this.getStaticMapElements()
        .then(() => {
            // Get the flyovers
            this.getFlyovers();

            // We want to wait for all the static map elements to load before we load the flyovers
            // Because the flyovers load causes the repaint, and we want all the elements to be there

        });
    },
    methods: {
        async getFlyovers() {
            // Get the flyovers from the database
            const flyovers = await getFlyovers(this.supabase);

            // Set the flyovers
            this.flyovers = flyovers;
            this.flyovers_clean = JSON.parse(JSON.stringify(flyovers));
        },

        async getStaticMapElements() {
            // Get the static map elements
            // Get the buildings
            const buildings = await getBuildingList(this.supabase);
            this.staticMapElements.buildings = buildings;

            // Get the spaces
            const spaces = await getSpaces(this.supabase);
            this.staticMapElements.spaces = spaces;

            // Get the space types
            const space_types = await getSpaceTypes(this.supabase);
            this.staticMapElements.space_types = space_types;

            // Get the overlays
            const overlays = await getOverlays(this.supabase);
            this.staticMapElements.overlays = overlays;
        },

        resetFlyovers(index: number){
            // Reset the flyovers to the original value
            this.flyovers[index] = JSON.parse(JSON.stringify(this.flyovers_clean[index]));
        },

        async deleteFlyover(index: number){

            // Check if this is a new flyover, a new flyover won't have an ID
            if (this.flyovers[index].id == undefined) {
                // Remove the flyover at index
                this.flyovers.splice(index, 1);
                this.flyovers_clean.splice(index, 1);
                return;
            }
            // If it's not a new flyover, we need to delete it from the database
            // Confirm the deletion
            if (!confirm("Are you sure you want to delete this flyover?")) {
                return;
            }

            // let url = this.space_types[index].icon;
            let flyover_id = JSON.stringify(this.flyovers[index].id);

            // Remove the database entry
            const access_token = await getSessionAccessToken(this.supabase);
            const {data: img, error:db_delete_error} = await removeFromTable(
                access_token, 
                "flyovers", 
                { 
                    col: 'id', 
                    eq: flyover_id
                }
            )
            

            if (db_delete_error) {
                console.error(db_delete_error)
                alert(db_delete_error.message)
                throw db_delete_error
            }

            // Remove the flyover at index
            this.flyovers.splice(index, 1);
            this.flyovers_clean.splice(index, 1);

            alert("Flyover deleted successfully")
        },

        async addNewFlyover(){

            // Add a new flyover to the list with the default values
            this.flyovers.push(JSON.parse(JSON.stringify(this.new_flyover)));
            this.flyovers_clean.push(JSON.parse(JSON.stringify(this.new_flyover)));

        },

        // updateFlyoverArray(index: number, flyover: Flyover){
        //     console.log("Updating flyover array")
        //     console.log(flyover)
        //     this.flyovers[index] = JSON.parse(JSON.stringify(flyover));
        // },

        updateFlyoverTarget(index: number, newBounds: [[number, number],[number, number]]){
            this.flyovers[index].target = newBounds
        },
        updateFlyoverLocation(index: number, newLocation: [number, number]){
            this.flyovers[index].location = newLocation
        },
        updateFlyoverLabel(index: number, input: Event){
            let newLabel = (input.target as HTMLInputElement).value
            this.flyovers[index].label = newLabel
        },
        
        async updateContent(index: number){

            const access_token = await getSessionAccessToken(this.supabase)
            let {data, error} = await updateTable(access_token, 'flyovers',
                this.flyovers[index],
                {
                    col:'id', 
                    eq: JSON.stringify(this.flyovers[index].id)
                },
            )

            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            // Update the clean flyover
            this.flyovers_clean[index] = JSON.parse(JSON.stringify(this.flyovers[index]));

        },

        async pushNewContent(index: number) {

            // Add the new flyover to the database
            // Only upload the bounds for now, in case the image upload fails
            const access_token = await getSessionAccessToken(this.supabase);
            let {data, error} = await insertToTable(access_token, 'flyovers', this.flyovers[index]);

            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            console.log(data)
            // Update the id of the flyover
            
            // Update the clean flyover
            this.flyovers_clean[index] = JSON.parse(JSON.stringify(this.flyovers[index]));

        },

        cancelChanges(index: number){
            // Check if this was a new flyover
            // If it was, remove it from the list
            if (this.flyovers[index].id == undefined) {
                this.flyovers.splice(index, 1);
                this.flyovers_clean.splice(index, 1);
                return;
            }
            else{
                // Reset the overlay
                this.flyovers[index] = JSON.parse(JSON.stringify(this.flyovers_clean[index]))
            }

        },
    },
}
</script>

<style>


</style>