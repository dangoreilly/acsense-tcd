import { createClient } from '@supabase/supabase-js'

const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
const supabaseKey = useRuntimeConfig().public.supabaseKey;
// console.log({supabaseUrl, supabaseKey});
const supabase = createClient(supabaseUrl, supabaseKey)

// The all buildings endpoint will only return the primary building data
// It will not return any student spaces or gallery images associated with the building

export default defineEventHandler(async (event) => {

    // console.table(event)
    let buildingId = event.context.params.buildingId;

    // Get the primary building data
    let building_response_data = await getBuildingData(buildingId);

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
    console.log("Spaces found:");
    console.log(spaces);
    return spaces;
}