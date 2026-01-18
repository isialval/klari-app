import { Product } from "@/constants/products";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  item: Product;
  isFavorite: boolean;
  isInMyProducts: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleMyProduct: (id: number) => void;
}

export default function ProductCard({
  item,
  isFavorite,
  isInMyProducts,
  onToggleFavorite,
  onToggleMyProduct,
}: ProductCardProps) {
  const [showRemoveOptions, setShowRemoveOptions] = useState(false);
  const router = useRouter();

  const handleRemoveFavorite = () => {
    onToggleFavorite(item.id);
    setShowRemoveOptions(false);
  };

  const handleRemoveMyProduct = () => {
    onToggleMyProduct(item.id);
    setShowRemoveOptions(false);
  };

  const showOptionsButton = isFavorite || isInMyProducts;

  return (
    <View className="w-[48%] mb-4 rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (showRemoveOptions) {
            setShowRemoveOptions(false);
          } else {
            router.push(`/products/${item.id}`);
          }
        }}
      >
        <View className="relative">
          <Image
            source={item.image}
            style={{ width: "100%", height: 120 }}
            resizeMode="cover"
          />

          <View className="absolute top-2 left-2 flex-row gap-1">
            {isInMyProducts && (
              <View className="bg-green-500 rounded-full p-1">
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            )}
            {isFavorite && (
              <View className="bg-pink-500 rounded-full p-1">
                <Ionicons name="heart" size={12} color="white" />
              </View>
            )}
          </View>

          {showOptionsButton && (
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
              onPress={() => setShowRemoveOptions(!showRemoveOptions)}
            >
              <Ionicons
                name={showRemoveOptions ? "close" : "ellipsis-vertical"}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <View className="p-3">
        <Text className="text-xs text-gray-400">{item.brand}</Text>
        <Text
          className="text-sm font-semibold text-gray-700 mt-1"
          numberOfLines={2}
        >
          {item.name}
        </Text>

        <View className="mt-3 pt-2 border-t border-gray-100">
          {showRemoveOptions ? (
            <View className="gap-2">
              {isFavorite && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleRemoveFavorite}
                >
                  <Ionicons
                    name="heart-dislike-outline"
                    size={16}
                    color="#E91E63"
                  />
                  <Text className="text-xs ml-2 text-pink-500">
                    Quitar de favoritos
                  </Text>
                </TouchableOpacity>
              )}
              {isInMyProducts && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={handleRemoveMyProduct}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={16}
                    color="#22C55E"
                  />
                  <Text className="text-xs ml-2 text-green-500">
                    Quitar de mi inventario
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View className="flex-row justify-between items-center">
              {!isFavorite && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => onToggleFavorite(item.id)}
                >
                  <Ionicons name="heart-outline" size={16} color="#6B7280" />
                  <Text className="text-xs ml-1 text-gray-500">Favorito</Text>
                </TouchableOpacity>
              )}
              {isFavorite && !isInMyProducts && <View />}

              {!isInMyProducts && (
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => onToggleMyProduct(item.id)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text className="text-xs ml-1 text-gray-500">Lo tengo</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
