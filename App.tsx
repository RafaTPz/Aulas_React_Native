import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { CreateTaskInput } from "./src/types/task";
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function App() {

  const [task, setTask] = useState<CreateTaskInput>({
    title: "",
    description: "",
  });

  return (
    <View style={styles.container}>
      <Text>Task - Cadastro</Text>
      <TextInput
        onChangeText={(dado) => {
          setTask({ ...task, title: dado });
        }}
        value={task.title}
        placeholder={"Title"}
      />
      <TextInput
        onChangeText={(dado) => {
          setTask({ ...task, description: dado });
        }}
        value={task.description ?? ''}
        placeholder={"Description"}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
