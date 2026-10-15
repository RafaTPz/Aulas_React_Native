import { Text, TouchableOpacity, View } from 'react-native';
import type { TaskFilter } from '../types/task';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  allTasksCount: number;
  pendingCount: number;
  completedCount: number;
}

export function FilterBar({ filter, onFilterChange, allTasksCount, pendingCount, completedCount }: FilterBarProps) {
  const options: { value: TaskFilter; label: string; count: number }[] = [
    { value: 'all', label: 'Todas', count: allTasksCount },
    { value: 'pending', label: 'Pendentes', count: pendingCount },
    { value: 'completed', label: 'Concluídas', count: completedCount },
  ];
  return (
    <View className="flex-row gap-2 px-4 py-4">
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          accessibilityRole="button"
          accessibilityState={{ selected: filter === option.value }}
          onPress={() => onFilterChange(option.value)}
          className={`min-h-12 flex-1 items-center justify-center rounded-xl px-1 py-3 ${filter === option.value ? 'bg-indigo-600' : 'bg-white'}`}
        >
          <Text className={`text-xs font-semibold ${filter === option.value ? 'text-white' : 'text-gray-600'}`}>
            {option.label} ({option.count})
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
