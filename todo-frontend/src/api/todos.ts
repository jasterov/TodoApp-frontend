import api from './axios'
import type { TodoEntry } from '../types/TodoEntry'

export const getTodos = (page: number, size: number) => {
    return api.get('/todos', { params: { page, size } })
}

export const deleteTodo = (id: number) => {
    return api.delete(`/todos/${id}`)
}

export const createTodo = (todo: TodoEntry) => {
    return api.post('/todos', todo)
}

export const updateTodo = (todo: TodoEntry) => {
    return api.put(`/todos/${todo.id}`, todo)
}
