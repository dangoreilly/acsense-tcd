<template>
<div 
class="mainPictureCard">

    <div v-if="panorama" id="panorama" style="width: 100%; height: 20rem"></div>

    <img v-else
    :src="imgSrc" 
    class="card-img mainPictureImg" 
    :alt="imgAlt">
</div>
</template>

<script setup>
    useHead({
        link: [
            {
                rel: 'stylesheet',
                href: 'https://cdn.jsdelivr.net/npm/@photo-sphere-viewer/core/index.min.css',
            },
        ],
    });


</script>

<script>

import { Viewer } from '@photo-sphere-viewer/core';
import { VisibleRangePlugin } from '@photo-sphere-viewer/visible-range-plugin';
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';

export default {
    props:{
        mainSrc: String,
        mainAlt: String,
        panorama: {
            type: Boolean,
            default: false,
        },
    },
    data(){
        return{
            imgSrc: this.mainSrc,
            imgAlt: this.mainAlt,
        }
    },

    // watch:{
    //     // If any of the props change, re-initialise the image
    //     mainSrc(){
    //         this.initImage();
    //     },
    //     mainAlt(){
    //         this.initImage();
    //     },
    // },
    mounted(){
        // If no mainSrc is provided, use a default image
        this.initImage();
    },

    updated(){
        // If no mainSrc is provided, use a default image
        this.initImage();
    },
    methods:{

        initImage(){
            if(!this.mainSrc){
                this.imgSrc = "../images/info_page_default_image.jpg";
                this.imgAlt = "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
            }

            // console.log("Panorama: " + this.panorama)

            if(this.panorama){
                this.vue_initPanoramaViewer();
            }
        },

        vue_initPanoramaViewer(){
            let visibleRangePlugin;
            // console.log("panorama_src: " + panorama_src)

            const panorama_viewer = new Viewer({
                container: "panorama",
                panorama: "https://i.imgur.com/Epj6Nzp.jpg", // TODO: replace with panorama_src
                caption: 'Kitchen test',
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
.mainPictureImg{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), -5px -5px 15px rgba(0,0,0,0.1);
}
</style>