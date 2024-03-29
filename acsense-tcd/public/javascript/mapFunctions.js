function getAppropriateInitialView(config) {
    // Check if the device is mobile (by checking if the screen is portrait)
    // If so, return the mobile view
    // Otherwise, return the web view
    if (window.innerHeight > window.innerWidth) {
        return config.INTIAL_VIEW_MOBILE;
    }
    return config.INTIAL_VIEW_WEB;
}

async function addOverlays(supabase_client, _map){
    // let bounds = [
    //     [53.345891563474524, -6.247142876377488],
    //     [53.341642339905164, -6.261688887313245]
    // ];
    let overlays = [];
    // overlays.push( L.imageOverlay('images/Overworld_1.svg', bounds).addTo(map));
    // overlays.push( L.imageOverlay('images/Overworld_terrain.svg', bounds));

    // Get the overlays from the database
    let { data: overlays_arr, error } = await supabase_client
        .from('overlays')
        .select('*')

    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // Once we have the overlays, add them to the map
        // And add them to the array to return
        overlays_arr.forEach(overlay => {
            // console.log(overlay)
            overlays.push( L.imageOverlay(overlay.url, overlay.bounds).addTo(_map) );
        });
    }

    return overlays;
}


function addMovementPaths(){
    console.log("addMovementPaths() not implemented yet");
}


async function addBuildings(supabase_client, map){

    // Empty array to hold the layer groups
    let building_geojsons = [];
    // Get buildings from supabase
    let { data: bld, error } = await supabase_client
        .from('buildings')
        .select('canonical, display_name, always_display, aka, description, map_label_1, map_label_2, map_label_3, geometry')

    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // console.log(bld)
        // Loop through buildings
        bld.forEach(building => {
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

        var buildings_geojson_array = L.geoJSON(building_geojsons, {
            style: buildingStyle,
            onEachFeature: onEachFeature
        }).addTo(map);

        // global_buildings = buildings_geojson_array;

        // Add their labels
        addLabelsToMap(map, bld);

        return buildings_geojson_array;
    }
    
}

/**
 * Runs on each feature in the GeoJSON layer
 * Adds the label and modal to the building
 * And adds the highlight effect on mouseover
 * @param {L.feature} feature 
 * @param {L.layer} layer 
 */
function onEachFeature(feature, layer) {
    // Check for the url param nointeraction and if it exists, don't add the label or modal
    if (!window.location.href.includes("nointeraction")){
        addModalToBuilding(feature, layer);
        addHighlightToBuilding(feature, layer);
    }
    else if(window.location.href.includes("servicekey")){
        let serviceKey = window.location.href.split("servicekey=")[1];
        updateOnMove(feature, layer, serviceKey);

    }
}


function addHighlightToBuilding(feature, layer){
    let building = feature.properties;
    // console.log(layer);

    layer.on('mouseover', function(e) { 
        // Highlight the feature that the mouse is over
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            // layer.bringToFront();
        }
        console.log("Mouseover event on " + building.canonical)
        e.target.setStyle(highlightFeature());
    });
    layer.on('mouseout', function(e) { 
        // Reset the style, otherwise it will stay highlighted
        layer.setStyle(buildingStyle(feature));
    });
};

function buildingStyle(layer) {
    // console.log(layer.properties)
    // if (layer.properties.always_display) console.log(layer);
    // else console.log(layer.properties.canonical + " not always display");

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

    return {
        fillColor: '#0087A2',
        weight: 1,
        opacity: 0,
        color: '#FCE891',
        dashArray: '0',
        fillOpacity: layer.properties.always_display ? 1 : 0,
        noClip:true
    };
}

function highlightFeature(e) {
    return {
        weight: 5,
        color: '#E53397',
        fillColor: '#E53397',
        fillOpacity: 1,
        opacity: 0.5
        
    };
}

function updateLabels(currentZoom, zoomMin, zoomMax){
    
    var r = document.querySelector('html');
    // Outside this range, the "Primary" label is hidden 
    // and the "Secondary" (zoom > LOWER) or "Tertiary" (zoom < UPPER) label is shown
    if (currentZoom <= zoomMin){ 

        r.style.setProperty('--primary-label-opacity', '0');
        r.style.setProperty('--secondary-label-opacity', '0');
        r.style.setProperty('--tertiary-label-opacity', '1');

        r.style.setProperty('--sense-icon-opacity', '0');

    }
    else if (currentZoom >= zoomMax){ 

        r.style.setProperty('--primary-label-opacity', '1');
        r.style.setProperty('--secondary-label-opacity', '0');
        r.style.setProperty('--tertiary-label-opacity', '0');

        r.style.setProperty('--sense-icon-opacity', '1');

    }
    else { 

        r.style.setProperty('--primary-label-opacity', '0');
        r.style.setProperty('--secondary-label-opacity', '1');
        r.style.setProperty('--tertiary-label-opacity', '0');

        r.style.setProperty('--sense-icon-opacity', '1');

    }
}

