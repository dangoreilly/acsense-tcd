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
                <span>Student Spaces</span>
                <!-- <a 
                class="link-offset-2 link-underline link-underline-opacity-0"
                href="https://www.tcd.ie/disability/services/sensory-support/"
                target="_blank">
                    <i class="fs-6 mx-2 bi bi-info-circle"></i>
                </a> -->
            </h3>
            <div v-if="senseAreasExist">
                <p>There are {{sensoryAreas.length}} Student Spaces in this building:</p>
                <table class="table">
                    <tbody>
                        <tr v-for="area in sensoryAreas">
                            <th>
                                <img :src="area.url" :alt="area.type" width="10px"/>
                            </th>
                            <td>{{ area.Name }}</td>
                            <td>
                                <span class="badge rounded-pill text-bg-warning" title="Capacity">
                                    <i class="fa-solid fa-chair"></i> 
                                    {{area.capacity > 0 ? area.capacity : '?'}}
                                </span>
                                <span 
                                class="badge rounded-pill" 
                                :class="{'text-bg-success': area.electrical_outlets, 'text-bg-danger': !area.electrical_outlets}" 
                                title="{{area.electrical_outlets ? '' : 'No '}}Plug Sockets">
                                    <i class="fa-solid fa-plug"></i>
                                </span>
                                <span class="badge rounded-pill text-bg-{{area.food_drink_allowed ? 'success' : 'danger'}}" title="Food and Drink {{area.food_drink_allowed ? 'Allowed' : 'not Allowed'}}">
                                    <i class="fa-solid fa-utensils"></i></span>
                                <span class="badge rounded-pill text-bg-{{area.kettle ? 'success' : 'danger'}}" title="{{area.kettle ? '' : 'No '}}Kettle">
                                    <i class="fa-solid fa-mug-saucer"></i></span>
                                <span class="badge rounded-pill text-bg-{{area.microwave ? 'success' : 'danger'}}" title="{{area.microwave ? '' : 'No ''}}Microwave">
                                    <i class="fa-solid fa-radiation"></i>
                                </span>
                                <span class="badge rounded-pill text-bg-{{area.wheelchair_accessible ? 'success' : 'danger'}}" title="{{area.wheelchair_accessible ? '' : 'No '}}Wheelchair Access">
                                    <i class="fa-solid fa-wheelchair"></i>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            <p>This building has no student spaces</p>
            </div>
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
</style>