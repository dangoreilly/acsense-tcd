<template>
<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <div class="card bg-purple-100">
                <div class="card-body">
                    <h2 class="card-title text-center">Acsense Login</h2>

                    <form @submit.prevent="login">

                        <div class="form-group">
                            <input v-model="username" type="text" class="form-control my-1" placeholder="Username" required>
                            <input v-model="password" type="password" class="form-control my-1" placeholder="Password" required>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block w-100 mt-1">Login</button>
                    
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

import { createClient } from '@supabase/supabase-js'



export default {
  data() {
    return {
      username: '',
      password: '',
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
        // It will also be used for logging in eventually.
        this.supabase = await createClient(this.$config.public.supabaseUrl, this.$config.public.supabaseKey);
        
        // Check if there's an active session.
        const { data, error } = await this.supabase.auth.getSession()
  
        console.log(data)

        if (data.session) {
            // Redirect to admin page
            console.log("user is logged in")
            return navigateTo('/admin/analytics'); 
        }
        console.log("user is not logged in")
    },

    checkSocialOverride() {
        this.social_override = this.$route.query.bypass
    },

    async login() {
        const { data, error } = await this.supabase.auth.signInWithPassword({
        email: this.username,
        password: this.password,
        })

        if (error) {

            alert(error.message)
            console.log(error)

        } else {

            console.log("user logged in as " + data.user.email)
            navigateTo('/admin/analytics')
            
        }
    },
    loginWithGoogle() {
      // Implement your Google login logic here.
      console.log('Login with Google');
    },
    loginWithMicrosoft() {
      // Implement your Microsoft login logic here.
      console.log('Login with Microsoft');
    },
  }
}

</script>

<style>

</style>