// Loop over the buildings and add the labels to the map at their geometric center
function addLabelsToMap(map, buildings){

    // Init variables
    let building = {};
    let primaryLabelContent = "";
    let secondaryLabelContent = "";
    let tertiaryLabelContent = "";

    for(let i = 0; i < buildings.length; i++){
        // Get the current building
        building = buildings[i];

        // Init the label content
        primaryLabelContent = "";
        secondaryLabelContent = "";
        tertiaryLabelContent = "";


        if (building.map_label_1 != null){
            // Generate the content
            primaryLabelContent = "<p align='center' class='primary-label'>" + building.map_label_1 + " </p>";
            // Add it to the map
            addToolTipToBuilding(building.geometry.coordinates, primaryLabelContent, map);
            // layer.bindTooltip(primaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(map);
        }
        if (building.map_label_2 != null){
            // Generate the content
            secondaryLabelContent = "<p align='center'  class='secondary-label'>" + building.map_label_2 + " </p>";
            // Add it to the map
            addToolTipToBuilding(building.geometry.coordinates, secondaryLabelContent, map);
            // layer.bindTooltip(secondaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();
        }
        if (building.map_label_3 != null){
            // Generate the content
            tertiaryLabelContent = "<p align='center' class='tertiary-label'>" + building.map_label_3 + " </p>";
            // Add it to the map
            // addToolTipToBuilding(layer, tertiaryLabelContent);
        }
    }

}

function addModalToBuilding(feature, layer){

    let building = feature.properties;
    // console.log(building)

    // building.geometry.bindTooltip(tertiaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();

    // Add the modal
    layer.on('click', function (e){

        console.log("Building clicked");

        let modal_aka = '<p><em>Also known as: ' + building.aka + '</em></p>';
        let modal_Description = '<p><b>Description</b><br>' + building.description + '</p>';


        let modal_info_button = {
            text: "More Info",
            link: `/info/${building.canonical}`,
            // disabled: !feature.properties.infoPageEnabled
        }
        
        // let modal_map_button = {
        //     text: "Library Map",
        //     link: feature.properties.libraryMapLink, //Temporary for launch
        //     // link: `/map/${feature.properties.bldID}`,
        //     disabled: !feature.properties.mapped
        // }
          
        let modal_content = "";
        
        if (building.aka != "" && building.aka != "null" && building.aka != null){
            modal_content += modal_aka;
        }
        
        modal_content += modal_Description;


        let modal_buttons_array = [modal_info_button];

        // if (feature.properties.mapped){
        //     modal_buttons_array.push(modal_map_button);
        // }

        openInfoModal(building.name, modal_content, modal_buttons_array);

    });
}

function addToolTipToBuilding(building_coordinates, content, map){

    // Create a tooltip object with the given content and class
    let label = L.tooltip( {direction: "top", offset:[0,-20], opacity:1, permanent: true})
        .setContent(content);
    // Add it to the map at the given layer location
    label.setLatLng(getGeometricCenter(building_coordinates))
        .addTo(map)
        .openTooltip();

}

function getGeometricCenter(_coordinates){

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
}

// function getSensoryAreaTitle(area){
//     let key = {
//         "Social Space": ["🟡","😄"],
//         "Study Space": ["🔵","📚"], 
//         "Respite Room": ["🟠","🧡"],
//         "Quiet Space": ["🟣","🌺"],  
//     }

//     let _colour = key[area.type][0];
//     let _emoji = key[area.type][1];

//     return `${_colour} ${area.Name} ${_emoji}`;

// }
/**
 * 
 * @param {boolean} [clickable=true] Whether or not the areas should be clickable 
 * @returns 
 */
