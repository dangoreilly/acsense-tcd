import { createClient } from '@supabase/supabase-js'
import getUserPermissionsByToken from '~/utils/getUserPermissionsByToken'

/**
 * Handles the superadmin post request.
 * @param {Event} event - The event object containing the request details.
 * @returns {Promise<string>} - A promise that resolves to the superadmin email or "Forbidden".
 */
export default defineEventHandler(async (event) => {

    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseServiceKey = useRuntimeConfig().supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // const { table } = event.context.params;
    const action = getRouterParam(event, 'action') 
    const body = await readBody(event)
    const { jwt, data, target, select} = body;

    const permissions = await getUserPermissionsByToken(supabase, jwt);

    // // Get the email of the superadmin from the runtime config
    const superadminEmail = useRuntimeConfig().superAdminEmail;

    // SPECIAL CASE: Is the user an admin and requesting the superadmin profile?
    if(permissions.is_admin) {
        return superadminEmail;
    }
    else {
        // If a non-admin user is trying to access the superadmin, just return a string that
        // won't match with their email address.
        return "Forbidden"
    }
});



