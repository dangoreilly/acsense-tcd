<template>
<!-- <div class="container"> -->
<div 
class="mainPictureCard">
    <img 
    :src="imgSrc" 
    class="card-img mainPictureImg" 
    :alt="imgAlt">
    <!-- <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
    </div> -->
</div>
<!-- </div> -->
</template>

<script lang="ts">

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
    if(!this.mainSrc){
      this.imgSrc = "../images/info_page_default_image.jpg";
      this.imgAlt = "Photo showing the fellows' square of Trinity College Dublin. No building in particular is focused on";
    }
  }

}
</script>

<style>
.mainPictureImg{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
}
</style>