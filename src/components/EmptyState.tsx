import { Text, View } from 'react-native';
import type { TaskFilter } from '../types/task';

const MESSAGES: Record<TaskFilter, { emoji: string; title: string; subtitle: string }> = {
  all: { emoji: '📋', title: 'Nenhuma tarefa ainda!', subtitle: 'Toque no botão + para adicionar sua primeira tarefa.' },
  pending: { emoji: '🎉', title: 'Tudo em dia!', subtitle: 'Não há tarefas pendentes. Que eficiência!' },
  completed: { emoji: '⏳', title: 'Nenhuma tarefa concluída', subtitle: 'Conclua algumas tarefas para vê-las aqui.' },
};

export function EmptyState({ filter }: { filter: TaskFilter }) {
  const { emoji, title, subtitle } = MESSAGES[filter];
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="mb-4 text-6xl">{emoji}</Text>
      <Text className="mb-2 text-center text-xl font-bold text-gray-700">{title}</Text>
      <Text className="text-center text-sm leading-5 text-gray-500">{subtitle}</Text>
    </View>
  );
}
