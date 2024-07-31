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

    // // const { table } = event.context.params;
    // const action = getRouterParam(event, 'action') as string; 
    // // console.log("action", action)
    const body = await readBody(event)
    const { jwt, data} = body;

    // const permissions = await getUserPermissionsByToken(supabase, jwt);
    // // console.log("Permissions:", permissions)

    // // If they're not an admin, throw an error
    // if (!permissions.is_admin) { 
    //     // If they're not an admin, throw an error
    //     throw createError({
    //         statusCode: 403,
    //         statusMessage: 'Forbidden'
    //     })
    // }

    
    const { data: recovery_email_data, error } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: data,
        options: {
            redirectTo: useRuntimeConfig().public.baseUrl + '/admin/password-reset',
        }
    })

    return {recovery_email_data, error};
    
});
