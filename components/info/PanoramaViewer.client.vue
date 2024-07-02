<template>
<div 
class="mainPictureCard">

    <div id="panorama" style="width: 100%; height: 20rem"></div>

</div>
</template>

<!-- <script setup>
    useHead({
        link: [
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css',
            },
        ],
    });


</script> -->

<script>

import { Viewer } from '@photo-sphere-viewer/core';
import { VisibleRangePlugin } from '@photo-sphere-viewer/visible-range-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';

// import pkg from '@photo-sphere-viewer/autorotate-plugin';
// const { AutorotatePlugin } = pkg;

export default {
    props:{
        mainSrc: String,
        mainAlt: String,
    },
    data(){
        return{
            imgSrc: this.mainSrc,
            imgAlt: this.mainAlt,
        }
    },
    created(){
        // If no mainSrc is provided, use a default image
        this.initImage();
    },

    updated(){
        // If no mainSrc is provided, use a default image
        this.initImage();
    },
    methods:{

        async initImage(){
            if(!this.mainSrc){
                this.imgSrc = "../images/info_page_default_image.jpg";
                this.imgAlt = "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
            }

            // console.log("Panorama: " + this.panorama)

            // Check that the viewer and plugin objects exists (ie the cdn has been loaded)
            while (typeof Viewer === 'undefined' || typeof VisibleRangePlugin === 'undefined' || typeof AutorotatePlugin === 'undefined') {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            this.vue_initPanoramaViewer();
        },

        vue_initPanoramaViewer(){
            let visibleRangePlugin;
            // console.log("panorama_src: " + panorama_src)

            const panorama_viewer = new Viewer({
                container: "panorama",
                panorama: this.imgSrc,
                caption: this.imgAlt,
                // touchmoveTwoFingers: true,
                defaultZoomLvl: 0,
                maxFov: 70,

                navbar: [
                    'autorotate',
                    'zoom',
                    'move',
                    'fullscreen',
                ],

                plugins: [
                    [VisibleRangePlugin, {
                        usePanoData: true,
                    }],
                    [AutorotatePlugin, {
                        autostartDelay: 1000,
                        // autorotatePitch: '5deg',
                        autorotateSpeed: "1rpm",
                    }],
                ],
            });
            
            visibleRangePlugin = panorama_viewer.getPlugin(VisibleRangePlugin);
        }

    }

}
</script>

<style>

@import url(https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css);

.mainPictureImg{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
}
</style>