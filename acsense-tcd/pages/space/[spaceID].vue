<template>
    <NuxtLayout name="info-layout">
        <div 
        v-if="space"
        class="space-info">
    
            <div class="info-page-title" style="grid-area: title;">
                <h1>{{space.name}}</h1>
                <p style="display:block"><em>{{space.type}}</em></p>
            </div>
                
            <div id="description" style="grid-area: desc; justify-self: start;">
                <h3>Description</h3>
                <p>{{space.description}}</p>
            </div>
    
            <div style="grid-area: main-photo;">
                <MainPicture 
                :mainSrc="space.primary_image_url" 
                :mainAlt="space.primary_image_alt" 
                />
            </div>
                
            <div style="grid-area: facilties; align-self: end;">
                <Facilities 
                :space="space"
                />
            </div>
    
            <!-- <div style="grid-area: tips;">
                <AccessTips :tips="building.tips" />
                
            </div> -->
    
            <!-- <div style="grid-area: tabs;">
                <Infobox
                :contentArray="infoBoxContent"
                :activeInfoTab="activeInfoBoxTab"
                @tabChanged="activeInfoBoxTab = $event"
                />
            </div> -->
    
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
            [row1] 6rem
            [row2] auto 
            [row3] auto
            [row4] auto
            [row5] auto 
            [row6] auto 
            [row7] auto 
            [row8] auto 
            [row9] auto;
        grid-template-areas: 
            "title main-photo"
            "desc main-photo"
            "facilties facilties"
            /* "tabs tabs tabs tabs"
            "tips tips tips tips" */
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
    useHead({
        title: 'Student Space',
        meta: [
            {
                name: 'description',
                content: 'Information about the sensory spaces of Trinity College Dublin',
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
import {createClient} from '@supabase/supabase-js';

    export default {
        data() {
            return {
                space: {},
                supabase: {},
                space_types: [],
                space_icon: "",
            }
        },
        created() {

            // Initialise the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

            // Load the list of space types from the database
            this.getSpaceTypes();
            
            // Load and render the space from the database
            this.getStudentSpace(this.$route.params.spaceID);

        },
        methods: {
            // This function fetches the student space from the database based on it's canonical name
            async getStudentSpace(canonical){
                // console.log("Fetching space: " + canonical);

                // Fetch the space from the database
                // Since we are using the canonical name, we should only get one result
                let { data: space, error } = await this.supabase
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
                        this.$router.push('/info/?search=' + this.$route.params.spaceId);
                    }
                    
                    // Update the space object with the new data
                    this.space = space[0];

                    // Get the icon for the space type

                }
                
            },


            async getSpaceTypes(){
                // Fetch the space types from the database
                let { data: space_types, error } = await this.supabase
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
                    this.space_types = space_types;
                }
            },

            getImageForSpaceType(type){
                // Cycle through space types
                // When the category field matches the input, return the image
                // If there are no matches, return the placeholder image
                for (let i = 0; i < this.space_types.length; i++) {
                    if (this.space_types[i].category == type){
                        return this.space_types[i].icon;
                    }
                }    

                // TODO: Get a more sensible default image
                return '/images/red-dot.png';
            },
        },
    }


</script>
    