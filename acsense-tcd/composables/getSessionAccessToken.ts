/**
 * Retrieves the access token from the current session.
 * 
 * @param supabase - The Supabase client instance.
 * @returns The access token if the user is logged in, otherwise null.
 */
export default async function(supabase: any): Promise<string>{

    // Use supabase.auth.session() to get the current session
    // This will return the session object if the user is logged in
    // Otherwise it will return null
    const { data, error } = await supabase.auth.getSession()

    // console.log("Getting current user JWT")
    // console.log(data)

    if (!error && data.session) {
        // console.log("JWT: " + data.session.access_token)
        return data.session.access_token;
    }
    else {
        // If the user is not logged in, throw a hissy fit
        // Don't throw an error though, because it might have just been called before the session was properly initialised
        console.error("User not yet logged in, JWT inaccessible")
        return "User Not Logged in";
    }
}