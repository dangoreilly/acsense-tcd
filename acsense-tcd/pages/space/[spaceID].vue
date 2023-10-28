<template>
    <NuxtLayout name="info-layout">
        <div 
        v-if="space"
        class="space-info">
    
            <div class="info-page-title" style="grid-area: title;">
                <h1>{{space.name}}</h1>
                <p style="display:block">
                    <em>{{space.type}}</em> 
                    <span v-if="space.building != null"> 
                        &#8212; 
                        <a :href="'/info/' + space.building"> {{ space.building_display_name }}</a>
                    </span>
                </p>
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
    
            <div style="grid-area: tips;"
            v-if="space.tips.length >0">
                <AccessTips :tips="space.tips" />
                
            </div>
    
            <div style="grid-area: tabs;" 
            v-if="true">
                <Infobox
                :contentArray="infoBoxContent"
                :activeInfoTab="activeInfoBoxTab"
                @tabChanged="activeInfoBoxTab = $event"
                />
            </div>
    
            <!-- <div style="grid-area: open-times; justify-self: start; align-self: start;">
                <Timebox
                :times="space.opening_times"/>
            </div> -->
                    
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
    
            <!-- <div
            style="grid-area: additional-info;"
            v-if="space.furtherinfo_disp">
                <AdditionalInfo 
                :info="space.further_info"/>
            </div> -->
    
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
    
    .space-info {
        display: grid;
        padding-top: 2rem;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 
            [row1] auto
            [row2] auto 
            [row3] auto
            [row4] auto
            [row5] auto;
        grid-template-areas: 
            "title main-photo"
            "desc main-photo"
            "facilties facilties"
            "tabs tabs"
            "tips tips"
            /* "additional-info additional-info additional-info additional-info" */
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
                "tabs"
                "facilties"
                "tips"
                /* "additional-info" */
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
            .select('*')
            .eq('canonical', canonical)
        if (error) {
            console.error(error)
            alert(error.message)
            throw error
        }
        else {

            // If there are no results, navigate to the search page
            if (space.length == 0){
                this.$router.push('/info/?search=' + canonical);
            }
            
            // Update the space object with the new data
            let _space = space[0];

            // Get the display name for the building, if this space has one
            if (_space.building != null){
                _space.building_display_name = await getBuildingDisplayName(supabase, _space.building);
            }

            return _space;

        }
        
    }

    async function getBuildingDisplayName(supabase, building){
        // Fetch the building from the database
        // Since we are using the canonical name, we should only get one result
        let { data: building_name, error } = await supabase
            .from('buildings')
            .select('display_name')
            .eq('canonical', building)
        if (error) {
            console.error(error)
            alert(error.message)
            throw error
        }
        else {
            // Update the space object with the new data
            // this.space.building_display_name = building_name[0].display_name;
            return building_name[0].display_name;
        }
    }


    async function getSpaceTypes(supabase){
        // Fetch the space types from the database
        let { data: space_types, error } = await supabase
            .from('space_styles')
            .select('*')
        if (error) {
            console.error(error)
            alert(error.message)
            throw error
        }
        else {
            // Update the space object with the new data
            // console.log("Space types:")
            // console.log(space_types);
            // this.space_types = space_types;
            return space_types;
        }
    }

    function getImageForSpaceType(type, space_types){
        // Cycle through space types
        // When the category field matches the input, return the image
        // If there are no matches, return the placeholder image
        for (let i = 0; i < space_types.length; i++) {
            if (space_types[i].category == type){
                return space_types[i].icon;
            }
        }    

        // TODO: Get a more sensible default image
        return '/images/TCDSenseMapLogo.png';
    }


    // Get the supabase client for fetching the rest of our data
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const sb_client = createClient(supabaseUrl, supabaseKey)

    // Load the list of space types from the database
    const space_types = getSpaceTypes(sb_client);

    // Load and render the space from the database
    const route = useRoute()
    const { data: space, error } = await useAsyncData('space', () => getStudentSpace(sb_client, route.params.spaceID))
    // const space = getStudentSpace(sb_client, route.params.spaceID);

    // console.log(space.value)

    // function setInfoBoxContent(space){
    //     return [
    //         {
    //             title: "Sensory Experience",
    //             content: space.sense_exp || "No information available",
    //             display: space.sense_exp_display,
    //             video: space.sense_exp_video,
    //             video_embed: (space.sense_exp_video != null && space.sense_exp_video.length > 0),
    //         },
    //         {
    //             title: "Wayfinding",
    //             content: space.wayfinding || "No information available",
    //             display: space.wayfinding_display,
    //             video: space.wayfinding_video,
    //             video_embed: (space.wayfinding_video != null && space.wayfinding_video.length > 0),
    //         },
    //         {
    //             title: "Physical Access",
    //             content: space.phys_access || "No information available",
    //             display: space.phys_access_display,
    //             video: space.phys_access_video,
    //             video_embed: (space.phys_access_video != null && space.phys_access_video.length > 0),
    //         },
    //     ];
    // }

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

    const infoBoxContent = ref(setInfoBoxContent(space.value));
    // console.log(infoBoxContent);
    const infoBoxDisplays = ref(infoBoxDisplayCheck(infoBoxContent.value));

    // Set the SEO and page title

    useHead({
        title: space.value.name + ' - TCD Sense',
        meta: [
            {
                name: 'description',
                content: space.value.description,
            },
            {
                name: 'keywords',
                content: space.value.name + ', Trinity College Dublin, Accessibility, Map, Interactive, Wheelchair, Mobility, Vision, Hearing, Sensory, Disability, Inclusive, Inclusivity, Accessible, Building, Room, Floorplans',
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
    }

</script>
    