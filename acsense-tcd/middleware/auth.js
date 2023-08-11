import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)



export default defineNuxtRouteMiddleware( async (to, from) => {
    // console.log("Auth middleware running...")
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      // Redirect to login or restricted access page
      return navigateTo('/admin/login'); // Change this to your login page route
    }

    console.log("User is logged in: " + user.email);

    return navigateTo(to.path);

  });