import { createClient } from '@supabase/supabase-js'
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'

export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log("User navigating to " + to.path + " from " + from.path);
    const runtimeConfig = useRuntimeConfig()
    // Skip on client-side navigation
    if (import.meta.client) return
    console.log("Auth middleware running...")

    const supabaseUrl = runtimeConfig.public.supabaseUrl;
    const supabaseServiceKey = runtimeConfig.supabaseServiceKey;
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the jwt token from the cookies
    // const cookies = parseCookieHeader(to.req.headers.cookie)
    const jwt = useCookie('supabase.auth.token')
    // console.log("JWT token: " + JSON.stringify(jwt.value));

    // Check the permissions of the user based on the JWT token
    const { data: currentUser, error: jwt_error } = await supabase.auth.getUser(jwt.value);

    // console.log(JSON.stringify(currentUser));
    // const { data, error } = await supabase.auth.getSession()

    if (!currentUser.user) {
        // For obvious reasons, we don't want a login loop with the login page
        // But also, due to the way the password reset flow works, we need to allow users
        // without the session cookie to go directly to the password reset page, which will calculate clientside if the user exists
        if (to.path !== '/admin/login' || to.path !== 'admin/password-reset') {
            console.log("User is not logged in, redirecting to login page");
            return navigateTo('/admin/login');
        } else {
        }
    } else {
        console.log("User is logged in: " + currentUser.user.email);
    }
});