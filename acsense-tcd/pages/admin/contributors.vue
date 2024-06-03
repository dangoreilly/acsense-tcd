<!-- Admin page for displaying logs -->
<template>
    <NuxtLayout name="admin-layout" :activePage="'contributors'" :supabase_client="supabase">
        <main class="d-flex flex-nowrap" style="height:100vh">
            <!-- Main section for editing -->
            <div class="pt-1 px-4 w-100" style="overflow-y: auto;">

                <!-- Header -->
                <div class="border-bottom border-2 border-black mb-3 d-flex justify-content-between">
                    <!-- Title -->
                    <h1 class="display-6 d-flex align-items-end">
                        Contributor Management
                    </h1>

                    <!-- <div class="d-flex align-items-center m-3 fs-5">
                        <div class="btn-group" role="group">
                            <button 
                            type="button" 
                            class="btn" 
                            :class="permissionsHaveChanged ? 'btn-success' : 'btn-outline-secondary'"
                            @click="updatePermissions()"
                            :disabled="!permissionsHaveChanged">
                                Save Changes
                            </button>

                            <button 
                            type="button" 
                            class="btn"
                            :class="permissionsHaveChanged ? 'btn-warning' : 'btn-outline-secondary'"
                            @click="cancelChanges()"
                            :disabled="!permissionsHaveChanged">
                                Cancel
                            </button>
                        </div>
                    </div> -->


                </div>

                <!-- Main Matter -->
                <!-- The main matter will depend on if the user is an admin -->
                <div v-if="!currentUser.is_admin" class="mainMatter-admin">
                    <!-- Section for viewing your own permissions - there is no edit functionality -->
                    <p>Below are the permissions associated with your Acsense account</p>
                    <AdminUserPermissionsEdit :permissions="currentUserPermissions" :disabled="true"/> <!--  -->
                    
                </div>
                <div v-else class="mainMatter-admin">
                    <!-- Section for admins to edit user permissions, add/remove users etc -->
                    <p>Manage the permissions of contributors</p>
                    <button class="btn btn-warning" @click="getContributors">Get Contributors</button>

                    <!-- Loop through all the profiles apart from the current user -->
                    <div class="accordion">
                        <div v-for="(profile, index) in contributors">
                            <!-- There's no reason for an admin to be editing their own profile -->
                            <!-- They can really only cause problems doing that -->
                            <!-- There is also no reason for a regular admin to touch the Super Admin -->
                            <AccordionStep v-if="profile.email != currentUser.email && !profile.isSuperAdmin ">
                                <template #AccordionStepHeader>
                                    {{ profile.email }}
                                </template>
                                <template #AccordionStepBody>
                                    <AdminUserPermissionsEdit  :permissions="profile"/>
                                </template> 
                            </AccordionStep>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script lang="ts">
import {createClient} from '@supabase/supabase-js';
import type { PermissionsArray } from '~/assets/types/permissions';
import type { UserProfile } from '~/assets/types/permissions';
import permissionsKey from '~/assets/permissionsKey';
// import { sha256 } from 'crypto-hash';

