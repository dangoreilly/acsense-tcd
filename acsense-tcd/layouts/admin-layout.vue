<template>
<main class="d-flex flex-nowrap" style="height:100vh">
    <AdminSidebar
    :activeTab="activePage"
    :supabase_client="supabase_client"/>
    <div class="activityArea">
        <slot ></slot>  
    </div>
</main>    
</template>

<script>

export default {
    // The active page is passed in as a prop
    props: {
        activePage: String,
        supabase_client: Object,
    },

    // watch: {
    //     activePage: function (val) {
    //         useHead({
    //             title: 'Acsense Admin - ' + val,
    //             meta: [
    //                 {
    //                     name: 'description',
    //                     content: 'Acsense Admin page'
    //                 }
    //             ],
    //         })
    //     }
    // },
}
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