<template>
    <div class="fullwindow">
        <NavBar :searchBarDisabled="searchBarDisabled"/>
        <!-- <div class="mainMatterBox"> -->
            <div class="mainMatter">
                <slot></slot>
            </div>
        <!-- </div> -->
        <div class="fixed-bottom footer-font-control">
            <Footer/>
        </div>
    </div>
</template>

<style>

    .fullwindow {
        max-height: 100dvh;
        overflow: hidden;
    }

    .mainMatter {
        max-width: 1100px;
        margin: 0 auto;
        margin-top: 56px;
        min-height: 100vh;
        
        padding-inline: 30px;
        box-shadow: 0 30px 40px rgba(0,0,0,.1);
    }
    @media (prefers-color-scheme: dark) {
        .mainMatter {
        box-shadow: 0 30px 40px rgba(255,255,255,.1);
        }
    }

    @media screen and (max-width: 992px){    
        .mainMatter {
            max-width: 1000px;
        
            padding-inline: 0px;
        }

        .footer-font-control {
            font-size: 0.7rem !important;
        }
    }

    @media screen and (max-width: 332px){    

        .footer-font-control {
            font-size: 0.5rem !important;
        }
    }

</style>

<script setup>


    useHead({
        link:[
            {
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css2?family=Lato&family=PT+Mono&Inter:wght@900&display=swap"
            },
            {
                rel: "preconnect",
                href: "https://fonts.gstatic.com",
                crossorigin: "anonymous"
            },
            {
                rel: "preconnect",
                href: "https://fonts.googleapis.com",
            },
        ],
        script: [
            {
                src: 'https://plausible.io/js/script.js',
                defer: true,
                'data-domain': "tcdsensemap.ie"
            },
        ]
    });

</script>
    
<script>

    export default {
        props: {
            searchBarDisabled: Boolean,
        },
        computed: {
            // Get the theme from local storage
            prefersDarkTheme() {
                return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            }
        },
        watch: {
            // Watch for changes to the theme
            prefersDarkTheme(wantsDark) {
                if (wantsDark) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark')
                } else {
                    document.documentElement.setAttribute('data-bs-theme', 'light')
                }
            }
        },
        methods: {
            // Set the theme on page load
            setTheme() {
                if (this.prefersDarkTheme) {
                    document.documentElement.setAttribute('data-bs-theme', 'dark')
                } else {
                    document.documentElement.setAttribute('data-bs-theme', 'light')
                }
            }
        },
        mounted() {
            this.setTheme()
        }
    
    }



</script>
    