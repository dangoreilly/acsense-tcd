<template>
    <div
    class="card mx-3 my-1 searchresult placeholder-wave"
    style="background-color: #dfdfdf"
    :style="{'opacity': 1 - 0.12*index}">
        <!-- Building card -->
        <div class="card-body">
            <h5 class="card-title"><span class="placeholder col-3"></span></h5>
            <h6 class="card-subtitle mb-2 text-body-secondary" v-html="placeholderAKA()"></h6>
            <p style="overflow: hidden; white-space: nowrap; text-overflow:clip;" v-html="placeholderDescription()"></p>

        </div>
    </div>
</template>

<script>

// import { Building } from '~/assets/types/Building';

export default{
    props: {
        index: {
            type: Number,
            required: true,
        }
    },
    
    methods: {
        placeholderAKA(){
            // Generate rand int between 0 and 3
            let rand = Math.floor(Math.random() * 4);
            switch(rand){
                case 0:
                    return "<span class='placeholder col-4'></span>";
                case 1:
                    return "<span class='placeholder col-1'></span> <span class='placeholder col-2'></span>";
                case 2:
                    return "<span class='placeholder col-1'></span> <span class='placeholder col-1'></span> <span class='placeholder col-1'></span>";
                case 3:
                    return "<span class='placeholder col-2'></span> <span class='placeholder col-2'></span>";
            }
        },

        placeholderDescription(){
            let desc = "";
            // Loop through 10 times
            // Generate rand int between 2 and 8
            // Append a placeholder of that length to the desc
            for(let i = 0; i < 10; i++){
                let rand = Math.floor(Math.random() * 3) + 1;
                desc += "<span class='placeholder col-" + rand + "'></span> ";
            }

            return desc;
        }
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

.searchresult-placeholder {
    cursor:wait;
    transition: all 0.4s ease-in-out;
}

.searchresult:hover {
    /* background-color: rgb(230, 249, 255); */
    box-shadow: inset 0px 0px 2px 2px rgba(2, 0, 117, 0.301);
}

</style>