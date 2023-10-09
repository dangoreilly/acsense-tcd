<template>
    <div class="sensoryinfo">
        <h3 class="d-flex">
            <span>Student Spaces 
                <span
                style="cursor: pointer;"
                class="text-primary fs-4"
                @click="openModal()"
                >
                    &#9432;
                </span>
            </span>
            <!-- <a 
            class="link-offset-2 link-underline link-underline-opacity-0"
            href="https://www.tcd.ie/disability/services/sensory-support/"
            target="_blank">
                <i class="fs-6 mx-2 bi bi-info-circle"></i>
            </a> -->
        </h3>
        <div v-if="senseAreasExist">
            <span>There {{sensoryAreas.length > 1 ? "are" : "is"}} {{sensoryAreas.length}} Student Spaces in this building:</span>

            <a :href="'/space/' + area.canonical"
            v-for="(area, index) in sensoryAreas" 
            class="space-row py-2 link-body-emphasis link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
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
                :class="{'text-bg-success': area.outlets, 'text-bg-danger': !area.outlets}" 
                :title="(area.outlets ? '' : 'No ') + 'Plug Sockets'">
                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.outlets" class="svg-icon-sash" src="/images/icons/sash.svg">
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
                :class="{'text-bg-success': area.wheelchair, 'text-bg-danger': !area.wheelchair}" 
                :title="(area.wheelchair ? '' : 'No ') + 'Wheelchair Access'">
                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!area.wheelchair" class="svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <!-- Dividing line, display on all but the last -->
                <hr 
                v-if="index < sensoryAreas.length - 1"
                style="grid-area: hr;" class="border-info-light opacity-50 border border-2 mt-3 mb-0">
            </a>
        </div>

        <div v-else>
            <p>This building has no student spaces</p>
        </div>

        <!-- Modal for describing space and facility icons -->
        <div 
        class="modal fade show" 
        id="infoModal"
        tabindex="-1" 
        @click.self="closeModal()"
        aria-modal="true" 
        role="dialog" >
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px;">
                <div class="modal-content" >

                    <div class="modal-header" style="width: 100%;">
                        <h5 class="modal-title d-flex">Student Space Icons</h5>
                        <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                    </div>

                    <div class="modal-body" style="align-self: baseline; max-height: 70vh; overflow-y: auto;">
                        <!-- Show the icons in a 2 columns, with the category name underneath -->
                        <h4>Space Types</h4>
                        <p>There are {{ spaceIcons.length }} categories of student space:</p>
                        
                        <div class="row">
                            <template v-for="icon in spaceIcons">
                                <div class="col-6">
                                    <div
                                        class="px-auto d-block">
                                        <img 
                                        :src="icon.icon" 
                                        class="mx-auto d-block border-bottom border-2 border-gray-500 pb-2 mb-2"
                                        style="width: 6rem; height: auto;"/>
                                        <p class="text-center">{{ icon.category }}</p>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <!-- List all the facilities icons, in FALSE then TRUE state, and then what they represent -->
                        <h4>Facilities</h4>
                        <p>The symbols beside the student space show what facilities are provided in them. Green shows the facility is available, Red with a strike-through shows the facility is unavailable</p>
                        <div class="mx-4">
                            <div class="row bottom-bottom border-2 border-gray-500 my-1" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Seating -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Seating Available">
                                    <img class="svg-icon" src="/images/icons/chair-solid.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div>
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Seating Available">
                                    <img class="svg-icon" src="/images/icons/chair-solid.svg">
                                </div>
                                <!-- Facility -->
                                <div>
                                    <span>Seating Available</span>
                                </div>

                            </div>
                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Electrical Sockets -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Plug Sockets">
                                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div>
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Plug Sockets">
                                    <img class="svg-icon" src="/images/icons/plug-solid.svg">
                                </div>
                                <div>
                                    <!-- Facility -->
                                    <span>Plug Sockets available</span>
                                </div>

                            </div>
                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Food and Drink allowed -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Food or Drink Allowed">
                                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div>
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Food and Drink Allowed">
                                    <img class="svg-icon" src="/images/icons/utensils-solid.svg">
                                </div>
                                <div>
                                    <!-- Facility -->
                                    <span>Food and Drink allowed</span>
                                </div>

                            </div>
                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Kettle provided -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Kettle Available">
                                    <img class="svg-icon" src="/images/icons/kettle.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div>
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Kettle Available">
                                    <img class="svg-icon" src="/images/icons/kettle.svg">
                                </div>
                                <div>
                                    <!-- Facility -->
                                    <span>Kettle provided</span>
                                </div>

                            </div>
                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Microwave provided -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Microwave Available">
                                    <img class="svg-icon" src="/images/icons/microwave.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div>
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Microwave Available">
                                    <img class="svg-icon" src="/images/icons/microwave.svg">
                                </div>
                                <div>
                                    <!-- Facility -->
                                    <span>Microwave provided</span>
                                </div>

                            </div>
                            <div class="row bottom-bottom border-2 border-gray-500 my-2" style="display: grid; grid-template-columns: 4rem 4rem auto;">
                                <!-- Wheelchair Accessible -->
                                <!-- FALSE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-danger" 
                                title="No Wheelchair Access">
                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                                    <!-- Strikethrough for RG blindness -->
                                    <img class="svg-icon-sash" src="/images/icons/sash.svg">
                                </div> 
                                <!-- TRUE -->
                                <div
                                class="badge rounded-pill mx-1 facility-icon text-bg-success"
                                title="Wheelchair Access">
                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg">
                                </div>
                                <div>
                                    <!-- Facility -->
                                    <span>Wheelchair Accessibility</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {createClient} from '@supabase/supabase-js';

export default {
  props:{
    sensoryAreas: {
        type: Array,
        required: true,
    },
  },
  data() {
    return {
        senseAreasExist: this.sensoryAreas.length > 0,
        spaceIcons: [],
    }
  },
    mounted() {
        this.getSpaceIcons()
    },
  methods: {
    async getSpaceIcons() {
        // Get the space icons from the database
        // For showing in the info modal
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)

        let { data: icons, error } = await this.supabase
            .from('space_styles')
            .select('category, icon')
        if (error) {
            console.log(error)
            throw error
        }
        else {
            this.spaceIcons = icons;
        }
    },

    closeModal() {
        // Get the modal element and set it's display to none
        let infoModal = document.getElementById('infoModal')
        let body = document.body

        if (infoModal) {
            infoModal.style.display = "none";
        }
        body.style.overflowY = "auto";
    },

    openModal() {
        // Get the modal element and set it's display to block
        let infoModal = document.getElementById('infoModal')
        let body = document.body

        if (infoModal) {
            infoModal.style.display = "block";
        }
        body.style.overflowY = "hidden";
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