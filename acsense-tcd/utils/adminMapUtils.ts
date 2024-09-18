import type { Overlay, Space, Space_Type, Building } from "~/assets/types/supabase_types";
export interface Building_Partial {
    canonical: string, 
    display_name: string, 
    UUID: string, 
    always_display: boolean, 
    geometry: {coordinates:[[[number, number]]]}
    map_label_1: string,
    map_label_2: string,
    map_label_3: string,
    published: boolean
}
export interface Space_Partial {
    canonical: string, 
    location: [number, number], 
    type: string, 
    icon_override: string, 
    name: string,
    published: boolean
}

/**
 * Retrieves the list of buildings from the database.
 * 
 * @param supabase - The Supabase client object.
 * @returns A promise that resolves to an array of buildings.
 * @throws If there is an error fetching the building list.
 */
export async function getBuildingList(supabase: any): Promise<Building_Partial[]> {
    // Fetch the building list from the database
    let { data: buildings, error } = await supabase
        .from('buildings')
        .select('canonical, display_name, UUID, always_display, geometry, map_label_1, map_label_2, map_label_3, published')
    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // Update the space object with the new data
        // console.log("Buildings:")
        // console.log(buildings);
        return sortArrayOfObjectsByKey(buildings, "display_name");
    }
}

/**
 * Fetches the spaces list from the database.
 * 
 * @async
 * @param supabase - The Supabase client object.
 * @returns A promise that resolves to an array of spaces.
 * @throws If there is an error fetching the spaces list.
 */
export async function getSpaces(supabase: any): Promise<Space_Partial[]> {
    // Fetch the spaces list from the database, for dummy display
    let { data: spaces, error } = await supabase
        .from('spaces')
        .select('canonical, location, type, icon_override, name, published')
    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        return spaces;
    }

}

export async function getSpaceTypes(supabase: any): Promise<Space_Type[]> {
    // Fetch the space types from the database
    let { data: space_types, error } = await supabase
        .from('space_styles')
        .select('*')
    if (error) {
        console.error(error)
        alert(error.message)
        throw error
    }
    else {
        // Update the space object with the new data
        // console.log("Space types:")
        // console.log(space_types);
        return space_types;
    }
}

/**
 * Retrieves overlays from the database.
 * 
 * @param supabase - The Supabase client instance.
 * @returns A promise that resolves to an array of Overlay objects.
 * @throws If an error occurs while fetching overlays.
 */
export async function getOverlays(supabase: any): Promise<Overlay[]> {
    // Fetch the overlays from the database
    const { data: overlays_data, error: overlay_error} = await supabase
    .from('overlays')
    .select('*')

    if (overlay_error) {
        console.log('An error occured while fetching overlays:');
        console.log(overlay_error);
        throw overlay_error
    }
    else {
        return overlays_data;
    }
}

/**
 * Retrieves the image URL for a given space type.
 * 
 * @param space - The space object.
 * @param space_types - An array of space types.
 * @returns The image URL for the space type. If no match is found, the placeholder image URL is returned.
 */
export function getImageForSpaceType(space: Space | Space_Partial, space_types: Space_Type[]): string {
    // Get the image for the space type

    // First check if the space has a custom icon
    if (space.icon_override && space.icon_override.length > 0){
        return space.icon_override;
    }
    // Else, Cycle through space types
    // When the category field matches the input, return the image
    // If there are no matches, return the placeholder image
    for (let i = 0; i < space_types.length; i++) {
        if (space_types[i].category == space.type){
            return space_types[i].icon;
        }
    }    
    return '/images/red-dot.png';
}

export function addOverlays(L: any, map: any, overlays: Overlay[], currentOverlay: Overlay | null, dummy: boolean, darkmode: boolean = false): any {
    // Go through each overlay and add it to the map
    overlays.forEach(overlay => {
        // Skip the current overlay
        if (overlay.id == currentOverlay?.id) return;

        // Figure out if the dark or light mode should be used
        let url = overlay.url;
        // If darkmode is enabled and the dark overlay exists, use it
        if (darkmode && overlay.url_dark != null && overlay.url_dark.length > 0){
            url = overlay.url_dark;
        }

        L.imageOverlay(url, overlay.bounds).addTo(map);
    });

    return map;
}

