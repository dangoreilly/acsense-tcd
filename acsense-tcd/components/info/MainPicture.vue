<template>
<!-- <div class="container"> -->
<div 
class="mainPictureCard">
    <img 
    :src="mainSrc" 
    class="card-img mainPictureImg" 
    :alt="mainAlt">
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
  }

}
</script>

<style>
.mainPictureCard {
    min-width: min(25rem, calc(100vw - 6rem));
    /* max-width: 650px; */
    margin: min(3rem, 3vw);
    
    /* margin-left: auto; */

    /* margin-top: min(1rem, 1vw); */
    
    /* min-width: 100%; */
}
.mainPictureImg{
    border-bottom-right-radius: 0.5rem;
    border-top-left-radius: 0.5rem;
}
</style>