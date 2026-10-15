import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#4f46e5' }, headerTintColor: '#ffffff', contentStyle: { backgroundColor: '#f9fafb' } }}>
        <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
        <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
      </Stack>
    </>
  );
}
