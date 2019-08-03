<template>
  <ul class="todos-list">
    <li class="card todos-list__item" v-for="todo in todos" :key="todo.id" :todo="todo">
      <div class="card-body">
        <h5 class="card-title">{{todo.title}}</h5>
        <p class="card-text">{{todo.body}}</p>
        <p class="card-text" v-if="todo.attachments_blobs && todo.attachments_blobs.length > 0">
          {{ todo.attachments_blobs.length }}
          <i class="fas fa-paperclip"></i>
        </p>
      </div>
      <div class="card-footer todos-item__footer">
        <small>{{formatDate(todo.updated_at)}}</small>
        <span>
          <i
            class="fa fa-edit"
            @click="editTodo(todo)"
            data-toggle="modal"
            data-target="#editTodo"
          />
          <i class="fa fa-trash-alt" @click="removeTodo(todo)" />
        </span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "TodoList",
  props: {
    editTodo: {
      type: Function,
      required: true
    },
    removeTodo: {
      type: Function,
      required: true
    },
    todos: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(d) {
      const date = new Date(d);
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
      const month =
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`;
      const year = date.getFullYear();

      return `${day}.${month}.${year}`;
    }
  },
  directives: {
    focus: {
      inserted: el => {
        el.focus();
      }
    }
  }
};
</script>

<style lang="css">
.todos-list {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  justify-content: flex-start;
}

.todos-list__item {
  display: flex;
  flex: 0 0 32%;
  margin: 0 5px 5px 0;
}

.todos-item__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>