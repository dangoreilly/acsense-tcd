<template>

    <!-- <div class="container"> -->
        <div class="card m-3">
            <div class="card-header">
                <ul class="nav nav-underline">
                    <li v-for="tab, index in contentArray" class="nav-item">
                        <a 
                        class="nav-link" 
                        :class="{ 'active': activeTab === index, }"
                        @click="makeTabActive(index)"
                        href="#">
                            {{ tab.title }}
                        </a>
                    </li>
                
                </ul>
            </div>
            <div 
            v-for="tab, index in tabs" 
            class="card-body"
            :class="{ 'd-block': activeTab === index, 'd-none': activeTab !== index, }"
            :innerHTML="tab.parsedContent">
                <!-- <p 
                style="white-space:pre-line;" 
                class="text-start" 
                ></p> -->
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

useHead({
 script:[
    {
        src: "https://cdn.jsdelivr.net/npm/marked/marked.min.js",
        crossorigin: "anonymous",}
    ]
})

</script>

<!-- <style>

</style> -->