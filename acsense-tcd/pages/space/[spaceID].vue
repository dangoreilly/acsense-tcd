<template>
    <NuxtLayout name="info-layout">
        <div 
        v-if="space"
        class="space-info pb-5">
    
            <div class="info-page-title" style="grid-area: title;">
                <h1>{{space.name}}</h1>
                <p v-if="space.aka" id="aka" class="d-block pb-0 mb-0"><b>Also Known as:</b> {{space.aka}}</p>
                <p class="d-block pb-0 mb-0">
                    <em>{{space.type}}</em> 
                    <span v-if="space.building != null"> 
                        &#8212; 
                        <a :href="'/info/' + space.building.canonical"> {{ space.building.display_name }}</a>
                    </span>
                </p>
                <!-- Pill link to highlight the building on the map -->
                <a class="btn badge rounded-pill text-bg-warning text-decoration-none mb-1"
                :href="'/?highlight='+space.canonical">
                Highlight on map</a>
            </div>
                
            <div id="description" style="grid-area: desc; justify-self: start;">
                <h3>Description</h3>
                <p>{{space.description}}</p>
            </div>
                
            <div style="grid-area: facilties; align-self: end;">
                <Facilities 
                :space="space"
                />
            </div>
    
            <div style="grid-area: main-photo;">
                <LazyPanoramaViewer v-if="space.primary_image_panorama"
                :mainSrc="space.primary_image_url" 
                :mainAlt="space.primary_image_alt" 
                />
                <MainPicture v-else
                :mainSrc="space.primary_image_url"
                :mainAlt="space.primary_image_alt"
                />
            </div>
    
            <!-- Tips -->
            <!-- Changes location if there's an infobox or not -->
            <!-- If there's no infobox, but there are openingtimes, take up the infobox space -->
            <!-- Otherwise, take it's own space -->
            <div 
            style="grid-area: tips;"
            class="my-3">
                <AccessTips :tips="space.tips" :entity="'space'"/>
            </div>
    
            <!-- Infobox -->
            <div style="grid-area: tabs;">
                <Infobox
                :contentArray="infoBoxContent"
                :activeInfoTab="activeInfoBoxTab"
                @tabChanged="activeInfoBoxTab = $event"
                />
            </div>
    
            <!-- Timebox -->
            <!-- Displays if there's data to display -->
            <!-- Shows a placeholder message iff there's no data and there's an infobox -->
            <div style="grid-area: opening-times; justify-self: start; align-self: start;" v-if="timeBoxDisplays">
                <Timebox
                :times="space.opening_times"/>
            </div>
            <div v-if="infoBoxDisplays && !timeBoxDisplays" style="grid-area: opening-times; align-self: center; margin-left: min(3rem, 3vw); margin-right: min(3rem, 3vw);">
                <div 
                class="time-card card  pt-2 mx-2 px-3" 
                style="grid-area: open-times; justify-self: start; align-self: start; margin-left: min(3rem, 3vw); margin-right: min(3rem, 3vw);">
                    <p><em>Opening times not available for this space</em></p>
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
            style="grid-area: additional-info;"
            v-if="space.furtherinfo_disp">
                <AdditionalInfo 
                :info="space.further_info"/>
            </div>
    
            <!-- <div style="grid-area: gallery;">
                <Gallery
                :images="gallery_images"
                />
            </div> -->
            
        </div>
        <p v-else>Sorry, this Student Space doesn't exist</p>
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
        margin-top: 2rem;
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
    
    .space-info {
        display: grid;
        padding-top: 2rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto;
        grid-template-areas: 
            "title main-photo"
            "desc main-photo"
            "facilties facilties"
            "tabs opening-times"
            "tips tips"
            "additional-info additional-info"
            /* "gallery gallery gallery gallery"; */
    }
    @media screen and (max-width: 992px){
        .space-info {
            padding: 1rem;
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas: 
                "title"
                "main-photo"
                "desc"
                "opening-times"
                "tabs"
                "facilties"
                "tips"
                "additional-info"
                /* "gallery"; */
        }

        #description{
            margin-top: 1.5rem;
        }
    
    }
    </style>
    
<script setup>

import {createClient} from '@supabase/supabase-js';


    // Define data fetching functions
    async function getStudentSpace(supabase, canonical){
        // console.log("Fetching space: " + canonical);

        // Fetch the space from the database
        // Since we are using the canonical name, we should only get one result
        let { data: space, error } = await supabase
            .from('spaces')
            .select('*, building(display_name, canonical)')
            .eq('canonical', canonical)
            .single()
        if (error) {
            console.error(error)
            alert(error.message)
            throw error
        }
        else {

            return space;

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


    // Get the supabase client for fetching the rest of our data
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const sb_client = createClient(supabaseUrl, supabaseKey)

    // Load and render the space from the database
    
    const route = useRoute();
    const canonical = route.params.spaceID;
    const preview = route.query.preview;

    let space = ref(null);
    let _space = await getStudentSpace(sb_client, canonical)
    // Only set the building if it's set to published, otherwise keep it null

    if (_space && _space.published) {
        space = ref(_space);
    }

    // Using ref and useState() at the same time like this definitely poor practice
    // But the documentation is unclear and I'm not bothered experimenting right now
    const space_check = useState("space");
    space_check.value = space;

    let infoBoxContent = null;
    let infoBoxDisplays = null;
    let timeBoxDisplays = null;

    if (space.value) {
        infoBoxContent = ref(setInfoBoxContent(space.value));
        infoBoxDisplays = ref(infoBoxDisplayCheck(infoBoxContent.value));
        timeBoxDisplays = ref(
            space.value.opening_times != null && 
            (space.value.opening_times.sat.open || space.value.opening_times.holidays.open || space.value.opening_times.weekday.open)
            // false
        );
    }


    // Set the SEO and page title

    let pageTitle = space.value ? space.value.name : "Space Not Found" + ' - TCD Sense';
    let pageDescription = space.value ? space.value.description : "This space does not exist";
    let keyword = space.value ? space.value.name : "";

    useHead({
        title: pageTitle + ' - TCD Sense',
        meta: [
            {
                name: 'description',
                content: pageDescription,
            },
            {
                name: 'keywords',
                content: keyword + ', Trinity College Dublin, Accessibility, Map, Interactive, Wheelchair, Mobility, Vision, Hearing, Sensory, Disability, Inclusive, Inclusivity, Accessible, Building, Room, Floorplans',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            },
        ],
    });

</script>
    

<script>
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
            let space = useState("space");
            // If it doesn't, redirect to the search page
            if (!space.value) {
                this.$router.push('/info/?search=' + this.$route.params.spaceID);
            }
            
        },
    }

</script>
    