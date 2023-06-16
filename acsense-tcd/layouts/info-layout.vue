<template>
    <div style="width:100%">
        <NavBar :searchBarDisabled="searchBarDisabled"/>
        <div class="mainMatter">
            <slot></slot>
        </div>
        <Footer />
    </div>
    </template>
    
    <style>
    .mainMatter {
        max-width: 1000px;
        margin: 0 auto;
        margin-top: 56px;
        min-height: 100vh;
        
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
    