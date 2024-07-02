function makeOverlayResizeble(map, overlay){
    // Holder for debugging
    // let dummy_bounds = [[0, 0],[0.0000001, 0.0000001]];
    // var dummy_image = L.imageOverlay('images/red-dot.png', dummy_bounds).addTo(map);

    // Resizing handles
    // Change the target to activate on different images
    var target_image = overlay;
    var target_bounds = overlay.getBounds();
    console.log("target_bounds:")
    console.log(target_bounds)

    target_image.setOpacity(0.25);

    var redDot = L.icon({
        iconUrl: 'images/red-dot.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
        opacity:0.25
    });

    var bound1_marker = L.marker(target_bounds._northEast, {
        // draggable:true,
        icon: redDot
    }).addTo(map);

    var bound2_marker = L.marker(target_bounds._southWest, {
        // draggable:true,
        icon: redDot
    }).addTo(map);

    // Add a bounding rectangle that can be dragged
    var bound_rect = L.rectangle(target_bounds, {
        color: "#ff7800",
        weight: 1,
        fillOpacity: 0,
    }).addTo(map);

    // This code is admittedly disgusting
    // Update the bounds and the rectangle when the markers are dragged
    bound1_marker.on('pm:drag', function(){updateBounds(overlay, bound1_marker, bound2_marker, bound_rect)});
    bound2_marker.on('pm:drag', function(){updateBounds(overlay, bound1_marker, bound2_marker, bound_rect)});
    // Update the markers and the bounds when the rectangle is dragged
    bound_rect.on('pm:drag', function(){updateMarkers(overlay, bound1_marker, bound2_marker, bound_rect)});
}

// Update the markers from the rectangle being dragged
function updateMarkers(overlay, bound1_marker, bound2_marker, bound_rect){
    // Update the markers
    bound1_marker.setLatLng(bound_rect.getBounds()._northEast);
    bound2_marker.setLatLng(bound_rect.getBounds()._southWest);
    // Update the overlay bounds
    overlay.setBounds([bound1_marker.getLatLng(), bound2_marker.getLatLng()]);
    // Print the new bounds
    printNewBounds(overlay, bound1_marker, bound2_marker);
}
// Update the bounds from the markers being moved
function updateBounds(overlay, bound1_marker, bound2_marker, bound_rect){
    // Update the overlay bounds
    overlay.setBounds([bound1_marker.getLatLng(), bound2_marker.getLatLng()]);
    // Update the rectangle
    bound_rect.setBounds([bound1_marker.getLatLng(), bound2_marker.getLatLng()]);
    // Print the new bounds
    printNewBounds(overlay, bound1_marker, bound2_marker);
}

function printNewBounds(overlay, bound1_marker, bound2_marker){
    console.log(`Bounds have been updated to:`)
    console.log(overlay.getBounds())
}

function convertGeomanPolygonToLatLngArray(polygon){
    let latlngArray = [];
    for (let i = 0; i < polygon.length; i++){
        latlngArray.push([polygon[i].lat, polygon[i].lng])
    }
    return latlngArray;
}

// Function to be called from the console to update the buildings
async function updateBuildings(serviceKey){

    console.log("Updating buildings...")

    // Create a service client
    supabase_service = supabase.createClient(supabaseUrl, serviceKey)
    console.log(supabase_service)

    // init variables
    let canonical = "";
    let coordinates = [];

    local_buildings = [];

    // Loop through all the layers, move the feature to the local_buildings array
    global_buildings.eachLayer(layer => {
        local_buildings.push(layer.feature);
    });

    // Loop through all the buildings
    for (let i = 0; i < local_buildings.length; i++)
        {// Get the canonical and coordinates
        canonical = local_buildings[i].properties.canonical;
        coordinates = local_buildings[i].geometry.coordinates;

        // Update the building in the database
        const { error } = await supabase_service
        .from('buildings')
        .update({ geometry: {"coordinates": coordinates}, map_label_3: ""})
        .eq('canonical', canonical)

        if (error) {
            console.error(error)
            alert(error.message)

            // Reset and move on
            error = null;
            // 
        }
        else {
            console.log("Updated " + canonical)
        }
 }   

}

async function updateOnMove(feature, layer){

    // When a feature is moved, update the database
    // Assume service client has already been created in console and is called supabase_service

    layer.on('pm:edit', async function(e){

        // Get the canonical and coordinates
        canonical = feature.properties.canonical;
        coordinates = latlngs_to_coordsarray(e.layer.getLatLngs());

        // Report to the console
        console.log("Updating " + canonical)
        // Update the building in the database
        const { error } = await supabase_service
        .from('buildings')
        .update({ geometry: {"coordinates": coordinates}, map_label_3: ""})
        .eq('canonical', canonical)

        if (error) {
            console.error(error)
            alert(error.message)
            throw error
        }
        else {
            console.log("Success\n")
        }
    });

}

function latlngs_to_coordsarray(latlngs){

    let coords = [[]];
    
    for (let i = 0; i < latlngs[0].length; i++){
        coords[0].push([latlngs[0][i].lng, latlngs[0][i].lat])
    }
    return coords;
}


