import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const goals = [
  {
    id: 1,
    text: "Mejorar la textura de mi piel",
    value: "TEXTURA",
  },
  {
    id: 2,
    text: "Reducir manchas",
    value: "MANCHAS",
  },
  {
    id: 3,
    text: "Reducir rojeces e irritación",
    value: "IRRITACION",
  },
  {
    id: 4,
    text: "Prevenir y tratar lineas de expresión",
    value: "LINEAS_EXPRESION",
  },
  {
    id: 5,
    text: "Minimizar poros",
    value: "POROS",
  },
];

export default function Goals() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleChangeGoals = async () => {
    if (!user || selectedGoals.length === 0) return;

    setIsLoading(true);
    try {
      await Promise.all(
        selectedGoals.map((goal) => api.post(`/users/${user.id}/goals/${goal}`))
      );
      router.replace("/(tabs)/home" as any);
    } catch (error: any) {
      Alert.alert("Error", "No se pudieron guardar los objetivos");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleGoal = (goalValue: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalValue)) {
        return prev.filter((g) => g !== goalValue);
      } else {
        return [...prev, goalValue];
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-2 flex-1 px-6 py-8">
          <View className="flex mb-8">
            <Text className="text-3xl font-bold text-primaryPink mb-2 text-left">
              Personaliza tu experiencia
            </Text>
            <Text className="text-gray-500">
              Cuéntanos sobre tus objetivos, así podemos adaptar mejor tu
              rutina.
            </Text>
          </View>
          <View className="flex mb-10">
            <Text className="text-secondaryPink text-lg text-center mb-1 font-semibold">
              ¿Cuáles son tus objetivos?
            </Text>
            <Text className="text-gray-500 text-center text-sm mb-4">
              Selecciona uno o más objetivos
            </Text>
            <View className="flex w-full">
              {goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.value); // ← cambiar
                return (
                  <TouchableOpacity
                    key={goal.id}
                    className={`flex-row items-center justify-between px-4 py-4 mb-3 rounded-xl border-2 ${
                      isSelected
                        ? "border-primaryPink bg-pink-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => toggleGoal(goal.value)}
                  >
                    <Text
                      className={`flex-1 ${
                        isSelected
                          ? "text-primaryPink font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      {goal.text}
                    </Text>

                    <View
                      className={`w-6 h-6 rounded-full items-center justify-center ${
                        isSelected
                          ? "bg-primaryPink"
                          : "border-2 border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {selectedGoals.length > 0 ? (
            <Text className="text-gray-500 text-center mb-4">
              {selectedGoals.length} objetivo
              {selectedGoals.length > 1 ? "s" : ""} seleccionado
              {selectedGoals.length > 1 ? "s" : ""}
            </Text>
          ) : null}

          <TouchableOpacity
            className={`rounded-2xl py-4 mb-4 ${
              selectedGoals.length > 0 ? "bg-primaryPink" : "bg-gray-300"
            }`}
            onPress={handleChangeGoals}
            disabled={selectedGoals.length === 0 || isLoading} // ← agregar isLoading
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Continuar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
