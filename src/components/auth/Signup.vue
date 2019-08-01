<template>
  <div class="raw">
    <div class="col-lg-4 offset-lg-4 col-md-6 offset-md-3 col-sm-8 offset-sm-2 col-12">
      <h1 class="mt-3 text-center">Sign up</h1>
      <form class="form-signin" @submit.prevent="signup">
        <div class="alert alert-danger" v-for="(error, index) in errors" :key="error">
          {{ error }}
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
            @click.prevent="deleteError(index)"
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
        <div class="form-group">
          <label for="password_confirmation">Password Confirmation</label>
          <input
            v-model="password_confirmation"
            type="password"
            class="form-control"
            id="password_confirmation"
            placeholder="Password Confirmation"
            minlength="4"
            required
          />
        </div>
        <div class="text-center">
          <button type="submit" class="btn btn-primary mb-3">Sign up</button>
        </div>
        <div class="text-center">
          Already have an account?
          <router-link to="/">Sign in</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Signup",
  data() {
    return {
      email: "",
      password: "",
      password_confirmation: "",
      errors: ""
    };
  },
  methods: {
    signup() {
      this.$http.plain
        .post("/signup", {
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then(response => this.signupSuccessful(response))
        .catch(error => this.signupFailed(error));
    },
    signupSuccessful(response) {
      if (!response.data.csrf) {
        this.signupFailed(response);
        return;
      }
      localStorage.csrf = response.data.csrf;
      localStorage.signedIn = true;
      this.error = "";
      this.$router.replace("/todos");
    },
    signupFailed(error) {
      debugger;
      this.errors =
        (error.response && error.response.data && error.response.data.errors) ||
        "Something went wrong";
      delete localStorage.csrf;
      delete localStorage.signedIn;
    },
    deleteError(index) {
      this.$delete(this.errors, index);
    }
  }
};
</script>

<style>
</style>
