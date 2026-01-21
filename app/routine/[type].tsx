import { useAuth } from "@/context/AuthContext";
import { routineService } from "@/services/routineService";
import { Routine } from "@/types/routine";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categoryOrder = [
  "LIMPIADOR",
  "TONICO",
  "SERUM",
  "CONTORNO_OJOS",
  "HIDRATANTE",
  "MASCARILLA",
  "PROTECTOR_SOLAR",
];

const categoryNames: Record<string, string> = {
  LIMPIADOR: "Limpiador",
  TONICO: "Tónico",
  SERUM: "Serum",
  CONTORNO_OJOS: "Contorno de ojos",
  HIDRATANTE: "Hidratante",
  MASCARILLA: "Mascarilla",
  PROTECTOR_SOLAR: "Protector solar",
};

export default function RoutineScreen() {
  const { type } = useLocalSearchParams<{ type: "day" | "night" }>();
  const { user } = useAuth();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDay = type === "day";
  const title = isDay ? "Rutina de día" : "Rutina de noche";

  useFocusEffect(
    useCallback(() => {
      loadRoutine();
    }, [type])
  );

  const loadRoutine = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = isDay
        ? await routineService.getActiveDayRoutine(user.id)
        : await routineService.getActiveNightRoutine(user.id);

      console.log("Rutina cargada:", data);
      console.log("Productos cargados:", data?.products);

      setRoutine(data);
    } catch (error) {
      console.error("Error loading routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRoutine = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const newRoutine = isDay
        ? await routineService.createInitialDayRoutine(user.id)
        : await routineService.createInitialNightRoutine(user.id);

      console.log("Rutina creada:", newRoutine);
      console.log("Productos:", newRoutine?.products);

      setRoutine(newRoutine);
    } catch (error: any) {
      console.log("Error:", error);
      Alert.alert("Error", error.message || "No se pudo crear la rutina");
    } finally {
      setIsLoading(false);
    }
  };

  const sortedProducts = routine?.products
    ? [...routine.products].sort(
        (a, b) =>
          categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
      )
    : [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-backgroundPink justify-center items-center">
        <ActivityIndicator size="large" color="#BB6276" />
      </SafeAreaView>
    );
  }
  if (!routine) {
    return (
      <SafeAreaView
        className="flex-1 bg-backgroundPink"
        edges={["top", "right", "left"]}
      >
        <View className="flex-row items-center px-4 pt-4">
          <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
            <Ionicons name="arrow-back" size={24} color="#580423" />
          </TouchableOpacity>
          <Text className="text-primaryPink text-xl font-semibold ml-4">
            {title}
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <Image
            source={require("../../assets/images/serum-empty.jpg")}
            style={{ width: 200, height: 200 }}
            resizeMode="contain"
          />
          <Text className="text-secondaryPink text-lg text-center mt-6">
            Aún no has creado tu rutina
          </Text>
          <TouchableOpacity
            className="bg-primaryPink px-8 py-4 rounded-full mt-6"
            onPress={handleCreateRoutine}
          >
            <Text className="text-white font-semibold">Crear rutina</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      <View className="flex-row items-center justify-between px-4 pt-4">
        <TouchableOpacity onPress={() => router.push(`/(tabs)/home`)}>
          <Ionicons name="arrow-back" size={24} color="#580423" />
        </TouchableOpacity>
        <Text className="text-primaryPink text-xl font-semibold">{title}</Text>
        <View className="px-2"></View>
      </View>
      <Text className="text-white text-sm text-center mt-4 px-4">
        Recuerda seguir el orden indicado al realizar tu rutina
      </Text>
      <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
        {sortedProducts.map((product) => (
          <View key={product.id} className="flex-row items-center mb-4 px-4">
            <View
              className="w-28 h-28 rounded-full overflow-hidden bg-white z-10 border border-4 border-lightPink"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Image
                source={{ uri: product.imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 flex-row items-center bg-white rounded-r-3xl -ml-8 pl-10 pr-4 py-4 min-h-[80px]">
              <View className="flex-1">
                <Text className="text-primaryPink font-bold text-base">
                  {categoryNames[product.category] || product.category}
                </Text>
                <Text className="text-gray-500 text-sm" numberOfLines={2}>
                  {product.name}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View className="flex items-center px-4">
          <TouchableOpacity
            className="bg-primaryPink rounded-2xl py-4 mt-4 mb-4 w-full flex-row items-center justify-center"
            onPress={() =>
              router.push(
                `/routine/edit?type=${type}&routineId=${routine.id}` as any
              )
            }
          >
            <Text className="text-white text-center font-semibold text-lg">
              Editar rutina
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
