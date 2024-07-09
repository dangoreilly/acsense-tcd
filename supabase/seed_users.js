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

// Array of user IDs
const userIds = [
    "18258c6b-5687-4328-baa5-12b8f18c8ef4",
    "52eb8eab-dd2a-4487-8ff9-dea022eabf83",
    "f2ea8521-6ac1-4cca-9353-a8fb890fd38c"
];

// Function to update user emails
async function updateEmails() {
    for (const id of userIds) {
        const email = `email-${id}@test.ie`;

        // Update user email
        const { data: user, error } = await supabase.auth.admin.updateUserById(
            id,
            { password: "Password123" }
          )

        if (error) {
            console.error(`Error updating email for user with ID ${id}:`, error);
        } else {
            console.log(`Email updated for user with ID ${id}`);
        }
    }
}

// Function to list users
async function listUsers() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()

    if (error) {
        console.error('Error listing users:', error);
    } else {
        console.log('Users:', users);
    }
}

// Call the function to update emails
// updateEmails();
listUsers();