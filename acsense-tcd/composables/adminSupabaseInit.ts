// Function to init the supabase instance for the admin interface
// Returns the supabase instance and user info
import { createClient } from '@supabase/supabase-js'
import type { Database } from 'assets/types/supabase_types.gen.ts'

/**
 * Initializes the Supabase client and retrieves the current user session.
 * @returns An object containing the Supabase client.
 */
export default function() : Database | any {

    // See if there is an existing session
    // try {
    //     const nuxtApp = useNuxtApp() as any;
    //     if (nuxtApp.$supabase) {
    //         console.log("Supabase client found in Nuxt App")
    //         return {supabase: nuxtApp.$supabase, session: nuxtApp.$supabase.auth.session()}
    //     }
    // }
    // catch (error) {
    //     console.error("Nuxt App not found, supabase instance will need to be created.")
    // }

    // console.log("Creating new Supabase client")
    const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
    const supabaseKey = useRuntimeConfig().public.supabaseKey;
    const supabase = createClient(supabaseUrl, supabaseKey);

    return supabase;

    // let currentUser = null;
    // let session = null as any;

    

    // // Get the current user
    // // let userSession = async () => { return await supabase.auth.getSession()}
    // const { data, error } = await supabase.auth.getSession();

    // if (!error && data.session) {
    //     // console.log("Setting current user: " + data.session.user.email)
    //     // currentUser = data.session.user
    //     session = data.session
    // }

    // else {
    //     if (error) console.error(error);
    //     else console.error("No session data found")
    // }

    // // Add the supabase client to the Nuxt App
    // // try {
    // //     const nuxtApp = useNuxtApp() as any;
    // //     nuxtApp.provide('supabase', supabase)
    // //     nuxtApp.provide('session', session)
    // // }
    // // catch (error) {
    // //     console.warn("Nuxt App not found")
    // // }

    // console.log("Returning Supabase client")
    // console.log({supabase, session})

    // return {supabase, session}
}