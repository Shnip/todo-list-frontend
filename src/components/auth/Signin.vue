<template>
  <div class="raw">
    <div class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
      <h1 class="mt-3 text-center">Sign in</h1>
      <form class="form-signin" @submit.prevent="signin">
        <div class="alert alert-danger" v-if="error">
          {{ error }}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click="clearError"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            v-model="email"
            type="email"
            class="form-control"
            id="email"
            placeholder="email@example.com"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            id="password"
            placeholder="Password"
            minlength="4"
            required
          />
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-primary mb-3">Sign in</button>
        </div>
        <div class="text-center">
          Do not have an account?
          <router-link to="/signup">Sign up</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signin",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    signin() {
      this.$http.plain
        .post("/signin", { email: this.email, password: this.password })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error));
    },
    signinSuccessful(response) {
      if (!response.data.csrf) {
        this.signinFailed(response);
        return;
      }
      localStorage.csrf = response.data.csrf;
      localStorage.signedIn = true;
      this.error = "";
      this.$router.replace("/todos");
    },
    signinFailed(error) {
      this.error =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        "";
      delete localStorage.csrf;
      delete localStorage.signedIn;
    },
    clearError() {
      this.error = "";
    }
  }
};
</script>

<style>
</style>
