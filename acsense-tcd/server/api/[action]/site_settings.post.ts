import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'
import { getChanges, checkUserHasPermission, comparePayloadToDatabase } from '~/utils/getChanges'

export default defineEventHandler(async (event) => {
    // Log the current time
    // console.log("Request received at POST /api/[action]/profiles");
    // console.log(`Current time: ${new Date().toISOString()}`)

    // throw createError({
    //     statusCode: 500,
    //     statusMessage: 'Test error message'
    // })

    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseServiceKey = useRuntimeConfig().supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // const { table } = event.context.params;
    const action = getRouterParam(event, 'action') as string; 
    // console.log("action", action)
    const body = await readBody(event)
    const { jwt, data, target, select} = body;

    const permissions = await getUserPermissionsByToken(supabase, jwt);
    // console.log("Permissions:", permissions)

    // If they're not an admin, throw an error
    if (!permissions.is_admin) { 
        // If they're not an admin, throw an error
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }

    // This table will only ever be updated, so we don't need to check for other actions

    // First, find the changes to the user profile
    const changes = await comparePayloadToDatabase(supabase, 'site_settings', target, data);

    // Check the user has permission to make the changes
    // if (!checkUserHasPermission(permissions, "site_settings", changes)) {
    //     throw createError({
    //         statusCode: 403,
    //         statusMessage: 'Forbidden'
    //     })
    // }

    // If the user has permission, then update the user profile
    const { data: updatedData, error: update_error } = await supabase
    .from("site_settings")
    .update(data)
    .eq(target.col, target.eq)

    if (update_error) {
        throw createError({
            statusCode: 500,
            statusMessage: update_error.message
        })
    }
    // If the update was successful, return the updated data
    return updatedData;

});


// async function selectFromSupabase(supabase, table, select, filter){

//     // Check if there's a filter to apply
//     if (filter.eq == "" || filter.col == "") {
//         const { data, error } = await supabase
//         .from(table)
//         .select(select.join(','))

//         return {data, error};
//     }

//     // If there is a filter, then only return the data that matches the filter
//     const { data, error } = await supabase
//     .from(table)
//     .select(select.join(','))
//     .eq(filter.eq, filter.col)

//     return {data, error};
// }
