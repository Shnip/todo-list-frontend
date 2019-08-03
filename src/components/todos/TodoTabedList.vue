<template>
  <div class="mb-2">
    <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          id="all-todos-tab"
          data-toggle="pill"
          href="#pills-all"
          role="tab"
          aria-controls="pills-all"
          aria-selected="true"
        >All</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="incompleted-todos-tab"
          data-toggle="pill"
          href="#pills-incompleted"
          role="tab"
          aria-controls="pills-incompleted"
          aria-selected="false"
        >In progress</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          id="completed-todos-tab"
          data-toggle="pill"
          href="#pills-completed"
          role="tab"
          aria-controls="pills-completed"
          aria-selected="false"
        >Completed</a>
      </li>
    </ul>

    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-all"
        role="tabpanel"
        aria-labelledby="all-todos-tab"
      >
        <todo-list :todos="todos" :editTodo="editTodo" :removeTodo="removeTodo" />
      </div>
      <div
        class="tab-pane fade"
        id="pills-incompleted"
        role="tabpanel"
        aria-labelledby="incompleted-todos-tab"
      >
        <todo-list :todos="incompleteTodos" :editTodo="editTodo" :removeTodo="removeTodo" />
      </div>
      <div
        class="tab-pane fade"
        id="pills-completed"
        role="tabpanel"
        aria-labelledby="completed-todos-tab"
      >
        <todo-list :todos="completedTodos" :editTodo="editTodo" :removeTodo="removeTodo" />
      </div>
    </div>
  </div>
</template>

<script>
import TodoList from "./TodoList";

export default {
  name: "TodoTabedList",
  components: {
    TodoList
  },
  props: {
    todos: {
      type: Array
    },
    incompleteTodos: {
      type: Array
    },
    completedTodos: {
      type: Array
    },
    editTodo: {
      type: Function
    },
    removeTodo: {
      type: Function
    }
  }
};
</script>
