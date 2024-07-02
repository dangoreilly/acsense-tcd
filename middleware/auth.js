import { createClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware( async (to, from) => {

    console.log("User navigating to " + to.path + " from " + from.path);
    const runtimeConfig = useRuntimeConfig()

    const supabaseUrl = runtimeConfig.public.supabaseUrl;
    const supabaseKey = runtimeConfig.public.supabaseKey;
    // cosnole.log({supabaseUrl, supabaseKey})
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Auth middleware running...")
    const { data, error } = await supabase.auth.getSession()

    // console.log("Session Data")
    // console.log(data);
    // console.error("Error: " + error);
  
    if (!data.session) {
      // Redirect to login or restricted access page
        console.log("User is not logged in, redirecting to login page");
      return navigateTo('/admin/login'); // Change this to your login page route
    }

    console.log("User is logged in: " + data.session.user.email);

    // return navigateTo(to.path);

  });