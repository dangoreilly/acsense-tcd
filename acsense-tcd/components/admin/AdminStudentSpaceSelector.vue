<template>
    <!-- Container for the sidebar -->
    <div class="d-flex flex-column flex-shrink-0 py-3 px-1 border-end border-secondary-subtle bg-body-tertiary position-sticky">
        <!-- Filter bar for spaces -->
        <input 
        id="new-space" 
        type="text" 
        class="form-control m-1 ms-0 me-2" 
        placeholder="Filter..." 
        @input="search()"
        v-model="searchTerm">
        <!-- Scrolling section -->
        <div class=" space-selection-sidebar">
            <!-- TODO: Squash into one component with buildings that takes the list as an input -->
            <!-- Pulling the data at the component level is really dumb -->
            <ul class="nav nav-pills flex-column mb-auto">
                <!-- Highlight the active page by matching it to the activeSpace -->
                <li v-for="space in spaces" style="max-width: 100%;">
                    <div
                    @click="changeSpace(space)"
                    class="nav-link link-body-emphasis text-decoration-none space-selection"
                    :class="{
                        'bg-blue-300': space.canonical === activeSpace.canonical, 
                        'fst-italic': !space.published, 
                        'bg-yellow-100': !space.published && space.canonical !== activeSpace.canonical
                        }"
                    style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                    :title="space.name">
                        <span>{{space.name}}</span> <br>
                        <span class="font-monospace" style="font-size: 0.8rem;">{{ space.canonical }}</span>
                    </div>
                </li>
            </ul>
            <!-- <hr>
            <div class="input-group">
                <input id="new-space" type="text" class="form-control" placeholder="new-spaceID" aria-label="New Space" aria-describedby="button-addon2"
                v-model="newSpaceID">
                <button 
                :disabled="!newSpaceIDValid" 
                class="btn"
                :class="{'btn-primary': newSpaceIDValid, 'btn-outline-secondary': !newSpaceIDValid}" 
                type="button" 
                title="new ID must be at least 5 characters">
                    +
                </button>
                
            </div>
            <div class="form-text" style="font-size: 0.75em;">spaceID cannot be updated</div> -->
        </div>
    </div>
</template>
    
<script>
    import {createClient} from '@supabase/supabase-js';
    import Fuse from 'fuse.js';
    
    
    export default {
        props: {
            updateCount: { // Dummy prop to force a refresh
                type: Number,
                required: false
            }
        },
        watch: {
            updateCount: function() {
                this.getListOfSpaces()
            }
        },
        data() {
            return {
                newSpaceID: '',
                activeSpace: {},
                spaces: [],
                spaces_clean: [],
                searchTerm: '',
            }
        },
        created() {
            this.getListOfSpaces()
        },
        computed: {
            newSpaceIDValid() {
                return this.newSpaceID.length > 4
            }
        },
        methods: {
            async NewSpace() {
                console.log("Creating new space")
                // Attempt to create a new space with the spaceID from the createNewSpace field
                // If successful, open the new space for editing
                // If unsuccessful, display an error message
            },
    
            async getListOfSpaces() {
                
                const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
                const supabaseKey = useRuntimeConfig().public.supabaseKey;
                this.supabase = createClient(supabaseUrl, supabaseKey)
    
                // Select All spaces from supabase
                // Assign them the spaces array

                let { data: spaces, error } = await this.supabase
                    .from('spaces')
                    .select('name, canonical, published')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    // Add the spaces to the spaces array, sorted by canonical
                    this.spaces = sortArrayOfObjectsByKey(spaces, "canonical");
                    this.spaces_clean = JSON.parse(JSON.stringify(this.spaces));

                    // Check if this is the first load
                    if (this.activeSpace == {}) {
                        // Set the active space to the first space in the array
                        this.activeSpace = this.spaces[0];
                        this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                    }
                    else {
                        // Check if the active space is still in the list
                        let activeSpaceInList = false;
                        for (let i = 0; i < this.spaces.length; i++) {
                            if (this.spaces[i].canonical == this.activeSpace.canonical) {
                                activeSpaceInList = true;
                                break;
                            }
                        }
                        // If the active space is not in the list, set the active space to the first space in the list
                        if (!activeSpaceInList) {
                            this.activeSpace = this.spaces[0];
                            this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                        }
                    }
                }
            },

            changeSpace(space) {
                this.activeSpace = space;
                this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                console.log("Changing space to " + this.activeSpace.canonical);
            },

            // Functions for dealing with the search/filter
            search() {
                 
                const fuse_options = {
                    includeScore: true,
                    // threshold: 1,
                    keys: [ 
                        // "display_name" 
                        {name:'name', weight:5},
                        {name:'canonical', weight:1},
                    ]
                }
                // Create a new Fuse object
                let fuse = new Fuse(this.spaces_clean, fuse_options);

                //Use the static generated Fuse instance to get a list of matches
                let result = fuse.search(this.searchTerm)
                console.log(result)

                // Check there is a result
                // If there's no result and no text in the textbox, show everything except the apology
                //TODO: Add an apology
                if (result.length == 0 && this.searchTerm == ""){

                    this.spaces = JSON.parse(JSON.stringify(this.spaces_clean));

                }
                else {

                    // If the result is nonzero, clear the old results and add the new ones
                    this.spaces = [];
                    for (let i = 0; i < result.length; i++) {
                        this.spaces.push(result[i].item);
                    }

                    // Check if the active space is still in the list
                    let activeSpaceInList = false;
                    for (let i = 0; i < this.spaces.length; i++) {
                        if (this.spaces[i].canonical == this.activeSpace.canonical) {
                            activeSpaceInList = true;
                            break;
                        }
                    }
                    // If the active space is not in the list, set the active space to the first space in the list
                    if (!activeSpaceInList) {
                        this.activeSpace = this.spaces[0];
                        this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                    }

                }

            },
        }
    };
    
    useHead({
        title: 'Acsense Admin',
        meta: [
            {
                name: 'description',
                content: 'Acsense Admin page'
            }
        ],
        // link: [
        //     {
        //         rel: 'stylesheet',
        //         href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css'
        //     }
        // ]
    })
    
    </script>
    
    
    <style>
    .space-selection-sidebar{
        width: 250px; 
        overflow-y: auto;
        transition: width 0.4s ease-in-out;
    }
    .space-selection-sidebar:hover {
        width: 400px;
    }

    .space-selection {
        cursor: pointer;
    } 
    .space-selection:hover {
        background-color: #e9ecef;
    }
    .active-space-selection {
        background-color: #6bb5ff;
    }
    </style>