<!-- Search page -->
<template>
    <NuxtLayout name="info-layout" searchBarDisabled>
        <div class="container" style="padding-top:1rem">
            <input 
            class="form-control" 
            type="text" 
            id="searchbar" 
            @submit="search()"
            @keydown.enter="search()"
            placeholder="Search for a building or space..." 
            aria-label="Searchbar" 
            v-model="searchTerm"
            style="font-size: 1.5rem;">
        </div>

        <!-- Placeholder results -->
        <div class="border-top mt-2 pt-1" v-if="sorted_list.length < 1"> 
            <searchResultPlaceholder v-for="(n, index) in 8" :key="index" :index="index"/>
        </div>
        <!-- Results section -->
        <div class="border-top mt-2 pt-1" v-else> 
            <searchResult v-for="result in sorted_list" :result="result" :searchterm="searchTerm" />
        </div>
    </NuxtLayout>
</template>
<!-- Going to a building page that doesn't exist should redirect to
the search page with a URL param signalling that the link was broken
Make sure the search with the url param converst dashes to spaces -->

<script setup>
    useHead({
        title: 'TCD Sense Map - Search',
        meta: [
            // {
            //     name: 'description',
            //     content: 'An interactive map of Trinity College Dublin, showing accessibility information for buildings and rooms.',
            // },
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
            // {
            //     rel:"stylesheet",
            //     href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            // },
        ],
    });

</script>

