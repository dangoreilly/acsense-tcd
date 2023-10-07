<template>
    <div
    class="card mx-3 my-1 searchresult"
    :class="result.type"    
    :style="{'background-color': (result.colour || '#dfdfdf') + '1b'}"
    @click="redirect()">
        <!-- Building card -->
        <div v-if="result.type == 'building'" class="card-body">
            <h5 class="card-title">{{ result.display_name }}</h5>
            <h6 v-if="result.aka" class="card-subtitle mb-2 text-body-secondary">{{result.aka}}</h6>
            <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{result.description}}</p>
        </div>
        <!-- Space card -->
        <div v-else 
        class="card-body">
            <h5 class="card-title">{{ result.name }}</h5>
            <h6 v-if="result.building" class="card-subtitle mb-2 text-body-secondary">{{result.building_display_name}}</h6>
            <div class="space-card-body">

                <!-- Description -->
                <div style="grid-area: desc;">
                    <p style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">{{result.description}}</p>
                </div>
                <!-- icon -->

                <div style="grid-area: icon;">
                    <img :src="result.icon" :alt="result.type" style="width: 2.5rem; margin-right: .25rem;"/>
                </div>
                
                <!-- Seating -->
                <div style="grid-area: seating;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.seating, 'text-bg-danger': !result.seating}" 
                :title="(result.seating ? '' : 'No ') + 'Seating Available'">
                    <img class="svg-icon" src="/images/icons/chair-solid.svg"><!-- width="12" height="12" -->
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.seating" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Electrical Sockets -->
                <div style="grid-area: sockets;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.outlets, 'text-bg-danger': !result.outlets}" 
                :title="(result.outlets ? '' : 'No ') + 'Plug Sockets'">
                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.outlets" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Food and Drink allowed -->
                <div style="grid-area: food;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.food_drink_allowed, 'text-bg-danger': !result.food_drink_allowed}" 
                :title="'Food and Drink ' + (result.food_drink_allowed ? '' : 'not') + 'Allowed'">
                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.food_drink_allowed" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Kettle provided -->
                <div 
                style="grid-area: kettle;" 
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.kettle, 'text-bg-danger': !result.kettle}" 
                :title="(result.kettle ? '' : 'No ') + 'Kettle Available'">
                    <img class="svg-icon" src="/images/icons/kettle.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.kettle" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Microwave provided -->
                <div style="grid-area: microwave;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.microwave, 'text-bg-danger': !result.microwave}" 
                :title="(result.microwave ? '' : 'No ') + 'Microwave Available'">
                    <img class="svg-icon" src="/images/icons/microwave.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.microwave" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Wheelchair Accessible -->
                <div style="grid-area: wheelchair;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': result.wheelchair, 'text-bg-danger': !result.wheelchair}" 
                :title="(result.wheelchair ? '' : 'No ') + 'Wheelchair Access'">
                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!result.wheelchair" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
            </div>
        </div>
</div>
</template>

<script>

// import { Building } from '~/assets/types/Building';

export default{
    props: {
        result: {
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
            // this.$router.push({
            //     path: '/info/' + this.building.canonical,
            // });
            // navigateTo('/info/' + this.building.canonical);

            // Check if the result is a building or a space
            if (this.result.type == "building"){
                // If it's a building, redirect to the building page
                window.location.href = '/info/' + this.result.canonical;
            }
            else {
                // If it's a space, redirect to the space page
                window.location.href = '/space/' + this.result.canonical;
            }
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

.building {
    background-color: #dfdfdf66;
}

.svg-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    vertical-align: middle;
    fill: currentColor;
    width: 1.5rem;
}
.svg-icon-sash {
    position: absolute;
    top: 31%;
    left: -30%;
    opacity: 0.8;
    /* transform: translate(-50%, -50%); */
    rotate: 45deg;
    vertical-align: middle;
    fill: currentColor;
    width: 2.4rem;
}

.facility-icon {
    width: 2.5rem;
    height: 2.5rem;
    position: relative;
    /* padding: 0.25rem; */
}

.space-card-body {
    display: grid;
    /* padding-top: 2rem; */
    grid-template-columns:  calc(100% - 26rem) auto 3rem 3rem 3rem 3rem 3rem 3rem 3rem ;
    grid-template-rows: auto;
    grid-template-areas: 
        "desc . icon seating sockets food kettle microwave wheelchair"
}


.space {
    background-color: rgba(240, 255, 254);
}

.searchresult {
    cursor: pointer;
    transition: all 0.4s ease-in-out;
}

.searchresult:hover {
    /* background-color: rgb(230, 249, 255); */
    box-shadow: inset 0px 0px 2px 2px rgba(2, 0, 117, 0.301);
}

</style>