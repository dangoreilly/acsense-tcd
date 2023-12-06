<template>
    <div id="map"></div>
</template>

<script>
import L from 'leaflet';
// import "leaflet/dist/leaflet.css";
import '~/assets/css/leaflet.css'

export default {
    props: {
        flyOvers: {
            type: Array,
            default: () => []
        },
        studentSpaces: {
            type: Array,
            default: () => []
        },
        buildings: {
            type: Array,
            default: () => []
        },
        overlays: {
            type: Array,
            default: () => []
        },
        spaceStyles: {
            type: Object,
            default: () => {}
        },

        dummy_studentSpaces: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            map: null,
            flyOvers_objects: [],
            studentSpaces_objects: [],
            buildings_objects: [],
            overlays_objects: [],

            LABEL_PRIMARY_RANGE_UPPER: 18,
            LABEL_PRIMARY_RANGE_LOWER: 17,
            
        }
    },
    mounted() {

        // This function first waits to make sure the map div exists
        // It then initialises the map
        // And calls all the functions to add the overlays, buildings, and student spaces
        this.initMap();
    },

    methods: {
        async initMap() {

            // Wait for the div to exist
            while (!document.getElementById('map')) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Set up basic map options
            let map = L.map('map', {
                zoomSnap: 0.25,
                zoomDelta: 0.25,
                maxZoom: 20,
                renderer: L.canvas({padding: 1})
            }).fitBounds([
                [53.345568, -6.259428],
                [53.341853, -6.249477]
            ]);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
                maxZoom:20
            }).addTo(map);

            // Check the zoom level, set it to >LABEL_PRIMARY_RANGE_LOWER if it's too high
            // This is to prevent the "Primary" label from being hidden
            if (map.getZoom() < this.LABEL_PRIMARY_RANGE_LOWER) {
                map.setZoom(this.LABEL_PRIMARY_RANGE_LOWER + 0.25);
            }

            // cheap debug object
            // Check for a debug flag in the URL
            if (window.location.href.includes("debug")){
                map.on('click', function(e) {
                    let cheapDebugObject = {
                        latlng: e.latlng,
                        bounds: map.getBounds(),
                        zoom: map.getZoom(),
                        center: map.getCenter()
                    }
            
                    console.log(cheapDebugObject);
                    
                });
            };

            // console.log('map', map);

            this.map = map;

            // Build the map features
            this.addJumpArrows();
            this.addOverlays();
            this.addBuildings();
            this.addZoomHandling();
            this.addStudentSpaces();
            this.addControlButtons();

            // Check if there's a building in the URL, and if so, fly to it
            this.checkForBuildingOrSpaceInURL();
        },

        checkForBuildingOrSpaceInURL(){

            // Check if there's a building in the URL, and if so, fly to it
            let url = window.location.href;
            const urlParams = new URL(url).searchParams;

            // Initialise check variable
            let buildingMatches = false;

            // First, check if there's a highlight parameter in the URL
            // if there isn't, we don't need to check any further
            if (!url.includes("highlight")) return;

            // Else, find the highlight parameter
            const highlight = urlParams.get('highlight');
            
            // if (highlight == feature.properties.canonical){

            // Loop through the buildings and check if the url contains the canonical name
            // Run buildings first, because if a building and a space share a canonical name, the building will be prioritised
            // Zooming to the building will also zoom to the space, so it's not a problem
            this.buildings.forEach(building => {
                if (highlight == building.canonical){
                    
                    // Dismiss the modals if they're open
                    // this.$emit('dismissModals');

                    // Get the center of the building to aim for
                    let center = this.getGeometricCenter(building.geometry.coordinates);

                    // Fly to the building at the correct zoom level
                    this.map.flyTo(center, this.LABEL_PRIMARY_RANGE_UPPER + 0.5);

                    buildingMatches = true;
                    
                }
            });
            
            // If a building was found, don't check for a space
            if (buildingMatches) return;
            
            // Loop through the student spaces and check if the url contains the canonical name
            this.studentSpaces.forEach(space => {
                if (highlight == space.canonical){
                    
                    // Dismiss the modals if they're open
                    // this.$emit('dismissModals');

                    // Fly to the building at the correct zoom level
                    this.map.flyTo(space.location, this.LABEL_PRIMARY_RANGE_UPPER + 0.5);
                    
                }
            });

        },

        // Add the overlays to the map eg main campus
        addOverlays() {
            // Go through each overlay and add it to the map
            // console.log('overlays', this.overlays)
            this.overlays.forEach(overlay => {
                this.overlays_objects.push( L.imageOverlay(overlay.url, overlay.bounds).addTo(this.map) );
            });
        },

        // Initialise handling of zoom for label management
        addZoomHandling(){

            let zoomGetter = () => {return this.map.getZoom()};
            let updateLabels = this.updateLabels;
            let zoomMax = this.LABEL_PRIMARY_RANGE_UPPER;
            let zoomMin = this.LABEL_PRIMARY_RANGE_LOWER;

            this.map.on('zoomend', function() {
                // console.log('zoomend');
                // console.log(zoomGetter());
                updateLabels(zoomGetter(), 
                zoomMin, 
                zoomMax);
            });

            // Update the labels on the map
            this.updateLabels(this.map.getZoom(), 
                zoomMin, 
                zoomMax);

        },

        // Add the buildings to the map
        addBuildings(){
            let building_geojsons = [];

            this.buildings.forEach(building => {
                try {
                    // Convert building to a valid GeoJSON object
                    let building_geojson = {
                        "type": "Feature",
                        "properties": {
                            "canonical": building.canonical,
                            "name": building.display_name,
                            "aka": building.aka,
                            "always_display": building.always_display || false,
                            "description": building.description,
                            "map_label_1": building.map_label_1,
                            "map_label_2": building.map_label_2,
                            "map_label_3": building.map_label_3,
                        },
                        "geometry": {
                            "coordinates": building.geometry.coordinates,
                            "type": "Polygon"
                        }
                    }
                    // Add the building to the array
                    // Check manually that there are actually coordinates in the array first though, otherwise it will crash
                    // And for some reason it isn't being caught by the try/catch
                    if (building.geometry.coordinates.length > 0)
                        building_geojsons.push(building_geojson);
                }
                catch (error) {
                    console.error("Error adding " + building.canonical + " to map")
                    console.error(error)
                }
            });

            // Need to use geojson group to avoid the mouseover event triggering on every building

            this.buildings_objects = L.geoJSON(building_geojsons, {
                style: this.buildingStyle,
                onEachFeature: this.onEachFeature
            }).addTo(this.map);

            this.addLabelsToMap();

        },

        // This function is just applied to every building, to give them all the same functionality eg modals and highlights
        onEachFeature(feature, layer) {
            // console.log('feature', feature);
            // console.log('layer', layer);
            
            this.addModalToBuilding(feature, layer);
            this.addHighlightToBuilding(feature, layer);

        },

        // Update the map labels based on the current zoom level
        updateLabels(currentZoom, zoomMin, zoomMax){
    
            var r = document.querySelector('html');
            // Outside this range, the "Primary" label is hidden 
            // and the "Secondary" (zoom > LOWER) or "Tertiary" (zoom < UPPER) label is shown
            if (currentZoom <= zoomMin){ 
                // console.log('currentZoom <= zoomMin');

                r.style.setProperty('--primary-label-opacity', '0');
                r.style.setProperty('--secondary-label-opacity', '0');
                r.style.setProperty('--tertiary-label-opacity', '1');

                r.style.setProperty('--sense-icon-opacity', '0');

            }
            else if (currentZoom >= zoomMax){ 
                // console.log('currentZoom >= zoomMax');

                r.style.setProperty('--primary-label-opacity', '1');
                r.style.setProperty('--secondary-label-opacity', '0');
                r.style.setProperty('--tertiary-label-opacity', '0');

                r.style.setProperty('--sense-icon-opacity', '1');

            }
            else { 
                // console.log('currentZoom in range');

                r.style.setProperty('--primary-label-opacity', '0');
                r.style.setProperty('--secondary-label-opacity', '1');
                r.style.setProperty('--tertiary-label-opacity', '0');

                r.style.setProperty('--sense-icon-opacity', '1');

            }
        },

        // Add a mouseover event to the building
        addHighlightToBuilding(feature, layer){
            let building = feature.properties;
            // console.log(layer);

            // Precalculate the styles, to avoid the issue with 'this'
            let highlightStyle = this.highlightFeature();
            let buildingStyle = this.buildingStyle(feature);
            
            // Localise the emitSpaceHover and emitSpaceUnhover functions, to avoid hassle with the 'this' keyword
            let emitSpaceHover = this.emitSpaceHover;
            let emitSpaceUnhover = this.emitSpaceUnhover;

            // Add the mouseover and mouseout events to the building
            layer.on('mouseover', function(e) { 
                // Highlight the feature that the mouse is over
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                    // layer.bringToFront();
                }
                // console.log("Mouseover event on " + building.canonical)
                e.target.setStyle(highlightStyle);

                // Add a popup of the building name
                emitSpaceHover(building.name);
            });

            layer.on('mouseout', function(e) { 
                // Reset the style, otherwise it will stay highlighted
                layer.setStyle(buildingStyle);
                emitSpaceUnhover();
            });
        },

        // Add a click event to the building, that emits the openModal event
        addModalToBuilding(feature, layer){

            // Get the building object
            let building = feature.properties;

            // Localise the emitOpenModal function, to avoid hassle with the 'this' keyword
            let emitOpenModal = this.emitOpenModal;

            // Add the modal
            layer.on('click', function (e){

                emitOpenModal("building", building);

            });
        },

        // Add the labels to the map over the buildings
        addLabelsToMap(){

            // Init variables
            let building = {};
            let primaryLabelContent = "";
            let secondaryLabelContent = "";
            let tertiaryLabelContent = "";

            for(let i = 0; i < this.buildings.length; i++){
                // Get the current building
                building = this.buildings[i];

                // Init the label content
                primaryLabelContent = "";
                secondaryLabelContent = "";
                tertiaryLabelContent = "";


                if (building.map_label_1 != null){
                    // Generate the content
                    primaryLabelContent = "<p align='center' class='primary-label'>" + building.map_label_1 + " </p>";
                    // Add it to the map
                    this.addToolTipToBuilding(building.geometry.coordinates, primaryLabelContent, map);
                    // layer.bindTooltip(primaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(map);
                }
                if (building.map_label_2 != null){
                    // Generate the content
                    secondaryLabelContent = "<p align='center'  class='secondary-label'>" + building.map_label_2 + " </p>";
                    // Add it to the map
                    this.addToolTipToBuilding(building.geometry.coordinates, secondaryLabelContent, map);
                    // layer.bindTooltip(secondaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();
                }
                // if (building.map_label_3 != null){
                //     // Generate the content
                //     tertiaryLabelContent = "<p align='center' class='tertiary-label'>" + building.map_label_3 + " </p>";
                //     // Add it to the map
                //     // addToolTipToBuilding(layer, tertiaryLabelContent);
                // }

            }

        },

        // Add a building tooltip to the map at the location of a polygon
        addToolTipToBuilding(building_coordinates, content, map){

            // Create a tooltip object with the given content and class
            let label = L.tooltip( {direction: "top", offset:[0,-20], opacity:1, permanent: true})
                .setContent(content);
            // Add it to the map at the given layer location
            label.setLatLng(this.getGeometricCenter(building_coordinates))
                .addTo(this.map)
                .openTooltip();

        },

        // Calculate the geometric center of a polygon
        getGeometricCenter(_coordinates){

            // Because geoJSON is a weird standard
            let coordinates = _coordinates[0];

            // Init the min and max values
            let min_lat = 180.0;
            let min_lng = 180.0;
            let max_lat = -180.0;
            let max_lng = -180.0;

            // Loop through the coordinates and find the min and max values
            coordinates.forEach(coordinate => {
                if (coordinate[1] < min_lat) min_lat = coordinate[1];
                if (coordinate[1] > max_lat) max_lat = coordinate[1];
                if (coordinate[0] < min_lng) min_lng = coordinate[0];
                if (coordinate[0] > max_lng) max_lng = coordinate[0];
            });

            // Calculate the geometric center
            let lat = (min_lat + max_lat) / 2;
            let lng = (min_lng + max_lng) / 2;

            // console.log([lat, lng])

            return [lat, lng];
        },

        // The default style for a building
        buildingStyle(feature, layer) {
            // Check for a display override url flag
            // If it exists, Draw red outlines instead of default style
            if (window.location.href.includes("outlines")){
                return {
                    fillColor: '#0087A2',
                    weight: 1,
                    opacity: 1,
                    color: '#FF0000',
                    dashArray: '0',
                    fillOpacity: 0,
                    noClip:true
                };
            }

            // Check the url for the building canonical, in which case we want to highlight it
            const urlParams = new URL(window.location.href).searchParams;
            const highlight = urlParams.get('highlight');
            
            if (highlight == feature.properties.canonical){

                return {
                    fillColor: "#E53397",
                    weight: 1,
                    opacity: 1,
                    color: '#E53397',
                    dashArray: '0',
                    fillOpacity: 0.5,
                    noClip:true
                };
            }

            return {
                fillColor: '#0087A2',
                weight: 1,
                opacity: 0,
                color: '#FCE891',
                dashArray: '0',
                fillOpacity: feature.properties.always_display ? 1 : 0,
                noClip:true
            };
        },

        // The style that's applied on highlight
        highlightFeature() {
            return {
                weight: 5,
                color: '#E53397',
                fillColor: '#E53397',
                fillOpacity: 1,
                opacity: 0.5
                
            };
        },

        // Add the student spaces to the map, categorised by type
        addStudentSpaces(){

            // Init an object to hold the sorted areas as arrays
            let areas_sorted = {};
            // Loop through the area types and add them to the object
            this.spaceStyles.forEach(area_type => {
                areas_sorted[area_type.styled_label] = [];
            });

            // Copy the area types array to a local variable
            let area_types = this.spaceStyles;

            // First we need to sort the areas into their respective groups
            this.studentSpaces.forEach(area => {

                // Figure out what the icon will be by matching the area type to the area type in the area_types array
                // TODO: Replace with composable for finding the icon that includes icon_override
                let icon_url = area_types.find(area_type => area_type.category == area.type).icon;
                let styled_label = area_types.find(area_type => area_type.category == area.type).styled_label;

                // Create the icon object
                // The className is used to make the icon fade in and out when the zoom changes
                let myIcon = L.icon({
                    iconUrl: icon_url, 
                    iconSize: [50, 50], 
                    className: "sense-icon",
                });

                // If the url contains the canonical name of the area, overwrite the icon with the highlighted version
                const urlParams = new URL(window.location.href).searchParams;
                const highlight = urlParams.get('highlight');
                
                if (highlight == area.canonical){
                    myIcon = L.icon({
                        iconUrl: icon_url, 
                        iconSize: [50, 50], 
                        className: "sense-icon",
                        shadowUrl: '/images/red-dot.png',
                        shadowSize: [60, 60],
                        // shadowAnchor: [22, 94]
                    });
                }

                // Create the marker object
                let marker = L.marker(area.location, {icon: myIcon, alt: area.name});

                let emitOpenModal = this.emitOpenModal;

                // Add a click event to the marker, that opens the modal
                marker.on('click', function (e){
                    // When the marker is clicked, emit the event to open the modal to display the area info

                    emitOpenModal("space", area);
                    // openAreaModal(area);
                });

                // Localise the emitSpaceHover and emitSpaceUnhover functions, to avoid hassle with the 'this' keyword
                let emitSpaceHover = this.emitSpaceHover;
                let emitSpaceUnhover = this.emitSpaceUnhover;

                // Add a mouseover event to the marker, that emits the spaceHover event
                marker.on('mouseover', function (e){
                    emitSpaceHover(area.type + ": " + area.name);
                });
                // Add a mouseout event to the marker, that emits the spaceUnhover event
                marker.on('mouseout', function (e){
                    emitSpaceUnhover();
                });



                if (styled_label in areas_sorted){
                    areas_sorted[styled_label].push(marker);
                }
            });

            // Repeat for the dummy spaces, but without any interaction
            this.dummy_studentSpaces.forEach(area => {

                // Figure out what the icon will be by matching the area type to the area type in the area_types array
                let icon_url = area_types.find(area_type => area_type.category == area.type).icon;
                let styled_label = area_types.find(area_type => area_type.category == area.type).styled_label;

                // Create the icon object
                // The className is used to make the icon fade in and out when the zoom changes
                let myIcon = L.icon({
                    iconUrl: icon_url, 
                    iconSize: [50, 50], 
                    className: "sense-icon",
                });

                // Create the marker object, pushing the click through to the building behind
                let marker = L.marker(area.location, {
                    icon: myIcon, 
                    alt: area.name,
                    interactive: false,
                });

                if (styled_label in areas_sorted){
                    areas_sorted[styled_label].push(marker);
                }
            });

            let areas_grouped = [];

            // Now transform the arrays into layer group objects
            // and add them to the map
            for (const [key, value] of Object.entries(areas_sorted)) {
                areas_grouped.push(L.layerGroup(value).addTo(this.map));
            }
            
            // Create an object to hold the layer groups for the control
            let areas_grouped_object = {};
            // Loop through the layer groups and add them to the object
            areas_grouped.forEach((layer_group, index) => {
                areas_grouped_object[area_types[index].styled_label] = layer_group;
            });

            // Copy the local variable to the global variable
            this.studentSpaces_objects = areas_grouped_object;

            // Add the layer groups to the map controls
            this.addLayerControl();
            // Add the popups to the student spaces
            // this.addPopupsToStudentSpaces(areas_sorted);
        },

        // Allows for icons to be placed on the map without a corresponding student space
        // For decorative purposes
        addDummyStudentSpaces(){},

        // Emit the various openModal events
        emitOpenModal(type, building_or_space){
            // Method for emtting the openmodal event for the legend, building, or space modal
            if (type == "building"){
                this.$emit('openBuildingModal', building_or_space);
            }
            else if (type == "space"){
                this.$emit('openSpaceModal', building_or_space);
            }
            else if (type == "legend"){
                console.log('openLegendModal')
                this.$emit('openLegendModal', null);
            }
        },

        // Emit that a space is being hovered over
        emitSpaceHover(space){
            this.$emit('spaceHover', space);
            console.log('spaceHover', space)
        },
        // Emit that a space is no longer being hovered over
        emitSpaceUnhover(){
            this.$emit('spaceUnhover');
        },

        // Add the layer selector to the UI
        addLayerControl(){

            let layers = L.control({position:"topright"});
    
            layers = L.control.layers(null, this.studentSpaces_objects);
            
            layers.addTo(this.map);
        },

        // Add anciallary buttons to the UI
        addControlButtons(){

        let info = L.control({position:"bottomleft"});
        let search = L.control({position:"bottomright"});

        // Localise the the openModal function, to avoid hassle with the 'this' keyword
        let openLegendModal = this.emitOpenModal;


        //Info Box and Main Campus Button
        info.onAdd = function () {

            this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
            this.button.value = "Legend";
            this.button.innerHTML = '<button type="button" class="btn btn-dark border border-dark" style="margin-top:0">Legend</button>';
            // this.button.innerHTML += '<button type="button" id="mainCampusButton" disabled class="btn btn-outline-primary btn-sm" onclick="flyHome()" style="display: none; margin-top:0; margin-left:0.5rem;">Main Campus</button>';
            this.button.style = "padding:0;"

            this.button.onclick = function(){
                openLegendModal("legend", null);
            }

            return this.button;
        };

        // Add a click event to the info button, that opens the legend modal
        // info.on('click', function (e){
        //     openLegendModal;
        // });

        //Link to Search
        search.onAdd = function () {

            this.button = L.DomUtil.create('div', 'search'); // create a div with a class "info"
            this.button.value = "Search";
            this.button.innerHTML = '<a role="button" href="/info" class="btn btn-dark " style="margin-top:0; ">Search</button>';
            this.button.style = "padding:0;"

            return this.button;
        };


        info.addTo(this.map);
        search.addTo(this.map);
        },

        // Add the overworld fast travel jump arrows to the map
        addJumpArrows(){
            // Go through each flyover and add a jump arrow
            this.flyOvers.forEach(flyOver => {

                let width = 0.0002
                let height = 0.0003

                // console.log('flyOver', flyOver);

                // Calculate the center point of flyover.target
                let targetCenter = {
                    lat: (flyOver.target[0][0] + flyOver.target[1][0]) / 2,
                    lng: (flyOver.target[0][1] + flyOver.target[1][1]) / 2
                };

                // Calculate the angle between targetCenter and flyover.location
                let angle = Math.atan2(flyOver.location[1] - targetCenter.lng, flyOver.location[0] - targetCenter.lat) * (180 / Math.PI);
                // Round to the nearest 30 degrees
                angle = Math.round(angle / 30) * 30;
                // If the angle is negative, add 360 to make it positive
                if (angle < 0) angle += 360;

                // console.log('angle', angle);

                // Add an image overlay to the map with the image corresponding to the angle
                let jumpArrow = L.imageOverlay(`/images/Chevrons/Chevron-${angle}.svg`, [
                    [flyOver.location[0] - width, flyOver.location[1] - height],
                    [flyOver.location[0] + width, flyOver.location[1] + height]
                ], {
                    interactive: true,
                    zIndex: 1000
                })
                
                // Add a click event to the jump arrow, that flys to the target
                jumpArrow.on('click', () => {
                    this.map.flyToBounds(flyOver.target);
                });

                // Add a label to the jump arrow
                let content = "<p align='center'  class='flyover-label'>" + flyOver.label + " </p>"
                let label = L.tooltip( {direction: "bottom", offset:[0,0], opacity:1, permanent: true})
                    .setContent(content);

                // Add it to the map at the given layer location
                label.setLatLng([flyOver.location[0], flyOver.location[1]])
                    .addTo(this.map)
                    .openTooltip();
                
                jumpArrow.addTo(this.map);

                // Create an icon for the jump arrow with the class corresponding to the angle
                // let jumpArrowIcon = L.icon({
                //     iconUrl: `/images/Chevrons/Chevron-${angle}.png`,
                //     iconSize: [50, 50],
                //     iconAnchor: [25, 25]
                // });

                // Create a jump arrow at the location of flyover.location
                // Using the drawChevron function to calculate the points of the chevron
                // let jumpArrow = L.polygon(this.drawChevron(flyOver.location[0], flyOver.location[1], angle, 0.0001), {
                //     color: 'red',
                //     fillColor: 'pink',
                //     fillOpacity: 1,
                //     weight: 1,
                //     interactive: false
                // }).addTo(this.map);

                // Create a jump arrow at the location of flyover.location
                // with the jumpArrowIcon
                // let jumpArrow = L.marker(flyOver.location, {
                //     icon: jumpArrowIcon,
                // }).addTo(this.map);

            });

        },

        // TODO:Calculate the points of a chevron given a center point, angle, and size
        drawChevron(cx, cy, angle, size) {
            // Define the base length and height of the chevron
            // let base = 10 * size;
            // let height = 3 * size;

            // Chevron pattern is 
            // [ 0, 4]
            // [ 4, 1]
            // [ 4,-4]
            // [ 0,-1]
            // [-4,-4]
            // [-4, 1]

            // Set up our basis vectors for the rotated coordinate system
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            let y = [cos * size, sin * size];
            let x = [-sin * size, cos * size];

            let units = [x, y];
            // console.log('units', units);

            // Define some linear algebra functions, because I'm too lazy to find a library
            // Define a function to add two vectors
            let sum = (a, b) => {
                return [a[0] + b[0], a[1] + b[1]];
            };
            // Get the dot product of two vectors
            let dot = (a, b) => {
                return a[0] * b[0] + a[1] * b[1];
            };
            // Scale a vector by a scalar
            let scaler = (a, b) => {
                // console.log('scaler', a, b);
                // console.log([a * b[0], a * b[1]]);
                return [a * b[0], a * b[1]];
            };

            // Calculate the offset six corners of the polygon
            // To calculate the shape, we need to add the correct amount of each basis vector to the centre point
            let p1 = sum(scaler(0, x), scaler(4, y));
            let p2 = sum(scaler(4, x), scaler(1, y));
            let p3 = sum(scaler(4, x), scaler(-4, y));
            let p4 = sum(scaler(0, x), scaler(-1, y));
            let p5 = sum(scaler(-4, x), scaler(-4, y));
            let p6 = sum(scaler(-4, x), scaler(1, y));

            // Then add those offsets to the centre point
            let chevron = [p1, p2, p3, p4, p5, p6].map(p => {
                return [p[0] + cx, p[1] + cy];
            });

            // Return the array of points
            // console.log(chevron)
            return chevron;
        },

    }

    
};
</script>

<style>
#map {
    height: 100dvh; /* dvh is important for some reason. Leaflet really doesn't like vh */
}

/* Styles for rotating a jump arrow */

.jump-arrow-0 {
    transform: rotate(0deg);
}

.jump-arrow-30 {
    transform: rotate(30deg);
}

.jump-arrow-60 {
    transform: rotate(60deg);
}

.jump-arrow-90 {
    transform: rotate(90deg);
}

.jump-arrow-120 {
    transform: rotate(120deg);
}

.jump-arrow-150 {
    transform: rotate(150deg);
}

.jump-arrow-180 {
    transform: rotate(180deg);
}

.jump-arrow-210 {
    transform: rotate(210deg);
}

.jump-arrow-240 {
    transform: rotate(240deg);
}

.jump-arrow-270 {
    transform: rotate(270deg);
}

.jump-arrow-300 {
    transform: rotate(300deg);
}

.jump-arrow-330 {
    transform: rotate(330deg);
}



</style>
