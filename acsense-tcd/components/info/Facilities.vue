<template>
    <div class="facilities-info">
        <h3 class="d-flex">
            Facilities
        </h3>

        <div class="facilities-grid py-2">
            <!-- Seating -->
            <div style="grid-area: seating;"	class="facility-icon-container">
                <div 
                class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.seating, 'text-bg-danger': !space.seating}" 
                :title="(space.seating ? '' : 'No ') + 'Seating Available'">
                    <img class="facility-component-svg-icon" src="/images/icons/chair-solid.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.seating" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <div class="facility-note"><span>{{ getNote("seating") }}</span></div>
            </div>
            <!-- Electrical Sockets -->
            <div style="grid-area: sockets" class="facility-icon-container">
                <div 
                class="badge rounded-pill facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.outlets, 'text-bg-danger': !space.outlets}" 
                :title="(space.outlets ? '' : 'No ') + 'Plug Sockets'">
                    <img class="facility-component-svg-icon" src="/images/icons/plug-solid.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.outlets" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <div class="facility-note"><span>{{ getNote("outlets") }}</span></div>
            </div>
            <!-- Food and Drink allowed -->
            <div style="grid-area: food;"	class="facility-icon-container">
                <div 
                class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.food_drink_allowed, 'text-bg-danger': !space.food_drink_allowed}" 
                :title="'Food and Drink ' + (space.food_drink_allowed ? '' : 'not') + 'Allowed'">
                    <img class="facility-component-svg-icon" src="/images/icons/utensils-solid.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.food_drink_allowed" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <div class="facility-note"><span>{{ getNote("food_and_drink_allowed") }}</span></div>
            </div>
            <!-- Kettle provided -->
            <div style="grid-area: kettle;"	class="facility-icon-container">
                <div 
                class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.kettle, 'text-bg-danger': !space.kettle}" 
                :title="(space.kettle ? '' : 'No ') + 'Kettle Available'">
                    <img class="facility-component-svg-icon" src="/images/icons/kettle.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.kettle" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <div class="facility-note"><span>{{ getNote("kettle") }}</span></div>
            </div>
            <!-- Microwave provided -->
            <div style="grid-area: microwave;"	class="facility-icon-container">
                <div 
                class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.microwave, 'text-bg-danger': !space.microwave}" 
                :title="(space.microwave ? '' : 'No ') + 'Microwave Available'">
                    <img class="facility-component-svg-icon" src="/images/icons/microwave.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.microwave" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div>
                <div class="facility-note"><span>{{ getNote("microwave") }}</span></div>
            </div>
            <!-- Wheelchair Accessible -->
            <div style="grid-area: wheelchair;"	class="facility-icon-container">
                <div 
                class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
                :class="{'text-bg-success': space.wheelchair, 'text-bg-danger': !space.wheelchair}" 
                :title="(space.wheelchair ? '' : 'No ') + 'Wheelchair Access'">
                    <img class="facility-component-svg-icon" src="/images/icons/wheelchair-solid.svg">
                    <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
                    <!-- Strikethrough for RG blindness -->
                    <img v-if="!space.wheelchair" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
                </div> 
                <div class="facility-note"><span>{{ getNote("wheelchair") }}</span></div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
  props:{
    space: Object,
  },
  data() {
    return {
        // Object containing default text saying a facility is or is not available
        defaults: {
            microwave: ["No Microwave Available", "Microwave Available"], 
            kettle: ["No Kettle Available", "Kettle Available"], 
            seating: ["No Seating Available", "Seating Available"], 
            outlets: ["No Plug Sockets", "Plug Sockets"], 
            food_and_drink_allowed: ["No Food or Drink Allowed", "Food and Drink Allowed"], 
            wheelchair: ["No Wheelchair Access", "Wheelchair Access"]
        },
    }
  },
  methods: {
    // Returns the default text for a facility, if user has not specified
    getNote(facility){

        // Unfortunately there's no clean way of checking each facility
        // So we have to do it by hand

        // Check there's a space object, first and foremost
        if (this.space.canonical == undefined){
            return;
        }
        
        // console.log(facility)

        if (facility == "seating"){
            // If the note is empty, return the default text
            if (this.space.seating_note == null || this.space.seating_note == "" || this.space.seating_note == "\"\""){
                if (this.space.seating) return this.defaults.seating[1];
                else return this.defaults.seating[0];
            }
            // Otherwise, return the note
            else {
                return this.space.seating_note;
            }

        }

        if (facility == "outlets"){
            // If the note is empty, return the default text
            if (this.space.outlets_note == null || this.space.outlets_note == "" || this.space.outlets_note == "\"\""){
                if (this.space.outlets) return this.defaults.outlets[1];
                else return this.defaults.outlets[0];
            }
            // Otherwise, return the note
            else {
                return this.space.outlets_note;
            }

        }

        if (facility == "food_and_drink_allowed"){
            // If the note is empty, return the default text
            if (this.space.food_and_drink_allowed_note == null || this.space.food_and_drink_allowed_note == "" || this.space.food_and_drink_allowed_note == "\"\""){
                if (this.space.food_and_drink_allowed) return this.defaults.food_and_drink_allowed[1];
                else return this.defaults.food_and_drink_allowed[0];
            }
            // Otherwise, return the note
            else {
                return this.space.food_and_drink_allowed_note;
            }

        }

        if (facility == "kettle"){
            // If the note is empty, return the default text
            if (this.space.kettle_note == null || this.space.kettle_note == "" || this.space.kettle_note == "\"\""){
                if (this.space.kettle) return this.defaults.kettle[1];
                else return this.defaults.kettle[0];
            }
            // Otherwise, return the note
            else {
                return this.space.kettle_note;
            }

        }

        if (facility == "microwave"){
            // If the note is empty, return the default text
            if (this.space.microwave == null || this.space.microwave == "" || this.space.microwave_note == "\"\""){
                if (this.space.microwave) return this.defaults.microwave[1];
                else return this.defaults.microwave[0];
            }
            // Otherwise, return the note
            else {
                return this.space.microwave_note;
            }

        }

        if (facility == "wheelchair"){
            // If the note is empty, return the default text
            if (this.space.wheelchair_note == null || this.space.wheelchair_note == "" || this.space.wheelchair_note == "\"\""){
                if (this.space.wheelchair) return this.defaults.wheelchair[1];
                else return this.defaults.wheelchair[0];
            }
            // Otherwise, return the note
            else {
                return this.space.wheelchair_note;
            }

        }

        return "Error"
    
        
    }
  }

}
</script>

