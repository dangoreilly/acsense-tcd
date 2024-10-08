<template>
    <div id="overlay-preview-map" style="height: 70dvh; padding-top: 30px;"></div>
</template>

<script lang="ts">
// @ts-ignore
import * as L from "leaflet";
import '~/assets/css/leaflet.css'
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import type { Overlay, Space, Space_Type, Building, Flyover } from "~/assets/types/supabase_types";
import type { Building_Partial, Space_Partial } from '~/utils/adminMapUtils'

import { getBuildingList, addBuildings, getFlyovers, addOverlays, getSpaces, addSpaces, getSpaceTypes } from '~/utils/adminMapUtils'


const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

export default {
    props: {
        overlays: {
            type: Array as () => Overlay[],
            required: true,
        },
        supabase_client: {
            type: Object as any,
            required: true,
        }
    },
    data(){
        return {
            map: {},
            buildingList: [] as Building_Partial[],
            spaceList: [] as Space_Partial[],
            spaceTypes: [] as Space_Type[],
            flyovers: [] as Flyover[],
            mode: "light",
        }
    },
    watch: {
        overlays: {
            handler: function(){
                this.refreshMap();
            },
            deep: true,
        },
        mode: {
            handler: function(){
                this.refreshMap();
            },
            deep: true,
        }
    },
    created(){
        // Fetch the non-overlay elements
        getBuildingList(this.supabase_client).then((buildings) => {
            this.buildingList = buildings;
        });
        getSpaces(this.supabase_client).then((spaces) => {
            this.spaceList = spaces;
        });
        getSpaceTypes(this.supabase_client).then((spaceTypes) => {
            this.spaceTypes = spaceTypes;
        });
        getFlyovers(this.supabase_client).then((flyovers) => {
            this.flyovers = flyovers;
        });
    },
    mounted(){
        this.refreshMap();
    },
    methods:{

        async waitForElements(){
            while (this.buildingList.length === 0 || this.spaceList.length === 0 || this.spaceTypes.length === 0){
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        },

        async initMap(){

            // Wait for the div to exist
            while (!document.getElementById('overlay-preview-map')) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if there is already a map object, remove if there is
            try {
                // @ts-ignore
                this.map.remove();
            }
            catch (error) {
                console.log("No map to remove");
            }

            // Initialise the map
            let map = L.map('overlay-preview-map', {
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxZoom: 20,
                renderer: L.canvas({padding: 1}),
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
            }).fitBounds(campusBounds);


            L.tileLayer(`https://{s}.basemaps.cartocdn.com/${this.mode}_nolabels/{z}/{x}/{y}.png`, { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            this.map = map;
        },

        async refreshMap(){
            await this.initMap();
            await this.waitForElements();

            let isDarkMode = this.mode === "dark";

            addOverlays(L, this.map, this.overlays, null, false, isDarkMode);
            addBuildings(L, this.map, this.buildingList, null, false, (active, text) => {return}, (feature, layer) => {return}, isDarkMode);
            addLabelsToMap(L, this.map, this.buildingList, null, true);
            // @ts-ignore
            addSpaces(L, this.map, this.spaceList, this.spaceTypes, null, false, (active, text) => {return});
            addFlyovers(L, this.map, this.flyovers, null, false);

            // Add buttons for controlling light/dark mode
            this.makeVisualModeToggle().addTo(this.map);
        },

        makeVisualModeToggle(){

            let isDarkMode = this.mode === "dark";
            let buttonColour = isDarkMode ? "btn-light" : "btn-dark";
            
            let modeControl = L.control({position: 'bottomleft'});

            // Anon function for toggling the mode
            let toggleMode = () => {
                this.mode = isDarkMode ? "light" : "dark";
            }
            
            modeControl.onAdd = function () {

                this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
                this.button.value = "Toggle Light/Dark Mode";
                this.button.innerHTML = '<button type="button" class="btn ' + buttonColour + ' border border-dark" style="margin-top:0">Toggle Light/Dark Mode</button>';
                this.button.style = "padding:0;"

                this.button.onclick = function(){
                    toggleMode();
                }

                return this.button;
            }
            
            // modeControl.addTo(this.map);
            return modeControl;
        }
    }
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

    .map-label { 
        color: #000;
        /* Text outline for improved readability */
        -webkit-text-stroke: 0.2px #ccc;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .map-label {
            color: #fff;
            /* Text outline for improved readability */
            -webkit-text-stroke: 1px black;
        }
    }

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