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
import { routineService } from "../../services/routineService";
import { Routine } from "../../types/routine";

const availableSteps = [
  { id: 1, name: "Limpiador", category: "LIMPIADOR", order: 1 },
  { id: 2, name: "Tónico", category: "TONICO", order: 2 },
  { id: 3, name: "Serum", category: "SERUM", order: 3 },
  { id: 4, name: "Contorno de ojos", category: "CONTORNO_OJOS", order: 4 },
  { id: 5, name: "Hidratante", category: "HIDRATANTE", order: 5 },
  { id: 6, name: "Mascarilla", category: "MASCARILLA", order: 6 },
  {
    id: 7,
    name: "Protector solar",
    category: "PROTECTOR_SOLAR",
    order: 7,
    dayOnly: true,
  },
];

export default function EditRoutineScreen() {
  const { type, routineId } = useLocalSearchParams<{
    type: "day" | "night";
    routineId: string;
  }>();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const routineType = type || "day";
  const isDay = routineType === "day";

  useFocusEffect(
    useCallback(() => {
      loadRoutine();
    }, [routineId])
  );

  const loadRoutine = async () => {
    if (!routineId) return;

    setIsLoading(true);
    try {
      const data = await routineService.getById(Number(routineId));
      setRoutine(data);
    } catch (error) {
      console.error("Error loading routine:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const usedCategories = routine?.products.map((p) => p.category) || [];

  const getAvailableStepsForType = () => {
    return availableSteps.filter((step) => {
      if (!isDay && step.dayOnly) return false;
      return true;
    });
  };

  const getUnusedSteps = () => {
    return getAvailableStepsForType().filter(
      (step) => !usedCategories.includes(step.category)
    );
  };
  const handleSave = () => {
    router.back();
  };

  const handleSelectProduct = (category: string) => {
    router.push(
      `/routine/select-product?category=${category}&type=${routineType}&routineId=${routine?.id}` as any
    );
  };

  const handleRemoveProduct = async (productId: number) => {
    if (!routine) return;

    try {
      await routineService.removeProduct(routine.id, productId);
      setRoutine({
        ...routine,
        products: routine.products.filter((p) => p.id !== productId),
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo eliminar el producto");
    }
  };

  const unusedSteps = getUnusedSteps();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-backgroundPink justify-center items-center">
        <ActivityIndicator size="large" color="#BB6276" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      <View className="flex-row items-center justify-between px-4 pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#580423" />
        </TouchableOpacity>
        <Text className="text-primaryPink text-xl font-semibold">
          Editar rutina de {isDay ? "día" : "noche"}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Ionicons name="checkmark" size={28} color="#580423" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 mt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {routine?.products
          .sort(
            (a, b) =>
              availableSteps.findIndex((s) => s.category === a.category) -
              availableSteps.findIndex((s) => s.category === b.category)
          )
          .map((product) => (
            <View key={product.id} className="flex-row items-center mb-4 px-4">
              <TouchableOpacity
                onPress={() => handleSelectProduct(product.category)}
                className="w-28 h-28 rounded-full overflow-hidden bg-white z-10 border-4 border-lightPink"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                {product ? (
                  <Image
                    source={{ uri: product.imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <View className="flex-1 items-center justify-center bg-white">
                    <Ionicons name="add" size={40} color="#9ca3af" />
                  </View>
                )}
              </TouchableOpacity>

              <View className="flex-1 flex-row items-center bg-white rounded-r-3xl -ml-6 pl-10 pr-4 py-4 min-h-[80px]">
                <View className="flex-1">
                  <Text className="text-primaryPink font-bold text-base">
                    {availableSteps.find((s) => s.category === product.category)
                      ?.name || product.category}
                  </Text>
                  <Text
                    className="text-gray-500 text-sm mt-1"
                    numberOfLines={2}
                  >
                    {product.name}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => handleRemoveProduct(product.id)}
                  className="p-2"
                >
                  <Ionicons name="trash-outline" size={22} color="#C9677E" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

        {unusedSteps.length > 0 && (
          <View className="mx-4 mt-4 mb-2">
            <Text className="text-primaryPink font-semibold mb-3">
              Agregar paso
            </Text>
            <View className="flex-row flex-wrap">
              {unusedSteps.map((step) => (
                <TouchableOpacity
                  key={step.id}
                  onPress={() => handleSelectProduct(step.category)}
                  className="bg-white border border-lightPink px-4 py-3 rounded-xl mr-2 mb-2 flex-row items-center"
                >
                  <Ionicons name="add" size={18} color="#580423" />
                  <Text className="text-primaryPink ml-2">{step.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View className="px-4 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-primaryPink rounded-2xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-lg">
              Guardar rutina
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
