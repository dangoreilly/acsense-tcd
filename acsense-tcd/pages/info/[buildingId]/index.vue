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
                :sensoryOverview="building.sensoryOverview"
                />
            </div>

            <div 
            style="flex:2">
                <MainPicture 
                :mainSrc="building.images.main.url" 
                :mainAlt="building.images.main.alt" />
                
                <Timebox
                :times="building.openingTimes"/>
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
                <AccessTips :tips="building.tips" />
            </div>
            
            <div 
            class="m-3"
            style="flex:2">
            <NuxtLink :to="linkToRooms">
                <LinkCard :title="'Room Info'">
                    Information about the capacity and accessibility of some of the rooms in this building
                </LinkCard>
            </NuxtLink>

                <LinkCard :title="'Floor Plans'">
                    Coming Soon
                </LinkCard>

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

<script lang="ts">

    import bld from '~/assets/example-data';
    import { Building } from '~/assets/types/Building';

    import { InfoBoxContentTab } from '~/assets/types/infoPageTypes';

    export default {
        data() {
            return {
            building: {} as Building,
            infoBoxContent: [] as InfoBoxContentTab[],
            activeInfoBoxTab: 0,
            linkToRooms: '/info/' + this.$route.params.buildingId + '/rooms',
            }
        },
        created() {
            this.building = bld;
            this.infoBoxContent = [
                {
                    title: "Sound",
                    content: this.building.sounds,
                },
                {
                    title: "Lights",
                    content: this.building.lights,
                },
                {
                    title: "Experience",
                    content: this.building.experience,
                },
                {
                    title: "Sensory Spaces",
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
