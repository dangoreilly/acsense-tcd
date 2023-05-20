<template>
    <div id="summary" class="m-3">
        <h1>{{buildingName}}</h1>
        
        <p v-if="aka" id="aka" style="display:block"><b>Also Known as:</b> {{aka}}</p>
        
        <div id="description">
            <h3>Description</h3>
            <p>{{description}}</p>
        </div>
        <div class="sensoryinfo">
            <h3 class="d-flex">
                <span>Sensory Overview </span>
                <a 
                class="link-offset-2 link-underline link-underline-opacity-0"
                href="https://www.tcd.ie/disability/services/sensory-support/"
                target="_blank">
                    <i class="fs-6 mx-2 bi bi-info-circle"></i>
                </a>
            </h3>
            <p>{{sensoryOverview}}</p>
        </div>

    </div>
</template>

<script lang="ts">

export default {
  props:{
    buildingName: {
        type: String,
        required: true,
    },
    aka: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    sensoryOverview: {
        type: String,
        required: true,
    },
  }

}
</script>

<style>
    #summary {
        border-radius: 3pt;
        padding: 1rem;
        min-width: min(25rem, 90vw);
    }
</style>