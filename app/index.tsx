import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../src/components/EmptyState';
import { FilterBar } from '../src/components/FilterBar';
import { TaskItem } from '../src/components/TaskItem';
import { useTasks } from '../src/hooks/useTasks';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, filter, loading, error, allTasksCount, pendingCount, completedCount, setFilter, toggleTask, removeTask, loadTasks } = useTasks();

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1 bg-gray-50">
      <View className="px-5 pt-6">
        <Text className="text-2xl font-bold text-gray-900">Organize seu dia</Text>
        <Text className="mt-1 text-sm text-gray-500">Uma tarefa de cada vez.</Text>
      </View>
      <FilterBar filter={filter} onFilterChange={setFilter} allTasksCount={allTasksCount} pendingCount={pendingCount} completedCount={completedCount} />
      {error ? (
        <View accessibilityRole="alert" className="mx-4 mb-3 rounded-xl bg-red-50 p-4">
          <Text className="text-red-800">{error}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={() => { void loadTasks(); }} className="min-h-12 justify-center">
            <Text className="font-bold text-indigo-700">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {loading && allTasksCount === 0 ? (
        <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#4f46e5" /><Text className="mt-3 text-gray-500">Carregando tarefas…</Text></View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id.toString()}
          renderItem={({ item }) => <TaskItem task={item} onToggle={toggleTask} onDelete={removeTask} />}
          ListEmptyComponent={error ? null : <EmptyState filter={filter} />}
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 100 }}
          refreshing={loading}
          onRefresh={() => { void loadTasks(); }}
        />
      )}
      <View pointerEvents="box-none" className="absolute bottom-8 right-6">
        <TouchableOpacity accessibilityRole="button" accessibilityLabel="Adicionar tarefa" onPress={() => router.push('/form')}
          className="h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg">
          <Text className="text-4xl text-white">+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
