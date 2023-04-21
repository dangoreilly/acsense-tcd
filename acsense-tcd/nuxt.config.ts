// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        '/**': {static: true},
    },
    css: [ "~/assets/css/style.scss" ],


})
