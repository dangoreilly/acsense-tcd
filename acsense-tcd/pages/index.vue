<template>
<div>
    <OverworldMap
    :flyOvers="flyovers"
    :overlays="overlays"
    :buildings="buildings"
    :studentSpaces="studentSpaces"
    :spaceStyles="spaceStyles"
    :dummy_studentSpaces="dummy_studentSpaces"
    @openBuildingModal="openBuildingModal"
    @openSpaceModal="openSpaceModal"
    @openLegendModal="legendModalOpen = true"
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

    <!-- Space Modal -->
    <!-- <div 
        class="modal fade show" 
        id="areaModal"
        tabindex="-1" 
        @click.self="closeModal()"
        aria-modal="true" 
        role="dialog" 
        :style="spaceModalOpen ? 'display: block;' : 'display: none;'">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px;">
                <div class="modal-content" >

                    <div class="modal-header" style="width: 100%;">
                        <h5 class="modal-title d-flex" id="mapModalLabel" >text</h5>
                        <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                    </div>

                    <div class="modal-body" style="align-self: baseline; max-height: 70vh; overflow-y: auto;"></div>

                    <div class="modal-footer space-modal-badge-container" style="justify-content: center"></div>
                
                </div>
            </div>
        </div> -->

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
                    <h5 class="modal-title" id="welcomeModalLabel">Welcome</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="welcomeModalOpen=false; legendModalOpen=true"></button>
                </div>

                <div class="modal-body">
                    <p>{{welcome.mainContent}}</p>
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

    <Legend :displayModal="legendModalOpen" :spaceIcons="spaceStyles" @close-modal="legendModalOpen = false"></Legend>

</div>
</template>

<script setup>

import { createClient } from '@supabase/supabase-js';

// The view when the map is first opened. Defined as what looks good on mobile, because 
    // that automatically looks alright on desktop, but not the other way around.
    const INITIAL_VIEW = [
                        [53.34631744552114, -6.255028994837502],
                        [53.34163690316516, -6.258745992827823]
                    ];
    // Set some meta data for the page
    useHead({
        title: 'TCD Sense Map',
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

    function createStyledLayerGroupLabel(area_type, area_styles){
    // Take in space type and the space styles array
    // Return the styled layer group label

    let area_colour = area_styles.find(area_style => area_style.category == area_type).colour;

    // Create the label
    return `<span class="position-relative">` +
                    `<span class="position-absolute top-50 start-0 translate-middle ms-3 p-2 border border-dark rounded-circle" style="background-color: ${area_colour};"> </span>` +
                    `<span class="ms-1 ps-4">${area_type}</span>` +
                `</span>`
    }

    // Create the supabase client that will gather all our data
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Gather all our data

    let flyovers = ref([]);
    let buildings = ref([]);
    let studentSpaces = ref([]);
    let overlays = ref([]);
    let spaceStyles = ref([]);
    let welcome = ref({});

    let dummy_studentSpaces = ref([]);


    // Flyovers
    const { data: flyovers_data, error: flyover_error} = await supabase
        .from('flyovers')
        .select('*')

    if (flyover_error) {
        console.log('An error occured while fetching flyovers:');
        console.log(flyover_error);

        // Hardcode bypass for now
    }
    else {
        flyovers = ref(flyovers_data);
    }

    // Buildings
    const { data: buildings_data, error: building_error} = await supabase
        .from('buildings')
        .select('canonical, display_name, always_display, aka, description, map_label_1, map_label_2, map_label_3, geometry')
        .eq("published", true)

    if (building_error) {
        console.log('An error occured while fetching buildings:');
        console.log(building_error);
    }
    else {
        buildings = ref(buildings_data);
    }

    // Student Spaces
    const { data: studentSpaces_data, error: studentSpace_error} = await supabase
        .from('spaces')
        .select('*')
        .eq("published", true)

    if (studentSpace_error) {
        console.log('An error occured while fetching student spaces:');
        console.log(studentSpace_error);
    }
    else {
        studentSpaces = ref(studentSpaces_data);
    }

    // Dummy Student Spaces
    const { data: dummy_studentSpaces_data, error: dummy_studentSpace_error} = await supabase
        .from('space_dummy')
        .select('*')

    if (studentSpace_error) {
        console.log('An error occured while fetching dummy student spaces:');
        console.log(studentSpace_error);
    }
    else {
        dummy_studentSpaces = ref(dummy_studentSpaces_data);
    }

    // Overlays
    const { data: overlays_data, error: overlay_error} = await supabase
        .from('overlays')
        .select('*')

    if (overlay_error) {
        console.log('An error occured while fetching overlays:');
        console.log(overlay_error);
    }
    else {
        overlays = ref(overlays_data);
        // console.log(overlays_data)
        // console.log(overlays);
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

        // Add the styled layer group label to each space style
        spaceStyles_data.forEach(spaceStyle => {
            spaceStyle.styled_label = createStyledLayerGroupLabel(spaceStyle.category, spaceStyles_data);
        });

        spaceStyles = ref(spaceStyles_data);
    }

    // Welcome Modal Content
    const { data: welcome_data, error: welcome_error} = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'welcome')

    if (welcome_error) {
        console.log('An error occured while fetching welcome modal content:');
        console.log(welcome_error);
    }
    else {
        welcome = ref(welcome_data[0].data);
        // console.log(welcome_data[0].data);
    }
        

</script>

<script>
// import { createClient } from '@supabase/supabase-js';

import {openInfoModal, openAreaModal} from '~/assets/modalFunctions.js';

export default {
    data() {
        return {
            welcomeModalOpen: false,
            legendModalOpen: false,
            infoModalOpen: false,
            skipWelcome: false,
            infoModal: {
                title: '',
                mainContent: '',
                footer: '',
            },
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

        openBuildingModal(building){
            this.infoModal = openInfoModal(building);

            this.infoModalOpen = true;
        },

        openSpaceModal(space){
            this.infoModal = openAreaModal(space);

            this.infoModalOpen = true;
        },
        
        
        closeModal(){
            // Close the modals
            this.welcomeModalOpen = false;
            this.infoModalOpen = false;
            this.legendModalOpen = false;
        },


        // Check the cookies to see if the user has requested to skip the welcome modal
        checkSkipWelcome(){
            // Access the cookie
            let skipWelcomeCookie = useCookie('tcdsense-skipWelcome');

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
                let skipWelcomeCookie =  useCookie('tcdsense-skipWelcome', {maxAge: 60*60*24*180});

                skipWelcomeCookie.value = 'true';

                console.log(skipWelcomeCookie);
            }
            else {
                console.log("deleting cookie")
                // Delete the cookie by setting it to expire in 10 seconds
                let skipWelcomeCookie =  useCookie('tcdsense-skipWelcome', {maxAge: 10});

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

    </style>
