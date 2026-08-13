export interface Task {
    id: number
    title: string
    description: string | null
    completed: number
    createdAt: string
    filter: TaskFilter
}

export type TaskFilter = 'all' | 'pending' | 'completed'

export interface CreateTaskInput {
    title: string
    description: string | null
}

export interface UpdateTaskInput {
    id: number
    title: string
    description: string | null
}