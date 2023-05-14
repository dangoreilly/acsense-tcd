<!-- Admin page for displaying analytics from Plausible -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'analytics'">
        <div>
            <!-- <div 
            style="font-size: 14px; padding-bottom: 14px;">
                Stats powered by 
                <a 
                target="_blank" 
                style="color: #4F46E5; text-decoration: underline;" 
                href="https://plausible.io">
                    Plausible Analytics
                </a>
            </div> -->

            <iframe 
            plausible-embed 
            src="https://plausible.io/share/tcdsensemap-test.ie?auth=ygLkYbc_xksHgzQ6oa0je" 
            scrolling="yes"
            frameborder="0" 
            loading="lazy" 
            style="width: 1px; min-width: 100%; height: 100vh; overflow-y: auto;">
            </iframe>
            <!-- <script async src="https://plausible.io/js/embed.host.js"></script> -->
        </div>
    </NuxtLayout>
</template>

<script setup>

useHead({
    script: [
        {
            src: 'https://plausible.io/js/embed.host.js',
            async: true,
        },
    ],
})


definePageMeta({
  layout: false,
});
</script>
