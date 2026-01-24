import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { productService } from "../../services/productService";
import { userService } from "../../services/userService";
import { Product } from "../../types/product";

const categoryNames: Record<string, string> = {
  LIMPIADOR: "Limpiador",
  TONICO: "Tónico",
  SERUM: "Serum",
  CONTORNO_OJOS: "Contorno de ojos",
  HIDRATANTE: "Hidratante",
  MASCARILLA: "Mascarilla",
  PROTECTOR_SOLAR: "Protector solar",
};

const skinTypeNames: Record<string, string> = {
  NORMAL: "Normal",
  SECA: "Seca",
  GRASA: "Grasa",
  MIXTA: "Mixta",
  SENSIBLE: "Sensible",
};

const goalNames: Record<string, string> = {
  TEXTURA: "Mejorar la textura de mi piel",
  MANCHAS: "Reducir manchas",
  IRRITACION: "Reducir rojeces e irritación",
  LINEAS_EXPRESION: "Prevenir y tratar lineas de expresión",
  POROS: "Minimizar poros",
};

const applicationTimeLabels: Record<string, { label: string; icon: string }> = {
  DIA: { label: "Uso de día", icon: "sunny-outline" },
  NOCHE: { label: "Uso de noche", icon: "moon-outline" },
  AMBOS: { label: "Día y noche", icon: "time-outline" },
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInMyProducts, setIsInMyProducts] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  const [isTogglingInventory, setIsTogglingInventory] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!user || !id) return;

    setIsLoading(true);
    try {
      const productId = Number(id);

      // Cargar producto y verificar estados en paralelo
      const [productData, isFav, isInv] = await Promise.all([
        productService.getById(productId),
        userService.isFavorite(user.id, productId),
        userService.isInInventory(user.id, productId),
      ]);

      setProduct(productData as any);
      setIsFavorite(isFav);
      setIsInMyProducts(isInv);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user || !product) return;

    setIsTogglingFavorite(true);
    try {
      if (isFavorite) {
        await userService.removeFavorite(user.id, product.id);
      } else {
        await userService.addFavorite(user.id, product.id);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };

  const toggleMyProduct = async () => {
    if (!user || !product) return;

    setIsTogglingInventory(true);
    try {
      if (isInMyProducts) {
        await userService.removeFromInventory(user.id, product.id);
      } else {
        await userService.addToInventory(user.id, product.id);
      }
      setIsInMyProducts(!isInMyProducts);
    } catch (error) {
      console.error("Error toggling inventory:", error);
    } finally {
      setIsTogglingInventory(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#BB6276" />
      </SafeAreaView>
    );
  }

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
          source={{ uri: product.imageUrl }}
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
                {categoryNames[product.category] || product.category}
              </Text>
            </View>
          </View>

          <Text className="text-gray-800 text-2xl font-bold mt-2">
            {product.name}
          </Text>

          <View className="flex-row items-center mt-3 bg-gray-50 self-start px-3 py-2 rounded-lg">
            <Ionicons
              name={
                (applicationTimeLabels[product.applicationTime]?.icon as any) ||
                "time-outline"
              }
              size={18}
              color="#6B7280"
            />
            <Text className="text-gray-600 text-sm ml-2">
              {applicationTimeLabels[product.applicationTime]?.label ||
                product.applicationTime}
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
            {product.skinTypes.map((skinType) => (
              <View
                key={skinType}
                className="bg-green-50 border border-green-200 px-4 py-2 rounded-full"
              >
                <Text className="text-green-700 text-sm font-medium">
                  {skinTypeNames[skinType] || skinType}
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
            {product.goals.map((goal) => (
              <View
                key={goal}
                className="flex-row items-center bg-pink-50 p-3 rounded-xl"
              >
                <View className="w-6 h-6 rounded-full bg-primaryPink items-center justify-center mr-3">
                  <Ionicons name="checkmark" size={14} color="white" />
                </View>
                <Text className="text-gray-700 flex-1 text-sm">
                  {goalNames[goal] || goal}
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
            disabled={isTogglingFavorite}
          >
            {isTogglingFavorite ? (
              <ActivityIndicator
                size="small"
                color={isFavorite ? "#E91E63" : "#6B7280"}
              />
            ) : (
              <>
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
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
              isInMyProducts ? "bg-green-500" : "bg-primaryPink"
            }`}
            onPress={toggleMyProduct}
            disabled={isTogglingInventory}
          >
            {isTogglingInventory ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons
                  name={
                    isInMyProducts ? "checkmark-circle" : "add-circle-outline"
                  }
                  size={20}
                  color="white"
                />
                <Text className="ml-2 font-medium text-white">
                  {isInMyProducts ? "En mi inventario" : "Agregar"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
