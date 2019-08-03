<template>
  <div>
    <div class="d-flex justify-content-end">
      <button class="btn btn-link" @click="signOut">Sign out</button>
    </div>
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-sm-10 offset-md-1 col-12">
        <div class="todos">
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
          <h3>Todos</h3>

          <todo-create v-on:todo-created="addToTodos" />
          <todo-edit :todo="currentEdited" v-on:clear-current-edit="clearCurrentEdited" />
          <todo-tabed-list
            :todos="todos"
            :incompleteTodos="incompleteTodos"
            :completedTodos="completedTodos"
            :editTodo="editTodo.bind(this)"
            :removeTodo="removeTodo.bind(this)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TodoCreate from "./TodoCreate";
import TodoEdit from "./TodoEdit";
import TodoTabedList from "./TodoTabedList";

export default {
  name: "Todos",
  components: {
    TodoCreate,
    TodoEdit,
    TodoTabedList
  },
  data() {
    return {
      todos: [],
      error: "",
      currentEdited: ""
    };
  },
  created() {
    this.$http.secured
      .get("/todos")
      .then(response => {
        this.todos = response.data;
      })
      .catch(error => this.setError(error, "Something went wrong"));
  },
  computed: {
    incompleteTodos() {
      return this.todos.filter(todo => todo.status === "in progress");
    },
    completedTodos() {
      return this.todos.filter(todo => todo.status === "complete");
    }
  },
  methods: {
    removeTodo(todo) {
      this.$http.secured
        .delete(`/todos/${todo.id}`)
        .then(() => {
          this.todos.splice(this.todos.indexOf(todo), 1);
        })
        .catch(error => this.setError(error, "Cannot delete todo"));
    },
    editTodo(todo) {
      this.currentEdited = todo;
    },
    clearCurrentEdited() {
      this.currentEdited = "";
    },
    signOut() {
      this.$http.secured
        .delete("/signin")
        .then(() => {
          delete localStorage.csrf;
          delete localStorage.signedIn;
          this.$router.replace("/");
        })
        .catch(error => this.setError(error, "Cannot sign out"));
    },
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    clearError() {
      this.error = "";
    },
    addToTodos(todo) {
      this.todos.push(todo);
    }
  }
};
</script>
