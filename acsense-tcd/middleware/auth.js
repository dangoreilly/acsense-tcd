import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const { data: { user } } = await supabase.auth.getUser()

export default defineNuxtRouteMiddleware((to, from) => {
    console.log("Auth middleware running...")
  
    if (!user) {
      // Redirect to login or restricted access page
      return navigateTo('/admin/login'); // Change this to your login page route
    }

    console.log("User is logged in: " + user.email);

    return navigateTo(to.path);

  });