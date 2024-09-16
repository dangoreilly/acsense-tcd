import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'
import { getChanges, checkUserHasPermission, comparePayloadToDatabase } from '~/utils/getChanges'
import { createLogEntry } from '~/utils/createLogEntry'

// Handles UPDATE, INSERT, DELETE operations on the specified table
// SELECT operations are handled directly by supabase for public tables
// Admin tables are handled separately
export default defineEventHandler(async (event) => {
    // Log the current time
    // console.log("Request received at POST /api/[table]");
    // console.log(`Current time: ${new Date().toISOString()}`)

    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseServiceKey = useRuntimeConfig().supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // const { action, table } = event.context.params as { table: string };
    const action = getRouterParam(event, 'action') as string;
    const table = getRouterParam(event, 'table') as string; 
    // console.log("action", action)
    const body = await readBody(event)
    const { jwt, data, target, select} = body;

    const permissions = await getUserPermissionsByToken(supabase, jwt);
    // console.log("Permissions:", permissions)

    // Perform the Supabase operation based on the action and table
    switch (action.toUpperCase()) {
        case 'INSERT':
            // Perform INSERT operation on the specified table

            // If this is the gallery table, check the user has permission to insert
            if (table == 'building_gallery_images' && checkUserHasPermission(permissions, "building_gallery_images", {old:{}, new:{}, list:["url"], error: null} )) {
                // The way these permissions are handled will likely change in the future
                // Because this is messy
            }

            // Otherwise, check the user is an admin
            else if (!permissions.is_admin) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Forbidden'
                })
            }

            // If the user has admin permissions, insert the data into the table
            const { data: insertedData, error: insert_error } = await supabase
            .from(table)
            .insert(data)
            

            if (insert_error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: insert_error.message
                })
            }
            else {
                // Add to the logs table
                createLogEntry(supabase, permissions, "INSERT", table, data);
                
            }
            // If the insert was successful, return the inserted data
            return insertedData;


            break;
        case 'UPDATE':
            // Perform UPDATE operation on the specified table
            
            // First, find the changes to the user profile
            const changes = await comparePayloadToDatabase(supabase, table, target, data);

            // Check the user has permission to make the changes
            if (!checkUserHasPermission(permissions, table, changes)) {

                // console.log("Changes:", changes)
                // console.log("Permissions:", permissions)

                throw createError({
                    statusCode: 403,
                    statusMessage: 'Forbidden'
                })
            }

            // If the user has permission, then update the user profile
            const { data: updatedData, error: update_error } = await supabase
            .from(table)
            .update(data)
            .eq(target.col, target.eq)

            if (update_error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: update_error.message
                })
            }
            else {
                // Add to the logs table
                let subject = table+":"+target.eq;

                // If the table is spaces or buildings, get the canonical name, to be more human-readable
                switch (table) {
                    case 'spaces':
                        // Get the canonical name of the space
                        const { data: spaceData, error: spaceError } = await supabase
                        .from('spaces')
                        .select('canonical')
                        .eq(target.col, target.eq)

                        // If there's an error, just use the space ID
                        if (!spaceError) {
                            subject = "spaces:"+spaceData[0].canonical;
                        }

                        break;
                    case 'buildings':
                        // Get the canonical name of the space
                        const { data: buildingData, error: buildingError } = await supabase
                        .from('buildings')
                        .select('canonical')
                        .eq(target.col, target.eq)

                        // If there's an error, just use the space ID
                        if (!buildingError) {
                            subject = "buildings:"+buildingData[0].canonical;
                        }
                        break;
                }


                createLogEntry(supabase, permissions, "UPDATE", subject, changes);
            }
            // If the update was successful, return the updated data
            return updatedData;

            break;
        case 'DELETE':
            // Perform DELETE operation on the specified table

            // If this is the gallery table, check the user has permission to delete
            if (table == 'building_gallery_images' && checkUserHasPermission(permissions, "building_gallery_images", {old:{}, new:{}, list:["url"], error: null} )) {
                // The way these permissions are handled will likely change in the future
                // Because this is messy
            }

            // Otherwise, check the user is an admin
            else if (!permissions.is_admin) {
                throw createError({
                    statusCode: 403,
                    statusMessage: 'Forbidden'
                })
            }

            // If the user has admin permissions, delete the data from the table
            const { data: deletedData, error: delete_error } = await supabase
            .from(table)
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
                createLogEntry(supabase, permissions, "DELETE", table+":"+target.eq, null);
            }
            // If the delete was successful, return the deleted data
            return deletedData;


            break;
        default:
            // res.status(400).send('Invalid action');
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
