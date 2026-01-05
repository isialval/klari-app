import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const routineData = {
  day: {
    title: "Rutina de día",
    steps: [
      { id: 1, name: "Limpiador", product: null },
      {
        id: 3,
        name: "Serum",
        product: {
          name: "Niacinamide 10%",
          brand: "The Ordinary",
          image: require("../../assets/images/product.jpg"),
        },
      },
      { id: 4, name: "Hidratante", product: null },
      {
        id: 5,
        name: "Protector solar",
        product: {
          name: "Eucerin Sun Sensitive Protect Cream SPF50+ 50ml",
          brand: "Eucerin",
          image: require("../../assets/images/product.jpg"),
        },
      },
    ],
    hasRoutine: true,
  },
  night: {
    title: "Rutina de noche",
    steps: [
      { id: 1, name: "Limpiador", product: null },
      { id: 2, name: "Serum", product: null },
      { id: 3, name: "Hidratante", product: null },
    ],
    hasRoutine: false,
  },
};

export default function RoutineScreen() {
  const { type } = useLocalSearchParams<{ type: "day" | "night" }>();

  const routine = routineData[type] || routineData.day;
  const isDay = type === "day";

  if (!routine.hasRoutine) {
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
            {routine.title}
          </Text>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <Image
            source={
              isDay
                ? require("../../assets/images/day.jpg")
                : require("../../assets/images/night.jpg")
            }
            style={{ width: 150, height: 150, borderRadius: 75 }}
            resizeMode="cover"
          />
          <Text className="text-secondaryPink text-lg text-center mt-6">
            Aún no has creado tu rutina
          </Text>
          <TouchableOpacity
            className="bg-primaryPink px-8 py-4 rounded-full mt-6"
            onPress={() => router.push(`/routine/edit?type=${type}`)}
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
        <Text className="text-primaryPink text-xl font-semibold">
          {routine.title}
        </Text>
        <View className="px-2"></View>
      </View>
      <Text className="text-white text-sm text-center mt-4 px-4">
        Recuerda seguir el orden indicado al realizar tu rutina
      </Text>
      <ScrollView className="flex-1 mt-6" showsVerticalScrollIndicator={false}>
        {routine.steps.map((step) => (
          <View key={step.id} className="flex-row items-center mb-4 px-4">
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
                source={
                  step.product?.image ||
                  require("../../assets/images/product.jpg")
                }
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 flex-row items-center bg-white rounded-r-3xl -ml-6 pl-10 pr-4 py-4 min-h-[80px]">
              <View className="flex-1">
                <Text className="text-primaryPink font-bold text-base">
                  {step.name}
                </Text>
                {step.product ? (
                  <Text
                    className="text-gray-500 text-sm max-h-4"
                    numberOfLines={2}
                  >
                    {step.product.name}
                  </Text>
                ) : (
                  <Text className="text-gray-400 text-sm mt-1 italic">
                    Sin producto asignado
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}

        <View className="flex items-center px-4">
          <TouchableOpacity
            className="bg-primaryPink rounded-2xl py-4 mt-4 mb-4 w-full flex-row items-center justify-center"
            onPress={() => router.push(`/routine/edit?type=${type}`)}
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
