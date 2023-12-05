/**
 * Retrieves space icons from the database using the Supabase client object.
 * 
 * @param {Object} supabase - The Supabase client object.
 * @returns {Array<Object>} - An array of space icons.
 */
export default async function(supabase) {
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