<template>
<NuxtLayout name="info-layout">
    <div 
    v-if="building"
    class="building-info infobox-display">

        <div class="info-page-title" style="grid-area: title;">

            <h1>{{building.display_name}}</h1>

            <p v-if="building.aka" id="aka" class="d-block pb-0 mb-0"><b>Also Known as:</b> {{building.aka}}</p>
            <!-- Pill link to highlight the building on the map -->
            <a class="btn badge rounded-pill text-bg-warning text-decoration-none"
            :href="'/?highlight='+building.canonical">
            Highlight on map</a>
        </div>
            
        <div id="description" style="grid-area: desc; justify-self: start;">
            <h3>Description</h3>
            <p>{{building.description}}</p>
        </div>
            
        <div style="grid-area: sense-areas; align-self: end;">
            <SenseSpaces 
            :sensoryAreas="building.spaces"
            :spaceIcons="space_icons"
            />
        </div>

        <div style="grid-area: main-photo;">
            <MainPicture 
            :mainSrc="building.primary_image_url" 
            :mainAlt="building.primary_image_alt" 
            />
        </div>

        <div style="grid-area: tips;">
            <AccessTips :tips="building.tips" :entity="'building'" :scrollAmount="y"/>
            
        </div>

        
        <div style="grid-area: tabs;"
        class="my-4">
            <Infobox
            :contentArray="infoBoxContent"
            :activeInfoTab="activeInfoBoxTab"
            @tabChanged="activeInfoBoxTab = $event"
            :scrollAmount="y"
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

import {createClient} from '@supabase/supabase-js'
import { useWindowScroll } from '@vueuse/core'

const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
const supabaseKey = useRuntimeConfig().public.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey)

// Track the scroll amount, this can be passed to components to trigger
// view rectangle tracking
const { x, y } = useWindowScroll()

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


    async function getSpaceIcons() {
        // Get the space icons from the database
        // For showing in the info modal
        // const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        // const supabaseKey = useRuntimeConfig().public.supabaseKey;
        // const supabase = createClient(supabaseUrl, supabaseKey)

        let { data: icons, error } = await supabase
            .from('space_styles')
            .select('category, icon, descriptor')
        if (error) {
            console.log(error)
            throw error
        }
        else {
            console.log("Space icons retrieved")
            // console.log(icons)
            return JSON.parse(JSON.stringify(icons));
        }
    }

    // space_icons = ref(await getSpaceIcons());

    async function getBuildingData(canonical) {

        const buildingFields = `
        canonical,
        display_name,
        aka,
        description,
        sense_exp,
        wayfinding,
        phys_access,
        tips,
        further_info,
        opening_times,
        sense_exp_display,
        phys_access_display,
        wayfinding_display,
        furtherinfo_display,
        primary_image_url,
        primary_image_alt,
        UUID,
        sense_exp_video,
        wayfinding_video,
        phys_access_video,
        entry_floor,
        published
        `


        const spaceFields = `
        canonical,
        name,
        type,
        aka,
        description,
        microwave, 
        kettle, 
        kettle_note,
        seating, 
        seating_note,
        outlets, 
        outlets_note,
        food_drink_allowed,
        food_drink_allowed_note, 
        wheelchair,
        wheelchair_note,
        icon:space_styles(url:icon),
        icon_override
        `



        let { data: building, error } = await supabase
        .from('buildings')
        .select(`
            ${buildingFields}, 
            spaces!spaces_building_fkey(${spaceFields}), 
            gallery_images:building_gallery_images!building_gallery_images_building_fkey(*)`
        )
        .eq('canonical', canonical)
        .single()
        if (error) {
            console.error(error)
            // useRouter().push('./?search=' + route.params.buildingId);
            // navigateTo('/?search=' + route.params.buildingId);
            return null;
        }
        else {
            // console.log(building)
            // document.getElementById('print').innerText = JSON.stringify(building, null, 2)
            console.log("Building data retrieved");
            // console.log(building);
            return JSON.parse(JSON.stringify(building));
        }
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

    
    let space_icons = ref([]);
    let building = ref({});
    let infoBoxContent = ref([]);
    let infoBoxDisplays = ref();
    
    const route = useRoute();
    const canonical = route.params.buildingId;
    const preview = route.query.preview;
    
    let _building = await getBuildingData(canonical);
    // Only set the building if it's set to published, otherwise keep it null
    if (_building && (_building.published || preview)) {
        building = ref(_building);
    }
    else {
        building = ref(null);
    }

    // Using ref and useState() at the same time like this definitely poor practice
    // But the documentation is unclear and I'm not bothered experimenting right now
    const building_check = useState("building");
    building_check.value = building;

    // space_icons = await useAsyncData('space_icons', () => getSpaceIcons())
    space_icons = await getSpaceIcons();

    // console.log(building);

    if (building.value) {
        infoBoxContent = ref(setInfoBoxContent(building.value));
        infoBoxDisplays = ref(infoBoxDisplayCheck(infoBoxContent.value));
    }

    let pageTitle = (building.value ? building.value.display_name : "Building not found") + '- TCD Sense';
    let pageDescription = (building.value ? building.value.description : "Building not found");

    useHead({
        title: pageTitle,
        meta: [
            {
                name: 'description',
                content: pageDescription,
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
        created() {
            // Check if the building exists
            let building = useState("building");
            // If it doesn't, redirect to the search page
            if (!building.value) {
                this.$router.push('/info/?search=' + this.$route.params.buildingId);
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
