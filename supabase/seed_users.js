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
// let users = [
//     { 
//         email: "user.all@acsense.ie",
//         is_admin: false,
//         buildings: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//         spaces: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//     },
//     { 
//         email: "user.buildings@acsense.ie",  
//         is_admin: false,
//         buildings: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//         spaces: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//     },
//     { 
//         email: "user.spaces@acsense.ie",
//         is_admin: false,
//         buildings: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//         spaces: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//     },
//     { 
//         email: "user.mix1@acsense.ie",
//         is_admin: false,
//         buildings: {
//             general: {
//                 name: false,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: false,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: false,
//                 sensory: true
//             },
//             gallery: {
//                 images: false,
//                 captions: true,
//                 alt: true
//             },
//             times: false,
//             tips: true,
//             further: false,
//             map: {
//                 labels: true,
//                 location: false
//             }
//         },
//         spaces: {
//             general: {
//                 name: true,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: true,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: true,
//                 sensory: false
//             },
//             gallery: {
//                 images: true,
//                 captions: false,
//                 alt: true
//             },
//             times: true,
//             tips: false,
//             further: true,
//             map: {
//                 labels: false,
//                 location: true
//             }
//         },
//     },
//     { 
//         email: "user.mix2@acsense.ie",
//         is_admin: false,
//         spaces: {
//             general: {
//                 name: false,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: false,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: false,
//                 sensory: true
//             },
//             gallery: {
//                 images: false,
//                 captions: true,
//                 alt: true
//             },
//             times: false,
//             tips: true,
//             further: false,
//             map: {
//                 labels: true,
//                 location: false
//             }
//         },
//         buildings: {
//             general: {
//                 name: true,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: true,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: true,
//                 sensory: false
//             },
//             gallery: {
//                 images: true,
//                 captions: false,
//                 alt: true
//             },
//             times: true,
//             tips: false,
//             further: true,
//             map: {
//                 labels: false,
//                 location: true
//             }
//         },
//     },
//     { 
//         email: "admin@acsense.ie",
//         is_admin: true,
//         buildings: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//         spaces: {
//             general: {
//                 name: true,
//                 aka: true,
//                 desc: true,
//             },
//             primary_image: {
//                 image: true,
//                 alt: true
//             },
//             tabs: {
//                 physical: true,
//                 wayfinding: true,
//                 sensory: true
//             },
//             gallery: {
//                 images: true,
//                 captions: true,
//                 alt: true
//             },
//             times: true,
//             tips: true,
//             further: true,
//             map: {
//                 labels: true,
//                 location: true
//             }
//         },
//     },
//     { 
//         email: "observer@acsense.ie",
//         is_admin: false,
//         buildings: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//         spaces: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//     },
//     { 
//         email: "superadmin@acsense.ie",
//         is_admin: true,
//         buildings: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//         spaces: {
//             general: {
//                 name: false,
//                 aka: false,
//                 desc: false,
//             },
//             primary_image: {
//                 image: false,
//                 alt: false
//             },
//             tabs: {
//                 physical: false,
//                 wayfinding: false,
//                 sensory: false
//             },
//             gallery: {
//                 images: false,
//                 captions: false,
//                 alt: false
//             },
//             times: false,
//             tips: false,
//             further: false,
//             map: {
//                 labels: false,
//                 location: false
//             }
//         },
//     },
// ]

let { user_all, user_admin, user_none, user_buildingsOnly, user_superadmin } = require('../acsense-tcd/assets/testObjects.js');

// Create the users
async function createUsers(users) {
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
            break;
        } else {
            // console.log(`Created user ${users[i].email}`);
            process.stdout.write(`Created user [${i+1}/${users.length}](${users[i].email})                     \r`);
            // Log the new user ID so we can use it in the profiles table
            users[i].user_id = data.user.id;
        }
    }
    console.log(`[${i}/${users.length}] users created                         `);
}

async function createUserProfiles(users){

    for (i = 0; i < users.length; i++) {

        const { error } = await supabase
            .from('profiles')
            .insert(users[i])

        if (error) {
            console.error(`Error creating profile for ${users[i].email}:`, error);
            break;
        } else {
            // console.log(`Created profile for ${users[i].email}`);
            process.stdout.write(`Created profile [${i+1}/${users.length}](${users[i].email})                     \r`);
        }
    }
    console.log(`[${i}/${users.length}] profiles created                         `);
}

function cleanUpTestProfiles(){
    // Process the profiles from the testObjects file 
    // Remove the fields that are not required
    // Return an array of appropriate profiles
    let users = [user_all, user_admin, user_none, user_buildingsOnly, user_superadmin];

    for (i = 0; i < users.length; i++) {
        // Remove the is_super_admin field as this is not stored in the profiles table
        if (users[i].hasOwnProperty('is_super_admin')) {
            delete users[i].is_super_admin;
        }
        // Remove the user_id field as this is generated by Supabase
        if (users[i].hasOwnProperty('user_id')) {
            delete users[i].is_super_admin;
        }
    }

    return users;
}

async function seed(){

    const users = cleanUpTestProfiles();

    await createUsers(users);
    createUserProfiles(users);
}

seed();