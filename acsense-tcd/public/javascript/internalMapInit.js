//// Set some constants
//---------------------------------------------------------------------------------//
// Set the initial view of the map
// We will calculate which one to use later
const INTIAL_VIEW_WEB = [
    [0, 0],
    [1080, 1920]
];
const INTIAL_VIEW_MOBILE = [
    [0, 650],
    [1080, 1300]
];
const MAX_BOUNDS = [
[-200, -200],
[1280, 2120]
]
// Debug can be enabled with a URL parameter
var DEBUG = false;

//---------------------------------------------------------------------------------//
function initialiseMap() {
    // Initialise the map
    var map = L.map('map', {
        crs: L.CRS.Simple,
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        maxBounds: MAX_BOUNDS,
        maxZoom: 20,
        minZoom: -1,
        renderer: L.canvas({padding: 1})
    }).fitBounds(getAppropriateInitialView());
    console.log(map);

    var back = L.control({position:"bottomleft"});
    back.onAdd = function (map) {

        this.button = L.DomUtil.create('div', 'back'); // create a div with a class "info"
        this.button.value = "i";
        this.button.innerHTML = '<button type="button" class="btn btn-danger btn-sm" style="margin-top:0">Info</button>';
        // this.button.innerHTML += '<button type="button" id="mainCampusButton" disabled class="btn btn-outline-primary btn-sm" onclick="flyHome()" style="display: none; margin-top:0; margin-left:0.5rem;">Main Campus</button>';
        this.button.style = "padding:0;"

        return this.button;
    };
    // var search = L.control({position:"bottomright"});

    // Cheap debug function
    if (DEBUG) {
        map.on('click', function(e) {
            let cheapDebugObject = {
                latlng: e.latlng,
                bounds: map.getBounds(),
                zoom: map.getZoom(),
                center: map.getCenter()
            }
    
            console.log(cheapDebugObject);
            
        });
    }

    // Quick hack for demonstration purposes
    // Add the SVGs to the map
   let bounds = INTIAL_VIEW_WEB;
    let floors ={};

    let floor_1 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts01.svg', bounds)] );
    let floor_2 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts02.svg', bounds)] ).addTo(map);
    let floor_3 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts03.svg', bounds)] );
    let floor_4 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts04.svg', bounds)] );
    let floor_5 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts05.svg', bounds)] );
    let floor_6 = L.layerGroup( [L.imageOverlay('/images/ArtsBlock/Arts06.svg', bounds)] );
    floors["Floor 1"] = floor_1 ;
    floors["Floor 2"] = floor_2;
    floors["Floor 3"] = floor_3;
    floors["Floor 4"] = floor_4;
    floors["Floor 5"] = floor_5;
    floors["Floor 6"] = floor_6;

    // Add a sensory space callout
    let space = {
        "Name": "TCDSU Student Space",
        "type": "Social Space",
        "Description": "Room with beanbags and booths for students to relax in.",
        "capacity": 0,
        "electrical_outlets": true,
        "food_drink_allowed": true,
        "indoors": true,
        "wheelchair_accessible": true,
        "kettle": false,
        "microwave": false,
        "coordinates": [338, 573],
        "url": "https://tcd-sense-map-assets.fra1.digitaloceanspaces.com/fada674505fcc8875fe2a99d47ca15b8.png",
    };

    let myIcon = L.icon({iconUrl: space.url, iconSize: [50, 50]});

    let marker = L.marker(space.coordinates, {icon: myIcon, zIndexOffset: 1000});
    marker.on('click', function (e){

        openAreaModal(space);

    });

    floor_4.addLayer(marker);

    let layers = L.control.layers(floors, null);
    
    layers.addTo(map);


}


//---------------------------------------------------------------------------------//
function checkDebug() {
    // Check if the URL contains a debug parameter
    // If so, set the DEBUG variable to true
    // This will enable the debug function
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
        DEBUG = true;
    }
}

checkDebug();
initialiseMap();