<template>
<!-- Container div -->
<div> 
    <!-- Map object, populated by Leaflet -->
    <div id="map"></div>

    <!-- Modal for building info -->
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

    <!-- Modal for map markers -->
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

                <div class="modal-body" style="align-self: baseline;"></div>

                <div class="modal-footer" style="justify-content: center"></div>
            
            </div>
        </div>
    </div>

    <!-- Modal for welcome message -->
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
                    <a role="button" href='https://www.tcd.ie/disability/services/tcdsense.php' class="btn btn-secondary" >About TCDSense</a>
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
            src: '/javascript/internalMapInit.js',
            body: true,
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
                    MainContent: "Internal map test. Use the floor controls in the top left to move through the floors",
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
#map { height: 100vh; }
</style>