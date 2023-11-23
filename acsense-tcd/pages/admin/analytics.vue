<!-- Admin page for displaying analytics from Plausible -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'analytics'" :supabase_client="supabase">
        <div>
            <iframe 
            id="plausible-embed"
            plausible-embed 
            src="https://plausible.io/share/tcdsensemap.ie?auth=ygLkYbc_xksHgzQ6oa0je" 
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
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
const supabaseKey = useRuntimeConfig().public.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey)

onMounted(() => {
    // Required to fix the plausible embed script from turning off scrolling for some reason
    document.getElementById('plausible-embed').scrolling = 'yes';
})

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
  middleware: ['auth'],
});
</script>
