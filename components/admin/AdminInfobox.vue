<!-- Variation of the infoBox for the admin page, using inputs instead of text boxes -->
<template>

    <!-- Card container -->
        <div class="card m-3">
            <!-- Nav bar for tabs -->
            <div class="card-header">
                <!-- Tabs -->
                <ul class="nav nav-underline">

                    <li v-for="tab, index in contentArray" class="nav-item infobox-tab">
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
            v-for="tab, index in contentArray" 
            class="card-body"
            :class="{ 'd-block': activeInfoTab === index, 'd-none': activeInfoTab !== index, }">
                <textarea class="form-control" rows="8" 
                v-model="tab.content"
                @change="$emit('contentChanged', tabs)"></textarea>
            </div>
            <p class="fst-italic mx-3">This section has some <span style="cursor: pointer;" class="link-primary" @click="$emit('modalOpen', true)">markdown styling</span> enabled </p>
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
    // data() {
    //     return {
    //         tabs: [] as InfoBoxContentTab[],

    //     }
    // },
    // watch: {
    //     // Watch for changes to the active tab prop, if it's being used
    //     activeInfoTab: {
    //         handler(newVal: number) {
    //             if (newVal != null && newVal != undefined)
    //             this.activeTab = newVal;
    //         },
    //         immediate: true,
    //     }
    // },
    // created() {
    //     // Parse markdown and move the content array data into the tabs array
    //     this.tabs = this.contentArray.map((tab) => {
    //         return {
    //             title: tab.title,
    //             content: tab.content,
    //             parsedContent: mdParser(tab.content),
    //         }
    //     })
    // },
    methods: {
        makeTabActive(index: number) {
            // this.activeTab = index;
            // Emit the tab change event
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