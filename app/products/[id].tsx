import {
  getCategoryById,
  getGoalById,
  getProductById,
  getSkinTypeById,
} from "@/constants/products";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_FAVORITES = [1, 3, 5, 8];
const INITIAL_MY_PRODUCTS = [2, 5, 7, 10];

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [favorites, setFavorites] = useState<number[]>(INITIAL_FAVORITES);
  const [myProducts, setMyProducts] = useState<number[]>(INITIAL_MY_PRODUCTS);

  const product = getProductById(Number(id));

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#ccc" />
        <Text className="text-gray-400 mt-4">Producto no encontrado</Text>
        <TouchableOpacity
          className="mt-4 bg-primaryPink px-6 py-2 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Volver</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const category = getCategoryById(product.categoryId);
  const productSkinTypes = product.skinTypeIds
    .map((id) => getSkinTypeById(id))
    .filter(Boolean);
  const productGoals = product.goalIds
    .map((id) => getGoalById(id))
    .filter(Boolean);

  const isFavorite = favorites.includes(product.id);
  const isInMyProducts = myProducts.includes(product.id);

  const toggleFavorite = () => {
    setFavorites((prev) =>
      prev.includes(product.id)
        ? prev.filter((x) => x !== product.id)
        : [...prev, product.id]
    );
  };

  const toggleMyProduct = () => {
    setMyProducts((prev) =>
      prev.includes(product.id)
        ? prev.filter((x) => x !== product.id)
        : [...prev, product.id]
    );
  };

  const getUseTimeIcon = () => {
    switch (product.useTime) {
      case "día":
        return "sunny-outline";
      case "noche":
        return "moon-outline";
      case "ambos":
        return "time-outline";
      default:
        return "time-outline";
    }
  };

  const getUseTimeLabel = () => {
    switch (product.useTime) {
      case "día":
        return "Uso de día";
      case "noche":
        return "Uso de noche";
      case "ambos":
        return "Día y noche";
      default:
        return product.useTime;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#580423" />
        </TouchableOpacity>

        <View className="flex-row gap-2">
          {isInMyProducts && (
            <View className="bg-green-500 rounded-full p-1.5">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
          {isFavorite && (
            <View className="bg-pink-500 rounded-full p-1.5">
              <Ionicons name="heart" size={16} color="white" />
            </View>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Image
          source={product.image}
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />

        <View className="px-4 pt-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-sm uppercase tracking-wide">
              {product.brand}
            </Text>
            <View className="bg-lightPink px-3 py-1 rounded-full">
              <Text className="text-primaryPink text-xs font-medium">
                {category?.name}
              </Text>
            </View>
          </View>

          <Text className="text-gray-800 text-2xl font-bold mt-2">
            {product.name}
          </Text>

          <View className="flex-row items-center mt-3 bg-gray-50 self-start px-3 py-2 rounded-lg">
            <Ionicons
              name={getUseTimeIcon() as any}
              size={18}
              color="#6B7280"
            />
            <Text className="text-gray-600 text-sm ml-2">
              {getUseTimeLabel()}
            </Text>
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-primaryPink text-lg font-semibold mb-2">
            Descripción
          </Text>
          <Text className="text-gray-600 leading-6">{product.description}</Text>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-primaryPink text-lg font-semibold mb-2">
            Ingredientes
          </Text>
          <View className="bg-gray-50 p-4 rounded-xl">
            <Text className="text-gray-500 text-sm leading-5">
              {product.ingredients}
            </Text>
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-primaryPink text-lg font-semibold mb-3">
            Apto para pieles
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {productSkinTypes.map((skinType) => (
              <View
                key={skinType?.id}
                className="bg-green-50 border border-green-200 px-4 py-2 rounded-full"
              >
                <Text className="text-green-700 text-sm font-medium">
                  {skinType?.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="px-4 mt-6">
          <Text className="text-primaryPink text-lg font-semibold mb-3">
            Te ayuda a
          </Text>
          <View className="gap-2">
            {productGoals.map((goal) => (
              <View
                key={goal?.id}
                className="flex-row items-center bg-pink-50 p-3 rounded-xl"
              >
                <View className="w-6 h-6 rounded-full bg-primaryPink items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
                <Text className="text-gray-700 flex-1 text-sm">
                  {goal?.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-8">
        <View className="flex-row gap-3">
          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
              isFavorite
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 bg-white"
            }`}
            onPress={toggleFavorite}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={20}
              color={isFavorite ? "#E91E63" : "#6B7280"}
            />
            <Text
              className={`ml-2 font-medium ${
                isFavorite ? "text-pink-500" : "text-gray-600"
              }`}
            >
              {isFavorite ? "En favoritos" : "Favorito"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
              isInMyProducts ? "bg-green-500" : "bg-primaryPink"
            }`}
            onPress={toggleMyProduct}
          >
            <Ionicons
              name={isInMyProducts ? "checkmark-circle" : "add-circle-outline"}
              size={20}
              color="white"
            />
            <Text className="ml-2 font-medium text-white">
              {isInMyProducts ? "En mi inventario" : "Agregar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
