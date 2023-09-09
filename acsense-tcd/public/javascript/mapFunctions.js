function getAppropriateInitialView() {
    // Check if the device is mobile (by checking if the screen is portrait)
    // If so, return the mobile view
    // Otherwise, return the web view
    if (window.innerHeight > window.innerWidth) {
        return INTIAL_VIEW_MOBILE;
    }
    return INTIAL_VIEW_WEB;
}

function addOverlays(){
    let bounds = [
        [53.34586316412621, -6.247154474258424],
        [53.341654914498974, -6.261670589447022]
    ];
    let overlays = [];
    overlays.push( L.imageOverlay('images/Overworld_1.svg', bounds).addTo(map));
    // overlays.push( L.imageOverlay('images/Overworld_terrain.svg', bounds));

    return overlays;
}


function addMovementPaths(){
    console.log("addMovementPaths() not implemented yet");
}


async function addBuildings(){

    // Empty array to hold the layer groups
    let building_geojsons = [];
    // Get buildings from supabase
    let { data: bld, error } = await this.supabase
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
    }
    
}

function onEachFeature(feature, layer) {
    addLabelAndModalToBuilding(feature, layer);
    addHighlightToBuilding(feature, layer);
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
        if (DEBUG) console.log("tertiary Label active");

    }
    else if (currentZoom >= zoomMax){ 

        r.style.setProperty('--primary-label-opacity', '1');
        r.style.setProperty('--secondary-label-opacity', '0');
        r.style.setProperty('--tertiary-label-opacity', '0');
        if (DEBUG) console.log("primary Label active");

    }
    else { 

        r.style.setProperty('--primary-label-opacity', '0');
        r.style.setProperty('--secondary-label-opacity', '1');
        r.style.setProperty('--tertiary-label-opacity', '0');
        if (DEBUG) console.log("secondary Label active");

    }
}

