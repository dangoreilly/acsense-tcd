import type { UserProfile } from 'assets/types/permissions';
import type { Database } from 'assets/types/supabase_types.gen';

/**
 * Retrieves the current user's permissions.
 * @returns A Promise that resolves to the user's profile.
 * @throws An error if there is no session or if there is an error retrieving the user's permissions.
 */
export default async function(supabase_client?: Database) : Promise<UserProfile> {

    // Get a supabase client and the current session
    const supabase = supabase_client || adminSupabaseInit();

    let access_token:string = "";
    let session:any = null;

    // Check the context we're in. If we're in the browser, we can use the getSession method
    if (typeof window !== 'undefined'){    
        const {data, error} = await supabase.auth.getSession();

        session = data.session;
        // console.log("Getting current user permissions")
        // console.log(session)

        if (!session) {
            console.error("No session found")
            // alert("No session found")
            // throw new Error("No session found")
            // Redirect to the login page
            navigateTo("/admin/login")
        }

        // Get the current session access token
        access_token = session.access_token;
    }
    else {
        // If we're not in the browser, then we should use the session cookie
        const jwt = useCookie("supabase.auth.token")
        const refresh = useCookie("supabase.auth.refresh")

        // console.log(jwt)
        // console.log(refresh)
        // If the JWT token is not found, then we should redirect to the login page
        if (!jwt.value || !refresh.value) {
            console.error("No JWT token found")
            // alert("No JWT token found")
            // throw new Error("No JWT token found")
            // Redirect to the login page
            navigateTo("admin/login")
        }

        // Retrieve the session data from the JWT token
        const { data: currentUser, error: jwt_error } = await supabase.auth.setSession({
            access_token: jwt.value,
            refresh_token: refresh.value
        })

        session = currentUser.session;
        access_token = session.access_token;

    }
    // First, we can check if the user is the superadmin
    const { data: superadmin, error: superadmin_fetch_error } = await permissionedFetch(access_token, "superadmin");

    let user_is_super_admin = false;

    if (superadmin_fetch_error) {
        console.error("Error getting superadmin status: ", superadmin_fetch_error)
        // console.error(superadmin_fetch_error)
        // If this composable was called from the browser, we can alert the user
        if (typeof window !== 'undefined')
            alert(superadmin_fetch_error.message)
        throw superadmin_fetch_error
    }
    else {
        // console.log("Superadmin:")
        // console.log(superadmin)
        if (superadmin == session.user.email){
            user_is_super_admin = true;
        }
    }
    
    // To get to this page, the user must be logged in
    // So we can just just select * from the contributors list
    // The RLS policies on supabase will handle the selection

    let { data: user, error: user_permissions_error } = await supabase
        .from('profiles')
        .select('*')
        .single()
    if (user_permissions_error) {
        console.error("Error getting user permissions:")
        console.error(user_permissions_error)
        // If this composable was called from the browser, we can alert the user
        if (typeof window !== 'undefined')
            alert(user_permissions_error.message)
        throw user_permissions_error
    }
    else {
        
        // Copy the user object to avoid reactivity issues
        let current_user = JSON.parse( JSON.stringify(user) );
        current_user.is_super_admin = user_is_super_admin;

        return current_user;
        
    }

}