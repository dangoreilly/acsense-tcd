import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {

    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseServiceKey = useRuntimeConfig().public.supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, table } = event.context.params;
    const body = await readBody(event)
    const { jwt, data, target} = body;

    console.log(`Performing ${action} operation on ${table} table`);
    console.log(`Data:`, data);
    console.log(`Target:`, target);
    console.log(`JWT:`, jwt);

    // Check the permissions of the user based on the JWT token
    const { data: currentUser, error } = await supabase.auth.getUser(jwt);

    console.log(`Current user:`, currentUser);
    return currentUser;

    const user_id = currentUser.id;

    // Then look up the users permissions in the profiles table
    let permissions = null;
    try {
        const { data, error } = await supabase
        .from('profiles')
        .select('permissions')
        .eq('user_id', user_id);
        if (error) {
            throw new Error(error.message);
        }
        permissions = data[0].permissions;
    } catch (error) {
        return event.respondWith(new Response(error.message, { status: 401 }));
    }




    // Perform the Supabase operation based on the action and table
    switch (action.toUpperCase()) {
        case 'SELECT':
            // Perform SELECT operation on the specified table
            // Use auth_token and data.payload for additional processing
            // ...
            res.send('SELECT operation performed');
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
