<template>
  <div class="mb-3">
    <button class="btn btn-primary" data-toggle="modal" data-target="#createTodo">Create task</button>

    <div class="modal fade" id="createTodo" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create Task</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
              @click="onClose"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
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
            <form @submit="addTodo" name="createTodo">
              <div class="form-group">
                <label for="todoTitle">Title</label>
                <input
                  id="todoTitle"
                  class="form-control"
                  autofocus
                  autocomplete="off"
                  placeholder="Title"
                  v-model.trim="title"
                  required
                />
              </div>
              <div class="form-group">
                <label for="todoBody">Body</label>
                <input
                  id="todoBody"
                  class="form-control"
                  autofocus
                  autocomplete="off"
                  placeholder="Body"
                  v-model.trim="body"
                  required
                />
              </div>
              <div class="form-group">
                <div class="custom-file">
                  <input
                    type="file"
                    ref="attachments"
                    class="custom-file-input"
                    id="createTodoFileInput"
                    @change="onFilesChange"
                  />
                  <label class="custom-file-label" for="createTodoFileInput">Choose file</label>
                </div>
                <div v-for="(file, index) in attachments" :key="file.name">
                  {{file.name}}
                  <i class="fa fa-trash-alt" @click="removeAttached(index)" />
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="onClose"
            >Close</button>
            <button type="submit" class="btn btn-primary" @click="addTodo">Create</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const initialState = {
  title: "",
  body: "",
  error: ""
};

export default {
  name: "todoCreate",
  data() {
    return {
      ...initialState,
      attachments: []
    };
  },
  methods: {
    onFilesChange() {
      const files = this.$refs.attachments.files;

      for (let i = 0; i < files.length; i += 1) {
        this.attachments.push(files[i]);
      }
    },
    removeAttached(index) {
      this.attachments.splice(index, 1);
      this.$refs.attachments.value = "";
    },
    addTodo() {
      if (!this.title || !this.body) {
        return;
      }
      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("body", this.body);

      for (let i = 0; i < this.attachments.length; i += 1) {
        formData.append(`attachments[${i}]`, this.attachments[i]);
      }

      this.$http.secured
        .post("/todos", formData)
        .then(response => {
          this.$emit("todo-created", response.data);
          this.resetState();
          $("#createTodo").modal("hide");
        })
        .catch(error => this.setError(error, "Cannot create todo"));
    },
    setError(error, text) {
      this.error =
        (error.response && error.response.data && error.response.data.error) ||
        text;
    },
    clearError() {
      this.error = "";
    },
    onClose() {
      this.resetState();
    },
    resetState() {
      this.$refs.attachments.value = "";
      Object.assign(this.$data, initialState, {
        attachments: []
      });
    }
  }
};
</script>
