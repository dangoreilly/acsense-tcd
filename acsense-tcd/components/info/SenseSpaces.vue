<template>
    <div class="sensoryinfo">
        <h3 class="d-flex">
            <span>Student Spaces</span>
            <!-- <a 
            class="link-offset-2 link-underline link-underline-opacity-0"
            href="https://www.tcd.ie/disability/services/sensory-support/"
            target="_blank">
                <i class="fs-6 mx-2 bi bi-info-circle"></i>
            </a> -->
        </h3>
        <div v-if="senseAreasExist">
            <span>There {{sensoryAreas.length > 1 ? "are" : "is"}} {{sensoryAreas.length}} Student Spaces in this building:</span>

            <div v-for="(area, index) in sensoryAreas" class="space-row py-2">
                <div style="grid-area: icon;">
                    <img :src="area.icon" :alt="area.type" style="width: 2.5rem; margin-right: .25rem;"/>
                </div>

                <div style="grid-area: name; align-self: start;" class=" pb-2">
                    {{ area.name }}
                </div>
                
                <!-- Seating -->
                <div style="grid-area: seating;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.seating, 'text-bg-danger': !area.seating}" 
                :title="(area.seating ? '' : 'No ') + 'Seating Available'">
                    <img class="svg-icon" src="/images/icons/chair-solid.svg"><!-- width="12" height="12" -->
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.seating" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Electrical Sockets -->
                <div style="grid-area: sockets;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.electrical_outlets, 'text-bg-danger': !area.electrical_outlets}" 
                :title="(area.electrical_outlets ? '' : 'No ') + 'Plug Sockets'">
                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.electrical_outlets" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Food and Drink allowed -->
                <div style="grid-area: food;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.food_drink_allowed, 'text-bg-danger': !area.food_drink_allowed}" 
                :title="'Food and Drink ' + (area.food_drink_allowed ? '' : 'not') + 'Allowed'">
                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.food_drink_allowed" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Kettle provided -->
                <div 
                style="grid-area: kettle;" 
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.kettle, 'text-bg-danger': !area.kettle}" 
                :title="(area.kettle ? '' : 'No ') + 'Kettle Available'">
                    <img class="svg-icon" src="/images/icons/kettle.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.kettle" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Microwave provided -->
                <div style="grid-area: microwave;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.microwave, 'text-bg-danger': !area.microwave}" 
                :title="(area.microwave ? '' : 'No ') + 'Microwave Available'">
                    <img class="svg-icon" src="/images/icons/microwave.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.microwave" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Wheelchair Accessible -->
                <div style="grid-area: wheelchair;"
                class="badge rounded-pill mx-1 facility-icon" 
                :class="{'text-bg-success': area.wheelchair_accessible, 'text-bg-danger': !area.wheelchair_accessible}" 
                :title="(area.wheelchair_accessible ? '' : 'No ') + 'Wheelchair Access'">
                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.wheelchair_accessible" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Dividing line, display on all but the last -->
                <hr 
                v-if="index < sensoryAreas.length - 1"
                style="grid-area: hr;" class="border-info-light opacity-50 border border-2 mt-3 mb-0">
            </div>
        </div>

        <div v-else>
            <p>This building has no student spaces</p>
        </div>
    </div>
</template>

<script lang="ts">
import {sensoryArea} from '~/assets/types/sensoryArea'

export default {
  props:{
    sensoryAreas: {
        type: Array as () => sensoryArea[],
        required: true,
    },
  },
  data() {
    return {
      senseAreasExist: this.sensoryAreas.length > 0,
    }
  },

}
</script>

<style>
#summary {
    border-radius: 3pt;
    padding: 1rem;
    min-width: min(25rem, 90vw);
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

.space-row {
    display: grid;
    /* padding-top: 2rem; */
    grid-template-columns:  4rem auto 4rem 4rem 4rem 4rem 4rem 4rem ;
    grid-template-rows: auto;
    grid-template-areas: 
        "icon name seating sockets food kettle microwave wheelchair"
        "hr hr hr hr hr hr hr hr";
}

@media screen and (max-width: 675px){
    .space-row {
        padding: 1rem;
        grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: auto auto;
        grid-template-areas: 
            "name name name name name name name"
            "icon seating sockets food kettle microwave wheelchair"
            "hr hr hr hr hr hr hr";
    }
}
</style>