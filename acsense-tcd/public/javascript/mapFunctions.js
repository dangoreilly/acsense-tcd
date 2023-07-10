function getAppropriateInitialView() {
    // Check if the device is mobile (by checking if the screen is portrait)
    // If so, return the mobile view
    // Otherwise, return the web view
    if (window.innerHeight > window.innerWidth) {
        return INTIAL_VIEW_MOBILE;
    }
    return INTIAL_VIEW_WEB;
}

function addOverlays(map){
    let bounds = [
        [53.34586316412621, -6.247154474258424],
        [53.341654914498974, -6.261670589447022]
    ];
    let overlays = [];
    overlays.push( L.imageOverlay('images/Overworld_1.svg', bounds).addTo(map));
    overlays.push( L.imageOverlay('images/Overworld_terrain.svg', bounds));

    return overlays;
}


function addMovementPaths(map){
    console.log("addMovementPaths() not implemented yet");
}


function addBuildings(map){

    let artsBlock = {
        "name": "Arts Building",
        "aka": "Arts Block",
        "buildingId": "arts-building",
        "description": "The Arts Building contains many large lecture theatres on the ground floor as well as seating areas and a coffee shop. There are a range of different department located on the upper floors along with various seminar rooms, classrooms and offices. ",
        "geometry": null,
        "primaryMapLabel": "Arts Building1",
        "secondaryMapLabel": "Arts Building2",
        "tertiaryMapLabel": "Arts Building3",
    }
    // Hardcoded arts block
    artsBlock.geometry = L.polygon([
        {lat: 53.34355252139788, lng: -6.257875263690949},
        {lat: 53.343541312153604, lng: -6.257419288158418},
        {lat: 53.34339078773066, lng: -6.257430016994477},
        {lat: 53.34339078773066, lng: -6.257330775260926},
        {lat: 53.34342601689857, lng: -6.257328093051911},
        {lat: 53.343422814248136, lng: -6.257156431674958},
        {lat: 53.343381179770724, lng: -6.25716045498848},
        {lat: 53.343377977116916, lng: -6.257041096687318},
        {lat: 53.343176209443094, lng: -6.257057189941407},
        {lat: 53.343152189418355, lng: -6.256181448698044},
        {lat: 53.3431153586874, lng: -6.25618413090706},
        {lat: 53.34311696002419, lng: -6.256235092878343},
        {lat: 53.34300166362171, lng: -6.2562377750873575},
        {lat: 53.34300486630377, lng: -6.256292760372163},
        {lat: 53.3429840488661, lng: -6.256292760372163},
        {lat: 53.3429680354456, lng: -6.2563370168209085},
        {lat: 53.34293440724294, lng: -6.2563490867614755},
        {lat: 53.34294081261692, lng: -6.2565623223781595},
        {lat: 53.3429095864097, lng: -6.256606578826905},
        {lat: 53.34291439044307, lng: -6.25679299235344},
        {lat: 53.34298565020783, lng: -6.256882846355439},
        {lat: 53.34296483276077, lng: -6.256906986236573},
        {lat: 53.34296723477439, lng: -6.257062554359437},
        {lat: 53.34299525825687, lng: -6.257089376449586},
        {lat: 53.342993656915525, lng: -6.257129609584809},
        {lat: 53.34301687635933, lng: -6.257156431674958},
        {lat: 53.34302168038062, lng: -6.25747561454773},
        {lat: 53.34305050449693, lng: -6.2574729323387155},
        {lat: 53.343051305166554, lng: -6.257537305355073},
        {lat: 53.343092139297205, lng: -6.257569491863252},
        {lat: 53.34309293996607, lng: -6.257640570402145},
        {lat: 53.34310895333965, lng: -6.257653981447221},
        {lat: 53.34311776069258, lng: -6.257950365543366},
        {lat: 53.34314658474395, lng: -6.257947683334351},
        {lat: 53.34314738541177, lng: -6.257999986410142},
        {lat: 53.34317300677391, lng: -6.258024126291276},
        {lat: 53.343173807441225, lng: -6.258076429367065},
        {lat: 53.34320743545506, lng: -6.258072406053544},
        {lat: 53.34320263145471, lng: -6.257942318916322},
        {lat: 53.34324346544045, lng: -6.257939636707307},
        {lat: 53.34324346544045, lng: -6.257885992527009}
    ], buildingStyle()).addTo(map);

    addLabelAndModalToBuilding(artsBlock, map);
    addHighlightToBuilding(artsBlock, map);
    
}

