import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoutine } from "../../context/RoutineContext";

const skinTypes = [
  {
    id: 1,
    title: "Normal",
    image: require("../../assets/images/skintypes/piel_normal.jpg"),
  },
  {
    id: 2,
    title: "Seca",
    image: require("../../assets/images/skintypes/piel_seca.jpg"),
  },
  {
    id: 3,
    title: "Grasa",
    image: require("../../assets/images/skintypes/piel_grasa.jpg"),
  },
  {
    id: 4,
    title: "Mixta",
    image: require("../../assets/images/skintypes/piel_mixta.jpg"),
  },
  {
    id: 5,
    title: "Sensible",
    image: require("../../assets/images/skintypes/piel_sensible.jpg"),
  },
];

const goals = [
  { id: 1, text: "Mejorar la textura de mi piel" },
  { id: 2, text: "Reducir manchas" },
  { id: 3, text: "Reducir rojeces e irritación" },
  { id: 4, text: "Prevenir y tratar lineas de expresión" },
  { id: 5, text: "Minimizar poros" },
];

export default function ProfileScreen() {
  const { userProfile, setSkinType, setGoals } = useRoutine();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedSkinType, setSelectedSkinType] = useState(
    userProfile.skinType
  );
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    userProfile.goals
  );

  const currentSkinType = skinTypes.find(
    (s) => s.title === userProfile.skinType
  );

  const toggleGoal = (goalText: string) => {
    if (!isEditing) return;
    setSelectedGoals((prev) => {
      if (prev.includes(goalText)) {
        return prev.filter((g) => g !== goalText);
      } else {
        return [...prev, goalText];
      }
    });
  };

  const handleEdit = () => {
    setSelectedSkinType(userProfile.skinType);
    setSelectedGoals(userProfile.goals);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedSkinType(userProfile.skinType);
    setSelectedGoals(userProfile.goals);
    setIsEditing(false);
  };

  const handleSave = () => {
    setSkinType(selectedSkinType);
    setGoals(selectedGoals);
    setIsEditing(false);
    Alert.alert("Éxito", "Perfil actualizado correctamente");
  };

  if (!isEditing) {
    return (
      <SafeAreaView
        className="flex-1 bg-backgroundPink"
        edges={["top", "right", "left"]}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="items-center pt-6 pb-4">
            <Text className="text-primaryPink text-2xl font-semibold">
              Mi Perfil
            </Text>
          </View>

          <View className="items-center mb-6">
            <View
              className="w-20 h-20 rounded-full bg-lightPink items-center justify-center"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Ionicons name="person" size={40} color="#580423" />
            </View>
          </View>

          <View className="mx-4 mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-primaryPink text-lg font-semibold">
                Mi tipo de piel
              </Text>
            </View>

            <View className="bg-white rounded-2xl p-4 flex-row items-center">
              {currentSkinType && (
                <ImageBackground
                  source={currentSkinType.image}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    overflow: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      backgroundColor: "rgba(0, 0, 0, 0.3)",
                      borderRadius: 25,
                    }}
                  />
                </ImageBackground>
              )}
              <View className="ml-4 flex-1">
                <Text className="text-gray-800 font-semibold text-lg">
                  Piel {userProfile.skinType}
                </Text>
              </View>
            </View>
          </View>

          <View className="mx-4 mb-6">
            <Text className="text-primaryPink text-lg font-semibold mb-3">
              Mis metas
            </Text>

            <View className="bg-white rounded-2xl p-4">
              {userProfile.goals.length > 0 ? (
                userProfile.goals.map((goal, index) => (
                  <View
                    key={index}
                    className={`flex-row items-center ${
                      index < userProfile.goals.length - 1
                        ? "mb-3 pb-3 border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <View className="w-6 h-6 rounded-full bg-primaryPink items-center justify-center mr-3">
                      <Ionicons name="checkmark" size={14} color="white" />
                    </View>
                    <Text className="text-gray-700 flex-1">{goal}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-center italic">
                  No has seleccionado metas
                </Text>
              )}
            </View>
          </View>

          <View className="mx-4 mb-4">
            <TouchableOpacity
              className="bg-primaryPink rounded-2xl py-4 flex-row items-center justify-center"
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white text-center font-semibold text-lg ml-2">
                Editar perfil
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mx-4 mt-4">
            <TouchableOpacity
              className="bg-white rounded-2xl p-4 flex-row items-center justify-center"
              onPress={() => router.replace("/(auth)/login")}
            >
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <Text className="text-red-500 ml-2 font-semibold">
                Cerrar sesión
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="flex-row items-center justify-between px-4 pt-4 pb-4">
          <TouchableOpacity onPress={handleCancel}>
            <Ionicons name="close" size={24} color="#580423" />
          </TouchableOpacity>
          <Text className="text-primaryPink text-xl font-semibold">
            Editar Perfil
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Ionicons name="checkmark" size={28} color="#580423" />
          </TouchableOpacity>
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-primaryPink text-lg font-semibold mb-3">
            Mi tipo de piel
          </Text>

          <View className="flex-row justify-center flex-wrap">
            {skinTypes.map((type) => {
              const isSelected = selectedSkinType === type.title;

              return (
                <TouchableOpacity
                  key={type.id}
                  className="m-1"
                  onPress={() => setSelectedSkinType(type.title)}
                >
                  <ImageBackground
                    source={type.image}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      overflow: "hidden",
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: isSelected ? 3 : 0,
                      borderColor: isSelected ? "#BB6276" : "transparent",
                    }}
                  >
                    <View
                      style={{
                        ...StyleSheet.absoluteFillObject,
                        backgroundColor: isSelected
                          ? "rgba(0, 0, 0, 0.55)"
                          : "rgba(0, 0, 0, 0.3)",
                        borderRadius: 30,
                      }}
                    />
                    {isSelected && (
                      <Ionicons name="checkmark" size={24} color="#BB6276" />
                    )}
                  </ImageBackground>
                  <Text
                    className={`text-center text-xs mt-1 ${
                      isSelected
                        ? "text-primaryPink font-semibold"
                        : "text-gray-500"
                    }`}
                  >
                    {type.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-primaryPink text-lg font-semibold mb-3">
            Mis metas
          </Text>

          {goals.map((goal) => {
            const isSelected = selectedGoals.includes(goal.text);
            return (
              <TouchableOpacity
                key={goal.id}
                className={`flex-row items-center justify-between px-4 py-3 mb-2 rounded-xl border-2 ${
                  isSelected
                    ? "border-primaryPink bg-pink-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => toggleGoal(goal.text)}
              >
                <Text
                  className={`flex-1 text-sm ${
                    isSelected
                      ? "text-primaryPink font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {goal.text}
                </Text>

                <View
                  className={`w-5 h-5 rounded-full items-center justify-center ${
                    isSelected ? "bg-primaryPink" : "border-2 border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={12} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="mx-4 mb-4">
          <TouchableOpacity
            className="bg-primaryPink rounded-2xl py-4"
            onPress={handleSave}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Guardar cambios
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
