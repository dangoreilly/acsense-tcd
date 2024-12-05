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
            <!-- Link to room search page -->
            <!-- <a href="/info/rooms" class="text-decoration-none">
                <span class="mt-2">Search for teaching rooms instead</span>
            </a> -->
            
        </div>
        <!-- Filters -->
        <div class="mt-1 pt-1"> 
            <!-- <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="d-flex">
                            <div>
                                <span>Filter by:</span>
                                <span v-for="(filter, index) in facilty_filter" 
                                :key="index" 
                                class="badge ms-1 cursor-pointer" 
                                @click="updateFilter(index)" 
                                :class="filter.active ? 'bg-success' : 'bg-secondary opacity-50'">
                                    {{filter.label}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div> -->
                <!-- Count of results -->
                <!-- <div class="row">
                    <div class="col-12">
                        <span>Showing {{filterActive ? filtered_list.length : sorted_list.length}} results</span>
                    </div>
                </div>
            </div>  -->
            <div class="container">
                <span>Filter by:</span>
                <!-- Grid of options -->
                <div class="d-flex flex-wrap">
                    <span v-for="(filter, index) in facilty_filter" 
                    :key="index" 
                    class="badge ms-1 cursor-pointer flex-fill my-1" 
                    @click="updateFilter(index)" 
                    :class="filter.active ? 'bg-success' : 'bg-secondary opacity-50'">
                        {{filter.label}}
                    </span>
                </div>
                
            </div>
            <div>
                <!-- Count of results -->
                <div class="container d-flex justify-content-between">
                    <span>Showing {{filterActive ? filtered_list.length : sorted_list.length}} results</span>
                    <!-- Pill link to highlight the filtered results on the map -->
                    <a class="btn badge rounded-pill text-bg-warning text-decoration-none"
                    v-if="filterActive && filtered_list.length > 0"
                    @click="highlightResultsOnMap()">
                    Highlight on map</a>
                </div>
                
            </div>
        </div>

        <!-- Placeholder results -->
        <div class="border-top mt-2 pt-1" v-if="sorted_list.length < 1 || filterActive && filtered_list.length == 0"> 
            <!-- <searchResultPlaceholder v-for="(n, index) in 8" :key="index" :index="index"/> -->
            <div class="container fs-3">
                Sorry, no results found.
            </div>
        </div>
        <!-- Results section -->
        <div class="border-top mt-2 pt-1" v-else> 
            <!-- If there is a filter active, loop through the filtered list -->
            <div v-if="filterActive">
                <searchResult 
                v-for="result in filtered_list" 
                :result="result"
                :searchterm="searchTerm" />
            </div>
            <!-- If there is no filter active, loop through the sorted list -->
            <div v-else>
                <searchResult 
                v-for="result in sorted_list" 
                :result="result"
                :searchterm="searchTerm" />
            </div>
        </div>

        <!-- Back to top toast -->
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
            <div id="toast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Back to top</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body
                cursor-pointer" @click="scrollToTop()">
                    Back to 
                </div>
            </div>
        </div>

    </NuxtLayout>
</template>
<!-- Going to a building page that doesn't exist should redirect to
the search page with a URL param signalling that the link was broken
Make sure the search with the url param converst dashes to spaces -->

<script setup>
import {createClient} from '@supabase/supabase-js'

    // Create the supabase client
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseKey)
    
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

    /**
     * Takes in a list of buildings or spaces, and adds a show and type property to each one
     * @param {Array} list
     * @param {Boolean} isBuilding
     */
    function initList (list, isBuilding) {
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

        return list;
    }
                
    async function getListOfBuildings() {
        // Select All buildings from supabase
        // Assign them the buildings array

        let { data: buildings, error } = await supabase
            .from('buildings')
            .select('display_name, canonical, description, aka')
            .eq("published", true)
        if (error) {
            console.log(error)
            throw error
        }
        else {
            // Add them to the buildings list
            let build_list = JSON.parse(JSON.stringify(buildings));
            // Add a show property to each building, so that it can later be controlled with the search function
            build_list = initList(build_list, true);
            // Find the rooms for the buildings
            build_list = await getRoomsForBuildings(build_list);
            return build_list;
        }
        
    }

    async function getRoomsForBuildings(buildings_list){
        // Query supabase for all buildings that have their rooms published, and the rooms thereof
        // Attach the returned rooms to the building objects by their UUID

        console.log("Finding rooms")

        let { data: rooms, error } = await supabase
            .from('rooms')
            .select('room_name, room_code, aka, building(canonical, rooms_published)')
        if (error) {
            console.log(error)
            throw error
        }
        else {

            // Filter out the rooms from buildings with unpublished room data
            let rooms_list = rooms.filter(r => r.building.rooms_published == true);

            // Cycle through the buildings and add the rooms to them
            for (let i = 0; i < buildings_list.length; i++) {
                // Find the rooms that match the building
                let building_rooms = rooms_list.filter(r => r.building.canonical == buildings_list[i].canonical);
                // Add the rooms to the building
                buildings_list[i].rooms = building_rooms;

                console.log(buildings_list[i])
            }

            
        }

        return buildings_list;
    }

    async function getListOfSpaces() {

        // Select All spaces from supabase
        // Assign them the spaces array

        let { data: spaces, error } = await supabase
            .from('spaces')
            // .select('*')
            .select('name, building, aka, microwave, kettle, seating, outlets, food_drink_allowed, wheelchair, type, description, canonical, aka')
            .eq("published", true)
        if (error) {
            console.log(error)
            throw error
        }
        else {

            // Add a show property to each space, so that it can later be controlled with the search function
            let spaces_list_temp = JSON.parse(JSON.stringify(spaces));
            return initList(spaces_list_temp, false);

        }
        
    }

    async function getSpaceIcons() {

        let { data: icons, error } = await supabase
            .from('space_styles')
            .select('*')
        if (error) {
            console.log(error)
            throw error
        }
        else {
            return icons;
        }
    }

    function assignSpaceIcons(spaces_list, icons) {
        for (let i = 0; i < spaces_list.length; i++) {
            // Get the icon for the space type
            let icon = icons.find(s => s.category == spaces_list[i].type);
            // console.log(icon);
            
            // Assign the icon override to the space, if one exists
            spaces_list[i].icon = spaces_list[i].icon_override 
            // Otherwise, assign the default icon
            spaces_list[i].icon ||= icon.icon;
            // Colour cannot be customised, it depends on the space style
            spaces_list[i].colour = icon.colour;
        }
        return spaces_list;
    }

    let buildings_list_temp = [];
    let spaces_list_temp = [];
    let spaceIcons = [];

    const spaces = useState("spaces_list");
    const buildings = useState("buildings_list");

    await Promise.allSettled([getListOfBuildings(), getListOfSpaces(), getSpaceIcons()])
    .then((values) => {
        buildings.value = values[0].value;
        spaces_list_temp = values[1].value;
        spaceIcons = values[2].value;
        spaces.value = assignSpaceIcons(spaces_list_temp, spaceIcons);
    })
    // buildings_list_temp = await getListOfBuildings();
    // // console.log("Buildings fetched")
    // spaces_list_temp = await getListOfSpaces();
    // spaceIcons = await getSpaceIcons();
    // spaces_list_temp = assignSpaceIcons(spaces_list_temp, spaceIcons);
    // console.log("Spaces fetched")

    // const spaces = useState("spaces_list");
    // spaces.value = spaces_list_temp;
    // // console.log("Spaces stored")
    // // console.log(space.value)

    // const buildings = useState("buildings_list");
    // buildings.value = buildings_list_temp;
    // // console.log("Buildings stored")
    // // console.log(buildings_list.value)

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
                include_rooms: false,
                // fuse: null,
                sorted_list: [],
                filtered_list: [],
                spaceIcons: [],
                facilty_filter: [
                    {key: "microwave", label: "Has Microwave", active: false},
                    {key: "kettle", label: "Has Kettle", active: false},
                    {key: "seating", label: "Has Seating", active: false},
                    {key: "outlets", label: "Has Plug Sockets", active: false},
                    {key: "food_drink_allowed", label: "Food/Drink Allowed", active: false},
                    {key: "wheelchair", label: "Wheelchair Accessible", active: false}
                ],
                filterActive: false,
            }
        },
        // setup(){

        // },
        created() {

            

            // Gather the list of buildings and spaces
            this.formSearchList()

            // Add rooms for testing
            // find the fitzgerald-building by canonical
            let fitz = this.sort_list.find(b => b.canonical == "fitzgerald-building");
            // Find the sniam by canonical
            let sniam = this.sort_list.find(b => b.canonical == "sami-nasr-institute-of-advanced-materials");


            // Add rooms to fitz
            fitz.rooms =[
                {
                    "roomName": "FITZGERALD LIBRARY ",
                    "aka": "",
                    "cmis": "FITZLIB",
                    "roomType": "Flat",
                    "capacity": 22,
                    "hearingLoop": false,
                    "wheelchair": true,
                    "outlets": false,
                    "projector": true,
                    "whiteboard": true,
                    "lecturn": true

                },
                {
                    "roomName": "PHYSICS LARGE LECTURE THEATRE",
                    "aka": "The Shro",
                    "cmis": "PHYLLT",
                    "roomType": "Tiered",
                    "capacity": 148,
                    "hearingLoop": false,
                    "wheelchair": false,
                    "outlets": false,
                    "projector": true,
                    "whiteboard": true,
                    "lecturn": true

                }
            ];
            // Add rooms to sniam
            sniam.rooms = [
                {
                    "roomName": "SNIAM COMPUTATIONAL PHYSICS LAB (0.19)",
                    "aka": "SNIAM PC Room",
                    "cmis": "SNIAM CPL",
                    "roomType": "Lab",
                    "capacity": 35,
                    "hearingLoop": false,
                    "wheelchair": true,
                    "outlets": true,
                    "projector": true,
                    "whiteboard": true,
                    "lecturn": true

                },
                {
                    "roomName": "SNIAM LECTURE THEATRE",
                    "aka": "SNIAM Basement",
                    "cmis": "SNIAM LT",
                    "roomType": "Flat",
                    "capacity": 122,
                    "hearingLoop": false,
                    "wheelchair": true,
                    "outlets": true,
                    "projector": true,
                    "whiteboard": true,
                    "lecturn": true

                },
            ]

            // console.log(JSON.parse(JSON.stringify(this.sort_list)))
            // Check if there is a search param from a redirect
            this.checkForSearchParam()

        },
        methods: {

            async formSearchList(){
                // Get the buildings and spaces
                this.buildings_list = JSON.parse(JSON.stringify(useState("buildings_list").value));
                // console.log("Buildings List")
                // console.log(this.buildings_list)
                this.spaces_list = useState("spaces_list").value;
                // console.log("Spaces List")
                // console.log(this.spaces_list)

                // Set up the buildings_list with an empty sorted_rooms array
                for (let i = 0; i < this.buildings_list.length; i++) {
                    this.buildings_list[i].sorted_rooms = [];
                }


                // Wait for them all to be loaded
                // while (this.buildings_list.length == 0 || this.spaces_list.length == 0 || this.spaceIcons.length == 0){
                //     await new Promise(r => setTimeout(r, 100));
                // }

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
                // console.log("Checking for search param")
                // console.log(this.$route.query.search)
                if (this.$route.query.search) {
                    // If there is, set the search bar to that value
                    this.searchTerm = this.normaliseSearchTerm(this.$route.query.search);

                    // And search for it, if the sort list is available
                    while (this.sort_list.length == 0){
                        await new Promise(r => setTimeout(r, 100));
                    }

                    this.search();
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

            updateFilter(filter_index) {
                // Get the filter object from the index
                let filter = this.facilty_filter[filter_index];
                // Toggle the active state of the filter
                filter.active = !filter.active;

                // If a filter is active, filter the list
                if (this.checkFilterActive()) {
                    this.filterList();
                }

                // console.log(filter.key + " " + filter.active)
                // // If there are any active filters, filter the list
                // if (this.checkFilterActive()) {
                //     this.filterList();
                // }
                // else {
                //     // If there are no active filters, reset the list
                //     this.search();
                // }
                
            },

            checkFilterActive() {
                // Cycle through the facility_filter array and check if any are true
                for (let i = 0; i < this.facilty_filter.length; i++) {
                    if (this.facilty_filter[i].active == true) {
                        this.filterActive = true;
                        return true;
                    }
                }
                // If none are true, return false
                this.filterActive = false;
                return false;
            },

            filterList() {
                // Filter the list based on the active filters

                // Clean copy the sorted_list into the filtered_list
                this.filtered_list = JSON.parse(JSON.stringify(this.sorted_list));
                // For each active filter, filter the list
                for (let i = 0; i < this.facilty_filter.length; i++) {
                    if (this.facilty_filter[i].active) {

                        this.filtered_list = this.filtered_list.filter(item => item[this.facilty_filter[i].key] == true);
                    
                    }
                }
            },

            checkFilter(item){
                // Check if there is a filter active
                if (!this.filterActive) {
                    return true;
                }

                // Check if the item is a building. If it is, it has no facilities to filter
                if (item.type == "building") {
                    return false;
                }

                // Check if the item has the filter by cycling through the filter and matching the keys
                for (let i = 0; i < this.facilty_filter.length; i++) {
                    if (this.facilty_filter[i].active) {
                        if (item[this.facilty_filter[i].key] == false) {
                            return false;
                        }
                    }
                }
            },

            clearFilter(){
                // Cycle through the filters and set them all to false
                for (let i = 0; i < this.facilty_filter.length; i++) {
                    this.facilty_filter[i].active = false;
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
                // Select All buildings from supabase that are published
                // Assign them the buildings array

                let { data: buildings, error } = await this.supabase
                    .from('buildings')
                    .select('display_name, canonical, description, aka, rooms_published')
                    .eq("published", true)
                if (error) {
                    console.log(error)
                    throw error
                }
                else {
                    // Add them to the buildings list
                    this.buildings_list = buildings;

                    // Get the rooms for the buildings with floors
                    this.buildings_list = this.getRoomsForBuildings();

                    // console.log(buildings);
                    // Add a show property to each building, so that it can later be controlled with the search function
                    // this.initList(this.buildings_list, true);

                    // Add to the sort list initially to speed up page draw
                    this.sort_list = this.sort_list.concat(this.buildings_list);
                }
                
            },

            async getListOfSpaces() {
    
                // Select All spaces from supabase
                // Assign them the spaces array

                let { data: buildings, error } = await this.supabase
                    .from('spaces')
                    .select('name, building, aka, microwave, kettle, seating, outlets, food_drink_allowed, wheelchair, type, description, canonical, aka')
                    .eq("published", true)
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
                        {name:'', weight:1},
                        {name:"rooms.roomName", weight:3},
                        {name:"rooms.aka", weight:2},
                        {name:"rooms.cmis", weight:4},
                        // {name:'ZoomedOutLabel', weight:1}
                    ]
                }
                // Create a new Fuse object
                let fuse = new Fuse(this.sort_list, fuse_options);

                //Use the static generated Fuse instance to get a list of matches
                let result = fuse.search(this.searchTerm)
                // console.log(result)

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

                    // Then add in the room results
                    for (let i = 0; i < this.sorted_list.length; i++) {
                        // For each building in the primary search...
                        if (this.sorted_list[i].type == "building") {
                            // If the building has a rooms array, search it
                            this.sorted_list[i].sorted_rooms = this.search_roomsOnly(this.sorted_list[i]);
                        }
                    }

                    this.showApology = false;
                }

            },

            search_roomsOnly(sorted_building_item){
                // For the given building result from the original search,
                // Search the rooms array specifically so that they can be surfaced in the search results

                // First, check the building has rooms

                if (!sorted_building_item.rooms || sorted_building_item.rooms.length == 0){
                    return [];
                }

                let rooms_to_search = sorted_building_item.rooms;
                let sorted_rooms = [];

                const fuse_options = {
                    includeScore: true,
                    // threshold: 1,
                    keys: [ 
                        {name:"roomName", weight:3},
                        {name:"aka", weight:2},
                        {name:"cmis", weight:5},
                    ]
                }
                // Create a new Fuse object
                let fuse = new Fuse(rooms_to_search, fuse_options);

                //Use the static generated Fuse instance to get a list of matches
                let result = fuse.search(this.searchTerm)
                console.log(result)

                // Check there is a result
                if(result.length != 0){

                    // If the result is nonzero, add them to the sorted_rooms array
                    for (let i = 0; i < result.length; i++) {
                        sorted_rooms.push(result[i].item);
                    }
                }

                return sorted_rooms;


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
            },

            highlightResultsOnMap(){
                // Collect up the canonical names of the filtered results and form
                // a link back to the main map page with a URL param

                // Add the first result to the search param
                let searchParam = "?filterSearchResults=" + this.filtered_list[0].canonical
                // If there are more, add them to the search param too
                for (let i = 1; i < this.filtered_list.length; i++) {
                    searchParam += "&filterSearchResults=" + this.filtered_list[i].canonical;
                }

                // Redirect to the map page with the search param
                navigateTo('/' + searchParam);
            }
        }
    }

</script>


<style>
.cursor-pointer {
    cursor: pointer;
    transition: all 0.2s;
}
</style>