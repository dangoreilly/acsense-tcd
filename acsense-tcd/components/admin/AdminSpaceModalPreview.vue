
<template>
    <div class="modal position-static d-block" tabindex="-1" style="">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title d-flex">{{ space.name }}</h5>
                                                <button type="button" class="btn-close d-flex" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
    
                                            <div class="modal-body" style="align-self: baseline; max-height: 70vh; overflow-y: auto;">
                                                <p>{{ space.description }}</p>
                                            </div>
                                                
                                            <div class="modal-footer fs-4" style="justify-content: center;">
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.seating, 'text-bg-danger': !space.seating}" 
                                                :title="(space.seating ? '' : 'No ') + 'Seating'">
                                                    <img class="svg-icon" src="/images/icons/chair-solid.svg" width="12" height="12">
                                                </span>
    
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.outlets, 'text-bg-danger': !space.outlets}" 
                                                :title="(space.outlets ? '' : 'No ') + 'Plug Sockets'">
                                                    <img class="svg-icon" src="/images/icons/plug-solid.svg" width="12" height="12">
                                                </span>
    
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.food_drink_allowed, 'text-bg-danger': !space.food_drink_allowed}" 
                                                :title="'Food and Drink ' + (space.food_drink_allowed ? '' : 'not') + 'Allowed'">
                                                    <img class="svg-icon" src="/images/icons/utensils-solid.svg" width="12" height="12">
                                                </span>
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.kettle, 'text-bg-danger': !space.kettle}" 
                                                :title="(space.kettle ? '' : 'No ') + 'Kettle Available'">
                                                    <img class="svg-icon" src="/images/icons/kettle.svg" width="12" height="12">
                                                </span>
    
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.microwave, 'text-bg-danger': !space.microwave}" 
                                                :title="(space.microwave ? '' : 'No ') + 'Microwave Available'">
                                                    <img class="svg-icon" src="/images/icons/microwave.svg" width="12" height="12">
                                                </span>
    
                                                <span 
                                                class="badge rounded-pill mx-1" 
                                                :class="{'text-bg-success': space.wheelchair, 'text-bg-danger': !space.wheelchair}" 
                                                :title="(space.wheelchair ? '' : 'No ') + 'Wheelchair Access'">
                                                    <!-- <i class="fa-solid fa-wheelchair"></i> -->
                                                    <img class="svg-icon" src="/images/icons/wheelchair-solid.svg" width="12" height="12">
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
    </template>
    <script>
    export default {
        props: {
            space: {
                type: Object,
                required: true
            }
        },
    }
    </script>