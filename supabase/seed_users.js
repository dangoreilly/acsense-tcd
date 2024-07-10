const { createClient } = require('@supabase/supabase-js');

require('dotenv').config();

// Load SUPABASE_SERVICE_KEY from .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Create Supabase client instance
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

//   Define the users
let users = [
    { 
        email: "user.all@acsense.ie",
        bld_general: true,
        bld_tabs: true,
        bld_gallery: true,
        sense_general: true,
        bld_map: true,
        bld_times: true,
        bld_tips: true,
        bld_further: true,
        sense_map: true,
        sense_facilities: true,
        sense_photos: true,
    },
    { 
        email: "user.buildings@acsense.ie",
        bld_general: true,
        bld_tabs: true,
        bld_gallery: true,
        bld_map: true,
        bld_times: true,
        bld_tips: true,
        bld_further: true,
    },
    { 
        email: "user.spaces@acsense.ie",
        sense_general: true,
        sense_map: true,
        sense_facilities: true,
        sense_photos: true,
    },
    { 
        email: "admin@acsense.ie",
        is_admin: true,
    },
    { 
        email: "observer@acsense.ie",
    },
    { 
        email: "superadmin@acsense.ie",
    },
]

// Create the users
async function createUsers() {
    // Loop through the defined seed data above
    for (i = 0; i < users.length; i++) {
        // Create the user and auto-confirm
        const { data, error } = await supabase.auth.admin.createUser({
            email: users[i].email,
            password: "password123",
            email_confirm: true
          })

        if (error) {
            console.error(`Error creating user ${users[i].email}:`, error);
        } else {
            console.log(`Created user ${users[i].email}`);
            // Log the new user ID so we can use it in the profiles table
            users[i].user_id = data.user.id;
        }
    }
}

async function createUserProfiles(){

    for (i = 0; i < users.length; i++) {

        const { error } = await supabase
            .from('profiles')
            .insert(users[i])

        if (error) {
            console.error(`Error creating profile for ${users[i].email}:`, error);
        } else {
            console.log(`Created profile for ${users[i].email}`);
        }
    }

}

async function seed(){
    await createUsers();
    createUserProfiles();
}

seed();