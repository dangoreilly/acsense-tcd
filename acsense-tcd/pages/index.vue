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

                    <div class="modal-footer" style="justify-content: center"></div>
                
                </div>
            </div>
        </div>
    
        <div 
        class="modal fade show" 
        tabindex="-1" 
        @click.self="welcomeModalOpen=false"
        aria-modal="true" 
        role="dialog" 
        :style="welcomeModalOpen ? 'display: block;' : 'display: none;'">

            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h5 class="modal-title" id="welcomeModalLabel">Welcome</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="welcomeModalOpen = false"></button>
                    </div>

                    <div class="modal-body">
                        <p>{{welcome.MainContent}}</p>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="welcomeModalOpen = false">Close</button>
                        <!-- <a role="button" href='https://www.tcd.ie/disability/services/tcdsense.php' class="btn btn-secondary" >About TCDSense</a> -->
                    </div>
                
                </div>
            </div>
        </div>
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
            }
        ]
    });

    
    
    </script>

    <script>

    export default {
        data() {
            return {
                welcome: {
                    MainContent: "This map provides information about the sensory environments in different areas of Trinity. It also provides physical access information for buildings across campus. Click on each building or use the search bar in bottom corner to find your desired building.",
                },
                welcomeModalOpen: true,
            }
        },
        methods: {
            closeModal() {
                let mapModal = document.getElementById('mapModal')
                let areaModal = document.getElementById('areaModal')
                mapModal.style.display = "none";
                areaModal.style.display = "none";
                // mapModal.classList.remove('show');
            }
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
            opacity: var(--sense-icon-opacity);
            transition: opacity 0.5s ease-in-out;
        }

    </style>