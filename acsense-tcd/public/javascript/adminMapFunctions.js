// Set the initial view to the values in the lat and long inputs
// let initialView = [document.getElementById('lat').value, document.getElementById('long').value];

var space_map;

function spaceSelectMapInit() {
    // Set the initial view to the values in the lat and long inputs
    // let initialView = [document.getElementById('lat').value, document.getElementById('long').value];
    const INTIAL_VIEW_WEB = [
        [53.345568, -6.259428],
        [53.341853, -6.249477]
    ];

    space_map = L.map('space-placement-map').fitBounds(INTIAL_VIEW_WEB);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', { //rastertiles/voyager_nolabels
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom:20
    }).addTo(space_map);

    // Add a marker to the map at the initial view
    // This should be updated very quickly when the spaces are loaded
    var marker = L.marker(space_map.getCenter()).addTo(space_map);

    // When the map view moves, the marker moves with it
    map.on('move', function () {
        marker.setLatLng(space_map.getCenter());
    });

    //When the movement is finished, update the lat and long inputs
    map.on('dragend', function(e) {
        setInputValues();
    });
    map.on('zoomend', function(e) {
        setInputValues();
    });
}


function setInputValues() {
    document.getElementById('lat').value = map.getCenter().lat;
    document.getElementById('long').value = map.getCenter().lng;
}

// Initialise the map
// spaceSelectMapInit();