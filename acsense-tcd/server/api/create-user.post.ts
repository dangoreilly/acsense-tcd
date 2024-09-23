import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'
import { getChanges, checkUserHasPermission, comparePayloadToDatabase } from '~/utils/getChanges'
import { user_none } from '~/assets/testObjects';

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

    let return_data = null;
    let return_error = null;

    // First, we check if the user already exists
    let { data: existing_user, error: existing_user_error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', data)

    if (existing_user_error || !existing_user) {
        console.error("Error checking for existing user:")
        console.error(existing_user_error)
        throw existing_user_error
    }
    
    if (existing_user.length == 0) {
        // If the user doesn't exist, we can create them

        const { data: signup_data, error: signup_error } = await supabase.auth.admin.createUser({
            email: data,
            email_confirm: true
        })

        if(signup_error) {
            console.error("Error signing up user:")
            console.error(signup_error)
            // return { data:null, signup_error }
            throw signup_error
        }

        // If the user was created successfully, we can add them to the profiles table
        // By default, they will have no permissions

        // We'll use the user_none test user as a template
        let new_user = JSON.parse( JSON.stringify(user_none) );
        new_user.email = data;
        new_user.user_id = signup_data.user.id;

        const { data: new_user_data, error: new_user_error } = await supabase
            .from('profiles')
            .insert(new_user)

        if(new_user_error) {
            console.error("Error inserting new user:")
            console.error(new_user_error)
            // return { data:null, new_user_error }
            throw new_user_error
        }

        // Log the event
        await createLogEntry(supabase, permissions, 'User Created', data, null);
    }

    // Now whether the user existed or not, we can send them a password reset email
    
    const { data: recovery_email_data, error: recovery_email_error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: data,
        options: {
            redirectTo: useRuntimeConfig().public.baseUrl + '/admin/password-reset',
        }
    })

    // Log the event
    await createLogEntry(supabase, permissions, 'Password Reset', data, null);

    // return_data = recovery_email_data;
    // return_error = recovery_email_error;

    // return {return_data, return_error};
    return {recovery_email_data, recovery_email_error};
    
});
