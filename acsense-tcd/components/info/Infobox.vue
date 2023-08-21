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
            :class="{ 'd-block': activeInfoTab === index, 'd-none': activeInfoTab !== index, }"
            v-html="mdParser(tab.content)">
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

        // Cycle through tabs
        // Set the first tab that is marked as display to be active
        for (let i = 0; i < this.contentArray.length; i++) {
            if (this.contentArray[i].display) {
                this.activeInfoTab = i;
                break;
            }
        }

    },
    methods: {
        makeTabActive(index) {
            this.activeInfoTab = index;
            // this.$emit('tabChanged', index);
        }
    }
}

</script>

<style>
.infobox-tab{
    transition: all 0.5s ease;
}

</style>