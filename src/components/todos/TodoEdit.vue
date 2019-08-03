<template>
  <div class="modal fade" tabindex="-1" role="dialog" id="editTodo">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit todo</h5>
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
          <form @submit="updateTodo(todo)">
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
              <label for="todo_status">Status</label>
              <select class="form-control" id="todo_status" v-model="status">
                <option value="in progress">In progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
            <div class="form-group">
              <div class="custom-file">
                <input
                  type="file"
                  ref="files"
                  class="custom-file-input"
                  id="editTodoFileInput"
                  @change="onFilesChange"
                />
                <label class="custom-file-label" for="editTodoFileInput">Choose file</label>
              </div>
              <div v-for="(file, index) in attachments_blobs" :key="file.id">
                {{file.filename}}
                <i class="fa fa-trash-alt" @click="removeFromBlobs(index)" />
              </div>
              <div v-for="(file, index) in newAttachments" :key="file.name">
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
          <button type="submit" class="btn btn-primary" @click="updateTodo(todo)">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const initialState = {
  title: "",
  body: "",
  status: "",
  error: ""
};

export default {
  name: "TodoEdit",
  props: ["todo"],
  data() {
    return {
      ...initialState,
      willDestroyedBlobs: [],
      newAttachments: [],
      attachments_blobs: []
    };
  },
  watch: {
    todo(newTodo, old) {
      if (!old && newTodo) {
        const newData = {
          title: newTodo.title,
          body: newTodo.body,
          status: newTodo.status,
          attachments_blobs: [...newTodo.attachments_blobs]
        };
        Object.assign(this.$data, newData);
      }
    }
  },
  methods: {
    onFilesChange() {
      const files = this.$refs.files.files;

      for (let i = 0; i < files.length; i += 1) {
        this.newAttachments.push(files[i]);
      }
    },
    removeAttached(index) {
      this.newAttachments.splice(index, 1);
      this.$refs.files.value = "";
    },
    removeFromBlobs(index) {
      const blob = this.attachments_blobs.splice(index, 1);
      this.willDestroyedBlobs.push(blob[0].id);
    },
    updateTodo(todo) {
      const textInputs = {
        title: this.title,
        body: this.body,
        status: this.status
      };

      const formData = new FormData();
      formData.append("title", this.title);
      formData.append("body", this.body);
      formData.append("status", this.status);

      for (let i = 0; i < this.newAttachments.length; i += 1) {
        formData.append(`attachments[${i}]`, this.newAttachments[i]);
      }

      for (let i = 0; i < this.willDestroyedBlobs.length; i += 1) {
        formData.append(`willDestroyedBlobs[${i}]`, this.willDestroyedBlobs[i]);
      }

      this.$http.secured
        .patch(`/todos/${todo.id}`, formData)
        .then(res => {
          Object.assign(todo, textInputs, { attachments_blobs: res.data });
          this.resetState();
          this.$emit("clear-current-edit");
          $("#editTodo").modal("hide");
        })
        .catch(error => this.setError(error, "Cannot update todo"));
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
      this.$emit("clear-current-edit");
      this.resetState();
    },
    resetState() {
      this.$refs.files.value = "";
      Object.assign(this.$data, initialState, {
        willDestroyedBlobs: [],
        newAttachments: [],
        attachments_blobs: []
      });
    }
  }
};
</script>
