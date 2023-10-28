<template>
<NuxtLayout name="info-layout">
    <div 
    v-if="building"
    class="building-info"
    :class="infoBoxDisplays ? 'infobox-display' : 'infobox-no-display'">

        <div class="info-page-title" style="grid-area: title;">

            <h1>{{building.display_name}}</h1>

            <p v-if="building.aka" id="aka" style="display:block"><b>Also Known as:</b> {{building.aka}}</p>
        </div>
            
        <div id="description" style="grid-area: desc; justify-self: start;">
            <h3>Description</h3>
            <p>{{building.description}}</p>
        </div>
            
        <div style="grid-area: sense-areas; align-self: end;">
            <SenseSpaces 
            :sensoryAreas="building.student_spaces"
            />
        </div>

        <div style="grid-area: main-photo;">
            <MainPicture 
            :mainSrc="building.primary_image_url" 
            :mainAlt="building.primary_image_alt" 
            />
        </div>

        <div style="grid-area: tips;"
        v-if="building.tips.length >0">
            <AccessTips :tips="building.tips" />
            
        </div>

        
        <div style="grid-area: tabs;">
            <Infobox
            :contentArray="infoBoxContent"
            :activeInfoTab="activeInfoBoxTab"
            @tabChanged="activeInfoBoxTab = $event"
            />
        </div>

        <!-- If time data exists, render it. If it doesn't, render a placeholder -->
        <div style="grid-area: open-times;  align-self: center;"
        class="my-4"
        v-if="building.opening_times">
            <Timebox
            :times="building.opening_times"/>
        </div>
        <!-- In theory, this placeholder should be temporary. But theoretically temporary things tend to be practically permanent... -->
        <div v-else style="grid-area: open-times; align-self: center; margin-left: min(3rem, 3vw); margin-right: min(3rem, 3vw);">
            <div 
            class="time-card card  pt-2 mx-2 px-3" 
            style="grid-area: open-times; justify-self: start; align-self: start; margin-left: min(3rem, 3vw); margin-right: min(3rem, 3vw);">
                <p><em>Opening times not available for this building</em></p>
            </div>
        </div>
                
        <!-- <div class="link-button link-button-top" style="grid-area: rooms; align-self: center; justify-self: stretch;">
            <NuxtLink :to="linkToRooms">
                <button type="button" class="btn btn-primary btn-lg w-100 h-75">Room info</button>
            </NuxtLink>
        </div> -->
            
        <!-- <div class="link-button" style="grid-area: floorplan; align-self: center; justify-self: stretch;">
            <NuxtLink :to="linkToInternalMap">
                <button type="button" class="btn btn-primary btn-lg w-100">Internal Map</button>
            </NuxtLink>
        </div> -->

        <div
        class="mt-3"
        style="grid-area: additional-info;"
        v-if="building.furtherinfo_display">
            <AdditionalInfo 
            :info="building.further_info"/>
        </div>

        <div style="grid-area: gallery;"
        v-if="building.gallery_images.length > 0">
            <Gallery
            :images="building.gallery_images"
            />
        </div>
        
    </div>
    <p v-else>Sorry, this building doesn't exist</p>
</NuxtLayout>
</template>

<style>
.mainMatter {
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 40px;
    
}

.mainPictureCard {
    min-width: min(25rem, calc(100vw - 6rem));
    margin: 0 min(3rem, 3vw) 0 min(3rem, 3vw);
}
.time-card {
    margin-top: 1rem;
}

.infotabs {
    margin: 2rem 0 2rem 0;
}

.link-button {
    padding: 0.5rem;
}

.link-button-top {
    padding-top: 0.5rem;
}

.building-info {
    display: grid;
    padding-top: 2rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 
        [row1] auto
        [row2] auto 
        [row3] auto
        [row4] auto
        [row5] auto 
        [row6] auto 
        [row7] auto 
        [row8] auto 
        [row9] auto;
    grid-template-areas: 
        "title title main-photo main-photo"
        "desc desc main-photo main-photo"
        "sense-areas sense-areas sense-areas sense-areas"
        "tabs tabs open-times open-times"
        "tips tips tips tips"
        ". . . ." /* ". rooms floorplan ." */
        "additional-info additional-info additional-info additional-info"
        "gallery gallery gallery gallery";
}

