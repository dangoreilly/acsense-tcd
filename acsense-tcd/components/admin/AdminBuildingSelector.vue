<template>
    <div class="d-flex flex-column flex-shrink-0 py-3 px-3 border-end border-secondary-subtle bg-body-tertiary position-sticky building-selection-sidebar">
        <ul class="nav nav-pills flex-column mb-auto">
            <!-- Highlight the active page by matching it to the activeBuilding -->
            <li v-for="building in buildings" style="max-width: 100%;">
                <div
                @click="changeBuilding(building)"
                class="nav-link link-body-emphasis text-decoration-none building-selection"
                :class="{'bg-yellow-300': building.canonical === activeBuilding.canonical}"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;"
                :title="building.display_name">
                    <span>{{building.display_name}}</span> <br>
                    <span class="font-monospace" style="font-size: 0.8rem;">{{ building.canonical }}</span>
                </div>
            </li>
        </ul>
        <hr>
        <div class="input-group">
            <input id="new-building" type="text" class="form-control" placeholder="new-buildingID" aria-label="New Building" aria-describedby="button-addon2"
            v-model="newBuildingID">
            <button 
            :disabled="!newBuildingIDValid" 
            class="btn"
            :class="{'btn-primary': newBuildingIDValid, 'btn-outline-secondary': !newBuildingIDValid}" 
            type="button" 
            title="new ID must be at least 5 characters">
                +
            </button>
            
        </div>
        <div class="form-text" style="font-size: 0.75em;">buildingID cannot be updated</div>
    </div>
    </template>
    
    <script>
    // import {createClient} from '@supabase/supabase-js';
    
    
    export default {
        props: {
            supabase_client: Object
        },
        data() {
            return {
                newBuildingID: '',
                activeBuilding: {},
                buildings: [
                    {
                        display_name: 'Arts Building',
                        canonical: 'arts-building',
                    },
                    {
                        display_name: 'Fitzgerald Building',
                        canonical: 'fitzgerald-building',
                    },
                    {
                        display_name: 'The Pav',
                        canonical: 'the-pav',
                    },
                ]
            }
        },
        mounted() {
            this.getListOfBuildings()
        },
        computed: {
            newBuildingIDValid() {
                return this.newBuildingID.length > 4
            }
        },
        methods: {
            async NewBuilding() {
                console.log("Creating new building")
                // Attempt to create a new building with the buildingID from the createNewBuilding field
                // If successful, open the new building for editing
                // If unsuccessful, display an error message
            },
    
            async getListOfBuildings() {
                
                // const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
                // const supabaseKey = useRuntimeConfig().public.supabaseKey;
                // this.supabase = createClient(supabaseUrl, supabaseKey)
    
                // Select All buildings from supabase
                // Assign them the buildings array

                // Wait for the supabase object to be initialised and passed down
                while (this.supabase_client == undefined) {
                    console.log("Waiting for supabase to be initialised")
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                let { data: buildings, error } = await this.supabase_client
                    .from('buildings')
                    .select('display_name, canonical')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    this.buildings = this.sortArrayOfObjectsByKey(buildings, "canonical");;
                    this.activeBuilding = this.buildings[0];
                    this.$emit('activeBuildingChanged', this.activeBuilding.canonical);
                }
            },

            changeBuilding(building) {
                this.activeBuilding = building;
                this.$emit('activeBuildingChanged', this.activeBuilding.canonical);
                console.log("Changing building to " + this.activeBuilding.canonical);
            },

            sortArrayOfObjectsByKey(array, key) {
                // Sort an array of objects by a key
                // Usually will be the canonical
                // Generated by ChatGPT

                if (!Array.isArray(array) || array.length === 0) {
                    return [];
                }

                if (!array[0].hasOwnProperty(key)) {
                    throw new Error(`The key "${key}" does not exist in the objects.`);
                }

                return array.slice().sort((a, b) => {
                    const valueA = a[key].toLowerCase(); // Convert to lowercase for case-insensitive sorting
                    const valueB = b[key].toLowerCase();
                    
                    if (valueA < valueB) {
                    return -1;
                    }
                    
                    if (valueA > valueB) {
                    return 1;
                    }
                    
                    return 0;
                });
            }
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
    .building-selection-sidebar{
        width: 250px; 
        overflow-y: auto;
        transition: width 0.4s ease-in-out;
    }
    .building-selection-sidebar:hover {
        width: 400px;
    }

    .building-selection {
        cursor: pointer;
    } 
    .building-selection:hover {
        background-color: #e9ecef;
    }
    .active-building-selection {
        background-color: #6bb5ff;
    }
    </style>