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
                <div class="border-bottom border-2 border-black mb-3 d-flex">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Space Management | <span class=" p-1 ms-2 border font-monospace border-success bg-yellow-100 fs-4">{{ space.canonical }}</span>
                    </h1>

                </div>

                <!-- Main Matter -->
                <div class="mainMatter-admin">

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
                        </div>

                        <!-- Preview block -->
                        <div class="col">
                            <admin-space-modal-preview :space="space"/>
                        </div>
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
                space: {},
                space_clean: {},
                markdownModalOpen: false,
                supabase: {},
            }
        },
        created() {

            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)
            // Grab all the spaces
            // this.getSpaces();
        },
        methods: {
            // This function fetches All the spaces from the database
            // async getSpaces(){

            //     // Fetch the building from the database
            //     // Since we are using the canonical name, we should only get one result
            //     let { data: spaces, error } = await this.supabase
            //         .from('spaces')
            //         .select('*')
            //     if (error) {
            //         console.error(error)
            //         alert(error.message)
            //         throw error
            //     }
            //     else {
                    
            //         // Fill in the gaps with sensible defaults, but only on hot copy
            //         // This will highlight to the user when a field is about to be set to a default
            //         // this.spaces = this.fillInTheGaps( JSON.parse( JSON.stringify(bld[0]) ) );

            //         // Assign the space data to the space object
            //         this.space = spaces;

            //         // Deep copy the space objects so we have comparison data
            //         this.spaces_clean = JSON.parse(JSON.stringify(this.spaces));

            //     }
                
            // },

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