// Set the initial view to the values in the lat and long inputs
// let initialView = [document.getElementById('lat').value, document.getElementById('long').value];

var space_map;
var center_marker;
var spaces = [];

async function spaceSelectMapInit() {

    console.log("spaceSelectMapInit()");
    // Set the initial view to the values in the lat and long inputs
    // let initialView = [document.getElementById('lat').value, document.getElementById('long').value];
    const INTIAL_VIEW_WEB = [
        [53.345568, -6.259428],
        [53.341853, -6.249477]
    ];

    // Hold until the map div is loaded
    while (!document.getElementById('space-placement-map')) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Create the map

    space_map = L.map('space-placement-map').fitBounds(INTIAL_VIEW_WEB);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom:20
    }).addTo(space_map);

    // Add a marker to the map at the initial view
    // This should be updated very quickly when the spaces are loaded
    center_marker = L.marker(space_map.getCenter()).addTo(space_map);
    
    // Add an icon to the default marker
    spaceSelectMapUpdateIcon(null);

    // When the map view moves, the marker moves with it
    space_map.on('move', function () {
        center_marker.setLatLng(space_map.getCenter());
    });

    //When the movement is finished, update the lat and long inputs
    space_map.on('dragend', function(e) {
        setInputValues();
    });
    space_map.on('zoomend', function(e) {
        setInputValues();
    });
}


function setInputValues() {
    // Update the lat and long inputs to the current view
    // console.log("setInputValues()");
    document.getElementById('lat').value = space_map.getCenter().lat;
    document.getElementById('long').value = space_map.getCenter().lng;
}

function spaceSelectMapUpdateIcon(newIconUrl){
    // Take in the url for a new icon and update the icon on the map

    if (newIconUrl == null){
        newIconUrl = "/images/red-dot.png";
    }

    let newIcon = L.icon({
        iconUrl: newIconUrl, 
        iconSize: [50, 50], 
    });

    center_marker.setIcon(newIcon);
}

function spaceSelectMapUpdateMarkerLocation(_newlocation){
    // Take in the new location and update the marker on the map
    // Unless the new location is [0,0], in which case move the marker
        // to a sensible default location

    // Sensible default location
    let newlocation = [53.345568, -6.259428]
        
    // If the new location is not [0,0], update the location
    if (_newlocation[0] != 0 && _newlocation[1] != 0){
        newlocation = _newlocation;
    }

    // Update the marker location and the map view
    center_marker.setLatLng(newlocation);
    space_map.setView(newlocation);

}

function addMapDetails(){
    // Get the overlays, satellite buildings and spaces for the map
    // Add them to the map to give a better reference for the user
    // Add Overlays

    // Add satellite buildings (buildings with display_override = 1)

    // Add spaces to the spaces array
    // So that it can be cycled through for selective hiding and showing
    // [{canonical: Marker}...]
}

// Initialise the map
spaceSelectMapInit();