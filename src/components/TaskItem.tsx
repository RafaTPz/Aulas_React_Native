import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const completed = task.completed === 1;

  async function runAction(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch {
      Alert.alert('Não foi possível salvar', 'Tente novamente. Sua alteração não foi confirmada.');
    } finally {
      setBusy(false);
    }
  }

  function confirmDelete() {
    Alert.alert('Excluir tarefa?', `“${task.title}” será excluída permanentemente.`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void runAction(() => onDelete(task.id)); } },
    ]);
  }

  return (
    <View className={`mb-3 rounded-2xl border border-gray-100 bg-white p-4 ${busy ? 'opacity-50' : ''}`}>
      <View className="flex-row items-start gap-3">
        <TouchableOpacity
          accessibilityRole="checkbox"
          accessibilityLabel={`Concluir ${task.title}`}
          accessibilityState={{ checked: completed, disabled: busy }}
          disabled={busy}
          onPress={() => { void runAction(() => onToggle(task.id, task.completed)); }}
          className={`h-12 w-12 items-center justify-center rounded-xl border-2 ${completed ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}
        >
          <Text className="text-xl font-bold text-white">{completed ? '✓' : ''}</Text>
        </TouchableOpacity>
        <View className="flex-1">
          <Text className={`text-lg font-semibold ${completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</Text>
          {task.description ? <Text className="mt-1 text-sm leading-5 text-gray-500">{task.description}</Text> : null}
          <Text className="mt-3 text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString('pt-BR')}</Text>
        </View>
      </View>
      <View className="mt-2 flex-row justify-end gap-2">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Editar ${task.title}`} disabled={busy}
          onPress={() => router.push({ pathname: '/form', params: { id: task.id.toString() } })}
          className="min-h-12 justify-center rounded-lg bg-indigo-50 px-4">
          <Text className="font-semibold text-indigo-700">Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Excluir ${task.title}`} disabled={busy}
          onPress={confirmDelete} className="min-h-12 justify-center rounded-lg bg-red-50 px-4">
          <Text className="font-semibold text-red-700">Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
