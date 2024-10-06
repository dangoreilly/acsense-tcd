<template>
<div 
    :class="previewMode ? '' : 'modal fade show'" 
    id="infoModal"
    tabindex="-1" 
    @click.self="closeModal()"
    aria-modal="true" 
    role="dialog" >
    <!-- Modal for describing space and facility icons -->
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width: 520px; min(calc(100%-calc(var(--bs-modal-margin) * 2)), 80rem)">
            <div class="modal-content" >

                <div class="modal-header" style="width: 100%;">
                    <h5 class="modal-title d-flex">Student Space Icons</h5>
                    <button type="button" class="btn-close d-flex" @click="closeModal()" aria-label="Close"></button>
                </div>

                <div v-if="spaceIcons" 
                class="modal-body" style="align-self: baseline; max-height: 70vh; overflow-y: auto;">

                    <!-- Welcome text -->
                    <div v-if="welcomeText">
                        <p>{{ welcomeText }}</p>
                    </div>

                    <!-- Show the icons in a 2 columns, with the category name underneath -->
                    <h4>Space Types</h4>
                    <p>There are {{ spaceIcons.length }} categories of student space:</p>
                    
                    <div class="row">
                        <template v-for="icon, index in spaceIcons">
                            <div :class="badgeWidth(index)">
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

                    <div class="row px-4" v-for="spaceType in spaceIcons">
                        <div v-if="spaceType.descriptor?.length>0">
                            <p class="position-relative">
                                <span class="position-absolute top-50 start-0 translate-middle p-2 border border-dark rounded-circle" :style="{'background-color': spaceType.colour}"> </span>
                                <span class="ps-3"><strong>{{ spaceType.category }}</strong></span>
                            </p>
                            <p>{{ spaceType.descriptor }}</p>
                        </div>
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
</template>

<script>
export default {
    props:{
        displayModal: {
            type: Boolean,
            default: false
        },
        spaceIcons: {
            type: Array,
            required: true,
        },
        welcomeText: {
            type: String,
            required: false,
        },
        previewMode: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    watch: {
        displayModal: function (newVal, oldVal) {
            if (newVal) {
                this.openModal()
            } else {
                this.closeModal()
            }
        }
    },
    methods: {
        closeModal() {
            // If we're in preview mode, do nothing
            if (this.previewMode) {
                return
            }
            // Get the modal element and set it's display to none
            let infoModal = document.getElementById('infoModal')
            let body = document.body

            if (infoModal) {
                infoModal.style.display = "none";
            }
            body.style.overflowY = "auto";

            // Emit the close-modal event
            this.$emit('close-modal', false)
        },

        openModal() {
            // Get the modal element and set it's display to block
            let infoModal = document.getElementById('infoModal')
            let body = document.body

            if (infoModal) {
                infoModal.style.display = "block";
            }
            // body.style.overflowY = "hidden";
        },
        badgeWidth(index){
            // For the icons for the student spaces
            // We want to make sure that if there are an odd number, the last one is full width
            if (index === this.spaceIcons.length - 1 && this.spaceIcons.length % 2 !== 0){
                return "col-12"
            } else {
                return "col-6"
            }
        }
    }
  }
</script>