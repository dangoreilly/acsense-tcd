<template>
<div v-if="building.show" class="card mx-3 my-1 searchresult" @click="redirect()">
    <div class="card-body">
        <h5 class="card-title">{{ building.name }}</h5>
        <h6 v-if="building.aka" class="card-subtitle mb-2 text-body-secondary">{{building.aka}}</h6>
        <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{building.description}}</p>
    </div>
</div>
</template>

<script lang="ts">

// import { Building } from '~/assets/types/Building';

export default{
    props: {
        building_raw: {
            type: Object,
            required: true,
        },
        searchterm: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            building: {
                name: this.building_raw.properties.Name,
                aka: this.building_raw.properties.aka,
                description: this.building_raw.properties.Description,
                show: this.building_raw.show,
                canonical: this.building_raw.properties.bldID,
            },
        }      
    },
    watch: {
        building_raw: {
            handler: function (val, oldVal) {
                this.building.show = val.show;
            },
            deep: true,
        },
    },
    // created: function () {
    //     console.log(this.building);
    // },
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