export function addBuildings(L: any, map: any, buildings: Building_Partial[], currentBuilding: Building | null,  dummy: boolean, updateHoverText: (active: boolean, text: string) => void, onEachFeature: (feature: any, layer: any) => void, darkmode: boolean = false): any {

    const DUMMY_BUILDING_OPACITY = 0.5;

    // Empty array to hold the layer groups
    let building_geojsons = [] as any;
    // Go through each building and add it to the map
    buildings.forEach(building => {
        // Skip the current building
        if (building.canonical == currentBuilding?.canonical) return;

        try {
            // Check if the building is always displayed
            // And that the coordinates are not empty
            // If it is, add it to the map
            if (((building.always_display && building.published) || dummy) && building.geometry.coordinates.length > 0){
                // Convert building to a valid GeoJSON object
                let building_geojson = {
                    "type": "Feature",
                    "geometry": {
                        "coordinates": building.geometry.coordinates,
                        "type": "Polygon"
                    },
                    "properties": {
                        "always_display": building.always_display,
                        "name": building.display_name,
                        "canonical": building.canonical,
                        "UUID": building.UUID,
                        "map_label_1": building.map_label_1,
                        "map_label_2": building.map_label_2,
                        "map_label_3": building.map_label_3,
                        "published": building.published
                    }
                }
                
                building_geojsons.push(building_geojson);
            }
        }
        catch (error) {
            console.error("Error adding " + building.canonical + " to map")
            console.error(error)
        }
    });

    var buildings_geojson_array = L.geoJSON(building_geojsons, {
        style: function(feature: any) {
            return { 
                fillColor: 
                    feature.properties.published
                    ? (darkmode ? '#5f5a95' : '#0087A2')
                    : '#FFFF00',
                weight: 1,
                opacity: 1,
                color: dummy ? '#021689' : '#FCE891',
                dashArray: '0',
                fillOpacity: dummy ? DUMMY_BUILDING_OPACITY : 1,
                noClip:true,
            };
        },
        onEachFeature: function(feature: any, layer: any) {
            layer.on('mouseover', function(e: Event) {
                updateHoverText(true, "Building: " + feature.properties.name);
            });
            layer.on("mouseout", function(e: Event) {
                updateHoverText(false, "")
            });

            // Optional callback
            if (onEachFeature != undefined)
                onEachFeature(feature, layer);

        }
    }).addTo(map);

    // console.log("Buildings added to map")
    return map;
}


export function addSpaces(L: any, map: any, space_list: Space_Partial[], space_types: Space_Type[], current_space: any | null, dummy: boolean, updateHoverText: (active: boolean, text: string) => void): any {
    // Go through each space and add it to the map at an opacity of DUMMY_SPACE_OPACITY
    // Except for the currently active space

    const DUMMY_SPACE_OPACITY = 0.5;

    space_list.forEach(space => {

        // Skip the current space
        if (space.canonical == current_space?.canonical) return;

        // Create the icon object
        // The className is used to make the icon fade in and out when the zoom changes
        let myIcon = L.icon({
            iconUrl: getImageForSpaceType(space, space_types), 
            iconSize: [50, 50], 
            iconAnchor: [25, 25],
        });

        // Create the marker object
        let marker = L.marker(space.location, {
            icon: myIcon, 
            opacity: dummy ? DUMMY_SPACE_OPACITY : 1,
        })

        // Add hover action to update the hover text
        marker.on('mouseover', function(e: Event) {
            updateHoverText(true, "Space: " + space.name);
        });
        marker.on("mouseout", function(e: Event) {
            updateHoverText(false, "")
        });

        marker.addTo(map);

    });

    return map;
}
// Initialise handling of zoom for label management

const LABEL_PRIMARY_RANGE_UPPER = 18;
const LABEL_PRIMARY_RANGE_LOWER = 17;

export function addZoomHandling(map: any): any {

    let zoomGetter = () => {return map.getZoom()};
    // let updateLabels = this.updateLabels;
    // let zoomMax = this.LABEL_PRIMARY_RANGE_UPPER;
    // let zoomMin = this.LABEL_PRIMARY_RANGE_LOWER;

    map.on('zoomend', function() {
        // console.log('zoomend');
        // console.log(zoomGetter());
        updateLabels(zoomGetter(), LABEL_PRIMARY_RANGE_LOWER, LABEL_PRIMARY_RANGE_UPPER);
    });

    // Update the labels on the map
    updateLabels(map.getZoom(), LABEL_PRIMARY_RANGE_LOWER, LABEL_PRIMARY_RANGE_UPPER);

    return map;

}

// Update the map labels based on the current zoom level
export function updateLabels(currentZoom: number, zoomMin: number, zoomMax: number) {
    
    var r = document.querySelector('html');
    // To make TS happy:
    if (!r) return;

    // Outside this range, the "Primary" label is hidden 
    // and the "Secondary" (zoom > LOWER) or "Tertiary" (zoom < UPPER) label is shown
    if (currentZoom <= zoomMin){ 
        // console.log('currentZoom <= zoomMin');

        r.style.setProperty('--primary-label-opacity', '0');
        r.style.setProperty('--secondary-label-opacity', '0');
        r.style.setProperty('--tertiary-label-opacity', '1');

        r.style.setProperty('--sense-icon-opacity', '0');

    }
    else if (currentZoom >= zoomMax){ 
        // console.log('currentZoom >= zoomMax');

        r.style.setProperty('--primary-label-opacity', '1');
        r.style.setProperty('--secondary-label-opacity', '0');
        r.style.setProperty('--tertiary-label-opacity', '0');

        r.style.setProperty('--sense-icon-opacity', '1');

    }
    else { 
        // console.log('currentZoom in range');

        r.style.setProperty('--primary-label-opacity', '0');
        r.style.setProperty('--secondary-label-opacity', '1');
        r.style.setProperty('--tertiary-label-opacity', '0');

        r.style.setProperty('--sense-icon-opacity', '1');

    }
}

