import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import * as TaskRepository from '../database/taskRepository';
import type { Task, TaskFilter } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);

  const loadTasks = useCallback(async () => {
    const current = ++request.current;
    setLoading(true);
    setError(null);
    try {
      const data = await TaskRepository.getTasks();
      if (current === request.current) setTasks(data);
    } catch {
      if (current === request.current) setError('Não foi possível carregar as tarefas. Tente novamente.');
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, []);

  // O efeito deve retornar uma limpeza, nunca a Promise da consulta.
  useFocusEffect(useCallback(() => {
    void loadTasks();
    return () => { request.current += 1; };
  }, [loadTasks]));

  const toggleTask = useCallback(async (id: number, currentCompleted: number) => {
    await TaskRepository.toggleTaskComplete(id, currentCompleted === 0 ? 1 : 0);
    await loadTasks();
  }, [loadTasks]);

  const removeTask = useCallback(async (id: number) => {
    await TaskRepository.deleteTask(id);
    await loadTasks();
  }, [loadTasks]);

  return {
    tasks: tasks.filter((task) => filter === 'pending' ? task.completed === 0
      : filter === 'completed' ? task.completed === 1 : true),
    allTasksCount: tasks.length,
    pendingCount: tasks.filter((task) => task.completed === 0).length,
    completedCount: tasks.filter((task) => task.completed === 1).length,
    filter, loading, error, setFilter, toggleTask, removeTask, loadTasks,
  };
}
