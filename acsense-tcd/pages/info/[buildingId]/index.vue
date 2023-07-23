<template>
<NuxtLayout name="info-layout">
    <div 
    v-if="$route.params.buildingId == building.buildingId"
    class="building-info">
        
        <div class="flexrow">
            <div 
            style="flex:3">
                <Summary 
                :buildingName="building.name"
                :aka="building.aka"
                :description="building.description"
                :sensoryAreas="building.sensoryAreas"
                />
            </div>

            <div 
            style="flex:2">
                <MainPicture 
                :mainSrc="building.images.main.url" 
                :mainAlt="building.images.main.alt" />

                <AccessTips :tips="building.tips" />
                
            </div>
        </div>

        <Infobox
        :contentArray="infoBoxContent"
        :activeInfoTab="activeInfoBoxTab"
        @tabChanged="activeInfoBoxTab = $event"
        />

        <div class="flexrow">
            <div 
            class="m-3"
            style="flex:3">
                <Timebox
                :times="building.openingTimes"/>
            </div>
            
            <div 
            class="d-grid gap-2 col-6 m-auto"
            style="flex:2; ">

                <NuxtLink :to="linkToRooms">
                    <button type="button" class="btn btn-primary btn-lg w-75">Room info</button>
                </NuxtLink>

                
                <NuxtLink :to="linkToInternalMap">
                    <button type="button" class="btn btn-primary btn-lg w-75">Internal Map</button>
                </NuxtLink>

            </div>
        </div>

        <div
        v-if="building.additionalInformation.display">
            <AdditionalInfo 
            :info="building.additionalInformation.content"/>
        </div>

        <Gallery
        :images="building.images.gallery"
        />
        
    </div>
    <p v-else>Sorry, this building doesn't exist</p>
</NuxtLayout>
</template>

<style>
.flexrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}
.flexcol-2 {
    min-width: min(25rem, calc(100vw - 6rem));
}
.mainMatter {
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 40px;
    
}

.tips-and-links-grid {
    display: grid;
    grid-template-areas: 
        "tips rooms-link"
        "tips gallery-link";
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 1fr 1fr;
    gap: 1.5rem;
}

.tips-area {
    grid-area: tips;
    grid-row: 1 / 3;
}

.rooms-area {
    grid-area: rooms-link;
}

.gallery-area {
    grid-area: gallery-link;
}

/* @media screen and (min-width: 992px) {
    .mainMatter {
        display: grid;
        grid-template-areas: "sidebar main";
        grid-template-columns: 1fr 5fr;
        gap: 1.5rem;
    }
} */
    
.building-info {
    grid-area: main;
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

    import bld from '~/assets/example-data';
    import areas from '~/assets/example-area-data';
    import { Building } from '~/assets/types/Building';

    import { InfoBoxContentTab } from '~/assets/types/infoPageTypes';

    export default {
        data() {
            return {
            building: {} as Building,
            infoBoxContent: [] as InfoBoxContentTab[],
            activeInfoBoxTab: 0,
            linkToRooms: '/info/' + this.$route.params.buildingId + '/rooms',
            linkToInternalMap: '/info/' + this.$route.params.buildingId + '/floorplan',
            }
        },
        created() {
            this.building = bld;
            this.building.sensoryAreas = areas;
            this.infoBoxContent = [
                // {
                //     title: "Sound",
                //     content: this.building.sounds,
                // },
                // {
                //     title: "Lights",
                //     content: this.building.lights,
                // },
                {
                    title: "Sensory Experience",
                    content: this.building.experience,
                },
                {
                    title: "Wayfinding",
                    content: this.building.respite,
                },
                {
                    title: "Physical Access",
                    content: this.building.physicalAccess,
                },
            ];
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
