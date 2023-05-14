<template>
<main class="d-flex flex-nowrap" style="height:100vh">
    <AdminSidebar
    :activeTab="activePage"/>
    <div class="activityArea">
        <slot></slot>  
    </div>
</main>    
</template>

<script>

export default {
    // The active page is passed in as a prop
    props: {
        activePage: String,
    },
}
</script>