<script>

    import {createClient} from '@supabase/supabase-js';
    import Fuse from 'fuse.js';

    export default {

        data() {
            return {
                searchTerm: '',
                buildings_list: [],
                spaces_list: [],
                sort_list: [],
                // fuse: null,
                sorted_list: [],
                spaceIcons: [],
            }
        },
        created() {

            // Create the supabase client
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

            // Gather the list of buildings and spaces
            this.formSearchList()
            // Check if there is a search param from a redirect
            this.checkForSearchParam()


        },
        mounted() {
            // Once there's a list to check, check it
            // this.buildingSearch()
        },
        methods: {

            async formSearchList(){
                // Get the buildings, spaces and space icons
                this.getListOfBuildings()
                this.getListOfSpaces()
                this.getSpaceIcons()

                // Wait for them all to be loaded
                while (this.buildings_list.length == 0 || this.spaces_list.length == 0 || this.spaceIcons.length == 0){
                    await new Promise(r => setTimeout(r, 100));
                }

                this.assignBuildingNamesToSpaces(this.spaces_list);

                // Create a merged list of buildings and spaces
                this.sort_list = this.spaces_list.concat(this.buildings_list);
                // Copy the list for sorting
                this.sorted_list = JSON.parse(JSON.stringify(this.sort_list));

                // Create a new Fuse object for searching
                // this.createNewFuseObject()

                // Sort the list alphabetically
                this.sortList_byAlphabet()

            },

            async checkForSearchParam() {
                // Check if there is a search param
                console.log("Checking for search param")
                console.log(this.$route.query.search)
                if (this.$route.query.search) {
                    // If there is, set the search bar to that value
                    this.searchTerm = this.normaliseSearchTerm(this.$route.query.search);

                    // And search for it, is the sort list is available
                    while (this.sorted_list.length == 0){
                        await new Promise(r => setTimeout(r, 100));
                    }

                    this.search();
                }
            },

            /**
             * Takes in a list of buildings or spaces, and adds a show and type property to each one
             * @param {Array} list
             * @param {Boolean} isBuilding
             */
            initList (list, isBuilding) {
                // Normalise the result objects for sorting and styling
                if (isBuilding) {
                    for (let i = 0; i < list.length; i++) {
                        list[i].type = "building";
                    }
                }
                else {
                    for (let i = 0; i < list.length; i++) {
                        list[i].display_name = list[i].name;
                    }
                }
            },

            assignBuildingNamesToSpaces(list){
                for (let i = 0; i < list.length; i++) {
                    // If the space has a building, get the display name for it
                    if (list[i].building){
                        list[i].building_display_name = this.getBuildingDisplayName(list[i].building);
                    }
                }
            },

            async getSpaceIcons() {
                // Get the space icons from the database
                // For showing in the result card
                const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
                const supabaseKey = useRuntimeConfig().public.supabaseKey;
                this.supabase = createClient(supabaseUrl, supabaseKey)

                let { data: icons, error } = await this.supabase
                    .from('space_styles')
                    .select('*')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {

                    // Wait for the spaces to be loaded, then assign them icons
                    while (this.spaces_list.length == 0){
                        await new Promise(r => setTimeout(r, 500));
                    }

                    for (let i = 0; i < this.spaces_list.length; i++) {
                        // Get the icon for the space type
                        let icon = icons.find(s => s.category == this.spaces_list[i].type);
                        // console.log(icon);
                        // Assign the icon to the space
                        this.spaces_list[i].icon = icon.icon;
                        this.spaces_list[i].colour = icon.colour;
                    }

                    // This will double as a flag for the load being finished
                    this.spaceIcons = icons;
                }
            },

            getBuildingDisplayName(canonical){
                // Get the display name of a building from it's canonical name
                let building = this.buildings_list.find(b => b.canonical == canonical);
                if (building == undefined){
                    return "Building not found";
                }
                return building.display_name;
            },
            
            async getListOfBuildings() {
                // Select All buildings from supabase
                // Assign them the buildings array

                let { data: buildings, error } = await this.supabase
                    .from('buildings')
                    .select('display_name, canonical, description, aka')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    // Add them to the buildings list
                    this.buildings_list = buildings;

                    // console.log(buildings);
                    // Add a show property to each building, so that it can later be controlled with the search function
                    this.initList(this.buildings_list, true);

                    // Add to the sort list initially to speed up page draw
                    this.sort_list = this.sort_list.concat(this.buildings_list);
                }
                
            },

            async getListOfSpaces() {
    
                // Select All spaces from supabase
                // Assign them the spaces array

                let { data: buildings, error } = await this.supabase
                    .from('spaces')
                    .select('*')
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    // Add them to the buildings list
                    this.spaces_list = buildings;

                    // Add a show property to each space, so that it can later be controlled with the search function
                    this.initList(this.spaces_list, false);

                    // Add to the sort list initially to speed up page draw
                    this.sort_list = this.sort_list.concat(this.spaces_list);
                }
                
            },

            searchSubmit() {
                this.$router.push({
                    path: '/info',
                    query: { search: this.searchTerm },
                });
            },

            normaliseSearchTerm(searchTerm) {
                // replace dashes and %20 with spaces
                searchTerm = searchTerm.replace(/-|%20/g, ' ');
                return searchTerm;
            },

            search() {
                 
                const fuse_options = {
                    includeScore: true,
                    // threshold: 1,
                    keys: [ 
                        // "display_name" 
                        {name:'display_name', weight:5},
                        {name:'aka', weight:2},
                        {name:'building_display_name', weight:1},
                        // {name:'ZoomedInLabel', weight:1},
                        // {name:'ZoomedOutLabel', weight:1}
                    ]
                }
                // Create a new Fuse object
                let fuse = new Fuse(this.sort_list, fuse_options);

                //Use the static generated Fuse instance to get a list of matches
                let result = fuse.search(this.searchTerm)
                console.log(result)

                // Check there is a result
                // If there's no result and no text in the textbox, show everything except the apology
                //TODO: Add an apology
                if (result.length == 0 && this.searchTerm == ""){

                    this.sorted_list = JSON.parse(JSON.stringify(this.sort_list));
                    this.showApology = false;

                }
                else if(result.length == 0){
                    
                    //If the results are 0 but there is a query, then we need to apologise
                    this.showApology = true;     

                }
                else {

                    // If the result is nonzero, clear the old results and add the new ones
                    this.sorted_list = [];
                    for (let i = 0; i < result.length; i++) {
                        this.sorted_list.push(result[i].item);
                    }

                    this.showApology = false;
                }

            },

            sortList_byAlphabet() {

                var list, i, switching, b, shouldSwitch;
                let holder;
                
                switching = true;
                /* Make a loop that will continue until
                no switching has been done: */
                while (switching) {
                    // Start by saying: no switching is done:
                    switching = false;
                    b = this.sort_list
                    
                    // Loop through all list items:
                        for (i = 0; i < (b.length - 1); i++) {

                            // Start by saying there should be no switching:
                            shouldSwitch = false;

                            /* Check if the next item should
                            switch place with the current item: */
                            if (b[i].display_name > b[i+1].display_name) {

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
                // Copy the sorted list
                this.sorted_list = JSON.parse(JSON.stringify(b));
            }
        }
    }

</script>


<style>
</style>