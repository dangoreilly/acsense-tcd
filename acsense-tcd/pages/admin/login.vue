<template>
<div class="container">
    <div class="row justify-content-center mt-5">
        <div class="col-md-4">
            <div class="card bg-purple-100">
                <div class="card-body">
                    <h2 class="card-title text-center">Acsense Login</h2>

                    <form @submit.prevent="login" v-if="social_override">

                        <div class="form-group">
                            <input v-model="username" type="text" class="form-control my-1" placeholder="Username" required>
                            <input v-model="password" type="password" class="form-control my-1" placeholder="Password" required>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block w-100 mt-1">Login</button>
                    
                    </form>

                    <div v-if="social_override" class="text-center mt-3">or</div>
                    <div class="mt-3">
                        <!-- <button class="btn btn-outline-light btn-block w-100 my-1" @click="loginWithGoogle">Google</button>
                        <button class="btn btn-outline-light btn-block w-100 my-1" @click="loginWithMicrosoft">Microsoft</button> -->
                        <img src="/images/icons/btn_google_signin_light_normal_web.png" 
                        class="mx-auto d-block my-1 mw-100"
                        style="cursor: pointer;" 
                        @click="loginWithGoogle"
                        alt="Sign in with Google">
                        <img src="/images/icons/ms-symbollockup_signin_light.png" 
                        class="mx-auto d-block my-1 mw-100"
                        style="cursor: pointer;" 
                        @click="loginWithMicrosoft"
                        alt="Sign in with Microsoft">
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>

export default {
  data() {
    return {
      username: '',
      password: '',
      social_override: false,
    }
  },
  created() {
    // For debugging purposes, you can bypass the social login by adding ?bypass=true to the URL.
    // This will allow for a quick login without having to use Google or Microsoft.
    this.checkSocialOverride();
  },
  methods: {
    checkSocialOverride() {
      if (this.$route.query.bypass) {
        this.social_override = true;
      }
    },
    login() {
      // Implement your login logic here, for example, send the data to the server or perform authentication.
      // For this example, we'll just display the entered username and password in the console.
      console.log('Username:', this.username);
      console.log('Password:', this.password);
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