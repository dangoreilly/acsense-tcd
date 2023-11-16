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
                        <!-- <br> -->

                        <!-- Testing -->
                        <!-- <div>

                            <span class="position-relative">
                                <span class="position-absolute top-50 start-0 translate-middle p-2 border border-dark rounded-circle" style="background-color: #a5faad;"> </span>
                                <span class="ps-3">CSC Space</span>
                            </span>
                            

                            <span class="position-relative">
                                <span class="position-absolute top-50 start-0 translate-middle ms-3 p-2 border border-dark rounded-circle" style="background-color: #e97dff;"> </span>
                                <span class="ps-4">Outdoor Space</span>
                            </span>

                            
                        </div> -->
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
            supabase: null,
            contentHasChanged: false,
            space_types: [],
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

            this.welcome.mainContent = data.data.mainContent
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
        },
    },
}
</script>

<style>

</style>