// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        // '/info/*': {ssr: true},
        // '/': {static: true},
        // '/admin/*': {ssr: true},
        '/admin': {redirect:'/admin/analytics'},
    },
    css: [ "~/assets/css/style.scss"],
    modules: [
        '@vueuse/nuxt',
        '@nuxt/content',
      ],
    components: [
        { path: '~/components/admin'},
        { path: '~/components/info'},
        '~/components'
    ],
    runtimeConfig: {
        // Will be available in both server and client-side
        public: {
            // override with env var
            supabaseUrl: process.env.NUXT_SUPABASE_URL,
            supabaseKey: process.env.NUXT_SUPABASE_KEY,
        }
    }
})
