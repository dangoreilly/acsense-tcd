import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    // Log the current time
    // console.log("Request received at POST /api/[table]");
    // console.log(`Current time: ${new Date().toISOString()}`)

    // throw createError({
    //     statusCode: 500,
    //     statusMessage: 'Test error message'
    // })

    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseServiceKey = useRuntimeConfig().supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // const { table } = event.context.params;
    const table = getRouterParam(event, 'table')
    const action = getRouterParam(event, 'action')
    const body = await readBody(event)
    const { jwt, data, target, select} = body;


    // console.log(`Performing ${action} operation on ${table} table`);
    // console.log(`Data:`, data);
    // console.log(`Target:`, target);
    // console.log(`JWT:`, jwt);

    // Check the permissions of the user based on the JWT token
    const { data: currentUser, error: jwt_error } = await supabase.auth.getUser(jwt);

    if (jwt_error) {
        // setResponseStatus(event, 401);
        throw createError({
            statusCode: 401,
            statusMessage: jwt_error.message
        })
    }

    const user_id = currentUser.user.id;

    // Then look up the users permissions in the profiles table
    let permissions = null;

    const { data: user_permissions, error: user_permissions_error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single()
    if (user_permissions_error) {
        // throw createError({
        //     statusCode: 401,
        throw createError({
            statusCode: 401,
            statusMessage: user_permissions_error.message
        })
        // })
    }
    permissions = user_permissions

    // Get the email of the superadmin from the runtime config
    const superadminEmail = useRuntimeConfig().superAdminEmail;

    // If the user is the superadmin, then they have admin permissions
    if (permissions.email == superadminEmail) {
        permissions.is_admin = true;
        permissions.is_super_admin = true;
    }

    let adminRestrictedTables = ['profiles', 'logs'];

    // Check if the user is trying to access an admin restricted table
    if (adminRestrictedTables.includes(table) && !permissions.is_admin) { 
        // If they're not an admin, throw an error
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }

    // SPECIAL CASE: Is the user an admin and requesting the superadmin profile?
    if (table == "superadmin") {
        if(permissions.is_admin) {
            // console.log("Superadmin email fetched:", superadminEmail)
            return superadminEmail;
        }
        else {
            // If a non-admin user is trying to access the superadmin, just return a string that
            // won't match with their email address.
            return "Forbidden"
        }
    }

    // Perform the Supabase operation based on the action and table
    switch (action.toUpperCase()) {
        case 'SELECT':
            // Perform SELECT operation on the specified table
            // If there is a target, use it to filter the data

            // Get the selected data from the table, passing the elevated supabase client
            // There's a better way to handle this, but I don't know it
            // We've already checked for admin permissions, all other tables are publically readable
            // So any authenticated user can read from any unrestricted table
            const { data: selectedData, error: select_error } = await selectFromSupabase(supabase, table, select, target);
            if (select_error) {
                throw createError({
                    statusCode: 500,
                    statusMessage: select_error.message
                })
            }

            // Special case for the profiles table: Remove the superadmin from the list
            if (table == 'profiles') {
                let profiles = JSON.parse(JSON.stringify(selectedData));
                let superAdminEmail = useRuntimeConfig().superAdminEmail;
                // console.log("Superadmin email fetched:", superAdminEmail)
                for (let i = 0; i < selectedData.length; i++) {
                    // console.log(selectedData[i].email);
                    if (selectedData[i].email == superAdminEmail) {
                        profiles.splice(i, 1);
                        break;
                    }
                }
                return profiles;
            }

            return selectedData;


            break;
        case 'INSERT':
            // Perform INSERT operation on the specified table
            // Use auth_token and data.payload for additional processing
            // ...
            res.send('INSERT operation performed');
            break;
        case 'UPDATE':
            // Perform UPDATE operation on the specified table
            // Use auth_token and data.payload for additional processing
            // ...
            res.send('UPDATE operation performed');
            break;
        case 'DELETE':
            // Perform DELETE operation on the specified table
            // Use auth_token and data.payload for additional processing
            // ...
            res.send('DELETE operation performed');
            break;
        default:
            res.status(400).send('Invalid action');
    }
});


async function selectFromSupabase(supabase, table, select, filter){

    // Check if there's a filter to apply
    if (filter.eq == "" || filter.col == "") {
        const { data, error } = await supabase
        .from(table)
        .select(select.join(','))

        return {data, error};
    }

    // If there is a filter, then only return the data that matches the filter
    const { data, error } = await supabase
    .from(table)
    .select(select.join(','))
    .eq(filter.eq, filter.col)

    return {data, error};
}
