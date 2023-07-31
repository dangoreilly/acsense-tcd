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
            <p>There {{sensoryAreas.length > 1 ? "are" : "is"}} {{sensoryAreas.length}} Student Spaces in this building:</p>
            <table class="table">
                <tbody>
                    <tr v-for="area in sensoryAreas">
                        <th>
                            <img :src="area.url" :alt="area.type" style="width: 2rem;"/>
                        </th>

                        <td>{{ area.Name }}</td>

                        <td style="display: flex; flex-direction: column; min-width: 8rem;">

                            <div style="align-items: end;">

                                <span class="badge rounded-pill text-bg-warning mx-1" title="Capacity">
                                    <i class="fa-solid fa-chair"></i>
                                    {{area.capacity > 0 ? area.capacity : '?'}}
                                </span>

                                <span 
                                class="badge rounded-pill mx-1" 
                                :class="{'text-bg-success': area.electrical_outlets, 'text-bg-danger': !area.electrical_outlets}" 
                                :title="(area.electrical_outlets ? '' : 'No ') + 'Plug Sockets'">
                                    <img class="svg-icon" src="/images/icons/plug-solid.svg" width="12" height="12">
                                </span>

                                <span 
                                class="badge rounded-pill mx-1" 
                                :class="{'text-bg-success': area.food_drink_allowed, 'text-bg-danger': !area.food_drink_allowed}" 
                                :title="'Food and Drink ' + (area.food_drink_allowed ? '' : 'not') + 'Allowed'">
                                    <i class="fa-solid fa-utensils"></i>
                                </span>

                            </div>
                            <div style="align-items: end;">

                                <span 
                                class="badge rounded-pill mx-1" 
                                :class="{'text-bg-success': area.kettle, 'text-bg-danger': !area.kettle}" 
                                :title="(area.kettle ? '' : 'No ') + 'Kettle Available'">
                                    <i class="fa-solid fa-mug-saucer"></i>
                                </span>

                                <span 
                                class="badge rounded-pill mx-1" 
                                :class="{'text-bg-success': area.microwave, 'text-bg-danger': !area.microwave}" 
                                :title="(area.microwave ? '' : 'No ') + 'Microwave Available'">
                                    <i class="fa-solid fa-radiation"></i>
                                </span>

                                <span 
                                class="badge rounded-pill mx-1" 
                                :class="{'text-bg-success': area.wheelchair_accessible, 'text-bg-danger': !area.wheelchair_accessible}" 
                                :title="(area.wheelchair_accessible ? '' : 'No ') + 'Wheelchair Access'">
                                    <!-- <i class="fa-solid fa-wheelchair"></i> -->
                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg" width="12" height="12">
                                </span>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        <!-- <p>This building has no student spaces</p> -->
        </div>
    </div>
</template>

<script lang="ts">
import {sensoryArea} from '~/assets/types/sensoryArea'

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
       vertical-align: top;
       fill: currentColor;
    }
</style>