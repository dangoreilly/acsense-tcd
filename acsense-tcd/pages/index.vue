<template>
    <div>
        <div id="map"></div>

        <div 
        class="modal fade show" 
        id="mapModal"
        tabindex="-1" 
        @click.self="closeModal()"
        aria-modal="true" 
        role="dialog" >
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px;">
                <div class="modal-content" >

                    <div class="modal-header" style="width: 100%;">
                        <h5 class="modal-title d-flex" id="mapModalLabel" >text</h5>
                        <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                    </div>

                    <div class="modal-body" style="align-self: baseline;"></div>

                    <div class="modal-footer" style="justify-content: center"></div>
                
                </div>
            </div>
        </div>

        <div 
        class="modal fade show" 
        id="areaModal"
        tabindex="-1" 
        @click.self="closeModal()"
        aria-modal="true" 
        role="dialog" >
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
        </div>
    
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
                        <p>{{welcome.MainContent}}</p>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="welcomeModalOpen=false; legendModalOpen=true">Close</button>
                        <!-- <a role="button" href='https://www.tcd.ie/disability/services/tcdsense.php' class="btn btn-secondary" >About TCDSense</a> -->
                    </div>
                
                </div>
            </div>
        </div>

        <Legend :displayModal="legendModalOpen" :spaceIcons="spaceIcons" @close-modal="legendModalOpen = false"></Legend>

    </div>
    
    </template>
   

    <script setup>
    
    //Script setup needed for UseHead
    // The index page is very different to the rest of the script
    // so there's no qualms with using the composition API here, instead of the Options API
    import '~/assets/css/leaflet.css'

    useHead({
        title: 'Accessibility Map',
        meta: [
            {
                name: 'description',
                content: 'An interactive map of Trinity College Dublin, showing accessibility information for buildings and rooms.',
            },
            {
                name: 'keywords',
                content: 'Trinity College Dublin, Accessibility, Map, Interactive, Wheelchair, Mobility, Vision, Hearing, Sensory, Disability, Inclusive, Inclusivity, Accessible, Building, Room, Floorplans',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            },
        ],
        link: [
            {
                rel:"stylesheet",
                href:"https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css"
            },
            {
                rel:"stylesheet",
                href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            },
        ],
        script: [
            {
                src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
                crossorigin: "",
            },
            {
                src: 'https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.min.js',
                body: true,
            },
            {
                src: '/javascript/mapInit.js',
                body: true,
            },
            {
                src: 'https://unpkg.com/@supabase/supabase-js@2',
            },
            {
                src: '/javascript/mapFunctions.js',
            },
            {
                src: '/javascript/debugFunctions.js',
            },
            {
                src: '/javascript/modalFunctions.js',
            },
            {
                src: 'https://plausible.io/js/script.js',
                defer: true,
                'data-domain': "tcdsensemap.ie"
            },
        ]
    });

    
    
    </script>

    <script>
    import {createClient} from '@supabase/supabase-js';

    export default {
        data() {
            return {
                welcome: {
                    MainContent: "This map provides information about the sensory environments in different areas of Trinity. It also provides physical access information for buildings across campus. Click on each building or use the search bar in bottom corner to find your desired building.",
                },
                welcomeModalOpen: true,
                map_config_object: {
                    INTIAL_VIEW_MOBILE: [
                        [53.34631744552114, -6.255028994837502],
                        [53.34163690316516, -6.258745992827823]
                    ],
                    INTIAL_VIEW_WEB: [
                        [53.345568, -6.259428],
                        [53.341853, -6.249477]
                    ],
                    LABEL_PRIMARY_RANGE_LOWER: 18,
                    LABEL_PRIMARY_RANGE_UPPER: 17,
                    DEBUG: false,
                },
                supabase: null,
                legendModalOpen: false,
                spaceIcons: [],
            }
        },
        methods: {
            closeModal() {
                let mapModal = document.getElementById('mapModal')
                let areaModal = document.getElementById('areaModal')
                mapModal.style.display = "none";
                areaModal.style.display = "none";
                // mapModal.classList.remove('show');
                legendModalOpen = false;
            },
            checkDebug() {
                // Check if the URL contains a debug parameter
                // If so, set the DEBUG variable to true
                // This will enable the debug function
                let urlParams = new URLSearchParams(globalThis.location.search);
                
                this.map_config_object.DEBUG = urlParams.has('debug');
            },
            async waitThenInitialiseMap(map_config_object, supabase) {
                // Wait until the initialiseMap function is available
                while (typeof initialiseMap !== "function") {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                // Initialise the map
                initialiseMap(map_config_object, supabase);
            },
            async getSpaceIcons() {
            // Get the space icons from the database
            // For showing in the info modal
            // const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            // const supabaseKey = useRuntimeConfig().public.supabaseKey;
            // const supabase = createClient(supabaseUrl, supabaseKey)

            let { data: icons, error } = await this.supabase
                .from('space_styles')
                .select('category, icon')
            if (error) {
                console.log(error)
                throw error
            }
            else {
                console.log("Space icons retrieved")
                console.log(icons)
                return JSON.parse(JSON.stringify(icons));
            }
        }
        },
        mounted() {
            // Initialise Supabase
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey);
            // Check the debug status
            this.checkDebug();
            // Initialise the map
            this.waitThenInitialiseMap(this.map_config_object, this.supabase);

            // Get the space icons
            this.getSpaceIcons().then((icons) => {
                this.spaceIcons = icons;
            })

        },
    }


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