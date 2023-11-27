<template>
    <div class="d-flex flex-column flex-shrink-0 py-3 px-3 border-end border-secondary-subtle bg-body-tertiary position-sticky space-selection-sidebar">
        <!-- TODO: Filter -->
        <!-- TODO: Squash into one component with buildings that takes the list as an input -->
        <!-- Pulling the data at the component level is really dumb -->
        <ul class="nav nav-pills flex-column mb-auto">
            <!-- Highlight the active page by matching it to the activeSpace -->
            <li v-for="space in spaces" style="max-width: 100%;">
                <div
                @click="changeSpace(space)"
                class="nav-link link-body-emphasis text-decoration-none space-selection"
                :class="{'bg-yellow-300': space.canonical === activeSpace.canonical}"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                :title="space.name">
                    <span>{{space.name}}</span> <br>
                    <span class="font-monospace" style="font-size: 0.8rem;">{{ space.canonical }}</span>
                </div>
            </li>
        </ul>
        <hr>
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
        <div class="form-text" style="font-size: 0.75em;">spaceID cannot be updated</div>
    </div>
    </template>
    
    <script>
    import {createClient} from '@supabase/supabase-js';
    
    
    export default {
        data() {
            return {
                newSpaceID: '',
                activeSpace: {},
                spaces: []
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
                    .select('name, canonical')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    // Add the spaces to the spaces array, sorted by canonical
                    this.spaces = sortArrayOfObjectsByKey(spaces, "canonical");
                    // Set the active space to the first space in the array
                    this.activeSpace = this.spaces[0];
                    this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                }
            },

            changeSpace(space) {
                this.activeSpace = space;
                this.$emit('activeSpaceChanged', this.activeSpace.canonical);
                console.log("Changing space to " + this.activeSpace.canonical);
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