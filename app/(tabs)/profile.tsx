import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const skinTypes = [
  {
    id: 1,
    title: "Normal",
    value: "NORMAL",
    image: require("../../assets/images/skintypes/piel_normal.jpg"),
  },
  {
    id: 2,
    title: "Seca",
    value: "SECA",
    image: require("../../assets/images/skintypes/piel_seca.jpg"),
  },
  {
    id: 3,
    title: "Grasa",
    value: "GRASA",
    image: require("../../assets/images/skintypes/piel_grasa.jpg"),
  },
  {
    id: 4,
    title: "Mixta",
    value: "MIXTA",
    image: require("../../assets/images/skintypes/piel_mixta.jpg"),
  },
  {
    id: 5,
    title: "Sensible",
    value: "SENSIBLE",
    image: require("../../assets/images/skintypes/piel_sensible.jpg"),
  },
];

const goals = [
  { id: 1, text: "Mejorar la textura de mi piel", value: "TEXTURA" },
  { id: 2, text: "Reducir manchas", value: "MANCHAS" },
  { id: 3, text: "Reducir rojeces e irritación", value: "IRRITACION" },
  {
    id: 4,
    text: "Prevenir y tratar lineas de expresión",
    value: "LINEAS_EXPRESION",
  },
  { id: 5, text: "Minimizar poros", value: "POROS" },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [userSkinType, setUserSkinType] = useState<string>("");
  const [userGoals, setUserGoals] = useState<string[]>([]);

  const [selectedSkinType, setSelectedSkinType] = useState<string>("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/${user.id}`);
      setUserSkinType(data.skinType || "");
      setUserGoals(data.goals || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSkinType = skinTypes.find((s) => s.value === userSkinType);

  const toggleGoal = (goalValue: string) => {
    if (!isEditing) return;
    setSelectedGoals((prev) => {
      if (prev.includes(goalValue)) {
        return prev.filter((g) => g !== goalValue);
      } else {
        return [...prev, goalValue];
      }
    });
  };

  const handleEdit = () => {
    setSelectedSkinType(userSkinType);
    setSelectedGoals([...userGoals]);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSelectedSkinType(userSkinType);
    setSelectedGoals([...userGoals]);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await api.patch(
        `/users/${user.id}/skin-type?skinType=${selectedSkinType}`
      );

      for (const goal of userGoals) {
        if (!selectedGoals.includes(goal)) {
          await api.delete(`/users/${user.id}/goals/${goal}`);
        }
      }
      for (const goal of selectedGoals) {
        if (!userGoals.includes(goal)) {
          await api.post(`/users/${user.id}/goals/${goal}`);
        }
      }

      setUserSkinType(selectedSkinType);
      setUserGoals(selectedGoals);
      setIsEditing(false);
      Alert.alert(
        "Perfil actualizado",
        "Tus preferencias han sido guardadas. Te recomendamos revisar tu rutina para asegurarte de que los productos sean adecuados para tu nuevo perfil.",
        [{ text: "Entendido" }]
      );
    } catch {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-backgroundPink justify-center items-center">
        <ActivityIndicator size="large" color="#BB6276" />
      </SafeAreaView>
    );
  }
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
                  Piel{" "}
                  {skinTypes.find((s) => s.value === userSkinType)?.title ||
                    userSkinType}
                </Text>
              </View>
            </View>
          </View>

          <View className="mx-4 mb-6">
            <Text className="text-primaryPink text-lg font-semibold mb-3">
              Mis metas
            </Text>

            <View className="bg-white rounded-2xl p-4">
              {userGoals.length > 0 ? (
                userGoals.map((goalValue, index) => {
                  const goalInfo = goals.find((g) => g.value === goalValue);
                  return (
                    <View
                      key={index}
                      className={`flex-row items-center ${
                        index < userGoals.length - 1
                          ? "mb-3 pb-3 border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <View className="w-6 h-6 rounded-full bg-primaryPink items-center justify-center mr-3">
                        <Ionicons name="checkmark" size={14} color="white" />
                      </View>
                      <Text className="text-gray-700 flex-1">
                        {goalInfo?.text || goalValue}
                      </Text>
                    </View>
                  );
                })
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
              onPress={logout}
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
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color="#580423" />
            ) : (
              <Ionicons name="checkmark" size={28} color="#580423" />
            )}
          </TouchableOpacity>
        </View>

        <View className="mx-4 mb-6">
          <Text className="text-primaryPink text-lg font-semibold mb-3">
            Mi tipo de piel
          </Text>

          <View className="flex-row justify-center flex-wrap">
            {skinTypes.map((type) => {
              const isSelected = selectedSkinType === type.value;

              return (
                <TouchableOpacity
                  key={type.id}
                  className="m-1"
                  onPress={() => setSelectedSkinType(type.value)}
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
            const isSelected = selectedGoals.includes(goal.value);
            return (
              <TouchableOpacity
                key={goal.id}
                className={`flex-row items-center justify-between px-4 py-3 mb-2 rounded-xl border-2 ${
                  isSelected
                    ? "border-primaryPink bg-pink-50"
                    : "border-gray-200 bg-white"
                }`}
                onPress={() => toggleGoal(goal.value)}
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
            className={`rounded-2xl py-4 ${
              isSaving ? "bg-gray-300" : "bg-primaryPink"
            }`}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Guardar cambios
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
