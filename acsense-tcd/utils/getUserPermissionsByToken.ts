import type { UserProfile } from 'assets/types/permissions';
import { createClient } from '@supabase/supabase-js';

/**
 * Retrieves the current user's permissions.
 * @returns A Promise that resolves to the user's profile.
 * @throws An error if there is no session or if there is an error retrieving the user's permissions.
 */
export default async function(supabase: any, jwt: string) : Promise<UserProfile> {

    // const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    // const supabaseServiceKey = useRuntimeConfig().supabaseServiceKey;
    // const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check the permissions of the user based on the JWT token
    const { data: currentUser, error: jwt_error } = await supabase.auth.getUser(jwt);

    if (jwt_error) {
        // setResponseStatus(event, 401);
        console.error("Error fetching user from JWT: ", jwt_error)
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

    // Copy the permissions to a new object so we can modify them
    permissions = JSON.parse(JSON.stringify(user_permissions));

    // Get the email of the superadmin from the runtime config
    const superadminEmail = useRuntimeConfig().superAdminEmail;

    // If the user is the superadmin, then they have admin permissions
    if (permissions.email == superadminEmail) {
        permissions.is_admin = true;
        permissions.is_super_admin = true;
    }

    return permissions;

}