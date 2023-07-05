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
    // Remove before launch
    map.on('click', function(e) {
        let cheapDebugObject = {
            latlng: e.latlng,
            bounds: map.getBounds(),
            zoom: map.getZoom(),
            center: map.getCenter()
        }

        console.log(cheapDebugObject);
        
    });

    //Observation: SVGs stay on the map even when outside viewport
    // For performance, we should restrict SVGs outside the viewport to the maximum zoom res
    // We should also put a limit on the file size of the SVGs

}

//---------------------------------------------------------------------------------//
function getAppropriateInitialView() {
    // Check if the device is mobile (by checking if the screen is portrait)
    // If so, return the mobile view
    // Otherwise, return the web view
    if (window.innerHeight > window.innerWidth) {
        return INTIAL_VIEW_MOBILE;
    }
    return INTIAL_VIEW_WEB;
}

initialiseMap();