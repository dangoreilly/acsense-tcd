<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'contributors'" >
        <main class="d-flex flex-nowrap" style="height:100vh">
            <!-- Sidebar for building selection -->
            <AdminUserSelector 
            @activeUserChanged="getUserForEditing($event)"/>

            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Contributor Management
                    </h1>


                </div>

                <!-- Main Matter -->
                <!-- Don't render anything until some data has been pulled -->
                <div class="mainMatter-admin">
                    <p> Selected: {{ currentUser }}</p>
                    <!-- Button that sends a POST request to the api/create-user route with a string payload -->
                    <button 
                    class="nav-link link-body-emphasis"
                    @click="createUser">
                        <span class="admin-sidebar-span">
                            <i class="bi bi-person-plus"></i>
                            Create User
                        </span>
                    </button>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script>
import {createClient} from '@supabase/supabase-js';

export default {
    data() {
        return {
            currentUser: "null",
            currentUser_clean: "null",
            session: "null",
            supabase: {},
        };
    },
    created() {
        this.getCurrentUser();
    },
    methods: {

        async createUser() {
            // Send a POST request to the api/create-user route with a string payload
            const { data } = await useFetch('/api/create-user', {
                method: 'POST',
                body: JSON.stringify({ 
                    new_user_email: "John.Doe@tcd.ie",
                    new_user_permissions: {},
                    access_token: this.session.access_token
                })
            })

            console.log(data)
        },

        async getCurrentUser() {
            
            const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
            const supabaseKey = useRuntimeConfig().public.supabaseKey;
            this.supabase = createClient(supabaseUrl, supabaseKey)

            const { data, error } = await this.supabase.auth.getSession()
            // console.log("Session Data:")
            // console.log(data);

            if (!error && data.session) {
                // console.log("Setting current user: " + data.session.user.email)
                this.currentUser = data.session.user
                this.session = data.session
            }

            else {
                console.log(error)
                console.log("Auth bypassed?")
                this.currentUser.email = "AUTH BYPASS";
            }
        },

        // This function fetches the user from the database based on their email
        async getUserForEditing(email){

                let { data: user, error } = await this.supabase
                    .from('contributors')
                    .select('*')
                    .eq('email', email)
                if (error) {
                    console.error(error)
                    alert(error.message)
                    throw error
                }
                else {
                    
                    // Copy the user object
                    // This will highlight to the user when a field is about to be set to a default
                    this.currentUser = JSON.parse( JSON.stringify(user[0]) );

                    // Deep copy the building object so we have comparison data
                    this.currentUser_clean = JSON.parse(JSON.stringify(this.currentUser));
                    
                }
                
            },
    }
}

</script>

<style>
</style>