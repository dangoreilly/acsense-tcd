import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'
import { getChanges, checkUserHasPermission, comparePayloadToDatabase } from '~/utils/getChanges'
import { createLogEntry } from '~/utils/createLogEntry'

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

    // Perform the Supabase operation based on the action and table
    switch (action.toUpperCase()) {
        case 'INSERT':
            // Perform INSERT operation on the specified table

            // If the user has admin permissions, insert the data into the table
            const { data: insertedData, error: insert_error } = await supabase
            .from("space_styles")
            .insert(data)
            

            if (insert_error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: insert_error.message
                })
            }
            else {
                // Add to the logs table
                createLogEntry(supabase, permissions, "INSERT", "space_styles", data);
                
            }
            // If the insert was successful, return the inserted data
            return insertedData;


            break;
        case 'UPDATE':
            // Update the space style using the payload

            // First, find the changes to the user profile
            const changes = await comparePayloadToDatabase(supabase, "space_styles", target, data);

            // If the user has permission, then update the space styles
            const { data: updatedData, error: update_error } = await supabase
            .from("space_styles")
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

            break;
        case 'DELETE':
            // Remove a space style from the table
            const { data: deletedData, error: delete_error } = await supabase
            .from("space_styles")
            .delete()
            .eq(target.col, target.eq)

            if (delete_error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: delete_error.message
                })
            }
            else {
                // Add to the logs table
                createLogEntry(supabase, permissions, "DELETE", "space_styles", deletedData);
            }
            // If the delete was successful, return the deleted data
            return deletedData;

            break;
        default:
            // If the action is not recognised, return a 403 error
            throw createError({
                statusCode: 403,
                statusMessage: 'Forbidden'
            })

    }
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
