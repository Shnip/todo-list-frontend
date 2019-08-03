import Vue from "vue";
import Router from "vue-router";
import Signin from "@/components/auth/Signin";
import Signup from "@/components/auth/Signup";
import Todos from "@/components/todos/Todos";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!localStorage.signedIn) {
    next("/");
    return;
  }
  next();
};

const ifAuthenticated = (to, from, next) => {
  if (localStorage.signedIn) {
    next("/todos");
    return;
  }

  next();
};

export default new Router({
  routes: [
    {
      path: "/",
      name: "Signin",
      component: Signin,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
      beforeEnter: ifAuthenticated
    },
    {
      path: "/todos",
      name: "Todos",
      component: Todos,
      beforeEnter: ifNotAuthenticated
    }
  ]
});
