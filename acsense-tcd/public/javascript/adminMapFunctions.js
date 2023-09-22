// Set the initial view to the values in the lat and long inputs
// let initialView = [document.getElementById('lat').value, document.getElementById('long').value];

var space_map;
var center_marker;
var spaces = [];

async function spaceSelectMapInit(locationUpdateCallback, supabase_client) {

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
        // setInputValues();
        newlocation = [space_map.getCenter().lat, space_map.getCenter().lng];
        locationUpdateCallback(newlocation);
    });
    space_map.on('zoomend', function(e) {
        // setInputValues();
        newlocation = [space_map.getCenter().lat, space_map.getCenter().lng];
        locationUpdateCallback(newlocation);
    });

    // Add the buildings to the map
    addBuildings_noInteration(supabase_client);

    // Add the overlays to the map
    addOverlays(supabase_client, space_map);

}

async function spaceSelectMapUpdateIcon(newIconUrl){
    // Take in the url for a new icon and update the icon on the map
    console.log("spaceSelectMapUpdateIcon()")

    if (newIconUrl == null){
        newIconUrl = "/images/red-dot.png";
    }

    let newIcon = L.icon({
        iconUrl: newIconUrl, 
        iconSize: [50, 50], 
    });

    // Wait for the center marker to be created
    while (typeof center_marker == 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    center_marker.setIcon(newIcon);
}

async function spaceSelectMapUpdateMarkerLocation(_newlocation){
    // Take in the new location and update the marker on the map
    // Unless the new location is [0,0], in which case move the marker
        // to a sensible default location

    // Sensible default location
    let newlocation = [53.345568, -6.259428]
        
    // If the new location is not [0,0], update the location
    if (_newlocation[0] != 0 && _newlocation[1] != 0){
        newlocation = _newlocation;
    }

    // Wait for the center marker to be created
    while (typeof center_marker == 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Update the marker location and the map view
    center_marker.setLatLng(newlocation);
    space_map.setView(newlocation);

}

async function addBuildings_noInteration(supabase_client){

    // Empty array to hold the layer groups
    let building_geojsons = [];
    // Get buildings from supabase
    let { data: bld, error } = await supabase_client
        .from('buildings')
        .select('canonical, always_display, geometry')

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
                        "always_display": building.always_display || false,
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
            // onEachFeature: onEachFeature
        }).addTo(space_map);
    }
    
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
// spaceSelectMapInit();