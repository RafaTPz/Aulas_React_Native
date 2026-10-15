import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as TaskRepository from '../src/database/taskRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const isEditing = id !== undefined;
  const taskId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : NaN;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const submitting = useRef(false);

  useEffect(() => {
    let active = true;
    setTitle('');
    setDescription('');
    setLoadError(null);
    setValidationError(null);
    setLoading(isEditing);
    if (!isEditing) return;
    async function loadTask() {
      try {
        if (!Number.isSafeInteger(taskId) || taskId <= 0) throw new Error('Identificador de tarefa inválido.');
        const task = await TaskRepository.getTaskById(taskId);
        if (!task) throw new Error('Esta tarefa não foi encontrada.');
        if (active) { setTitle(task.title); setDescription(task.description ?? ''); }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Não foi possível carregar a tarefa.');
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadTask();
    return () => { active = false; };
  }, [isEditing, taskId]);

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }

  async function saveTask() {
    if (submitting.current || loading || loadError) return;
    const trimmedTitle = title.trim();
    if (!trimmedTitle) { setValidationError('Informe um título para a tarefa.'); return; }
    submitting.current = true;
    setSaving(true);
    setValidationError(null);
    try {
      const input = { title: trimmedTitle, description: description.trim() || null };
      if (isEditing) await TaskRepository.updateTask({ ...input, id: taskId });
      else await TaskRepository.createTask(input);
      goBack();
    } catch {
      Alert.alert('Não foi possível salvar', 'Seus dados continuam no formulário. Tente novamente.');
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: isEditing ? 'Editar Tarefa' : 'Nova Tarefa', gestureEnabled: !saving }} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100} style={{ flex: 1 }}>
        {loading ? <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#4f46e5" /></View> : (
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 24 }}>
            {loadError ? (
              <View accessibilityRole="alert" className="rounded-xl bg-red-50 p-4">
                <Text className="text-red-800">{loadError}</Text>
                <TouchableOpacity accessibilityRole="button" onPress={goBack} className="min-h-12 justify-center"><Text className="font-bold text-indigo-700">Voltar para tarefas</Text></TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className="mb-2 text-base font-semibold text-gray-800">Título *</Text>
                <TextInput accessibilityLabel="Título da tarefa" placeholder="O que você precisa fazer?" placeholderTextColor="#6b7280"
                  value={title} onChangeText={(value) => { setTitle(value); setValidationError(null); }} editable={!saving}
                  maxLength={150} autoCapitalize="sentences" className="min-h-14 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900" />
                {validationError ? <Text accessibilityRole="alert" className="mt-2 text-red-700">{validationError}</Text> : null}
                <Text className="mb-2 mt-6 text-base font-semibold text-gray-800">Descrição</Text>
                <TextInput accessibilityLabel="Descrição da tarefa" placeholder="Adicione detalhes (opcional)" placeholderTextColor="#6b7280"
                  value={description} onChangeText={setDescription} editable={!saving} multiline textAlignVertical="top" maxLength={2000}
                  className="min-h-40 rounded-xl border border-gray-300 bg-white px-4 py-3 text-base text-gray-900" />
                <Text className="mt-2 text-xs text-gray-500">* Campo obrigatório</Text>
                <TouchableOpacity accessibilityRole="button" accessibilityState={{ disabled: saving, busy: saving }} disabled={saving}
                  onPress={() => { void saveTask(); }} className={`mt-8 min-h-14 items-center justify-center rounded-xl bg-indigo-600 px-4 py-4 ${saving ? 'opacity-50' : ''}`}>
                  {saving ? <ActivityIndicator color="#ffffff" /> : <Text className="text-base font-bold text-white">{isEditing ? 'Salvar alterações' : 'Criar tarefa'}</Text>}
                </TouchableOpacity>
                <TouchableOpacity accessibilityRole="button" disabled={saving} onPress={goBack} className="mt-3 min-h-12 items-center justify-center">
                  <Text className="font-semibold text-gray-600">Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
