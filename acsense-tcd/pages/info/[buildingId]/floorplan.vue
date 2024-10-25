<template>
    <div>
        <InternalMap
        :building="building"
        :floors="floorplans"
        :spaces="studentSpaces"
        :spaceStyles="spaceStyles"
        :navigationNodes="navNodes"
        @openSpaceModal="openSpaceModal"
        @openLegendModal="legendModalOpen = true"
        @spaceHover="space_name_toast_showing = true; space_being_hovered_on = $event"
        @spaceUnhover="space_name_toast_showing = false"
        @openLiftModal="openLiftModal"
        @dismissModals="closeModal"/>
    
        <!-- Info Modal -->
        <div 
            class="modal fade show" 
            id="buildingModal"
            tabindex="-1" 
            @click.self="closeModal()"
            aria-modal="true" 
            role="dialog" 
            :style="infoModalOpen ? 'display: block;' : 'display: none;'">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px;">
                    <div class="modal-content" >
    
                        <div class="modal-header" style="width: 100%;">
                            <h5 class="modal-title d-flex" id="mapModalLabel">{{infoModal.title}}</h5>
                            <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                        </div>
    
                        <div class="modal-body" style="align-self: baseline;" v-html="infoModal.mainContent"></div>
    
                        <div class="modal-footer space-modal-badge-container" style="justify-content: center" v-html="infoModal.footer"></div>
                    
                    </div>
                </div>
            </div>
    
        <!-- Lift Modal -->
        <div 
            class="modal fade show" 
            id="areaModal"
            tabindex="-1" 
            @click.self="closeModal()"
            aria-modal="true" 
            role="dialog" 
            :style="liftModalOpen ? 'display: block;' : 'display: none;'">
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px;">
                    <div class="modal-content" >
    
                        <div class="modal-header" style="width: 100%;">
                            <h5 class="modal-title d-flex" id="mapModalLabel">{{ lift.label }}</h5>
                            <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                        </div>
    
                        <div class="modal-body w-100" style="align-self: baseline; max-height: 70vh; overflow-y: auto;">
                            <div class="d-grid gap-2">
                                <!-- Loop through the valid floors, each button calls the gotoFloor function for the relevant index -->
                                <button v-for = "floor in lift.validFloors" 
                                class="btn btn-primary" 
                                type="button" 
                                @click="floor.gotoFloor()"
                                :disabled="floor.isCurrentFloor">
                                    {{ floor.label }}
                                </button>
                            </div>
                        </div>
    
                    
                    </div>
                </div>
            </div>
    
        <!-- Welcome Modal -->
        <div 
        class="modal fade show" 
        tabindex="-1" 
        @click.self="welcomeModalOpen=false; legendModalOpen=true"
        aria-modal="true" 
        role="dialog" 
        :style="welcomeModalOpen ? 'display: block;' : 'display: none;'">
    
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
    
                    <div class="modal-header">
                        <h5 class="modal-title" id="welcomeModalLabel">Internal map of {{ building.display_name }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="welcomeModalOpen=false; legendModalOpen=true"></button>
                    </div>
    
                    <div class="modal-body">
                        <p>{{welcome}}</p>
                    </div>
                    
                    <div class="modal-footer d-flex justify-content-between">
                        <div class="form-check" title="This checkbox stores a non-tracking cookie on your device, to store your preference">
                            <input class="form-check-input" type="checkbox" v-model="skipWelcome" id="skipWelcomeCheck">
                            <label class="form-check-label" for="skipWelcomeCheck">
                                Don't show again (stores a cookie)
                            </label>
                        </div>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="welcomeModalOpen=false; legendModalOpen=true">Close</button>
                        <!-- <a role="button" href='https://www.tcd.ie/disability/services/tcdsense.php' class="btn btn-secondary" >About TCDSense</a> -->
                    </div>
                
                </div>
            </div>
        </div>
    
        <div class="toast-container p-3 start-50 translate-middle-x space-name-toast bottom-0"
        :style="space_name_toast_showing ? 'opacity: 1;' : 'opacity: 0;'">
            <div class="toast show">
                <div class="toast-body">
                    {{ space_being_hovered_on  }}
                </div>
            </div>
        </div>
    
        <!-- <Legend :displayModal="legendModalOpen" :spaceIcons="spaceStyles" @close-modal="legendModalOpen = false"></Legend> -->
    
    </div>
</template>

<script setup lang="ts">
    import { createClient } from '@supabase/supabase-js';
    import type { Building_Partial, Space, Floorplan, Nav_Node, Space_Type } from '~/assets/types/supabase_types';
    import type { Lift } from '~/assets/types/otherTypes';
    import { Building_Partial_Fields } from '~/assets/types/supabase_types';

    function validateNavigationNode(node: Nav_Node, numFloors: number): Nav_Node {
        // Takes in a lift or stair, checks it has the correct number of floors
        // Trims the presence array to the correct number of floors if too many
        // filles the presence array with 0s if too few

        // Check the presence array is the correct length
        if (node.presence.length != numFloors) {
            // If it's too long, trim it
            if (node.presence.length > numFloors) {
                node.presence = node.presence.slice(0, numFloors);
            }
            // If it's too short, fill it with 0s
            else {
                let difference = numFloors - node.presence.length;
                for (let i = 0; i < difference; i++) {
                    node.presence.push(false);
                }
            }
        }

        return node;

    }


    // Create the supabase client that will gather all our data
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Gather all our data

    let building = ref({} as Building_Partial);
    let floorplans = ref([] as Floorplan[]);
    let studentSpaces = ref([] as Space[]);
    let navNodes = ref([] as Nav_Node[]);
    let spaceStyles = ref([] as Space_Type[]);
    let welcome = ref("" as string);

    // Figure out what building we're in
    const route = useRoute();
    const buildingId = route.params.buildingId;

    // Get our building data
    const { data: buildings_data, error: building_error} = await supabase
        .from('buildings')
        .select(Building_Partial_Fields)
        .eq('canonical', buildingId)

    if (building_error) {
        console.log('An error occured while fetching the building data:');
        console.log(building_error);
    }
    else {
        building = ref(buildings_data[0]);
    }

    // Space Styles
    const { data: spaceStyles_data, error: spaceStyle_error} = await supabase
        .from('space_styles')
        .select('*')

    if (spaceStyle_error) {
        console.log('An error occured while fetching space styles:');
        console.log(spaceStyle_error);
    }
    else {
        spaceStyles = ref(spaceStyles_data);
    }

    // Student Spaces
    const { data: studentSpaces_data, error: studentSpace_error} = await supabase
        .from('spaces')
        .select('*')
        .eq('building', building.value.canonical)

    if (studentSpace_error) {
        console.log('An error occured while fetching student spaces:');
        console.log(studentSpace_error);
    }
    else {

        studentSpaces_data.forEach(space => {
            space.icon = getIconForSpace(space, spaceStyles.value);
        });

        studentSpaces = ref(studentSpaces_data);
    }

    function setEntryFloor(floors: Floorplan[], newEntryFloor: number): Floorplan[] {
        // Set all floors to entryFloor = false
        floors.forEach((floor, index) => {
            floor.isEntry = false;
        });

        // Set the entry floor to true by checking newEntryfloor
        floors[newEntryFloor].isEntry = true;

        return floors;
    }

    // Floors
    const { data: floors_data, error: floors_error} = await supabase
        .from('floorplans')
        .select('*')
        .eq('building', building.value.canonical)

    if (floors_error) {
        console.log('An error occured while fetching floorplans:');
        console.log(floors_error);
    }
    else {

        let floors = floors_data;
        // Sort the floors and set the entry floor
        floors.sort((a, b) => (a.level > b.level) ? 1 : -1)
        floors = setEntryFloor(floors, building.value.entry_floor);
        // Store the floors
        floorplans = ref(floors);
    }

    // Nav Nodes
    const { data: NavNodes_data, error: NavNodes_error} = await supabase
        .from('nav_nodes')
        .select('*')
        .eq('building', building.value.canonical)

    if (NavNodes_error) {
        console.log('An error occured while fetching lifts and stairs:');
        console.log(NavNodes_error);
    }
    else {
        // Validate all the nodes
        for (let i = 0; i < NavNodes_data.length; i++) {
            NavNodes_data[i] = validateNavigationNode(NavNodes_data[i], floorplans.value.length);
        }
        navNodes = ref(NavNodes_data);
    }

    // Welcome Modal Content
    const { data: welcome_data, error: welcome_error} = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'internal_welcome')

    if (welcome_error) {
        console.log('An error occured while fetching welcome modal content:');
        console.log(welcome_error);
    }
    else {
        welcome = ref(welcome_data[0].data.mainContent);
        // console.log(welcome_data[0].data);
    }

    
    // Set some meta data for the page
    useHead({
        title: 'Map of ' + building.value.display_name + ' | TCDSense',
        meta: [
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
            },
        ],
        // Add the plausible analytics script
        script: [
            {
                src: 'https://plausible.io/js/script.js',
                defer: true,
                'data-domain': "tcdsensemap.ie"
            },
        ]
    });

    // console.log("building", building.value);
    // console.log("floorplans", floorplans.value);
    // console.log("studentSpaces", studentSpaces.value);
    // console.log("navNodes", navNodes.value);
    // console.log("spaceStyles", spaceStyles.value);
        