function addLabelAndModalToBuilding(feature, layer){

    let building = feature.properties;
    // console.log(building)

    // console.log(feature)
    // console.log(layer)

    // Add the labels
    let primaryLabelContent = "";
    let secondaryLabelContent = "";
    let tertiaryLabelContent = "";

    if (building.map_label_1 != null){
        // Generate the content
        primaryLabelContent = "<p align='center' class='primary-label'>" + building.map_label_1 + " </p>";
        // Add it to the map
        addToolTipToBuilding(layer, primaryLabelContent);
        // layer.bindTooltip(primaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(map);
    }
    if (building.map_label_2 != null){
        // Generate the content
        secondaryLabelContent = "<p align='center'  class='secondary-label'>" + building.map_label_2 + " </p>";
        // Add it to the map
        addToolTipToBuilding(layer, secondaryLabelContent);
        // layer.bindTooltip(secondaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();
    }
    if (building.map_label_3 != null){
        // Generate the content
        tertiaryLabelContent = "<p align='center' class='tertiary-label'>" + building.map_label_3 + " </p>";
        // Add it to the map
        // addToolTipToBuilding(layer, tertiaryLabelContent);
    }

    
    
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

function addToolTipToBuilding(layer, content){

    // Create a tooltip object with the given content and class
    let label = L.tooltip( {direction: "top", offset:[0,-20], opacity:1, permanent: true})
        .setContent(content);
    // Add it to the map at the given layer location
    label.setLatLng(layer.getBounds().getCenter())
        .addTo(map)
        .openTooltip();

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

function addSensoryAreas(){
    let areas = [
        {
            "Name": "SU Kitchen",
            "type": "Social Space",
            "Description": "Kitchen available to all",
            "capacity": 0,
            "electrical_outlets": true,
            "food_drink_allowed": true,
            "indoors": true,
            "wheelchair_accessible": false,
            "kettle": true,
            "microwave": true,
            "coordinates": [53.34462, -6.25889 ],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/fada674505fcc8875fe2a99d47ca15b8.png",
        },
        {
            "Name": "College Health Respite Room",
            "type": "Respite Room",
            "Description": "The Respite Room can be accessed by asking the building receptionist for the keys, you can also book them online at https://www.tcd.ie/disability/support-and-resources/respite-space/",
            "capacity": 0,
            "electrical_outlets": true,
            "food_drink_allowed": false,
            "indoors": true,
            "wheelchair_accessible": true,
            "kettle": false,
            "microwave": false,
            "coordinates": [53.34501, -6.25536],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/b6a89a5c93184bc6c7ebfa4d9f1a3e95.png",
        },
        {
            "Name": "Wild Garden Seating",
            "type": "Quiet Space",
            "Description": "This is located between College Park and the Rugby Pitch and has semi-circular seating for a small group.",
            "capacity": 4,
            "electrical_outlets": false,
            "food_drink_allowed": true,
            "indoors": false,
            "wheelchair_accessible": false,
            "kettle": false,
            "microwave": false,
            "coordinates": [53.34342, -6.252797 ],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/af336358b4f02d197667d15237723ff0.png",
        },
        {
            "Name": "Sports Centre Respite Room",
            "type": "Respite Room",
            "Description": "The Respite Room can be accessed by asking the building receptionist for the keys, you can also book them online at https://www.tcd.ie/disability/support-and-resources/respite-space/",
            "capacity": 0,
            "electrical_outlets": false,
            "food_drink_allowed": false,
            "indoors": true,
            "wheelchair_accessible": true,
            "kettle": false,
            "microwave": false,
            "coordinates": [53.34406, -6.25008 ],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/b6a89a5c93184bc6c7ebfa4d9f1a3e95.png",
        },
        {
            "Name": "AAP Cafe",
            "type": "Social Space",
            "Description": "Small cafe with seating, coffee and snacks",
            "capacity": 0,
            "electrical_outlets": false,
            "food_drink_allowed": true,
            "indoors": true,
            "wheelchair_accessible": true,
            "kettle": false,
            "microwave": false,
            "coordinates": [53.34482, -6.25502 ],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/fada674505fcc8875fe2a99d47ca15b8.png",
        },
        {
            "Name": "Freeman Library",
            "type": "Study Space",
            "Description": "Library only available to Geo-sciences students",
            "capacity": 0,
            "electrical_outlets": false,
            "food_drink_allowed": false,
            "indoors": true,
            "wheelchair_accessible": false,
            "kettle": false,
            "microwave": false,
            "coordinates": [53.3439, -6.25507 ],
            "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/890ea12ae6439456c7d985a0996d5beb.png",
        },
    ]

    let areas_sorted = {
        "Social Space": [],
        "Study Space": [],
        "Respite Room": [],
        "Quiet Space": [],
    };

    // First we need to sort the areas into their respective groups
    areas.forEach(area => {

        let myIcon = L.icon({iconUrl: area.url, iconSize: [50, 50]});

        let marker = L.marker(area.coordinates, {icon: myIcon});
        marker.on('click', function (e){

            openAreaModal(area);

        });

        if (area.type in areas_sorted){
            areas_sorted[area.type].push(marker);
        }
    });

    let areas_grouped = [];
    // Now transform the arrays into layer group objects
    // and add them to the map
    for (const [key, value] of Object.entries(areas_sorted)) {
        areas_grouped.push(L.layerGroup(value).addTo(map));
    }
    
    // Return an array of layer groups
    return areas_grouped;

}

function addControls(_map, selectables){

    console.log("adding controls")
    // Add the controls to the map
    let info = L.control({position:"bottomleft"});
    let search = L.control({position:"bottomright"});
    let layers = L.control({position:"topright"});

    //Info Box and Main Campus Button
    info.onAdd = function (_map) {

        this.button = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.button.value = "i";
        this.button.innerHTML = '<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#welcomeModal" style="margin-top:0">i</button>';
        // this.button.innerHTML += '<button type="button" id="mainCampusButton" disabled class="btn btn-outline-primary btn-sm" onclick="flyHome()" style="display: none; margin-top:0; margin-left:0.5rem;">Main Campus</button>';
        this.button.style = "padding:0;"

        return this.button;
    };

    //Link to Search
    search.onAdd = function (_map) {

        this.button = L.DomUtil.create('div', 'search'); // create a div with a class "info"
        this.button.value = "i";
        this.button.innerHTML = '<a role="button" href="/info" class="btn btn-primary" style="margin-top:0; ">Search</button>';
        this.button.style = "padding:0;"

        return this.button;
    };

    layers = L.control.layers(null, selectables);
    
    layers.addTo(_map);
    info.addTo(_map);
    search.addTo(_map);
}


// ---------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------//
// Debugging stuff
