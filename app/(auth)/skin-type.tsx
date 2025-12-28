import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function SkinType() {
  const [selectedSkinType, setSelectedSkinType] = useState("");

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
              Conocer tu tipo de piel nos ayuda a recomendarte productos
              adecuados.
            </Text>
          </View>
          <View className="flex mb-10">
            <Text className="text-secondaryPink  text-lg text-center mb-4 font-semibold">
              ¿Cuál es tu tipo de piel?
            </Text>
            <View className="flex-row justify-center flex-wrap w-full">
              {skinTypes.map((type) => {
                const isSelected = selectedSkinType === type.title;

                return (
                  <TouchableOpacity
                    key={type.id}
                    className="m-2 mb-4"
                    onPress={() => setSelectedSkinType(type.title)}
                  >
                    <ImageBackground
                      source={type.image}
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                        overflow: "hidden",
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: isSelected ? 4 : 0,
                        borderColor: isSelected ? "#BB6276" : "transparent",
                      }}
                    >
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: isSelected
                            ? "rgba(0, 0, 0, 0.55)"
                            : "rgba(0, 0, 0, 0.3)",
                          borderRadius: 50,
                        }}
                      />

                      {isSelected && (
                        <Ionicons name="checkmark" size={40} color="#BB6276" />
                      )}

                      <Text
                        className="text-center text-white font-semibold"
                        style={{
                          fontSize: isSelected ? 10 : 12,
                        }}
                      >
                        {type.title}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            className={`rounded-2xl py-4 mb-4 ${
              selectedSkinType ? "bg-primaryPink" : "bg-gray-300"
            }`}
            onPress={() => {
              router.push("/(auth)/goals");
            }}
            disabled={selectedSkinType === ""}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Continuar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
