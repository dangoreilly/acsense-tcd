import { createClient } from '@supabase/supabase-js'
import { getImageForSpaceType, getSpaceTypes } from '~/utils/adminMapUtils';


const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
const supabaseKey = useRuntimeConfig().public.supabaseKey;
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {

    // console.table(event)
    let buildingId = event.context.params.buildingId;

    // Get the primary building data
    let building_response_data = await getBuildingData(buildingId);

    if (building_response_data.length == 0) {
        return null
    }

    let building = building_response_data[0];
    // console.log(building);

    // Get any student spaces associated with the building
    let spaces_response_data = await getSpacesForBuilding(buildingId);
    building.student_spaces = spaces_response_data;

    // Get any gallery images associated with the building
    let gallery_response_data = await getGalleryImagesForBuilding(buildingId);
    building.gallery_images = gallery_response_data;

    return building;

  })

async function getBuildingData(buildingId) {
    let { data: building, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('canonical', buildingId)
    if (error) {
        console.log(error)
        throw error
    }
    // console.log("Building found: " + building[0].display_name + " (" + building[0].canonical + ")");


    return building;
}

async function getSpacesForBuilding(buildingId) {
    let { data: spaces, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('building', buildingId)
    if (error) {
        console.log(error)
        throw error
    }

    // console.log("Spaces found: " + spaces.length);
    // console.log(spaces);
    // Generate the stylised name for the space

    let styles = await getSpaceTypes(supabase);
    // let styles = {};
    // console.log(styles);

    spaces.forEach(space => {
        // space.stylised_name = getSpaceStyledTitle(styles, space);
        // console.log(space)
        space.icon = getImageForSpaceType(space, styles);
    });

    return spaces;
}

async function getGalleryImagesForBuilding(buildingId) {
    let { data: images, error } = await supabase
        .from('building_gallery_images')
        .select('*')
        .eq('building', buildingId)
    if (error) {
        console.log(error)
        throw error
    }

    

    return images;
}

async function checkForFloorplans(buildingId) {
    // Check if there are any floorplans for the building
    let { data: floorplans, error } = await supabase
        .from('floorplans')
        .select('*')
        .eq('building', buildingId)
    if (error) {
        console.log(error)
        throw error
    }
    return floorplans.length > 0;
}
