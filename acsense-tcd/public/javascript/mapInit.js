//// Set some constants
//---------------------------------------------------------------------------------//
// Set the zoom levels where the "Primary" label is shown
// More zoomed in = higher number
// Outside this range, the "Primary" label is hidden 
// and the "Secondary" (zoom > LOWER) or "Tertiary" (zoom < UPPER) label is shown
// const LABEL_PRIMARY_RANGE_LOWER = 18; 
// const LABEL_PRIMARY_RANGE_UPPER = 17;

// Set the initial view of the map
// We will calculate which one to use later
// const INTIAL_VIEW_WEB = [
//     [53.345568, -6.259428],
//     [53.341853, -6.249477]
// ];
// const INTIAL_VIEW_MOBILE = [
//     [53.34631744552114, -6.255028994837502],
//     [53.34163690316516, -6.258745992827823]
// ];
// Debug can be enabled with a URL parameter
// var DEBUG = false;

// Initialise Supabase as a global variable so we can access it from anywhere
// const supabaseUrl = "https://hadxekyuhdhfnfhsfrcx.supabase.co"
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZHhla3l1aGRoZm5maHNmcmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMxNzk2MjUsImV4cCI6MTk5ODc1NTYyNX0.yxQ1f1X4hILKFxZw40tfy3XHKFkHiTgcNWK_neTzqSo"
// var supabase_client = supabase.createClient(supabaseUrl, supabaseKey)

// Initialise the map as a global variable so we can access it from anywhere
// var map;

//---------------------------------------------------------------------------------//
function initialiseMap(map_config, supabase_client) {
    // Initialise the map
    let map = L.map('map', {
        zoomSnap: 0.25,
        zoomDelta: 0.25,
        maxZoom: 20,
        renderer: L.canvas({padding: 1})
    }).fitBounds(getAppropriateInitialView(map_config));

    var info = L.control({position:"bottomleft"});
    var search = L.control({position:"bottomright"});

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom:20
    }).addTo(map);

    // Add the SVGs to the map
    let overlays = addOverlays(supabase_client, map);

    // Add the buildings to the map
    let buildings = addBuildings(supabase_client, map);

    // Add the Sensory areas to the map
    let sensoryAreas = addSensoryAreas(supabase_client, map);
    
    // Add movement paths to the map
    let movementPaths = addMovementPaths();

    // Prepare the selectables array
    // This is used to populate the map controls
    let selectables = makeLayerArray(overlays, sensoryAreas);

    // Add the controls
    let controls = addControlButtons(map);

    // Listen to the map for zoom changes and update the labels accordingly
    map.on('zoomend', function() {
        updateLabels(map.getZoom(), 
            zoomMin=map_config.LABEL_PRIMARY_RANGE_UPPER, 
            zoomMax=map_config.LABEL_PRIMARY_RANGE_LOWER);
    });

    // Update the labels on the map
    updateLabels(map.getZoom(), 
        zoomMin=map_config.LABEL_PRIMARY_RANGE_UPPER, 
        zoomMax=map_config.LABEL_PRIMARY_RANGE_LOWER);

    // Debug optionns
    if (map_config.DEBUG) {

        // Add the overlay resize handles, if we have the overlay flag set
        if (window.location.href.includes("overlay")) {
            makeOverlayResizeble(map, overlays[0]);
        }

        // Cheap debug reporting
        map.on('click', function(e) {
            let cheapDebugObject = {
                latlng: e.latlng,
                bounds: map.getBounds(),
                zoom: map.getZoom(),
                center: map.getCenter()
            }
    
            console.log(cheapDebugObject);
            
        });

        // Add the geoman controls
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

//---------------------------------------------------------------------------------//
function checkDebug() {
    // Check if the URL contains a debug parameter
    // If so, set the DEBUG variable to true
    // This will enable the debug function
    let urlParams = new URLSearchParams(window.location.search);
    
    return urlParams.has('debug')
}

// checkDebug();
// initialiseMap();