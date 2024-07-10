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
        email: "user@acsense.ie"
    },
    { 
        email: "admin@acsense.ie"
    },
    { 
        email: "superadmin@acsense.ie"
    },
]

// Create the users
async function createUsers() {
    for (const user of users) {

        const { data, error } = await supabase.auth.admin.createUser({
            email: user.email,
            password: "password123",
            email_confirm: true
          })

        if (error) {
            console.error(`Error creating user ${user.email}:`, error);
        } else {
            console.log(`Created user ${user.email}`);
        }
    }
}

createUsers();