.infobox-display {
    grid-template-areas: 
        "title title main-photo main-photo"
        "desc desc main-photo main-photo"
        "sense-areas sense-areas sense-areas sense-areas"
        "tabs tabs open-times open-times"
        "tips tips tips tips"
        ". . . ." /* ". rooms floorplan ." */
        "additional-info additional-info additional-info additional-info"
        "gallery gallery gallery gallery";
}

.infobox-no-display {
    grid-template-areas: 
        "title title main-photo main-photo"
        "desc desc main-photo main-photo"
        "sense-areas sense-areas sense-areas sense-areas"
        ". open-times open-times ."
        "tips tips tips tips"
        ". . . ." /* ". rooms floorplan ." */
        "additional-info additional-info additional-info additional-info"
        "gallery gallery gallery gallery";
}

@media screen and (max-width: 992px){
    .building-info {
        padding: 1rem;
        grid-template-columns: 1fr;
        grid-template-rows: auto;
        grid-template-areas: 
            "title"
            "main-photo"
            "desc"
            "tabs"
            "sense-areas"
            "open-times"
            "tips"
            /* "rooms" */
            /* "floorplan" */
            "additional-info"
            "gallery";
    }
    
    .mainPictureCard {
        margin: min(3rem, 3vw);
    }

    
    .time-card {
        margin: 0;
    }

    .link-button-top {
        padding-top: 1rem;
    }

    .infotabs {
        margin: 0 0 1rem 0;
    }
    
    .access-tips-card {
        margin: 1rem 0 1rem 0;
    }

}
/* 
html {
    width: 100%;
}

body {
    min-width: 100vw;
} */
</style>

<script setup>

    // function setInfoBoxContent(building){
    //     return [
    //         {
    //             title: "Sensory Experience",
    //             content: building.sense_exp || "No information available",
    //             display: building.sense_exp_display
    //         },
    //         {
    //             title: "Wayfinding",
    //             content: building.wayfinding || "No information available",
    //             display: building.wayfinding_display
    //         },
    //         {
    //             title: "Physical Access",
    //             content: building.phys_access || "No information available",
    //             display: building.phys_access_display
    //         },
    //     ];
    // }

    async function getBuildingData() {
        const route = useRoute();

        const response = await useFetch('/api/get/building/' + route.params.buildingId);

        if (response.data.value != "" && response.data.value != null) {

            // Clone it to avoid proxy nonsense
            return JSON.parse(JSON.stringify(response.data.value));
            
            // Set the info box content
            // this.setInfoBoxContent();
        }
        else {
            console.log("No building data found");
            // Redirect 
            useRouter().push('./?search=' + route.params.buildingId);
        }
        // console.warn("Building data:")
        // console.log(this.building);
    }

    function infoBoxDisplayCheck(infoBoxContent) {
        // Returns true if any of the infobox tabs are set to display
        for (let i = 0; i < infoBoxContent.length; i++) {
            if (infoBoxContent[i].display) {
                return true;
            }
        }
        // If none of them are set to display, return false
        return false;
    }

    
    const { data: building, error } = await useAsyncData('building', () => getBuildingData())

    // console.log(building);

    const infoBoxContent = ref(setInfoBoxContent(building.value));
    // console.log(infoBoxContent);
    const infoBoxDisplays = ref(infoBoxDisplayCheck(infoBoxContent.value));

    // console.log(infoBoxContent.value);

    useHead({
        title: building.value.display_name + '- TCD Sense',
        meta: [
            {
                name: 'description',
                content: building.value.description,
            },
            {
                name: 'keywords',
                content: 'Trinity College Dublin, Accessibility, Map, Interactive, Wheelchair, Mobility, Vision, Hearing, Sensory, Disability, Inclusive, Inclusivity, Accessible, Building, Room, Floorplans',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            },
        ],
    });


</script>