<style>

.facility-note {
    /* font-size: 0.8rem; */
    /* text-align: center; */
    margin-top: 1rem;
}

.facility-icon-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.facility-component-svg-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    vertical-align: middle;
    fill: currentColor;
    width: 3rem;
}
.facility-component-svg-icon-sash {
    position: absolute;
    top: 31%;
    left: -30%;
    opacity: 0.8;
    z-index: 100;
    /* transform: translate(-50%, -50%); */
    rotate: 45deg;
    vertical-align: middle;
    fill: currentColor;
    width: 4.9rem;
}
.facility-component-svg-underline {
    position: absolute;
    top: 110%;
    left: -50%;
    opacity: 0.3;
    z-index: 100;
    /* transform: translate(-50%, -50%); */
    /* rotate: 45deg; */
    vertical-align: middle;
    fill: #000000;
    width: 10rem;
}

.facility-component-facility-icon {
    width: 5rem;
    height: 5rem;
    margin-left: 2.5rem;
    position: relative;
    margin-left: auto;
    margin-right: auto;

    /* padding: 0.25rem; */
}

.facility-component-bounding-box {
    position: relative;
    left: 25%;
    width: 10rem;
    border-bottom: 0.2rem solid gray;
}

.facilities-grid {
    display: grid;
    justify-items: center;
    grid-gap: 3rem;
    /* padding-top: 2rem; */
    grid-template-columns:  1fr 1fr 1fr;
    grid-template-rows: auto auto;
    grid-template-areas: 
        "seating sockets food"
        "kettle microwave wheelchair";
}

@media screen and (max-width: 675px){
    .facilities-grid {
        padding: 1rem;
        grid-template-columns: auto;
        grid-template-rows: auto;
        grid-template-areas: 
            "seating"
            "sockets"
            "food"
            "kettle"
            "microwave"
            "wheelchair";
    }
}
</style>