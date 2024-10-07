<template>
<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <div class="card bg-purple-100">
                <div class="card-body">
                    <h2 class="card-title text-center">Reset Password</h2>

                    <form @submit.prevent="resetPassword">

                        <div class="form-group">

                            <label>Email Address</label>
                            <input :value="user.email" type="text" class="form-control mb-3" placeholder="Email" readonly>

                            <label>New Password</label>
                            <input 
                            v-model="password" 
                            type="password" 
                            class="form-control mb-1" 
                            :class="{'is-invalid': password.length < 7}"
                            placeholder="New Password" 
                            required>

                            <label>Confirm New Password</label>
                            <input 
                            v-model="password_confirm" 
                            type="password" 
                            class="form-control mb-1"
                            :class="{'is-invalid': password != password_confirm}" 
                            placeholder="Re-Type your new password" 
                            required>
                        </div>

                        <button 
                        type="submit" 
                        class="btn btn-primary btn-block w-100 mt-3"
                        :disabled="!validPassword()">
                        Reset Password</button>
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>


<script lang="ts">

import { createClient } from '@supabase/supabase-js'
import type { UserProfile } from '~/assets/types/permissions'



export default {
    data() {
        return {
            password: '' as string,
            password_confirm: '' as string,
            social_override: true,
            supabase: {} as any,
            user: {} as UserProfile,
        }
    },
    mounted() {

        this.initSupabase()

        // Log the user in using the access token in the URL
        // if (!this.checkForAccessToken()) {
        //     // If there is no access token, see if this is a logged in user trying to reset their password
        //     if (!this.checkIfLoggedIn()) {
        //         // If the user is not logged in, redirect them to the login page
        //         navigateTo('/admin/login')
        //     }
        // }
        // else {
        //     // If there is an access token, use it to log in
        //     this.loginWithOtp()
        // }
    },
    methods: {

        async initSupabase() {
            // Create the client
            this.supabase = await createClient(this.$config.public.supabaseUrl, this.$config.public.supabaseKey);
            // Get the user
            this.user = await getCurrentUserPermissions()
            // console.log(this.user)
        },
        // async loginWithOtp() {
        //     // Wait for the supabase client to init
        //     while (!this.supabase) {
        //         await new Promise(resolve => setTimeout(resolve, 100))
        //     }
            
        //     const { data, error } = await this.supabase.auth.verifyOtp({ token_hash: accessToken, type: 'email'})

        //     if (error) {
        //         console.log(error)
        //         alert(error.message)
        //     }
        //     else {
        //         console.log(data)
        //         // this.getLoggedInUser()
        //     }
        //     // Once logged in, get the user
        //     let currentUser = await getCurrentUserPermissions()
        //     console.log(currentUser)
        //     this.email = currentUser.email
        // },

        // async checkIfLoggedIn() {
            
        //     // Wait for the supabase client to init
        //     while (!this.supabase) {
        //         await new Promise(resolve => setTimeout(resolve, 100))
        //     }
            
        //     // Check if there's an active session.
        //     const { data, error } = await this.supabase.auth.getSession()
    
        //     console.log(data)

        //     // if (checkForAccessToken()) {
        //     //     // User is resetting password from mail
        //     //     // Prefill email field from url params
        //     //     this.username = url.searchParams.get("email");

        //     // }

        //     if (data.session) {
        //         this.username = data.session.user.email 
        //         return true
        //     }
        //     return false
        // },

        // checkForAccessToken() {
        //     // Check if there's an access token in the URL
        //     // If there is, set the access token and return true
        //     // If there isn't, return false

        //     // Get the access token from the URL
        //     let url = new URL(window.location.href);
        //     let accessToken = url.searchParams.get("token_hash");
        //     // let email = url.searchParams.get("email");
        //     if (accessToken) {
        //         // Set the access token
        //         this.accessToken = accessToken;
        //         return true;
        //     }
        //     else {
        //         return false;
        //     }
        // },

        async resetPassword() {
            const { data, error } = await this.supabase.auth.updateUser({password: this.password})

            if (error) {

                alert(error.message)
                console.log(error)

            } else {

                // console.log("user logged in as " + data.user.email)
                navigateTo('/admin/login')
                
            }
        },

        validPassword() {
            // We don't care much about security, 
            return this.password.length > 7 && this.password == this.password_confirm
        },
    }
}

</script>

<style>

</style>