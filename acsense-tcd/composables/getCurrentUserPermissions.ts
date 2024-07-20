import type { UserProfile } from 'assets/types/permissions';

/**
 * Retrieves the current user's permissions.
 * @returns A Promise that resolves to the user's profile.
 * @throws An error if there is no session or if there is an error retrieving the user's permissions.
 */
export default async function() : Promise<UserProfile> {

    // Get a supabase client and the current session
    const supabase = adminSupabaseInit();
    const {data, error} = await supabase.auth.getSession();

    const session = data.session;
    // console.log("Getting current user permissions")
    // console.log(session)

    if (!session) {
        console.error("No session found")
        alert("No session found")
        throw new Error("No session found")
    }

    // First, we can check if the user is the superadmin
    // Get the current session access token
    const access_token:string = session.access_token;
    const { data: superadmin, error: superadmin_fetch_error } = await permissionedFetch(access_token, "superadmin");

    let user_is_super_admin = false;

    if (superadmin_fetch_error) {
        console.error("Error getting superadmin status: ", superadmin_fetch_error)
        console.error(superadmin_fetch_error)
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
        alert(user_permissions_error.message)
        throw user_permissions_error
    }
    else {
        
        // Copy the user object to avoid reactivity issues
        let current_user = JSON.parse( JSON.stringify(user) );
        current_user.is_super_admin = user_is_super_admin;

        return current_user;

        // Check if the user is the superadmin

        // Temporary hard code for development
        // this.currentUser.is_admin = false;

        // this.currentUserPermissions = this.makeUserPermissionsArray(user);
        
    }

}