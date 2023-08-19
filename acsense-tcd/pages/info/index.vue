<!-- Search page -->
<template>
    <NuxtLayout name="info-layout" searchBarDisabled>
        <div class="container" style="padding-top:1rem">
            <input 
            class="form-control" 
            type="text" 
            id="searchbar" 
            @keyup="buildingSearch()" 
            @submit="searchSubmit()"
            placeholder="Search for a building..." 
            aria-label="Searchbar" 
            v-model="search"
            style="font-size: 1.5rem;">
        </div>
        <!-- Results section -->
        <div class="border-top mt-2 pt-1"> 
            <searchResult v-for="building in buildings_list" :building_raw="building" :searchterm="search" :key="building.buildingId" />
        </div>
    </NuxtLayout>
</template>
<!-- Going to a building page that doesn't exist should redirect to
the search page with a URL param signalling that the link was broken
Make sure the search with the url param converst dashes to spaces -->

<script setup>
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
                rel:"stylesheet",
                href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            },
        ],
    });

</script>

<script>

    import buildings_list from '~/assets/buildings_list';
    import Fuse from 'fuse.js';

    const fuse_options = {
        includeScore: true,
        keys: [ 
            {name:'properties.buildingName', weight:3},
            {name:'properties.aka', weight:1},
            // {name:'ZoomedInLabel', weight:1},
            // {name:'ZoomedOutLabel', weight:1}
        ]
    }

    export default {

        data() {
            return {
                search: '',
                buildings_list: buildings_list,
                fuse: new Fuse(buildings_list, fuse_options)
            }
        },
        created:
            function () {
                for (let i = 0; i < this.buildings_list.length; i++) {
                    this.buildings_list[i].show = true;
                }
            },

        methods: {

            searchSubmit() {
                this.$router.push({
                    path: '/info',
                    query: { search: this.search },
                });
            },

            normaliseSearchTerm(searchTerm) {
                // replace dashes and %20 with spaces
                searchTerm = searchTerm.replace(/-|%20/g, ' ');
                return searchTerm;
            },

            buildingSearch() {
                // Declare variables
                var i; 
                var filter = [];
                // input = document.getElementById('searchbar').value;
                let li = this.buildings_list
                
                //Use the static generated Fuse instance to get a list of matches
                let result = this.fuse.search(this.search)

                //convert that Fuse instance to an array of IDs for filtering
                for (i = 0; i < result.length; i++){
                    filter.push(result[i].item.properties.bldID);
                }

                // console.log(filter);

                // Check there is a result
                // If there's no result and no text in the textbox, show everything except the apology
                //TODO: Add an apology
                if (result.length == 0 && this.search == ""){

                    //Make everything reappear
                    for (i = 0; i < this.buildings_list.length; i++) {
                        li[i].show = true;
                    }
                    //Sort them
                    this.sortList_byAlphabet();
                    
                }
                else if(result.length == 0){
                    //If the results are 0 but there is a query, then we need to apologise
                }
                else {
                    // If the result is nonzero, then show the returns
                    // Loop through all list items, and hide those who don't match the search query
                    for (i = 0; i < li.length; i++) {

                        
                        if (filter.includes(li[i].id)) {
                            li[i].show = true;
                            li[i].score = result.find(r => r.item.bldID == li[i].bldID).score;
                        } 
                        else {
                            li[i].show = false;
                        }
                    }

                    //Then loop through again and sort based on scores
                    this.sortList_byScore();
                    console.log(this.buildings_list);

                }

            },

            // highlight(text) {
                
            //     let inputText = document.getElementById("inputText");
            //     let innerHTML = inputText.innerHTML;
            //     let index = innerHTML.indexOf(text);
                
            //     if (index >= 0) { 
            //         innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
            //         inputText.innerHTML = innerHTML;
            //     }
            // }
        
            sortList_byScore() {

                var i, switching, b, shouldSwitch;
                let holder;

                switching = true;
                /* Make a loop that will continue until
                no switching has been done: */
                while (switching) {
                    // Start by saying: no switching is done:
                    switching = false;
                    b = this.buildings_list
                    
                    // Loop through all list items:
                        for (i = 0; i < (b.length - 1); i++) {

                            // Start by saying there should be no switching:
                            shouldSwitch = false;

                            /* Check if the next item should
                            switch place with the current item: */
                            if (b[i].score > b[i+1].dscore) {

                                /* If next item is alphabetically lower than current item,
                                mark as a switch and break the loop: */
                                shouldSwitch = true;
                                break;
                            }
                        }
                    if (shouldSwitch) {
                    // Have to deep copy the objects to avoid reference errors
                    holder = JSON.parse(JSON.stringify(b[i]));
                    b[i] = JSON.parse(JSON.stringify(b[i+1]));
                    b[i+1] = JSON.parse(JSON.stringify(holder));

                    switching = true;
                    }
                }
            },
            sortList_byAlphabet() {

                var list, i, switching, b, shouldSwitch;

                
                switching = true;
                /* Make a loop that will continue until
                no switching has been done: */
                while (switching) {
                    // Start by saying: no switching is done:
                    switching = false;
                    b = this.buildings_list
                    
                    // Loop through all list items:
                        for (i = 0; i < (b.length - 1); i++) {

                            // Start by saying there should be no switching:
                            shouldSwitch = false;

                            /* Check if the next item should
                            switch place with the current item: */
                            if (b[i].properties.name > b[i+1].properties.name) {

                                /* If next item is alphabetically lower than current item,
                                mark as a switch and break the loop: */
                                shouldSwitch = true;
                                break;
                            }
                        }
                    if (shouldSwitch) {

                    // Have to deep copy the objects to avoid reference errors
                    holder = JSON.parse(JSON.stringify(b[i]));
                    b[i] = JSON.parse(JSON.stringify(b[i+1]));
                    b[i+1] = JSON.parse(JSON.stringify(holder));
                    switching = true;
                    }
                }
            }
        }
    }

</script>


<style>
</style>