export default {
    data() {
        return {
            currentUser: {} as any,
            currentUserPermissions: {} as PermissionsArray,
            contributors: [] as any[],
            supabase: {} as any,
            permissionsHaveChanged: false,
        };
    },
    created() {
        // Set up supabase
        const supabaseUrl = useRuntimeConfig().public.supabaseUrl;
        const supabaseKey = useRuntimeConfig().public.supabaseKey;
        this.supabase = createClient(supabaseUrl, supabaseKey)

    },
    mounted(){
        // Trigger on mount to avoid SSR related issues
        this.getCurrentUserPermissions();
    },
    methods: {

        // async printHash(baseData: string) {
        //     // Get the current time in milliseconds
        //     const time = new Date().getTime();
        //     // Create a hash of the base data and the time
        //     const hash = await sha256(baseData + time).then( hash => {
        //         console.log(hash)
        //         return hash;
        //     })
            
        // },

        async createUser() {
            // Send a POST request to the api/create-user route with a string payload
            // const { data } = await useFetch('/api/create-user', {
            //     method: 'POST',
            //     body: JSON.stringify({ 
            //         new_user_email: "John.Doe@tcd.ie",
            //         new_user_permissions: {},
            //         access_token: this.session.access_token
            //     })
            // })

            // console.log(data)
        },

        async getSessionAccessToken(){

            // Use supabase.auth.session() to get the current session
            // This will return the session object if the user is logged in
            // Otherwise it will return null
            const { data, error } = await this.supabase.auth.getSession()

            if (!error && data.session) {
                // console.log("Setting current user: " + data.session.user.email)
                return data.session.access_token;
            }
            else {
                // If the user is not logged in, return null
                return null;
            }
        },

        async getContributors() {

            // Get the current session access token
            const access_token:string = await this.getSessionAccessToken();

            // console.log("Access token: " + access_token)
            // console.log("Getting contributors") 
            const { data: contributors, error } = await permissionedFetch(access_token, "profiles");
            // const { data, pending, error, status } = await useFetch(`/api/select/profiles`, {
            //     method: 'POST',
            //     body: JSON.stringify({ 
            //         // jwt: access_token,
            //         // target: target,
            //         // data: {},
            //         // select: select
            //         // "jwt": "eyJhbGciOiJIUzI1NiIsImtpZCI6InJzWiszVVc2V2tNbjRjN2YiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE3MzAzMDg4LCJpYXQiOjE3MTcyOTk0ODgsImlzcyI6Imh0dHBzOi8vaGFkeGVreXVoZGhmbmZoc2ZyY3guc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjE4MjU4YzZiLTU2ODctNDMyOC1iYWE1LTEyYjhmMThjOGVmNCIsImVtYWlsIjoiZGFuZ29yZWlsbHlAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MTE1OTkyMzN9XSwic2Vzc2lvbl9pZCI6IjMxNjAwNzRmLTk4NDgtNGNmOS04YzBiLTI2YjhjN2M5NzMyZCIsImlzX2Fub255bW91cyI6ZmFsc2V9.eLVaItT8GNSqwsiesdD3fCXrsn66Ei1Cx-UK4Cg9vWE",
            //         "target": "profiles",
            //         "data": {},
            //         "select": ["*"]
            //     })
            // })

            if (error) {
                console.error("Error getting contributors: ", error)
                // console.error(error)
                // alert(error.message)
                // throw error
            }
            else {
                console.log("Contributors:")
                console.log(contributors)
                // this.contributors = contributors;
                // Process the profile data into a permissions array
                this.contributors = contributors.map( (profile:UserProfile) => {
                    return this.makeUserPermissionsArray(profile);
                })
            }
        },

        async getCurrentUserPermissions() {
            
            // To get to this page, the user must be logged in
            // So we can just just select * from the contributors list
            // The RLS policies on supabase will handle the selection

            let { data: user, error } = await this.supabase
                .from('profiles')
                .select('*')
                .single()
            if (error) {
                console.error("Error getting user permissions:")
                console.error(error)
                alert(error.message)
                throw error
            }
            else {
                
                // Copy the user object to avoid reactivity issues
                this.currentUser = JSON.parse( JSON.stringify(user) );

                // Temporary hard code for development
                // this.currentUser.is_admin = false;

                this.currentUserPermissions = this.makeUserPermissionsArray(user);
                
            }

        },

        
        makeUserPermissionsArray(user:UserProfile){

            let userPermissionsArray = {} as PermissionsArray;

            userPermissionsArray = {
                    email: user.email,
                    uuid: user.user_id,
                    isAdmin: user.is_admin,
                    // Categories of permissions
                    buildings: [
                        {   
                            key: "bld_general",
                            value: user.bld_general,
                            label: permissionsKey.bld_general
                        },
                        {   
                            key: "bld_tabs",
                            value: user.bld_tabs,
                            label: permissionsKey.bld_tabs
                        },
                        {   
                            key: "bld_gallery",
                            value: user.bld_gallery,
                            label: permissionsKey.bld_gallery
                        },
                        {   
                            key: "bld_times",
                            value: user.bld_times,
                            label: permissionsKey.bld_times
                        },
                        {   
                            key: "bld_tips",
                            value: user.bld_tips,
                            label: permissionsKey.bld_tips
                        },
                        {   
                            key: "bld_further",
                            value: user.bld_further,
                            label: permissionsKey.bld_further
                        },
                        {   
                            key: "bld_map",
                            value: user.bld_map,
                            label: permissionsKey.bld_map
                        }
                    ],
                    spaces: [
                        {   
                            key: "sense_general",
                            value: user.sense_general,
                            label: permissionsKey.sense_general
                        },
                        {   
                            key: "sense_map",
                            value: user.sense_map,
                            label: permissionsKey.sense_map
                        },
                        {   
                            key: "sense_facilities",
                            value: user.sense_facilities,
                            label: permissionsKey.sense_facilities
                        },
                        {   
                            key: "sense_photos",
                            value: user.sense_photos,
                            label: permissionsKey.sense_photos
                        }
                    ],
                    map_misc: [],
                    general: []
    
                }

            return userPermissionsArray;

        },

        

        cancelChanges() {
            // Reset the modified permissions array to the original permissions array
            // this.modifiedPermissions = this.permissions;
        }
    }
}

</script>

<style>
</style>