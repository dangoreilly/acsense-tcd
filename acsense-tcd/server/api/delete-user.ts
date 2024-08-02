import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'

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

    // // const { table } = event.context.params;
    // const action = getRouterParam(event, 'action') as string; 
    // // console.log("action", action)
    const body = await readBody(event)
    const { jwt, data} = body;

    const permissions = await getUserPermissionsByToken(supabase, jwt);
    // // console.log("Permissions:", permissions)

    // // If they're not the superadmin, throw an error
    if (!permissions.is_super_admin) { 
        // If they're not an admin, throw an error
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }

    // Now that we have established this is a superadmin, we can proceed

    // First, we check if the user already exists
    let { data: existing_user, error: existing_user_error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', data)
        .single()

    if (existing_user_error || !existing_user) {
        console.error("Error checking for existing user:")
        console.error(existing_user_error)
        throw existing_user_error
    }

    // Now that we have the user, we can delete them
    const { data: delete_data, error: delete_error } = await supabase.auth.admin.deleteUser(existing_user.user_id);
    if (delete_error) {
        console.error("Error deleting user:")
        console.error(delete_error)
        throw delete_error
    }
    // We'll also delete the user from the profiles table
    const { data: delete_profile_data, error: delete_profile_error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', existing_user.user_id)
    if (delete_profile_error) {
        console.error("Error deleting user profile:")
        console.error(delete_profile_error)
        throw delete_profile_error
    }

    return { delete_data, delete_profile_data };

});