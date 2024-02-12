<template>

    <!-- Card container -->
        <div class="infotabs card" v-if="anyTabs">
            <!-- Nav bar for tabs -->
            <div class="card-header">
                <!-- Tabs -->
                <ul class="nav nav-underline">

                    <li v-for="tab, index in contentArray" class="nav-item infobox-tab">
                        <p 
                        v-if="tab.display"
                        class="nav-link"
                        style="cursor: pointer; margin-bottom: 2px;" 
                        :class="{ 'active': activeInfoTab === index, }"
                        @click="makeTabActive(index)"
                        href="#">
                            {{ tab.title }}
                        </p>
                        
                    </li>
                
                </ul>
            </div>

            <div 
            v-for="tab, index in contentArray"
            class="card-body"
            :class="{ 'd-block': activeInfoTab === index, 'd-none': activeInfoTab !== index, }" >
                <div
                v-html="mdParser(tab.content)">
                </div>

                <div v-if="tab.video_embed || false" >
                    <div class="ratio ratio-16x9" style="max-width: 100%;">
                        <iframe 
                        :src="'https://www.youtube-nocookie.com/embed/'+ extractYoutubeID(tab.video)" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
        <div class="infotabs card" v-else style="justify-self: start; align-self: start;">
            <div class="card-body">
                <p>No Wayfinding, sensory, or physical access information available</p>
            </div>
        </div>
    <!-- </div> -->

</template>

<script>

// import { InfoBoxContentTab } from '~/assets/types/infoPageTypes'


export default {
    props: {
        contentArray: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            activeInfoTab: 0,
            // tabs: [],
            youtube_embed: true,
            youtube_embed_link: "https://www.youtube.com/watch?v=Ck3yUXt5tCc",

        }
    },
    watch: {
        contentArray: {
            handler() {
                // Check that the active tab is still valid
                // If not, set the first valid tab to be active
                if (!this.contentArray[this.activeInfoTab].display) {
                    this.firstValidTab();
                }
            },
            deep: true,
        }
    },
    computed: {
        anyTabs() {
            // Loop through all the tabs and return true if any have display marked as true
            for (let i = 0; i < this.contentArray.length; i++) {
                if (this.contentArray[i].display) {
                    return true;
                }
            }
            // if none have display marked as true, return false
            return false;
        }
    },
    created() {
        // Parse markdown and move the content array data into the tabs array
        this.tabs = this.contentArray.map((tab) => {
            return {
                title: tab.title,
                content: tab.content,
                parsedContent: mdParser(tab.content),
                display: tab.display,
            }
        })

        // Set the first tab that is marked as display to be active
        this.firstValidTab();

    },
    methods: {
        makeTabActive(index) {
            this.activeInfoTab = index;
            // this.$emit('tabChanged', index);
        },

        extractYoutubeID(youtube_embed_link) {
            // Extract the youtube ID from the youtube link
            // https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
            let youtubeID = youtube_embed_link.split('v=')[1];
            let ampersandPosition = youtubeID.indexOf('&');
            if (ampersandPosition != -1) {
                youtubeID = youtubeID.substring(0, ampersandPosition);
            }
            return youtubeID;
        },

        firstValidTab() {
            // Cycle through tabs
            // Set the first tab that is marked as display to be active
            for (let i = 0; i < this.contentArray.length; i++) {
                if (this.contentArray[i].display) {
                    this.activeInfoTab = i;
                    break;
                }
            }
        }
    }
}

</script>

<style>
.infobox-tab{
    transition: all 0.5s ease;
}

</style>