<template>
<NuxtLayout name="info-layout">
    <div 
    v-if="building"
    class="building-info">

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

        <div style="grid-area: tips;">
            <AccessTips :tips="building.tips" />
            
        </div>

        <div style="grid-area: tabs;">
            <Infobox
            :contentArray="infoBoxContent"
            :activeInfoTab="activeInfoBoxTab"
            @tabChanged="activeInfoBoxTab = $event"
            />
        </div>

        <div style="grid-area: open-times; justify-self: start; align-self: start;">
            <Timebox
            :times="building.opening_times"/>
        </div>
                
        <div class="link-button link-button-top" style="grid-area: rooms; align-self: center; justify-self: stretch;">
            <NuxtLink :to="linkToRooms">
                <button type="button" class="btn btn-primary btn-lg w-100 h-75">Room info</button>
            </NuxtLink>
        </div>
            
        <div class="link-button" style="grid-area: floorplan; align-self: center; justify-self: stretch;">
            <NuxtLink :to="linkToInternalMap">
                <button type="button" class="btn btn-primary btn-lg w-100">Internal Map</button>
            </NuxtLink>
        </div>

        <div
        style="grid-area: additional-info;"
        v-if="building.furtherinfo_disp">
            <AdditionalInfo 
            :info="building.further_info"/>
        </div>

        <div style="grid-area: gallery;">
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
        "title title main-photo main-photo"
        "desc desc main-photo main-photo"
        "sense-areas sense-areas open-times open-times"
        "tabs tabs tabs tabs"
        "tips tips tips rooms"
        "tips tips tips floorplan"
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
            "rooms"
            "floorplan"
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

<script setup lang="ts">
    useHead({
        title: 'Accessibility Map',
        meta: [
            {
                name: 'description',
                content: 'An interactive map of Trinity College Dublin, showing accessibility information for buildings and rooms.',
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
        link: [
            {
                rel:"stylesheet",
                href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            },
        ],
    });


</script>

<script lang="ts">

    // import bld from '~/assets/example-data';
    import areas from '~/assets/example-area-data';
    import { Building } from '~/assets/types/Building';

    import { InfoBoxContentTab } from '~/assets/types/infoPageTypes';

    export default {
        data() {
            return {
            building: {} as any,
            infoBoxContent: [] as any,
            activeInfoBoxTab: 0,
            linkToRooms: '/info/' + this.$route.params.buildingId + '/rooms',
            linkToInternalMap: '/info/' + this.$route.params.buildingId + '/floorplan',
            }
        },
        created() {
            Promise.resolve(this.getBuildingData()).then(
                (building) => {
                    // console.log(this.building)
                    this.infoBoxContent = [
                        {
                            title: "Sensory Experience",
                            content: this.building.sense_exp,
                            display: this.building.sense_exp_disp
                        },
                        {
                            title: "Wayfinding",
                            content: this.building.wayfinding,
                            display: this.building.wayfinding_disp
                        },
                        {
                            title: "Physical Access",
                            content: this.building.phys_access,
                            display: this.building.phys_access_disp
                        },
                    ]
                },
            )
            // .then((r) => console.log(this.building));
            // console.log(this.building);
            
        },
        computed: {
            // Get the theme from local storage
            prefersDarkTheme() {
                return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            }
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
            setInfoBoxContent(){
                this.infoBoxContent = [
                {
                    title: "Sensory Experience",
                    content: this.building.sense_exp,
                    display: this.building.sense_exp_disp
                },
                {
                    title: "Wayfinding",
                    content: this.building.wayfinding,
                    display: this.building.wayfinding_disp
                },
                {
                    title: "Physical Access",
                    content: this.building.phys_access,
                    display: this.building.phys_access_disp
                },
            ];
            },
            async getBuildingData() {
                const building = await useFetch('/api/get/building/' + this.$route.params.buildingId);
                // Clone it to avoid proxy nonsense
                this.building = JSON.parse(JSON.stringify(building.data.value));
                
                // Set the info box content
                this.setInfoBoxContent();

                // console.warn("Building data:")
                console.log(this.building);
            }
        },
        mounted() {
            this.setTheme()
        }
    
    }

    useHead({
        link:[
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Lato&family=PT+Mono&Inter:wght@900&display=swap"
            },
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: "anonymous"
            },
            {
                rel: "preconnect",
                href: "https://fonts.googleapis.com",
            }
        ],
    });


</script>
