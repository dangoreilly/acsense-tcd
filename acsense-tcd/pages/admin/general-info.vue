<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'map'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">

            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">
                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        General Settings
                    </h1>

                    <!-- Buttons -->
                    <div class="d-flex align-items-center m-3 fs-5">
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
                    </div>

                </div>
                <!-- Main Matter -->
                <!-- <Welcome Modal > -->
                <div class="row border-b">
                    <!-- Input -->
                    <div class="col d-flex flex-column">
                        <!-- Welcome Modal -->
                        <div class="mb-3">
                            <label for="welcomeText" class="form-label">Welcome Text</label>
                            <textarea class="form-control" id="welcomeText" rows="4"  
                            v-model="welcome.mainContent"></textarea>
                        </div>
                    </div>

                    <!-- Preview -->
                    <div class="col">
                        <div class="modal position-static d-block" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Welcome</h5>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <p>{{ welcome.mainContent }}</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Space types descriptor -->
                <div class="row mt-3">
                    <!-- input -->
                    <div class="col">
                        <div class="mb-3" v-for="spaceType in space_types">
                            <div class="row mb-2">
                                <input type="color" :id="'colour-space-' + spaceType.id" class="form-control form-control-color" v-model="spaceType.colour">
                                <label :for="'colour-space-' + spaceType.id" class="col-lg-10 col-form-label">{{ spaceType.category }}</label>
                            </div>
                            <div class="row">
                                <textarea class="form-control" :id="'space-' + spaceType.id" rows="4"  
                                v-model="spaceType.descriptor"></textarea>
                            </div>
                        </div>
                    </div>
                    <!-- Preview -->
                    <div class="col">
                        <div class="modal position-static d-block" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header" style="width: 100%;">
                                        <h5 class="modal-title d-flex">Student Space Icons</h5>
                                        <button type="button" class="btn-close d-flex" aria-label="Close"></button>
                                    </div>

                                    <div class="modal-body" style="align-self: baseline; max-height: 70vh; overflow-y: auto;">
                                        <!-- Show the icons in a 2 columns, with the category name underneath -->
                                        <h4>Space Types</h4>
                                        <p>There are {{ space_types.length }} categories of student space:</p>
                                        
                                        <div class="row">
                                            <template v-for="spaceType in space_types">
                                                <div class="col-6">
                                                    <div
                                                        class="px-auto d-block">
                                                        <img 
                                                        :src="spaceType.icon" 
                                                        class="mx-auto d-block border-bottom border-2 border-gray-500 pb-2 mb-2"
                                                        style="width: 6rem; height: auto;"/>
                                                        <p class="text-center">{{ spaceType.category }}</p>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <div class="row px-4" v-for="spaceType in space_types">
                                            <p class="position-relative">
                                                <span class="position-absolute top-50 start-0 translate-middle p-2 border border-dark rounded-circle" :style="{'background-color': spaceType.colour}"> </span>
                                                <span class="ps-3"><strong>{{ spaceType.category }}</strong></span>
                                            </p>
                                            <p>{{ spaceType.descriptor }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script>
import {createClient} from '@supabase/supabase-js';

export default {
    data() {
        return {
            welcome: {
                mainContent: '',
            },
            welcome_clean: {
                mainContent: '',
            },
            supabase: null,
            space_types: [],
            space_types_clean: [],
        }
    },
    computed: {
        contentHasChanged() {
            // Check if either the welcome text or the space types have changed
            let welcomeChanged = this.welcome.mainContent !== this.welcome_clean.mainContent
            let spaceTypesChanged = JSON.stringify(this.space_types) !== JSON.stringify(this.space_types_clean);

            // Return true if either has changed
            return welcomeChanged || spaceTypesChanged;
        }
    },
    created() {
        // Initialise the supabase client
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)
    },
    mounted() {
        this.fetchWelcome()
        this.fetchSpaceTypes()
    },
    methods: {
        async fetchWelcome() {
            const { data, error } = await this.supabase
                .from('site_settings')
                .select('data')
                .eq('key', "welcome")
                .single()

            if (error) {
                console.error(error)
                return
            }

            // Copy the data into the welcome object
            this.welcome.mainContent = data.data.mainContent
            // Duplicate the object to keep a clean copy
            this.welcome_clean.mainContent = data.data.mainContent
        },
        async fetchSpaceTypes() {
            const { data, error } = await this.supabase
                .from('space_styles')
                .select('*')

            if (error) {
                console.error(error)
                return
            }

            // Copy the data into the spaces array
            this.space_types = JSON.parse(JSON.stringify(data));
            // Duplicate the object to keep a clean copy
            this.space_types_clean = JSON.parse(JSON.stringify(data));
        },

        cancelChanges(){
            // Reset the welcome text
            this.welcome.mainContent = this.welcome_clean.mainContent
            // Reset the space types
            this.space_types = JSON.parse(JSON.stringify(this.space_types_clean));
        },
        
        async updateContent() {
            // Update the welcome text
            let {data, error:welcome_update_error} = await this.supabase
                .from('site_settings')
                .update({ data: this.welcome })
                .eq('key', "welcome")

                
            if (welcome_update_error) {
                console.error(style_update_error)
                alert(style_update_error.message)
                throw style_update_error
            }

            // Update the space types
            for (let i = 0; i < this.space_types.length; i++) {
                let {data, error:style_update_error} = await this.supabase
                    .from('space_styles')
                    .update(this.space_types[i])
                    .eq('id', this.space_types[i].id)

                if (style_update_error) {
                    console.error(style_update_error)
                    alert(style_update_error.message)
                    throw style_update_error
                }
            }

            // Create temp copies of the data
            let temp_welcome = JSON.parse(JSON.stringify(this.welcome))
            let temp_space_types = JSON.parse(JSON.stringify(this.space_types));

            // Pull fresh copies of the data
            this.fetchWelcome()
            this.fetchSpaceTypes()

            // Compare the temp copies to the fresh copies, to ensure the update was successful
            if (JSON.stringify(temp_welcome) !== JSON.stringify(this.welcome)) {
                alert("Welcome text update failed")
            }
            if (JSON.stringify(temp_space_types) !== JSON.stringify(this.space_types)) {
                alert("Space types update failed")
            }

            if (JSON.stringify(temp_welcome) === JSON.stringify(this.welcome) && JSON.stringify(temp_space_types) === JSON.stringify(this.space_types)) {
                alert("Update successful")
            }

        },
    },
}
</script>

<style>

</style>