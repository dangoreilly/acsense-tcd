<template>
    <div style="width:100%">
        <NavBar :searchBarDisabled="searchBarDisabled"/>
        <!-- <div class="mainMatterBox"> -->
            <div class="mainMatter">
                <slot></slot>
            </div>
        <!-- </div> -->
        <Footer />
    </div>
    </template>
    
    <style>
    .mainMatter {
        max-width: 1100px;
        margin: 0 auto;
        margin-top: 56px;
        min-height: 100vh;
        
        padding-inline: 50px;
        box-shadow: 0 30px 40px rgba(0,0,0,.1);
    }
    @media (prefers-color-scheme: dark) {
        .mainMatter {
        box-shadow: 0 30px 40px rgba(255,255,255,.1);
        }
    }
    </style>
    
    <script lang="ts">
    
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
                }
            ],
        });
    
    
    </script>
    