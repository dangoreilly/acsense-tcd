<!-- Search page -->
<template>
    <NuxtLayout name="info-layout" searchBarDisabled>
        <div class="container" style="padding-top:1rem">
            Redirecting...
        </div>
       
    </NuxtLayout>
</template>
<!-- Going to a building page that doesn't exist should redirect to
the search page with a URL param signalling that the link was broken
Make sure the search with the url param converst dashes to spaces -->

<script setup>
    useHead({
        title: 'Accessibility Map',
        meta: [
            {
                name: 'description',
                content: 'An interactive map of Trinity College Dublin, showing accessibility information for buildings and rooms.',
            },
            {
                name: 'keywords',
                content: 'Trinity College Dublin, Accessibility, Map, Interactive, Wheelchair, Mobility, Vision, Hearing, Sensory, Disability, Inclusive, Inclusivity, Accessible, Building, Room, Floorplans',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            },
        ],
        link: [
            {
                rel:"stylesheet",
                href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            },
        ],
    });

</script>

<script>

    export default {
        created() {
           // Redirect to the search page
           this.$router.push('/info');
        },
    }

</script>


<style>
</style>