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
                        <!-- Existing spaces -->
                        <div class="row border-bottom border-2 mb-2 pb-2" v-for="spaceType, index in space_types">
                            <div class="col-8">
                                <div class="row mb-1">
                                    <div class="input-group mx-0 px-0">
                                        <input type="color" class="form-control form-control-color" style="flex: 0 1 auto; width: 3rem;"
                                        :id="'colour-space-' + spaceType.id"  
                                        v-model="spaceType.colour">
                                        <!-- <label :for="'colour-space-' + spaceType.id" class="col-lg-10 col-form-label">{{ spaceType.category }}</label> -->
                                        <input type="text" class="form-control flex-grow-1" 
                                        :id="'space-' + spaceType.id" 
                                        v-model="spaceType.category">
                                        <span  v-if="space_counts[index]"
                                        :title="tooltipSpacesList(index)"
                                        class="input-group-text"
                                        
                                        >{{ space_counts[index].count }}</span>

                                        <button type="button" class="btn btn-danger" 
                                        v-if="space_counts[index]"
                                        @click="deleteSpaceType(index)" 
                                        :disabled="space_counts[index].count > 0"
                                        title="Category can not be deleted while there are still associated spaces">
                                        Delete</button>
                                    </div>
                                </div>
                                <div class="row mb-1">
                                    <textarea class="form-control" :id="'space-' + spaceType.id" rows="4"
                                    placeholder="Space Type description"  
                                    v-model="spaceType.descriptor"></textarea>
                                </div>
                                <div class="row">
                                    <div class="input-group mx-0 px-0">
                                        <input :id="'IconOverrideInput-'+index" :data-index="index" type="file" class="form-control" 
                                        @change="handleCustomIconSelect">
                                        <button class="btn" type="button" id="inputGroupFileAddon04"
                                        :class="(space_types[index].icon == space_types_clean[index].icon) ? 'btn-outline-secondary' : 'btn-warning'"
                                        :disabled="space_types[index].icon == space_types_clean[index].icon"
                                        @click="resetIcon(index)">
                                        Reset</button>
                                    </div>
                                </div>
                            </div>
                            <!-- Icon Display -->
                            <div class="col-4">
                                <div class="mt-3 position-relative">
                                    <img 
                                    :src="spaceType.icon" 
                                    style="width: 100%;">
                                     <!-- v-model="spaceType.icon" -->
                                </div>
                            </div>
                        </div>
                        <!-- New space -->
                        <div class="row mb-4 mt-1 border-top ">
                            <div class="col-8">
                                <div class="row mb-1">
                                    <div class="input-group mx-0 px-0">
                                        <input type="color" class="form-control form-control-color" style="flex: 0 1 auto; width: 3rem;"  
                                        v-model="new_space.colour">
                                        <input type="text" class="form-control flex-grow-1" 
                                        id="new_space" 
                                        placeholder="New Space Type"
                                        v-model="new_space.category">

                                        <button type="button" class="btn btn-success" 
                                        @click="addNewSpaceType()" 
                                        :disabled="new_space.category.length == 0 || new_space.icon.length == 0"
                                        title="Space type needs a name and icon">
                                        Add</button>
                                    </div>
                                </div>
                                <div class="row mb-1">
                                    <textarea class="form-control" id="new_space_desc" rows="4"
                                    placeholder="Space Type description"  
                                    v-model="new_space.descriptor"></textarea>
                                </div>
                                <div class="row">
                                    <input class="form-control"
                                    id="IconOverrideInput-new" data-index="new" type="file" 
                                    @change="handleCustomIconSelect">
                                </div>
                            </div>
                            <!-- Icon Display -->
                            <div class="col-4">
                                <div class="mt-3 position-relative">
                                    <img v-if="new_space.icon"
                                    :src="new_space.icon" 
                                    style="width: 100%;">
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Preview -->
                    <div class="col">
                        <div class="row modal position-static d-block">
                            <Legend :displayModal="true" :spaceIcons="space_types" :previewMode="true"></Legend>
                            <SpaceTypeIconPreview :spaceTypes="space_types" :supabase_client="supabase"/>
                        </div>
                        <!-- Map preview -->
                        <div class="row mx-2">
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
            space_counts: [],
            new_space: {
                category: '',
                descriptor: '',
                icon: '',
                colour: '#000000',
            }
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

            // Count the number of spaces of each type
            this.countSpaces()
        },

        async countSpaces() {
            // Get the count of each space type
            // Store the counts in the space_counts array
            // This will be used to display the number of spaces of each type

            // Reset the space counts
            this.space_counts = [];

            for (let i = 0; i < this.space_types.length; i++) {
                const { data, error } = await this.supabase
                    .from('spaces')
                    .select('canonical')
                    .eq('type', this.space_types[i].category)

                if (error) {
                    console.error(error)
                    return
                }

                this.space_counts.push(JSON.parse(JSON.stringify({count: data.length, list: data})))

                // console.log(this.space_counts)
            }
        },

        resetIcon(index){
            // Reset the icon to the original icon
            this.space_types[index].icon = this.space_types_clean[index].icon;
            // Clear the input
            document.getElementById(`IconOverrideInput-${index}`).value = "";
        },

        tooltipSpacesList(index) {

            // If the spaces haven't been counted yet, return empty for now
            if (!this.space_counts[index]) {
                return "";
            }

            // For the space type at index, return comma+newline seperated list 
            // of the first 5 spaces of that type, followed by ellipsis if there are more
            let list = this.space_counts[index].list;
            let count = this.space_counts[index].count;
            if (count === 0) {
                return "No spaces of this type"
            }

            let tooltip = "";
            // If there are 5 or fewer spaces, list them all
            if (count <= 5) {
                for (let i = 0; i < Math.min(4, count-1); i++) {
                    tooltip += list[i].canonical + ",\n";
                }
                // Add the last item without a comma
                tooltip += list[count-1].canonical
                return tooltip;
            }
            // Else, list the first 5, then add ellipsis
            for (let i = 0; i < 5; i++) {
                tooltip += list[i].canonical + ",\n";
            }
            tooltip += list[i].canonical + ",\n...";
            
            return tooltip;

        },

        handleCustomIconSelect(evt){
            // Get the file from the input
            // Set the iconOverride to the file to preview
            const file = evt.target.files[0];

            // Get the index of the space type
            const index = evt.target.getAttribute("data-index");

            if (index == "new")
                this.new_space.icon = URL.createObjectURL(file);
            else
                this.space_types[index].icon = URL.createObjectURL(file);
             
        },

        async uploadNewCustomIcon(index){
            // Get the file object from the primary image upload input
            // Upsert to the storage bucket as the canonical name
            // TODO: Check if the file already exists under a different extension, and if so, delete it

            // Get the file
            let file = document.getElementById(`IconOverrideInput-${index}`).files[0];
            // Get the file extension
            let extension = file.name.split('.').pop();
            
            // Make a canonical name for the space type
            let spaceType_canonical = "";
            if (index == "new")
                spaceType_canonical = this.new_space.category.toLowerCase().replace(/ /g, "_");
            else
                spaceType_canonical = this.space_types[index].category.toLowerCase().replace(/ /g, "_");

            // Build the new url for the file
            let newUrl = this.supabase.storageUrl + "/object/public/icons/" + spaceType_canonical + "." + extension;
            // Upsert the image
            const {data, error} =  upsertImage(this.supabase, 'icons', `${spaceType_canonical}.${extension}`, file)
            
            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            // Clear the icon input
            document.getElementById(`IconOverrideInput-${index}`).value = "";

            return newUrl;

        },

        cancelChanges(){
            // Reset the welcome text
            this.welcome.mainContent = this.welcome_clean.mainContent
            // Reset the space types
            this.space_types = JSON.parse(JSON.stringify(this.space_types_clean));
            // Re-count the spaces
            countSpaces()
        },

        async deleteSpaceType(index){
            let category = this.space_types[index].category;
            // Confirm the deletion
            if (!confirm("Are you sure you want to delete type '" + category + "'?")) {
                return;
            }

            let url = this.space_types[index].icon;

            // Remove the database entry
            const access_token = await getSessionAccessToken(this.supabase);
            const {data: img, error:db_delete_error} = await removeFromTable(
                access_token, 
                "space_styles", 
                { 
                    col: 'category', 
                    eq: category,
                }
            )
            

            if (db_delete_error) {
                console.error(db_delete_error)
                alert(db_delete_error.message)
                throw db_delete_error
            }

            // Get the path by subtracting the supabase url from the image url
            let path = url.replace(this.supabase.storageUrl + "/object/public/icons/", "");
            
            // Delete the image from the storage bucket
            const { data:storage_response, error:storage_error } = await this.supabase.storage
            .from('icons')
            .remove([path])

            if (storage_error) {
                console.error(storage_error)
                alert(storage_error.message)
                throw storage_error
            }
            console.log("storage_response")
            console.log(storage_response)


            // Remove the space type at index
            this.space_types.splice(index, 1);
            // Remove the space count at index
            this.space_counts.splice(index, 1);

            alert("'"+category+"' deleted successfully")
        },

        validateSpaceTypeName(name){
            // Check if the space type already exists
            for (let i = 0; i < this.space_types.length; i++) {
                if (this.space_types[i].category === name) {
                    return false;
                }
            }
            return true;
        },

        async addNewSpaceType(){

            // Validate the space type name
            if (!this.validateSpaceTypeName(this.new_space.category)) {
                alert("Space type already exists")
                return;
            }

            // Upload the new icon
            this.new_space.icon = await this.uploadNewCustomIcon("new");

            // Add the new space type to the database
            const access_token = await getSessionAccessToken(this.supabase);
            const {data, error} = await insertToTable(access_token, 'space_styles', 
                {
                    category: this.new_space.category,
                    descriptor: this.new_space.descriptor,
                    icon: this.new_space.icon,
                    colour: this.new_space.colour,
                }
            )
            
            if (error) {
                console.error(error)
                alert(error.message)
                throw error
            }

            // Get the new space fresh from the DB and add it to the space_types array
            const { data:new_space, error:new_space_error } = await this.supabase
                .from('space_styles')
                .select('*')
                .eq('category', this.new_space.category)
                .single()

            if (new_space_error) {
                console.error(new_space_error)
                alert(new_space_error.message)
                throw new_space_error
            }

            this.space_types.push(JSON.parse(JSON.stringify(new_space)));
            this.space_types_clean.push(JSON.parse(JSON.stringify(new_space)));

            // Refresh the count
            this.countSpaces();

            // Clear the new space type input
            this.new_space.category = '';
            this.new_space.descriptor = '';
            this.new_space.icon = '';
            this.new_space.colour = '#000000';

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

                // If the icon has been updated, upload the new icon
                if (this.space_types[i].icon !== this.space_types_clean[i].icon) {
                    this.space_types[i].icon = await this.uploadNewCustomIcon(i);
                }

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

.svg-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            vertical-align: middle;
            fill: currentColor;
            width: 1.5rem;
        }
        .svg-icon-sash {
            position: absolute;
            top: 31%;
            left: -30%;
            opacity: 0.8;
            /* transform: translate(-50%, -50%); */
            rotate: 45deg;
            vertical-align: middle;
            fill: currentColor;
            width: 2.4rem;
        }

        .facility-icon {
            width: 2.5rem;
            height: 2.5rem;
            position: relative;
            /* padding: 0.25rem; */
        }

        .space-modal-badge-container {
            display: grid;
            /* width: 100%; */
            /* padding-top: 2rem; */
            grid-template-columns:  auto auto auto auto auto auto;
            grid-template-rows: auto auto;
            grid-template-areas: 
                "seating sockets food kettle microwave wheelchair"
                "btn btn btn btn btn btn";
        }

</style>