async function addSensoryAreas(supabase_client, map, clickable = true){

    // Get the student spaces from the database
    let areas = await getAreas(supabase_client);

    // Get the area types from the database
    let area_types = await getAreaStyles(supabase_client);
    // console.log(area_types)

    // Init an object to hold the sorted areas as arrays
    let areas_sorted = {};
    // Loop through the area types and add them to the object
    area_types.forEach(area_type => {
        areas_sorted[area_type.styled_label] = [];
    });

    // First we need to sort the areas into their respective groups
    areas.forEach(area => {

        // Figure out what the icon will be by matching the area type to the area type in the area_types array
        let icon_url = area_types.find(area_type => area_type.category == area.type).icon;
        let styled_label = area_types.find(area_type => area_type.category == area.type).styled_label;

        // Create the icon object
        // The className is used to make the icon fade in and out when the zoom changes
        let myIcon = L.icon({
            iconUrl: icon_url, 
            iconSize: [50, 50], 
            className: "sense-icon"
        });

        // Create the marker object
        let marker = L.marker(area.location, {icon: myIcon, alt: area.name});

        // Unless disabled, Add the onclick modal
        if (clickable){
            marker.on('click', function (e){
                // When the marker is clicked, open the modal to display the area info
                openAreaModal(area);
            });
        }


        if (styled_label in areas_sorted){
            areas_sorted[styled_label].push(marker);
        }
    });

    let areas_grouped = [];

    // Now transform the arrays into layer group objects
    // and add them to the map
    for (const [key, value] of Object.entries(areas_sorted)) {
        areas_grouped.push(L.layerGroup(value).addTo(map));
    }
    
    // Create an object to hold the layer groups for the control
    let areas_grouped_object = {};
    // Loop through the layer groups and add them to the object
    areas_grouped.forEach((layer_group, index) => {
        areas_grouped_object[area_types[index].styled_label] = layer_group;
    });

    // Add the layer groups to the map controls
    console.log(areas_grouped_object)
    addLayerControl(areas_grouped_object, map);

    // Return an array of layer groups
    return areas_grouped;

}
/**
 * Retrieves the styles from the database
 * @async
 * @returns {JSON} The styles from the database
 */
async function getAreaStyles(supabase_client){

    let {data, error} = await supabase_client.from('space_styles').select('*');
    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // For each space style, add a styled layer group label
        data.forEach(space_style => {
            space_style.styled_label = createStyledLayerGroupLabel(space_style.category, data);
        });

        return data;
    }

}

/**
 * Retrieves the Student Spaces from the database
 * @async
 * @returns {JSON} The spaces from the database
 */
async function getAreas(supabase_client){

    let {data, error} = await supabase_client.from('spaces').select('*');
    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // console.log(spaces)
        return data;
    }

}



function makeLayerArray(area_types, sensory_areas) {

    // Prepare the selectables array
    // 
    
}

function addControlButtons(map){

    // console.log("adding controls")
    // Add the controls to the map
    let info = L.control({position:"bottomleft"});
    let search = L.control({position:"bottomright"});
    

    //Info Box and Main Campus Button
    info.onAdd = function (map) {

        this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.button.value = "i";
        this.button.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#welcomeModal" style="margin-top:0">i</button>';
        // this.button.innerHTML += '<button type="button" id="mainCampusButton" disabled class="btn btn-outline-primary btn-sm" onclick="flyHome()" style="display: none; margin-top:0; margin-left:0.5rem;">Main Campus</button>';
        this.button.style = "padding:0;"

        return this.button;
    };

    //Link to Search
    search.onAdd = function (map) {

        this.button = L.DomUtil.create('div', 'search'); // create a div with a class "info"
        this.button.value = "i";
        this.button.innerHTML = '<a role="button" href="/info" class="btn btn-primary" style="margin-top:0; ">Search</button>';
        this.button.style = "padding:0;"

        return this.button;
    };

    
    info.addTo(map);
    search.addTo(map);
}

function addLayerControl(area_types, map){
    
    let layers = L.control({position:"topright"});
    
    layers = L.control.layers(null, area_types);
    
    layers.addTo(map);
}

function createStyledLayerGroupLabel(area_type, area_styles){
    // Take in space type and the space styles array
    // Return the styled layer group label

    let area_colour = area_styles.find(area_style => area_style.category == area_type).colour;

    // Create the label
    return `<span class="position-relative">` +
                    `<span class="position-absolute top-50 start-0 translate-middle ms-3 p-2 border border-dark rounded-circle" style="background-color: ${area_colour};"> </span>` +
                    `<span class="ms-1 ps-4">${area_type}</span>` +
                `</span>`
        

}

// ---------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------//
// Debugging stuff
