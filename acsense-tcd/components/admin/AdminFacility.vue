<template>
<!-- Generic facility icon -->
<div class="facility-icon-container">
    <div 
    class="badge rounded-pill mx-1 facility-component-facility-icon mb-3" 
    :class="available ? 'text-bg-success' : 'text-bg-danger'" 
    :title="available ? defaultNote(facility)[1] : defaultNote(facility)[0]">
        <img class="facility-component-svg-icon" :src="getIcon(facility)">
        <img class="facility-component-svg-underline" src="/images/icons/underline.svg">
        <!-- Strikethrough for RG blindness -->
        <img v-if="!available" class="facility-component-svg-icon-sash" src="/images/icons/sash.svg">
    </div>
    <div class="facility-note"><span>{{ getNote(facility) }}</span></div>
    
    <!-- <div class="facility-note"><span> Test </span></div> -->
</div>
            
</template>

<script>

export default {
  props:{
    facility: String,
    available: Boolean,
    note: String,
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

        icons: {
            microwave: "/images/icons/microwave.svg",
            kettle: "/images/icons/kettle.svg",
            seating: "/images/icons/chair-solid.svg",
            outlets: "/images/icons/plug-solid.svg",
            food_and_drink_allowed: "/images/icons/utensils-solid.svg",
            wheelchair: "/images/icons/wheelchair-solid.svg"
        }
    }
  },
  methods: {
    // Returns the default text for a facility, if user has not specified
    getNote(facility){

        // If the note is empty, return the default text
        if (this.note == null || this.note == "" || this.note == "\"\""){
            // Dirty ternary operator to return the correct default note
            // Just be thankful I didn't cast the boolean to an int and use it as an index
            return (this.available ? this.defaultNote(facility)[1] : this.defaultNote(facility)[0]);
        }
        // Otherwise, return the note
        else {
            return this.note;
        }
        
    },
    // Returns the default text for a facility, if user has not specified
    defaultNote(facility){
        if (facility == "seating"){
            return this.defaults.seating;
        }
        if (facility == "outlets"){
            return this.defaults.outlets;
        }
        if (facility == "food_and_drink_allowed"){
            return this.defaults.food_and_drink_allowed;
        }
        if (facility == "kettle"){
            return this.defaults.kettle;
        }
        if (facility == "microwave"){
            return this.defaults.microwave;
        }
        if (facility == "wheelchair"){
            return this.defaults.wheelchair;
        }
        // Shouldn't get this far
        return ["Error", "Error"]
    },
    // Returns the icon for a facility
    getIcon(facility){
        if (facility == "seating"){
            return this.icons.seating;
        }
        if (facility == "outlets"){
            return this.icons.outlets;
        }
        if (facility == "food_and_drink_allowed"){
            return this.icons.food_and_drink_allowed;
        }
        if (facility == "kettle"){
            return this.icons.kettle;
        }
        if (facility == "microwave"){
            return this.icons.microwave;
        }
        if (facility == "wheelchair"){
            return this.icons.wheelchair;
        }
        // Shouldn't get this far
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