// Add the labels to the map over the buildings
export function addLabelsToMap(L: any, map: any, buildings_list: Building_Partial[], currentBuilding: Building | null): void {

    // Init variables
    let building = {} as Building_Partial;
    let primaryLabelContent = "";
    let secondaryLabelContent = "";
    let tertiaryLabelContent = "";

    for(let i = 0; i < buildings_list.length; i++){
        // Skip the current building
        if (buildings_list[i].canonical == currentBuilding?.canonical) continue;
        // Get the current building
        building = buildings_list[i];

        // Init the label content
        primaryLabelContent = "";
        secondaryLabelContent = "";
        tertiaryLabelContent = "";


        if (building.map_label_1 != null){
            // Generate the content
            primaryLabelContent = "<p align='center' class='primary-label map-label'>" + building.map_label_1 + " </p>";
            // Add it to the map
            addToolTipToBuilding(L, map, building.geometry.coordinates, primaryLabelContent);
            // layer.bindTooltip(primaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).addTo(map);
        }
        if (building.map_label_2 != null){
            // Generate the content
            secondaryLabelContent = "<p align='center'  class='secondary-label map-label'>" + building.map_label_2 + " </p>";
            // Add it to the map
            addToolTipToBuilding(L, map, building.geometry.coordinates, secondaryLabelContent);
            // layer.bindTooltip(secondaryLabelContent, {direction: "top", offset:[0,-20], opacity:1, permanent: true}).openTooltip();
        }
        // if (building.map_label_3 != null){
        //     // Generate the content
        //     tertiaryLabelContent = "<p align='center' class='tertiary-label'>" + building.map_label_3 + " </p>";
        //     // Add it to the map
        //     // addToolTipToBuilding(layer, tertiaryLabelContent);
        // }

    }

}

export function makeLabels(L: any, map: any, building: Building | Building_Partial): {primary_label: any | null, secondary_label: any | null, tertiary_label: any | null} | null {
    // Init the label content
    // let building = {} as Building_Partial;
    let primary_label = null;
    let primary_label_content = "";
    let secondary_label = null;
    let secondary_label_content = "";
    let tertiary_label = null;
    let tertiary_label_content = "";

    // Make sure building.geometry.coordinates is not null
    if (building.geometry == null){
        return null;;
    }

    // Make the labels, if they exist
    if (building.map_label_1 != null){
        // Generate the content
        primary_label_content = "<p align='center' class='primary-label map-label'>" + building.map_label_1 + " </p>";
        // Add it to the map 
        // @ts-ignore
        primary_label = addToolTipToBuilding(L, map, building.geometry.coordinates, primary_label_content);
    }

    if (building.map_label_2 != null){
        // Generate the content
        secondary_label_content = "<p align='center'  class='secondary-label map-label'>" + building.map_label_2 + " </p>";
        // Add it to the map
        // @ts-ignore
        secondary_label = addToolTipToBuilding(L, map, building.geometry.coordinates, secondary_label_content);
    }

    // if (building.map_label_3 != null){
    //     // Generate the content
    //     tertiary_label_content = "<p align='center'  class='tertiary-label map-label'>" + building.map_label_2 + " </p>";
    //     // Add it to the map
    //     // @ts-ignore
    //     tertiary_label = addToolTipToBuilding(L, map, building.geometry.coordinates, tertiary_label_content);
    // }

    return {primary_label: primary_label, secondary_label: secondary_label, tertiary_label: tertiary_label};
}

// Add a building tooltip to the map at the location of a polygon
export function addToolTipToBuilding(L: any, map: any, building_coordinates: [[number[]]], content: string): any{

    // Create a tooltip object with the given content and class
    let label = L.tooltip( {direction: "top", offset:[0,-20], opacity:1, permanent: true})
        .setContent(content);
    // Add it to the map at the given layer location
    label.setLatLng(getGeometricCenter(building_coordinates))
        .addTo(map)
        .openTooltip();

    return label;

}

// Calculate the geometric center of a polygon
export function getGeometricCenter(_coordinates: [[number[]]]): [number, number] {

    // Because geoJSON is a weird standard
    let coordinates = _coordinates[0];

    // Init the min and max values
    let min_lat = 180.0;
    let min_lng = 180.0;
    let max_lat = -180.0;
    let max_lng = -180.0;

    // Loop through the coordinates and find the min and max values
    coordinates.forEach(coordinate => {
        if (coordinate[1] < min_lat) min_lat = coordinate[1];
        if (coordinate[1] > max_lat) max_lat = coordinate[1];
        if (coordinate[0] < min_lng) min_lng = coordinate[0];
        if (coordinate[0] > max_lng) max_lng = coordinate[0];
    });

    // Calculate the geometric center
    let lat = (min_lat + max_lat) / 2;
    let lng = (min_lng + max_lng) / 2;

    // console.log([lat, lng])

    return [lat, lng];
}