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
                 <!-- Add in a guard to avoid annoying hydration issues -->
                <div v-if="loaded">
                    <!-- The main matter will depend on if the user is an admin -->
                    <div v-if="!currentUser.is_admin" class="mainMatter-admin">
                        <!-- Section for viewing your own permissions - there is no edit functionality -->
                        <p>Below are the permissions associated with your Acsense account</p>
                        <!-- <p>{{ currentUser }}</p> -->
                        <AdminUserPermissionsEdit :user="currentUser" :disabled="true"/> 
                        
                    </div>
                    <div v-else class="mainMatter-admin">
                        <!-- Section for admins to edit user permissions, add/remove users etc -->
                        <!-- <p>Manage the permissions of contributors</p>
                        <button class="btn btn-warning" @click="getContributors">Get Contributors</button> -->

                        <!-- Loop through all the profiles apart from the current user -->
                        <div class="accordion">
                            <div v-for="(profile, index) in contributors">
                                <!-- There's no reason for an admin to be editing their own profile -->
                                <!-- They can really only cause problems doing that -->
                                <AccordionStep v-if="profile.email != currentUser.email">
                                    <template #AccordionStepHeader>
                                        {{ profile.email }}
                                        <!-- Badge to show admin status -->
                                        <small 
                                        v-if="profile.is_admin"
                                        class="d-inline-flex mx-3 px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">
                                        Admin
                                        </small>
                                    </template>
                                    <template #AccordionStepBody>
                                        <AdminUserPermissionsEdit 
                                        :user="profile" 
                                        :disabled="profile.is_admin && !currentUser.is_super_admin" 
                                        :sessionAccessToken="sessionAccessToken" 
                                        :isSuperAdmin="currentUser.is_super_admin"
                                        @permissions-updated="getContributorsifAdmin()"
                                        @user-deleted="getContributors"/>
                                    </template> 
                                </AccordionStep>
                            </div>
                        </div>
                    </div>

                    <div class="card mt-3" v-if="currentUser.is_super_admin">
                        <div class="input-group">
                            <input 
                            type="text" 
                            class="form-control" 
                            placeholder="New Contributor Email" 
                            v-model="newUserEmail">
                            <button 
                            class="btn btn-outline-secondary"
                            type="button" 
                            @click="createUser()"
                            id="button-addon2">Add Contributor</button>
                        </div>

                        <div v-if="createUserActionLink != ''" class="m-3">
                            <p>Contributor added successfully.</p>
                            <p><a :href="mailToLink">Click here to generate an email with link to the signup page so they can set their password</a></p>
                            <p>Alternatively, Copy and paste the following link and send it to them to complete their registration. <strong>The link can only be clicked once, so do not click it yourself</strong></p>
                            <p>{{ createUserActionLink }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </NuxtLayout>
</template>

<script lang="ts">
import {createClient} from '@supabase/supabase-js';
import { get } from 'lodash';
// import type { PermissionsArray } from '~/assets/types/permissions';
import type { UserProfile } from '~/assets/types/permissions';
// import permissionsKey from '~/assets/permissionsKey';
// import { sha256 } from 'crypto-hash';

export default {
    data() {
        return {
            currentUser: {} as UserProfile,
            // currentUserPermissions: {} as PermissionsArray,
            contributors: [] as UserProfile[],
            supabase: {} as any,
            permissionsHaveChanged: false,
            loaded: false,
            sessionAccessToken: "",
            newUserEmail: "",
            createUserActionLink: "",
            mailToLink: ""
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

        // Check if the current user is an admin, and if they are, get the contributors
        this.getContributorsifAdmin();
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

            // Get the current session access token
            const access_token:string = await getSessionAccessToken(this.supabase);

            let initialSignupLink = "";
            let mailToLink = "";

            // First, check that the email is valid
            if (!this.newUserEmail.includes("@") || !this.newUserEmail.includes(".")) {
                alert("Invalid email address")
                return;
            }

            // Send a POST request to the api/create-user route with a string payload
            try {
                const data = await $fetch(`/api/create-user`, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        jwt: access_token,
                        data: this.newUserEmail,
                    })

                })

                initialSignupLink = data.recovery_email_data.properties?.action_link as string;
                mailToLink = makeInviteMail(data.recovery_email_data);
                console.log(data.recovery_email_data)
                // alert("User Creation Successful")
            }
            catch (error) {
                console.error("Error creating user", error)
                alert("Error creating user. See console for details")
            }

            this.createUserActionLink = initialSignupLink;
            this.mailToLink = mailToLink;

            // Get the contributors again to update the list
            this.getContributors();

        },

        async getContributorsifAdmin() {
            // Wait for the current user to be initialised
            while (this.currentUser.email == undefined) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Check if the current user is an admin
            if (this.currentUser.is_admin) {
                // If they are, get the contributors
                this.getContributors();
            }
        },

        async getContributors() {

            // Get the current session access token
            const access_token:string = await getSessionAccessToken(this.supabase);

            // console.log("Access token: " + access_token)
            // console.log("Getting contributors") 
            const { data: contributors, error } = await permissionedFetch(access_token, "profiles");

            if (error) {
                console.error("Error getting contributors: ", error)
                // console.error(error)
                // alert(error.message)
                // throw error
            }
            else {
                console.log("Contributors:")
                console.log(contributors)
                this.contributors = JSON.parse(JSON.stringify(contributors));
            }
        },

        async getCurrentUserPermissions() {
            // Keep requesting a user object until it is returned
            // This is to avoid SSR related issues
            this.currentUser = await getCurrentUserPermissions();
            this.loaded = true;

            // If the current user is an admin, Get additional data
            if (this.currentUser.is_admin){

                // Get the session access token for updating the tables, if applicable
                this.sessionAccessToken = await getSessionAccessToken(this.supabase);
                const { data, error } = await permissionedFetch(this.sessionAccessToken, "superadmin");
                // Check if the user is a super admin
                if(this.currentUser.email == data){
                    this.currentUser.is_super_admin = true;
                }
            }

            
        },

    }
}
    definePageMeta({
        middleware: 'auth'
    })

</script>

<style>
</style>