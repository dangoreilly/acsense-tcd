<!-- Admin page for displaying logs -->
<!-- TODO: Turn these inputs into components for maintainability -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'spaces'">
        <!-- Header -->
        <div class="border-bottom border-2 border-black mb-3 d-flex">
            <!-- Title -->
            <h1 class="display-6 d-flex align-items-end">
                Space Management
            </h1>

        </div>

        <!-- Main Matter -->
        <div class="mainMatter-admin">
            <!-- Two columns -->
            <!-- Column 1 contains input boxes -->
            <!-- Column 2 contains infoPage components -->
            <!-- The input boxes are paired to the components to allow for live editing -->
            <!-- The input boxes and components are left aligned in their respective colum -->
        
            <!-- Loop through all the student spaces -->
            <div class="row mx-4" v-for="space in spaces">
                <!-- Display the id -->
                <span class=" p-1 ms-2 mb-2 border font-monospace border-success bg-yellow-100 fs-6">{{ space.canonical }}</span>
                <!-- Open the boxes for editing -->
                <div class="col d-flex flex-column d-flex">
                    <div class="row">
                        <!-- Typey bits -->
                        <div class="col d-flex flex-column flex-grow-3">
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
                        <!-- clicky bits -->
                        <div class="col d-flex flex-column flex-grow-0">
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
                </div>
                <div class="col">
                    <!-- Diplay the info -->
                    <div class="modal position-static d-block" tabindex="-1">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title d-flex">{{ space.name }}</h5>
                                    <button type="button" class="btn-close d-flex" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>

                                <div class="modal-body" style="align-self: baseline;">
                                    <p>{{ space.description }}</p>
                                </div>
                                    
                                <div class="modal-footer fs-4" style="justify-content: center;">
                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.seating, 'text-bg-danger': !space.seating}" 
                                    :title="(space.seating ? '' : 'No ') + 'Seating'">
                                        <i class="fa-solid fa-chair"></i>
                                    </span>

                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.outlets, 'text-bg-danger': !space.outlets}" 
                                    :title="(space.outlets ? '' : 'No ') + 'Plug Sockets'">
                                        <img class="svg-icon" src="/images/icons/plug-solid.svg" width="12" height="12">
                                    </span>

                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.food_drink_allowed, 'text-bg-danger': !space.food_drink_allowed}" 
                                    :title="'Food and Drink ' + (space.food_drink_allowed ? '' : 'not') + 'Allowed'">
                                        <i class="fa-solid fa-utensils"></i>
                                    </span>
                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.kettle, 'text-bg-danger': !space.kettle}" 
                                    :title="(space.kettle ? '' : 'No ') + 'Kettle Available'">
                                        <i class="fa-solid fa-mug-saucer"></i>
                                    </span>

                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.microwave, 'text-bg-danger': !space.microwave}" 
                                    :title="(space.microwave ? '' : 'No ') + 'Microwave Available'">
                                        <i class="fa-solid fa-radiation"></i>
                                    </span>

                                    <span 
                                    class="badge rounded-pill mx-1" 
                                    :class="{'text-bg-success': space.wheelchair, 'text-bg-danger': !space.wheelchair}" 
                                    :title="(space.wheelchair ? '' : 'No ') + 'Wheelchair Access'">
                                        <!-- <i class="fa-solid fa-wheelchair"></i> -->
                                        <img class="svg-icon" src="/images/icons/wheelchair-solid.svg" width="12" height="12">
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <AdminMarkdownModal 
        :modalOpen="markdownModalOpen" 
        @modalClose="markdownModalOpen = false"
        />

    </NuxtLayout>
</template>

<script>
import {createClient} from '@supabase/supabase-js';

    export default {
        data() {
            return {
            spaces: [],
            markdownModalOpen: false,
            supabase: null,
            }
        },
        created() {

            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)
            // Grab all the spaces
            this.getSpaces();
        },
        methods: {
            // This function fetches All the spaces from the database
            async getSpaces(){

                // Fetch the building from the database
                // Since we are using the canonical name, we should only get one result
                let { data: spaces, error } = await this.supabase
                    .from('spaces')
                    .select('*')
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    // Fill in the gaps with sensible defaults, but only on hot copy
                    // This will highlight to the user when a field is about to be set to a default
                    // this.spaces = this.fillInTheGaps( JSON.parse( JSON.stringify(bld[0]) ) );

                    // Assign the spaces data to the spaces array
                    this.spaces = spaces;

                    // Deep copy the space objects so we have comparison data
                    this.spaces_clean = JSON.parse(JSON.stringify(this.spaces));

                }
                
            },

            // This function is called when the user clicks the "Save" button
            // It will save the current state of the building to the database
            saveSpace() {},

            // This function is called when the user clicks the "Cancel" button
            // It will revert the building to the state it was in when the page was loaded
            cancelChanges() {},

            // This function checks the current state of the building against the state it was in when the page was loaded
            // It returns true if the building has been changed, and false if it has not
            isSpaceChanged() {},

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

</style>