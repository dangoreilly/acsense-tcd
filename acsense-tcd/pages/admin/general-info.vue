<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'general-info'" :supabase_client="supabase">
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
                        <div class="row mb-3" v-for="spaceType in space_types">
                            <div class="col">
                                <div class="row mb-2">
                                    <input type="color" :id="'colour-space-' + spaceType.id" class="form-control form-control-color" v-model="spaceType.colour">
                                    <label :for="'colour-space-' + spaceType.id" class="col-lg-10 col-form-label">{{ spaceType.category }}</label>
                                </div>
                                <div class="row">
                                    <textarea class="form-control" :id="'space-' + spaceType.id" rows="4"  
                                    v-model="spaceType.descriptor"></textarea>
                                </div>
                            </div>
                            <!-- Icon Display -->
                            <!-- <div class="col">
                                <div class="mt-3 position-relative">
                                    <img 
                                    :src="spaceType.icon" 
                                    style="width: 100%;">
                                    <input id="IconOverrideInput" type="file" class="form-control" 
                                    @change="handleCustomIconSelect(e, spaceType.id)">
                                </div>
                            </div> -->
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
                                            <div v-if="spaceType.descriptor?.length>0">
                                                <p class="position-relative">
                                                    <span class="position-absolute top-50 start-0 translate-middle p-2 border border-dark rounded-circle" :style="{'background-color': spaceType.colour}"> </span>
                                                    <span class="ps-3"><strong>{{ spaceType.category }}</strong></span>
                                                </p>
                                                <p>{{ spaceType.descriptor }}</p>
                                            </div>
                                        </div>

                                        <!-- List all the facilities icons, in FALSE then TRUE state, and then what they represent -->
                                        <h4>Facilities</h4>
                                        <p>The symbols beside the student space show what facilities are provided in them. Green shows the facility is available, Red with a strike-through shows the facility is unavailable</p>
                                        <div class="mx-4">
                                            <div class="row bottom-bottom border-2 border-gray-500 my-1" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Seating -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Seating Available">
                                                    <img class="svg-icon" src="/images/icons/chair-solid.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div>
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Seating Available">
                                                    <img class="svg-icon" src="/images/icons/chair-solid.svg">
                                                </div>
                                                <!-- Facility -->
                                                <div>
                                                    <span>Seating Available</span>
                                                </div>

                                            </div>
                                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Electrical Sockets -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Plug Sockets">
                                                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div>
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Plug Sockets">
                                                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                                                </div>
                                                <div>
                                                    <!-- Facility -->
                                                    <span>Plug Sockets available</span>
                                                </div>

                                            </div>
                                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Food and Drink allowed -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Food or Drink Allowed">
                                                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div>
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Food and Drink Allowed">
                                                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                                                </div>
                                                <div>
                                                    <!-- Facility -->
                                                    <span>Food and Drink allowed</span>
                                                </div>

                                            </div>
                                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Kettle provided -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Kettle Available">
                                                    <img class="svg-icon" src="/images/icons/kettle.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div>
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Kettle Available">
                                                    <img class="svg-icon" src="/images/icons/kettle.svg">
                                                </div>
                                                <div>
                                                    <!-- Facility -->
                                                    <span>Kettle provided</span>
                                                </div>

                                            </div>
                                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Microwave provided -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Microwave Available">
                                                    <img class="svg-icon" src="/images/icons/microwave.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div>
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Microwave Available">
                                                    <img class="svg-icon" src="/images/icons/microwave.svg">
                                                </div>
                                                <div>
                                                    <!-- Facility -->
                                                    <span>Microwave provided</span>
                                                </div>

                                            </div>
                                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                                <!-- Wheelchair Accessible -->
                                                <!-- FALSE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                                title="No Wheelchair Access">
                                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                                                    <!-- Strikethrough for RG blindness -->
                                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                                </div> 
                                                <!-- TRUE -->
                                                <div
                                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                                title="Wheelchair Access">
                                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                                                </div>
                                                <div>
                                                    <!-- Facility -->
                                                    <span>Wheelchair Accessibility</span>
                                                </div>
                                            </div>
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

        handleCustomIconSelect(evt, id){
            // Get the file from the input
            // Set the iconOverride to the file to preview
            const file = evt.target.files[0];
            // Find the space type with the matching id
            for (let i = 0; i < this.space_types.length; i++) {
                if (this.space_types[i].id === id) {
                    this.space_types[i].icon = URL.createObjectURL(file);
                    break;
                }
            }

        },

        // async uploadNewCustomIcon(){
        //         // Get the file object from the primary image upload input
        //         // Upsert to the storage bucket as the canonical name
        //         // TODO: Check if the file already exists under a different extension, and if so, delete it

        //         // Get the file
        //         let file = document.getElementById("IconOverrideInput").files[0];
        //         // Get the file extension
        //         let extension = file.name.split('.').pop();

        //         make 
                
        //         // Build the new url for the file
        //         let newUrl = this.supabase.storageUrl + "/object/public/icons/" + this.space.canonical + "." + extension;

        //         // Upload the file to the storage bucket
        //         const { data, error:upload_error } = await this.supabase.storage
        //         .from('icons')
        //         .upload(`custom/${this.space.canonical}.${extension}`, file)

        //         if (upload_error) {
        //             // if the file already exists, it's not an error
        //             // We just need to update the existing file
        //             if (upload_error.statusCode == "409"){
        //                 console.warn(upload_error)
        //                 // Update the file
        //                 const { data, error:update_error } = await this.supabase.storage
        //                 .from('icons')
        //                     .update(`custom/${this.space.canonical}.${extension}`, file, {
        //                         upsert: true
        //                     })

        //                 if (update_error) {
        //                     console.error(update_error)
        //                     alert(update_error.message)
        //                     return ""
        //                 }
        //             }
        //             else
        //             {
        //                 console.error(upload_error)
        //                 alert(upload_error.message)
        //                 return ""
        //             }
        //         }
                
        //         // Clear the icon input
        //         document.getElementById("IconOverrideInput").value = "";

        //         return newUrl;

        //     },

        cancelChanges(){
            // Reset the welcome text
            this.welcome.mainContent = this.welcome_clean.mainContent
            // Reset the space types
            this.space_types = JSON.parse(JSON.stringify(this.space_types_clean));
        },
        
        async updateContent() {

            const access_token = await getSessionAccessToken(this.supabase)
            // Update the welcome text
            let {data, error:welcome_update_error} = await updateTable(access_token, 'site_settings', 
            {
                data: {mainContent: this.welcome.mainContent},
            }, 
            {col:"key", eq:'welcome'})

                
            if (welcome_update_error) {
                console.error(welcome_update_error)
                alert(welcome_update_error)
                throw welcome_update_error
            }

            // Update the space types
            for (let i = 0; i < this.space_types.length; i++) {
                let {data, error:style_update_error} = await updateTable(access_token, 'space_styles',
                    this.space_types[i],
                    {col:'id', eq:this.space_types[i].id},
                )

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