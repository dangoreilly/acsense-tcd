<template>
<main class="d-flex flex-nowrap" style="height:100vh">
    <AdminSidebar
    :activeTab="activePage"
    :supabase_client="supabase_client"/>
    <div class="activityArea">
        <ClientOnly>
            <slot ></slot>  
        </ClientOnly>
    </div>
</main>    
</template>

<script setup lang="ts">

    // Define the props
    const {activePage: page, supabase_client: sb} = defineProps({
        activePage: {
            type: String,
            required: true
        },
        supabase_client: {
            type: Object,
            required: true
        }
    })

    // Set up the refs
    const activePage = ref(page);
    const supabase_client = ref(sb);

    // let pageTitle = 'Acsense Admin - ' + activePage.value;

    // // Set the title and meta tags
    // useHead({
    //     title: 'Acsense Admin - ' + activePage.value.charAt(0).toUpperCase() + activePage.value.slice(1),
    //     meta: [
    //         {
    //             name: 'description',
    //             content: 'Acsense Admin page'
    //         }
    //     ],
    // })

</script>

<style>
body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
}

.activityArea {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* padding: 1rem;
    padding-left: 2rem;
    padding-right: 2rem; */
    background-color: #F5F5F5;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;

}

.mainMatter-admin{
    overflow-y: auto; 
    overflow-x: hidden;
    width: 100%;
}
</style>