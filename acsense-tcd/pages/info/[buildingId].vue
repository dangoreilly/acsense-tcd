<template>
<div style="width:100%">
    <NavBar />
    <div class="mainMatter">
        <div 
        v-if="$route.params.buildingId == building.buildingId">
            
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
            />
            
        </div>
        <p v-else>Sorry, this building doesn't exist</p>
    </div>
</div>
</template>

<style>
.flexrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
}
.flexcol {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
.mainMatter {
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 40px;
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

interface InfoBoxContentTab {
    title: string,
    content: string,
}

export default {
  data() {
    return {
      building: {} as Building,
      infoBoxContent: [] as InfoBoxContentTab[],
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
            title: "Respite",
            content: this.building.respite,
        },
        {
            title: "Physical Access",
            content: this.building.physicalAccess,
        },
        {
            title: "Evacuation Info",
            content: this.building.evacuationInfo,
        },
    ]
  },
  methods: {
    
  }
  
}

useHead({
  link:[
    //   {
    //     rel: "stylesheet",
    //     href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css",
    //     integrity: "sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ",
    //     crossorigin: "anonymous"
    //   },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Lato&family=PT+Mono&display=swap"
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
//   meta: [
//     { charset: "utf-8"},
//     {  name: "viewport",
//       content: "width=device-width, initial-scale=1, shrink-to-fit=no"
//     }
//   ]
});


</script>
