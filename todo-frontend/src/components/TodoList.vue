<template>
  <div class="todo-container">
    <h1 class="title">{{ texts.pageTitle }}</h1>

    <button @click="startNew" class="new-button">{{ texts.newTask }}</button>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <span class="todo-title">{{ todo.title }}</span>
          <span
            class="todo-status"
            :class="{ done: todo.completed, notdone: !todo.completed }"
          >
            {{ todo.completed ? texts.completed : texts.notCompleted }}
          </span>
        </div>
        <div class="buttons">
          <button class="edit-button" @click="edit(todo)">
            {{ texts.edit }}
          </button>
          <button class="delete-button" @click="remove(todo.id)">
            {{ texts.delete }}
          </button>
        </div>
      </li>
    </ul>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 0">
        {{ texts.prev }}
      </button>
      <span>{{ texts.page }} {{ currentPage + 1 }} z {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPages - 1">
        {{ texts.next }}
      </button>
    </div>

    <div v-if="showForm" class="modal-overlay">
      <div class="modal">
        <TodoForm
          :todo="selectedTodo"
          @saved="handleSave"
          @cancelled="cancelEdit"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import TodoForm from "./TodoForm.vue";
import texts from "../locales/cs";
import type { TodoEntry } from "../types/TodoEntry";
import { getTodos, deleteTodo } from "../api/todos";

const todos = ref<TodoEntry[]>([]);
const selectedTodo = ref<TodoEntry | null>(null);
const showForm = ref(false);
const currentPage = ref(0);
const totalPages = ref(1);
const pageSize = 5;

const loadTodos = async () => {
  const res = await getTodos(currentPage.value, pageSize);
  todos.value = res.data.content;
  totalPages.value = res.data.totalPages;
};

onMounted(loadTodos);

const remove = async (id: number) => {
  await deleteTodo(id);
  if (todos.value.length === 1 && currentPage.value > 0) {
    currentPage.value--;
  }
  await loadTodos();
};

const edit = (todo: TodoEntry) => {
  selectedTodo.value = { ...todo };
  showForm.value = true;
};

const startNew = () => {
  selectedTodo.value = null;
  showForm.value = true;
};

const cancelEdit = () => {
  selectedTodo.value = null;
  showForm.value = false;
};

const handleSave = () => {
  loadTodos();
  showForm.value = false;
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    loadTodos();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
    loadTodos();
  }
};
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.title {
  text-align: center;
  margin-bottom: 24px;
}

.new-button {
  margin-bottom: 20px;
  padding: 8px 14px;
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9f9f9;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 6px;
}

.todo-content {
  display: flex;
  flex-direction: column;
}

.todo-title {
  font-weight: bold;
  font-size: 16px;
}

.todo-status {
  font-size: 13px;
  margin-top: 4px;
}

.todo-status.done {
  color: green;
}

.todo-status.notdone {
  color: #888;
}

.buttons {
  display: flex;
  gap: 8px;
}

.delete-button,
.edit-button {
  padding: 4px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.edit-button {
  background-color: #3498db;
  color: white;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
}
</style>
