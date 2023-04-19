<template>
<!-- <div class="container"> -->
<div 
class="rounded" 
id="mainPictureCard">
    <img 
    :src="mainSrc" 
    class="card-img" 
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

<style scoped>
#mainPictureCard {
    min-width: 25rem;
    /* max-width: 650px; */
    margin: min(3rem, 3vw);
    /* margin-left: auto; */

    /* margin-top: min(1rem, 1vw); */
    
    /* min-width: 100%; */
}
</style>