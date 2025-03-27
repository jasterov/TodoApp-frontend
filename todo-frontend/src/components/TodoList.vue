<template>
  <div class="todo-container">
    <h1 class="title">{{ texts.pageTitle }}</h1>

    <button @click="startNew" class="new-button">{{ texts.newTask }}</button>

    <ul class="todo-list">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <span class="todo-title">{{ todo.title }}</span>
          <span class="todo-status" :class="{ done: todo.completed, notdone: !todo.completed }">
            {{ todo.completed ? texts.completed : texts.notCompleted }}
          </span>
        </div>
        <div class="buttons">
          <button class="edit-button" @click="editTodo(todo)">{{ texts.edit }}</button>
          <button class="delete-button" @click="remove(todo.id)">{{ texts.delete }}</button>
        </div>
      </li>
    </ul>

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
import { ref, onMounted } from 'vue'
import TodoForm from './TodoForm.vue'
import texts from '../locales/cs'
import type { TodoEntry } from '../types/TodoEntry'
import api from '../api/axios'

const todos = ref<TodoEntry[]>([])
const selectedTodo = ref<TodoEntry | null>(null)
const showForm = ref(false)

const loadTodos = async () => {
  const res = await api.get('/todos')
  todos.value = res.data
}

onMounted(loadTodos)

const remove = async (id: number) => {
  await api.delete(`/todos/${id}`)
  await loadTodos()
}

const editTodo = (todo: TodoEntry) => {
  selectedTodo.value = { ...todo }
  showForm.value = true
}

const startNew = () => {
  selectedTodo.value = null
  showForm.value = true
}

const cancelEdit = () => {
  selectedTodo.value = null
  showForm.value = false
}

const handleSave = () => {
  loadTodos()
  showForm.value = false
}
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
</style>