</script>

<script lang="ts">
// import { createClient } from '@supabase/supabase-js';

import {openAreaModal} from '~/assets/modalFunctions.js';

console.log()

export default {
    data() {
        return {
            welcomeModalOpen: false,
            legendModalOpen: false,
            infoModalOpen: false,
            skipWelcome: false,
            space_name_toast_showing: false,
            space_being_hovered_on: '',
            infoModal: {
                title: '',
                mainContent: '',
                footer: '',
            },
            lift: {} as Lift,
            liftModalOpen: false,
        }
    },
    mounted() {
        // console.log(this.$refs.welcome);
        // Check if the user has indicated they want to skip the welcome modal
        this.checkSkipWelcome();
    },
    watch: {
        skipWelcome: function(){
            this.setWelcomeSkipCookie();
        }
    },

    methods: {

        openSpaceModal(space: Space){
            this.infoModal = openAreaModal(space);

            this.infoModalOpen = true;
        },

        openLiftModal(lift: Lift){
            this.lift = lift;

            this.liftModalOpen = true;
        },
        
        
        closeModal(){
            // Close the modals
            this.welcomeModalOpen = false;
            this.infoModalOpen = false;
            this.legendModalOpen = false;
            this.liftModalOpen = false;
        },


        // Check the cookies to see if the user has requested to skip the welcome modal
        checkSkipWelcome(){
            // Access the cookie
            let skipWelcomeCookie = useCookie('tcdsense-skipWelcome-internal');

            // Initialise the cookie if it doesn't exist
            skipWelcomeCookie.value = skipWelcomeCookie.value || 'false';

            // If the cookie exists, and is set to true, skip the welcome modal
            if (skipWelcomeCookie.value == 'false'){
                this.welcomeModalOpen = true;
            }

            // If the cookie was initialised for this check, it'll be non-persistent
            
        },

        setWelcomeSkipCookie(){
            // create the cookie, if the user has requested to skip the welcome modal
            if (this.skipWelcome){
                console.log("creating cookie")
                // Create the cookie to expire in 6 months
                let skipWelcomeCookie =  useCookie('tcdsense-skipWelcome_internal', {maxAge: 60*60*24*180});

                skipWelcomeCookie.value = 'true';

                console.log(skipWelcomeCookie);
            }
            else {
                console.log("deleting cookie")
                // Delete the cookie by setting it to expire in 10 seconds
                let skipWelcomeCookie =  useCookie('tcdsense-skipWelcome-internal', {maxAge: 10});

                skipWelcomeCookie.value = 'false';

                console.log(skipWelcomeCookie);
            }
            

        }

    }
};
</script>

<style>
    /* @import url("~/assets/css/leaflet.css"); */

    :root{
        /* --primary-label-opacity: 1;
        --secondary-label-opacity: 0;
        --tertiary-label-opacity: 0; */
        transition: opacity 0.5s ease-in-out;
    }

    #map { height: 100dvh; }

    .primary-label {
        opacity: var(--primary-label-opacity);
        transition: opacity 0.5s ease-in-out;
        /* display: var(--primary-label-display); */
    }
    .secondary-label {
        opacity: var(--secondary-label-opacity);
        transition: opacity 0.5s ease-in-out;
        /* display: var(--primary-label-display); */
    }
    .tertiary-label {
        opacity: var(--tertiary-label-opacity);
        transition: opacity 0.5s ease-in-out;
        /* display: var(--primary-label-display); */
    }
    .flyover-label {
        opacity: calc(var(--secondary-label-opacity) + var(--primary-label-opacity));
        transition: opacity 0.5s ease-in-out;
        /* display: var(--primary-label-display); */
    }

    .sense-icon {
        /* opacity: var(--sense-icon-opacity); */
        transition: opacity 0.5s ease-in-out;
    }

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

    
    .space-name-toast {
        transition: all 0.2s ease-in-out;
    }

</style>
