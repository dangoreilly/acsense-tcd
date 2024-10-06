<template>
    <div>
        <div  id="space-placement-map" style="height: 700px; padding-top: 30px;"></div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import * as L from "leaflet";
import '~/assets/css/leaflet.css'
import 'leaflet.fullscreen';
import 'leaflet.fullscreen/Control.FullScreen.css';
import type { Overlay, Space, Space_Type, Building } from "~/assets/types/supabase_types";

import { getBuildingList, addBuildings, getOverlays, addOverlays, getSpaces, addSpaces } from '~/utils/adminMapUtils'

const campusBounds = [
                    [53.345568, -6.259428],
                    [53.341853, -6.249477]
                ];

export default {
    props: {
        spaceTypes: {
            type: Array as () => Space_Type[],
            required: true,
        },
        supabase_client: {
            type: Object,
            required: true,
        },
    },
    data(){
        return {
            map: {},
        }
    },
    watch: {
        spaceTypes: {
            handler: function(){
                this.refreshMap();
            },
            deep: true,
        }
    },
    mounted(){
        this.refreshMap();
    },
    methods:{
        initMap(){
            // Check if there is already a map object, remove if there is
            try {
                // @ts-ignore
                this.map.remove();
            }
            catch (error) {
                console.log("No map to remove");
            }

            // Initialise the map
            let map = L.map('space-placement-map', {
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxZoom: 20,
                renderer: L.canvas({padding: 1}),
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: 'topleft'
                },
            }).fitBounds(campusBounds);


            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            this.map = map;
        },

        async refreshMap(){
            this.initMap();
            const overlays = await getOverlays(this.supabase_client);
            const buildings = await getBuildingList(this.supabase_client);
            const spaces = await getSpaces(this.supabase_client);

            addOverlays(L, this.map, overlays, null, false);
            addBuildings(L, this.map, buildings, null, false, (active, text) => {return}, (feature, layer) => {return});
            // @ts-ignore
            addSpaces(L, this.map, spaces, this.spaceTypes, null, false, (active, text) => {return});
        },
    }
}
</script>