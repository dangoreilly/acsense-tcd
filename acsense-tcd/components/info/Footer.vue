<!-- Footer for the bottom of the info page -->
<!-- Displaying links back to the tcd site etc -->
<template>
    <footer class="footer mt-auto py-3 bg-dark">
        <div class="container d-flex flex-row justify-content-around flex-wrap" style="max-width: 1000px;">
            <!-- Loop through the links and print them with a divider -->
            <span v-for="link in links" class="mb-2">
                <a :href="link.url" class="text-light">
                    {{ link.name }}
                </a>        
        </span>
        </div>
    </footer>
</template>

<script lang="ts">
export default {
    data() {
        return {
            links: [
                // The TCD Website
                {
                    name: "Trinity College Dublin",
                    url: "https://www.tcd.ie/"
                },
                // The Disability Services Website
                {
                    name: "Disability Services",
                    url: "https://www.tcd.ie/disability/"
                },
                // The TCDSense Website
                {
                    name: "About TCDSense",
                    url: "https://www.tcd.ie/disability/services/tcdsense.php"
                },
                // The Plausible data policy
                {
                    name: "Plausible Analytics",
                    url: "https://plausible.io/data-policy"
                },
                // The github repo
                {
                    name: "This project is Open Source",
                    url: "https://github.com/dangoreilly/acsense-tcd"
                }
            ]
        }
    }
}
</script>
