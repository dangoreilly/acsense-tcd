//// Set some constants
//---------------------------------------------------------------------------------//
// Set the zoom levels where the "Primary" label is shown
// More zoomed in = higher number
// Outside this range, the "Primary" label is hidden 
// and the "Secondary" (zoom > LOWER) or "Tertiary" (zoom < UPPER) label is shown
const LABEL_PRIMARY_RANGE_LOWER = 18; 
const LABEL_PRIMARY_RANGE_UPPER = 17;

// Set the initial view of the map
// We will calculate which one to use later
const INTIAL_VIEW_WEB = [
    [53.345568, -6.259428],
    [53.341853, -6.249477]
];
const INTIAL_VIEW_MOBILE = [
    [53.34631744552114, -6.255028994837502],
    [53.34163690316516, -6.258745992827823]
];
// Debug can be enabled with a URL parameter
var DEBUG = false;

//---------------------------------------------------------------------------------//
function initialiseMap() {
    // Initialise the map
    var map = L.map('map', {
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        maxZoom: 20,
        renderer: L.canvas({padding: 1})
    }).fitBounds(getAppropriateInitialView());

    var info = L.control({position:"bottomleft"});
    var search = L.control({position:"bottomright"});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom:20
    }).addTo(map);

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

    //Observation: SVGs stay on the map even when outside viewport
    // For performance, we should restrict SVGs outside the viewport to the maximum zoom res
    // We should also put a limit on the file size of the SVGs

    // Add the SVGs to the map
    let overlays = addOverlays(map);

    if (DEBUG) {
        makeOverlayResizeble(map, overlays[0]);
    }

    // Add the buildings to the map
    let buildings = addBuildings(map);

    // Add the Sensory areas to the map
    // Capture the return value in a variable
    // This is so we can add them to the map controls later
    let sensoryAreas = addSensoryAreas(map);
    
    // Add movement paths to the map
    let movementPaths = addMovementPaths(map);

    // Prepare the selectables array
    // This is used to populate the map controls
    let selectables = makeLayerArray(overlays, sensoryAreas);

    // Add the controls
    let controls = addControls(map, selectables);

    // Listen to the map for zoom changes and update the labels accordingly
    map.on('zoomend', function() {
        // updateLabels(map.getZoom(), LABEL_PRIMARY_RANGE_UPPER, LABEL_PRIMARY_RANGE_LOWER);
    });

    // check for debug, and if so, add the geoman editor
    if (DEBUG) {
        map.pm.addControls({  
            position: 'topleft',  
            // drawCircleMarker: false,
            // rotateMode: false,
          });  

        map.on('pm:create', function(e) {
            // console.log(e.marker._latlngs[0]);
            console.log(convertGeomanPolygonToLatLngArray(e.marker._latlngs[0]))
        });
    }


}

makeLayerArray = function(overlays, sensoryAreas) {

    // Prepare the selectables array
    // Hardcoded for the demonstration on 10/7/23
    console.log(sensoryAreas);

    return selectables = {
        "Terrain": overlays[1],
        "Social Space": sensoryAreas[0],
        "Study Space": sensoryAreas[1], 
        "Respite Room": sensoryAreas[2],
        "Quiet Space": sensoryAreas[3],
    };
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