function addHighlightToBuilding(building, map){

    map.on('mouseover', function(e) { 
        // Highlight the feature that the mouse is over
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            building.geometry.bringToFront();
        }
        building.geometry.setStyle(highlightFeature());
    });
    map.on('mouseout', function(e) { 
        // Reset the style, otherwise it will stay highlighted
        building.geometry.setStyle(buildingStyle());
    });
};

function buildingStyle() {

    return {

        fillColor: '#0087A2',
        weight: 1,
        opacity: 0,
        color: '#FCE891',
        dashArray: '0',
        fillOpacity: 0,
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

        r.style.setProperty('--primary-label-visibility', '0');
        r.style.setProperty('--secondary-label-visibility', '0');
        r.style.setProperty('--tertiary-label-visibility', '1');
        if (DEBUG) console.log("tertiary Label active");

    }
    else if (currentZoom >= zoomMax){ 

        r.style.setProperty('--primary-label-visibility', '1');
        r.style.setProperty('--secondary-label-visibility', '0');
        r.style.setProperty('--tertiary-label-visibility', '0');
        if (DEBUG) console.log("primary Label active");

    }
    else { 

        r.style.setProperty('--primary-label-visibility', '0');
        r.style.setProperty('--secondary-label-visibility', '1');
        r.style.setProperty('--tertiary-label-visibility', '0');
        if (DEBUG) console.log("secondary Label active");

    }
}

function addLabelAndModalToBuilding(building, map){

    // Add the labels
    let primaryLabelContent = "<p align='center' class='primary-label'>" + building.primaryMapLabel.replace(/([\\])/g, '<br>') + " </p>";
    let secondaryLabelContent = "<p align='center'  class='secondary-label'>" + building.secondaryMapLabel.replace(/([\\])/g, '<br>') + " </p>";
    let tertiaryLabelContent = "<p align='center' class='tertiary-label'>" + building.tertiaryMapLabel.replace(/([\\])/g, '<br>') + " </p>";

    building.geometry.bindTooltip(primaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(map);
    // building.geometry.bindTooltip(secondaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();
    // building.geometry.bindTooltip(tertiaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();


    // Add the modal
    building.geometry.on('click', function (e){

        console.log("Building clicked");

        let modal_aka = '<p><em>Also known as: ' + building.aka + '</em></p>';
        let modal_Description = '<p><b>Description</b><br>' + building.description + '</p>';


        let modal_info_button = {
            text: "More Info",
            link: `/info/${building.buildingId}`,
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

function getSensoryAreaTitle(area){
    let key = {
        "Social Space": ["🟡","😄"],
        "Study Space": ["🔵","📚"], 
        "Respite Room": ["🟠","🧡"],
        "Quiet Space": ["🟣","🌺"],  
    }

    let _colour = key[area.type][0];
    let _emoji = key[area.type][1];

    return `${_colour} ${area.Name} ${_emoji}`;

}

function addSensoryAreas(map){
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

function addControls(map, sensoryAreas){
    // Add the controls to the map
    let info = L.control({position:"bottomleft"});
    let search = L.control({position:"bottomright"});
    let layers = L.control({position:"topright"});

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

    layers = L.control.layers(null, selectables);
    
    layers.addTo(map);
    info.addTo(map);
    search.addTo(map);
}


// ---------------------------------------------------------------------------------//
// ---------------------------------------------------------------------------------//
// Debugging stuff
