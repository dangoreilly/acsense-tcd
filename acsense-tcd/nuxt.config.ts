// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        '/**': {static: true},
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
    ]
})
