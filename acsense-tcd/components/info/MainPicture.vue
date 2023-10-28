<template>
<div 
class="mainPictureCard">
    <img
    :src="imgSrc" 
    class="card-img mainPictureImg" 
    :alt="imgAlt">
</div>
</template>

<script>


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

        initImage(){
            if(!this.mainSrc){
                this.imgSrc = "../images/info_page_default_image.jpg";
                this.imgAlt = "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
            }
        },

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