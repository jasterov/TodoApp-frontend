<template>
  <div class="form">
    <h3>{{ todoCopy.id ? texts.editTask : texts.createTask }}</h3>

    <input
      type="text"
      v-model="todoCopy.title"
      :placeholder="texts.title"
      required
    />

    <input
      type="text"
      v-model="todoCopy.description"
      :placeholder="texts.description"
    />

    <div class="checkbox-row">
      <input
        type="checkbox"
        id="completed"
        v-model="todoCopy.completed"
      />
      <label for="completed">{{ texts.done }}</label>
    </div>

    <div class="form-buttons">
      <button @click="save">{{ texts.save }}</button>
      <button @click="$emit('cancelled')">{{ texts.cancel }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, reactive, toRaw } from 'vue'
import api from '../api/axios'
import texts from '../locales'
import type { TodoEntry } from '../types/TodoEntry'

const props = defineProps<{ todo: TodoEntry | null }>()
const emit = defineEmits(['saved', 'cancelled'])

const emptyTodo = (): TodoEntry => ({
  title: '',
  description: '',
  completed: false
})

const todoCopy = reactive<TodoEntry>(emptyTodo())

watch(
  () => props.todo,
  (newVal) => {
    Object.assign(todoCopy, newVal || emptyTodo())
  },
  { immediate: true }
)

const save = async () => {
  const raw = toRaw(todoCopy)

  if (!raw.title || raw.title.trim() === '') {
    alert('Název úkolu nesmí být prázdný.')
    return
  }

  if (raw.id) {
    await api.put(`/todos/${raw.id}`, raw)
  } else {
    await api.post('/todos', raw)
  }

  emit('saved')
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

input[type="text"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

button {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  transition: background 0.2s;
}

button:hover {
  background-color: #2980b9;
}
</style>
