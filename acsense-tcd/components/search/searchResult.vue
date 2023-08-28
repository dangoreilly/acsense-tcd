<template>
<div v-if="building.show" class="card mx-3 my-1 searchresult" @click="redirect()">
    <div class="card-body">
        <h5 class="card-title">{{ building.display_name }}</h5>
        <h6 v-if="building.aka" class="card-subtitle mb-2 text-body-secondary">{{building.aka}}</h6>
        <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{building.description}}</p>
    </div>
</div>
</template>

<script>

// import { Building } from '~/assets/types/Building';

export default{
    props: {
        building: {
            type: Object,
            required: true,
        },
        searchterm: {
            type: String,
            required: true,
        },
    },

    methods: {
        redirect() {
            this.$router.push({
                path: '/info/' + this.building.canonical,
            });
        },
        // highlight(text) {
        //     let inputText = document.getElementById("inputText");
        //     let innerHTML = inputText.innerHTML;
        //     let index = innerHTML.indexOf(text);
            
        //     if (index >= 0) { 
        //         innerHTML = innerHTML.substring(0,index) + "<mark'>" + innerHTML.substring(index,index+text.length) + "<mark>" + innerHTML.substring(index + text.length);
        //         inputText.innerHTML = innerHTML;
        //     }
        // }
    },
}

</script>

<style>

.searchresult {
    cursor: pointer;
    background-color: rgb(255, 252, 240);
    transition: all 0.4s ease-in-out;
}

.searchresult:hover {
    background-color: rgb(230, 249, 255);
}

</style>