<template>

    <!-- Card container -->
        <div class="card m-3">
            <!-- Nav bar for tabs -->
            <div class="card-header">
                <!-- Tabs -->
                <ul class="nav nav-underline">

                    <li v-for="tab, index in tabs" class="nav-item infobox-tab">
                        <p 
                        class="nav-link"
                        style="cursor: pointer; margin-bottom: 2px;" 
                        :class="{ 'active': activeTab === index, }"
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
            :class="{ 'd-block': activeTab === index, 'd-none': activeTab !== index, }"
            v-html="tab.parsedContent">
            </div>
        </div>
    <!-- </div> -->

</template>

<script lang="ts">

interface Tab {
    title: string,
    content: string,
    parsedContent?: string,
}


export default {
    props: {
        contentArray: {
            type: Array as () => Tab[],
            required: true,
        }
    },
    data() {
        return {
            activeTab: 0,
            tabs: [] as Tab[],

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
            this.activeTab = index;
        }
    }
}

</script>

<style>
.infobox-tab{
    transition: all 0.5s ease;
}

</style>