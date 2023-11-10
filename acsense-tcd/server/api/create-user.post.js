import { createClient } from '@supabase/supabase-js'
// import getUserPermissions from '~/composables/server/getUserPermissions.js'

const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
// const supabaseKey = useRuntimeConfig().public.supabaseKey;
const supabaseServiceKey = useRuntimeConfig().public.supabaseServiceKey;
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {

    // const refreshToken = event.req.cookies['my-refresh-token']
    // const accessToken = event.req.cookies['my-access-token']


    const body = await readBody(event)
    // console.log(body)

    let newUser = {email: body.new_user_email, permissions: body.new_user_permissions}

    // Confirm the user with supabase
    
    const response = await fetch(supabaseUrl + '/auth/v1/user', {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + body.access_token,
            apikey: supabaseServiceKey
        }
    })

    const currentUser = await response.json()

    // console.log(user)

    // let CurrentUserPermissions = await getUserPermissions(user.email);
    let CurrentUserPermissions = "test"

    // return the user permissions
    // return JSON.stringify(userPermissions);
    return CurrentUserPermissions

})

// async function getUserPermissions(email){

//     return "test"
//     // Check the user email against the contributors table
//     let { data, error } = await supabase
//         .from('contributors')
//         .select('*')
//         .eq('email', email)
//         .single()
    
//     if (error){
//         console.error('error', error)
//         throw error
//     }

//     return data;
    

// }
