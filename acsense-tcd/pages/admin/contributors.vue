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
                <div v-if="!currentUser.is_admin || true" class="mainMatter-admin">
                    <!-- Section for viewing your own permissions - there is no edit functionality -->
                    <p>Below are the permissions associated with your Acsense account</p>
                    <AdminUserPermissionsEdit :permissions="currentUserPermissions" :disabled="true"/>
                    
                </div>
                <div v-else class="mainMatter-admin">
                    <!-- Section for admins to edit user permissions, add/remove users etc -->
                    <p>This is the admin view</p>

                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script lang="ts">
import {createClient} from '@supabase/supabase-js';
import type { PermissionsArray } from '~/assets/types/permissions';
import permissionsKey from '~/assets/permissionsKey';
import { sha256 } from 'crypto-hash';

export default {
    data() {
        return {
            currentUser: {} as any,
            currentUserPermissions: {} as PermissionsArray,
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

        async printHash(baseData: string) {
            // Get the current time in milliseconds
            const time = new Date().getTime();
            // Create a hash of the base data and the time
            const hash = await sha256(baseData + time).then( hash => {
                console.log(hash)
                return hash;
            })
            
        },

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
                
                // Copy the user object
                // This will highlight to the user when a field is about to be set to a default
                this.currentUser = JSON.parse( JSON.stringify(user) );
                // Temporary hard code for development
                this.currentUser.is_admin = false;

                this.currentUserPermissions = {
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
                
            }

        },

        updatePermissions(newData: PermissionsArray) {
            // Push updates to the contributors profiles table via the /api/update/profiles route

            // Update the current user object
            // The newData PermissionsArray does not have the same signature as the user object
            // So we need to map the keys to the user object

            this.currentUser.is_admin = newData.isAdmin;

            // Loop through the categories of permissions
            // Updating the user object with the new values
            // buildings
            for (let i = 0; i < newData.buildings.length; i++) {
                this.currentUser[newData.buildings[i].key] = newData.buildings[i].value;
            }
            // spaces
            for (let i = 0; i < newData.spaces.length; i++) {
                this.currentUser[newData.spaces[i].key] = newData.spaces[i].value;
            }
            // map_misc
            for (let i = 0; i < newData.map_misc.length; i++) {
                this.currentUser[newData.map_misc[i].key] = newData.map_misc[i].value;
            }
            // general
            for (let i = 0; i < newData.general.length; i++) {
                this.currentUser[newData.general[i].key] = newData.general[i].value;
            }

            // Push object to the profiles table
            // TBD

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