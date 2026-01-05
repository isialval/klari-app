import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoutine } from "../../context/RoutineContext";

// Pasos disponibles
const availableSteps = [
  { id: 1, name: "Limpiador", order: 1 },
  { id: 2, name: "Tónico", order: 2 },
  { id: 3, name: "Serum", order: 3 },
  { id: 4, name: "Contorno de ojos", order: 4 },
  { id: 5, name: "Hidratante", order: 5 },
  { id: 6, name: "Mascarilla", order: 6 },
  { id: 7, name: "Protector solar", order: 7, dayOnly: true },
];

export default function EditRoutineScreen() {
  const { type } = useLocalSearchParams<{ type: "day" | "night" }>();
  const routineType = type || "day";
  const isDay = routineType === "day";

  const {
    daySteps,
    nightSteps,
    setDaySteps,
    setNightSteps,
    updateStepProduct,
  } = useRoutine();

  const steps = isDay ? daySteps : nightSteps;
  const setSteps = isDay ? setDaySteps : setNightSteps;

  // Filtrar pasos disponibles
  const getAvailableStepsForType = () => {
    return availableSteps.filter((step) => {
      if (!isDay && step.dayOnly) return false;
      return true;
    });
  };

  // Pasos que aún no están en la rutina
  const getUnusedSteps = () => {
    const usedIds = steps.map((s) => s.id);
    return getAvailableStepsForType().filter((s) => !usedIds.includes(s.id));
  };

  // Agregar paso
  const handleAddStep = (stepDef: (typeof availableSteps)[0]) => {
    const newStep = {
      id: stepDef.id,
      name: stepDef.name,
      order: stepDef.order,
      product: null,
    };
    const newSteps = [...steps, newStep].sort((a, b) => a.order - b.order);
    setSteps(newSteps);
  };

  // Eliminar paso
  const handleDeleteStep = (stepId: number) => {
    Alert.alert(
      "Eliminar paso",
      "¿Estás seguro de que quieres eliminar este paso?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => setSteps(steps.filter((step) => step.id !== stepId)),
        },
      ]
    );
  };

  // Guardar rutina
  const handleSave = () => {
    Alert.alert("Éxito", "Rutina guardada correctamente", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Seleccionar producto
  const handleSelectProduct = (stepId: number) => {
    router.push(`/routine/select-product?stepId=${stepId}&type=${routineType}`);
  };

  // Quitar producto
  const handleRemoveProduct = (stepId: number) => {
    updateStepProduct(routineType, stepId, null);
  };

  const unusedSteps = getUnusedSteps();

  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      {/* Header */}
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
        {/* Lista de pasos */}
        {steps.map((step) => (
          <View key={step.id} className="flex-row items-center mb-4 px-4">
            <TouchableOpacity
              onPress={() => handleSelectProduct(step.id)}
              className="w-28 h-28 rounded-full overflow-hidden bg-white z-10 border-4 border-lightPink"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              {step.product ? (
                <Image
                  source={step.product.image}
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
                  {step.name}
                </Text>
                {step.product ? (
                  <Text
                    className="text-gray-500 text-sm mt-1 max-h-4"
                    numberOfLines={2}
                  >
                    {step.product.name}
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-sm mt-1 italic">
                    Toca para agregar producto
                  </Text>
                )}
              </View>

              <View className="flex-row items-center">
                {step.product && (
                  <TouchableOpacity
                    onPress={() => handleRemoveProduct(step.id)}
                    className="p-2"
                  >
                    <Ionicons name="close-circle" size={24} color="#9ca3af" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteStep(step.id)}
                  className="p-2"
                >
                  <Ionicons name="trash-outline" size={22} color="#C9677E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Agregar pasos */}
        {unusedSteps.length > 0 && (
          <View className="mx-4 mt-4 mb-2">
            <Text className="text-primaryPink font-semibold mb-3">
              Agregar paso
            </Text>
            <View className="flex-row flex-wrap">
              {unusedSteps.map((stepDef) => (
                <TouchableOpacity
                  key={stepDef.id}
                  onPress={() => handleAddStep(stepDef)}
                  className="bg-white border border-lightPink px-4 py-3 rounded-xl mr-2 mb-2 flex-row items-center"
                >
                  <Ionicons name="add" size={18} color="#580423" />
                  <Text className="text-primaryPink ml-2">{stepDef.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Botón guardar */}
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
