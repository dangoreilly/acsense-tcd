<template>

    <!-- Card container -->
        <div class="infotabs card">
            <!-- Nav bar for tabs -->
            <div class="card-header">
                <!-- Tabs -->
                <ul class="nav nav-underline">

                    <li v-for="tab, index in tabs" class="nav-item infobox-tab">
                        <p 
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
            v-for="tab, index in tabs" 
            class="card-body"
            :class="{ 'd-block': activeInfoTab === index, 'd-none': activeInfoTab !== index, }"
            v-html="tab.parsedContent">
            </div>
        </div>
    <!-- </div> -->

</template>

<script lang="ts">

import { InfoBoxContentTab } from '~/assets/types/infoPageTypes'


export default {
    props: {
        contentArray: {
            type: Array as () => InfoBoxContentTab[],
            required: true,
        },
        activeInfoTab: {
            type: Number,
            required: true,
        },
    },
    data() {
        return {
            // activeTab: 0,
            tabs: [] as InfoBoxContentTab[],

        }
    },
    created() {
        // Parse markdown and move the content array data into the tabs array
        this.tabs = this.contentArray.map((tab) => {
            return {
                title: tab.title,
                content: tab.content,
                parsedContent: mdParser(tab.content),
            }
        })
    },
    methods: {
        makeTabActive(index: number) {
            // this.activeTab = index;
            this.$emit('tabChanged', index);
        }
    }
}

</script>

<style>
.infobox-tab{
    transition: all 0.5s ease;
}

</style>