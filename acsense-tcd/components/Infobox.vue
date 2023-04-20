<template>

    <!-- <div class="container"> -->
        <div class="card m-3">
            <div class="card-header">
                <ul class="nav nav-underline">
                    <li v-for="tab, index in contentArray" class="nav-item">
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
            :innerHTML="tab.parsedContent">
            </div>
        </div>
    <!-- </div> -->

</template>

<script lang="ts">

interface Tab {
    title: string,
    content: string,
    parsedContent: string,
}


export default {
    props: {
        contentArray: {
            type: Array as () => {title: string, content: string}[],
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
/* .infobox{
    margin: 3rem auto;
    
} */

</style>