<script>

    // import bld from '~/assets/example-data';
    // import areas from '~/assets/example-area-data';
    // import { Building } from '~/assets/types/Building';

    // import { InfoBoxContentTab } from '~/assets/types/infoPageTypes';

    export default {
        data() {
            return {
            // building: {},
            // infoBoxContent: [],
            activeInfoBoxTab: 0,
            // linkToRooms: '/info/' + this.$route.params.buildingId + '/rooms',
            // linkToInternalMap: '/info/' + this.$route.params.buildingId + '/floorplan',
            }
        },
        // head() {
        //     return {
        //         title: this.building.display_name + ' - TCD Sense',
        //         meta: [
        //             {
        //                 name: 'description',
        //                 content: 'Access information for ' + this.building.display_name + ' (Trinity College Dublin), showing accessibility information for buildings and rooms.',
        //             },
        //         ],
        //     }
        // },
        // created() {
        //     // Set dummy variables to stop components from crashing
        //     this.building.student_spaces = [];
        //     // Grab the building data from the server and transform it 
        //     // into the format we need
        //     this.getBuildingData()
            
        // },
        computed: {
            // Get the theme from local storage
            // prefersDarkTheme() {
            //     return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            // },

            // Check if any of the infobox tabs are set to display
            // This will change the class of the whole page to make the infobox tabs visible
            // infoBoxDisplays() {
            //     // Returns true if any of the infobox tabs are set to display
            //     for (let i = 0; i < this.infoBoxContent.length; i++) {
            //         if (this.infoBoxContent[i].display) {
            //             return true;
            //         }
            //     }
            //     // If none of them are set to display, return false
            //     return false;
            // }
        },
        watch: {
            // Watch for changes to the theme
            prefersDarkTheme(wantsDark) {
                if (wantsDark) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark')
                } else {
                    document.documentElement.setAttribute('data-bs-theme', 'light')
                }
            }
        },
        methods: {
            // Set the theme on page load
            setTheme() {
                if (this.prefersDarkTheme) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark')
                } else {
                    document.documentElement.setAttribute('data-bs-theme', 'light')
                }
            },
            // setInfoBoxContent(){
            //     this.infoBoxContent = [
            //         {
            //             title: "Sensory Experience",
            //             content: this.building.sense_exp || "No information available",
            //             display: this.building.sense_exp_display
            //         },
            //         {
            //             title: "Wayfinding",
            //             content: this.building.wayfinding || "No information available",
            //             display: this.building.wayfinding_display
            //         },
            //         {
            //             title: "Physical Access",
            //             content: this.building.phys_access || "No information available",
            //             display: this.building.phys_access_display
            //         },
            //     ];
            // },
            // async getBuildingData() {
            //     const response = await useFetch('/api/get/building/' + this.$route.params.buildingId);

            //     if (response.data.value != "" && response.data.value != null) {

            //         // Clone it to avoid proxy nonsense
            //         this.building = JSON.parse(JSON.stringify(response.data.value));
                    
            //         // Set the info box content
            //         this.setInfoBoxContent();

            //         // Set the page title
            //         let newhead = this.building.display_name + ' - TCD Sense';
            //         this.$head.title = newhead;
            //         document.title = newhead;
            //     }
            //     else {
            //         console.log("No building data found");
            //         // Redirect 
            //         this.$router.push('./?search=' + this.$route.params.buildingId);
            //     }
            //     // console.warn("Building data:")
            //     // console.log(this.building);
            // },
        },
        // mounted() {
        //     this.setTheme()
        // }
    
    }

    // useHead({
    //     link:[
    //         {
    //             rel: "stylesheet",
    //             href: "https://fonts.googleapis.com/css2?family=Lato&family=PT+Mono&Inter:wght@900&display=swap"
    //         },
    //         {
    //             rel: "preconnect",
    //             href: "https://fonts.gstatic.com",
    //             crossorigin: "anonymous"
    //         },
    //         {
    //             rel: "preconnect",
    //             href: "https://fonts.googleapis.com",
    //         }
    //     ],
    // });


</script>
