function initialiseMap() {
    // Initialise the map
    var map = L.map('map').setView([51.505, -0.09], 13);
    var info = L.control({position:"bottomleft"});
    var search = L.control({position:"bottomright"});

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    //Observation: SVGs stay on the map even when outside viewport
    // For performance, we should restrict SVGs outside the viewport to the maximum zoom res
    // We should also put a limit on the file size of the SVGs

}

initialiseMap();