import { getDatabase } from './database';
import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task';

export async function getTasks(): Promise<Task[]> {
  const db = await getDatabase();
  return db.getAllAsync<Task>('SELECT * FROM tasks ORDER BY createdAt DESC, id DESC');
}

export async function getTaskById(id: number): Promise<Task | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Task>('SELECT * FROM tasks WHERE id = ?', id);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO tasks (title, description, completed, createdAt) VALUES (?, ?, 0, ?)',
    input.title, input.description, createdAt,
  );
  return { ...input, id: result.lastInsertRowId, completed: 0, createdAt };
}

export async function updateTask(input: UpdateTaskInput): Promise<void> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
    input.title, input.description, input.id,
  );
  if (result.changes === 0) throw new Error('Tarefa não encontrada.');
}

export async function toggleTaskComplete(id: number, completed: number): Promise<void> {
  if (completed !== 0 && completed !== 1) throw new Error('Status inválido.');
  const db = await getDatabase();
  await db.runAsync('UPDATE tasks SET completed = ? WHERE id = ?', completed, id);
}

export async function deleteTask(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM tasks WHERE id = ?', id);
}
