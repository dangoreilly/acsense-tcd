<template>
    <div id="map"></div>
    
    </template>
    

    <script setup>
    //Script setup needed for UseHead
    // The index page is very different to the rest of the script
    // so there's no qualms with using the composition API here, instead of the Options API
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
                href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
                rel: "stylesheet",
                integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
                crossorigin: "",
            }
        ],
        script: [
            {
                src: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                integrity: "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
                crossorigin: "",
            },
            {
                src: '/javascript/mapInit.js',
                body: true,
            },
        ]
    });
    
    </script>
    
    <style>
        #map { height: 100vh; }
    </style>