<template>
<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <div class="card bg-purple-100">
                <div class="card-body">
                    <h2 class="card-title text-center">Reset Password</h2>

                    <form @submit.prevent="resetPassword">

                        <div class="form-group">
                            <input v-model="username" type="text" class="form-control my-3" placeholder="Email" required>
                            <input v-model="password" type="password" class="form-control my-1" placeholder="New Password" required>
                            <input v-model="password_confirm" type="password" class="form-control my-1" placeholder="Re-Type your new password" required>
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

<script setup>

// definePageMeta({
//   middleware: ['auth'],
// });

</script>

<script>

import { createClient } from '@supabase/supabase-js'



export default {
  data() {
    return {
      username: '',
      password: '',
      password_confirm: '',
      social_override: true,
      supabase: {},
    }
  },
  created() {
        // For debugging purposes, you can bypass the social login by adding ?bypass=true to the URL.
        // This will allow for a quick login without having to use Google or Microsoft.
        // this.checkSocialOverride(); // Uncomment this line to hide the social login bypass
        // to login, unless the URL contains ?bypass=true.
        // const runtimeConfig = useRuntimeConfig()
        // const supabaseUrl = runtimeConfig.public.supabaseUrl;
        // const supabaseKey = runtimeConfig.public.supabaseKey;
        // console.log(supabaseUrl);
        // console.log(supabaseKey);
        this.checkIfLoggedIn()

  },
  methods: {

    async checkIfLoggedIn() {
        
        // Create the client
        // It will also be used for resetting the password.
        this.supabase = await createClient(this.$config.public.supabaseUrl, this.$config.public.supabaseKey);
        
        // Check if there's an active session.
        const { data, error } = await this.supabase.auth.getSession()
  
        console.log(data)

        if (!data.session) {
            // Redirect to login page
            return navigateTo('/admin/analytics'); 
        }
    },

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