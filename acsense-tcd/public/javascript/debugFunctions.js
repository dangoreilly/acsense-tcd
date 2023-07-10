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

    target_image.setOpacity(0.5);

    var redDot = L.icon({
        iconUrl: 'images/red-dot.png',
        iconSize: [10, 10],
        iconAnchor: [5, 5],
        opacity:0.5
    });

    var bound1_marker = L.marker(target_bounds._northEast, {
        draggable:true,
        icon: redDot
    }).addTo(map);

    var bound2_marker = L.marker(target_bounds._southWest, {
        draggable:true,
        icon: redDot
    }).addTo(map);

    // This code is admittedly disgusting
    bound1_marker.on('drag', function(){updateBounds(overlay, bound1_marker, bound2_marker)});
    bound2_marker.on('drag', function(){updateBounds(overlay, bound1_marker, bound2_marker)});
    bound1_marker.on('moveend', function() {printNewBounds(overlay, bound1_marker, bound2_marker)});
    bound2_marker.on('moveend', function() {printNewBounds(overlay, bound1_marker, bound2_marker)});
}

function updateBounds(overlay, bound1_marker, bound2_marker){
    // console.log("updateBounds() called")
    // console.log(bound1_marker)
    overlay.setBounds([bound1_marker.getLatLng(), bound2_marker.getLatLng()]);
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