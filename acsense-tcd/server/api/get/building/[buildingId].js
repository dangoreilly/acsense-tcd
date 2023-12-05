import { createClient } from '@supabase/supabase-js'
// import { getSpaceStyles } from '/composables/getSpaceStyles'
// import { getIconForSpace } from '/composables/getIconForSpace'


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

    let styles = await getSpaceStyles(supabase);
    // let styles = {};
    // console.log(styles);

    spaces.forEach(space => {
        // space.stylised_name = getSpaceStyledTitle(styles, space);
        // console.log(space)
        space.icon = getIconForSpace(space, styles);
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

// function getSpaceStyledTitle(styles, area){
//     let key = {
//         "Social Space": ["🟡","😄"],
//         "Study Space": ["🔵","📚"], 
//         "Respite Room": ["🟠","🧡"],
//         "Quiet Space": ["🟣","🌺"],  
//     }

//     let _colour = "🟤";
//     let _emoji = "🏠";

//     try {
//         _colour = key[area.type][0];
//         _emoji = key[area.type][1];
//     }
//     catch {
//         console.error("No style found for '" + area.type + "'");
//     }

//     // console.log(`${_colour} ${area.name} ${_emoji}`);

//     return `${_colour} ${area.name} ${_emoji}`;

// }

// async function getSpaceStyles(){
//     let { data: styles, error } = await supabase
//         .from('site_settings')
//         .select('*')
//         .eq('key', 'space_styles')
//     if (error) {
//         console.log(error)
//         throw error
//     }
//     return styles[0].data;
// }

function getIconForSpace(space, styles) {

    // Check if the space has an icon override
    if (space.icon_override != null && space.icon_override != "")
        return space.icon_override;
    else {
        // Otherwise, try to get the icon from the space style
        for (let i = 0; i < styles.length; i++) {
            if (styles[i].category == space.type)
                return styles[i].icon;
        }

        // If no icon is found, return the default icon
        return "https://hadxekyuhdhfnfhsfrcx.supabase.co/storage/v1/object/public/icons/default.png"
    }
}

async function getSpaceStyles() {
    try {
        // Get the space icons from the database
        let { data: icons, error } = await supabase
            .from('space_styles')
            .select('*')
        if (error) {
            console.log(error)
            return [];
        } else {
            return icons;
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}