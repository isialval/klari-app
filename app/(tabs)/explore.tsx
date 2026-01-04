import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { id: 0, name: "Todos" },
  { id: 1, name: "Contorno de ojos" },
  { id: 2, name: "Tónicos" },
  { id: 3, name: "Hidratantes" },
  { id: 4, name: "Serums" },
  { id: 5, name: "Protectores solares" },
  { id: 6, name: "Limpiadores" },
  { id: 7, name: "Mascarillas" },
];

const products = [
  {
    id: 1,
    name: "Eye Cream Retinol",
    brand: "The Ordinary",
    categoryId: 1,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 2,
    name: "Caffeine Solution",
    brand: "The Ordinary",
    categoryId: 1,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 3,
    name: "Glycolic Acid Toner",
    brand: "Pixi",
    categoryId: 2,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 4,
    name: "Hydrating Toner",
    brand: "Klairs",
    categoryId: 2,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 5,
    name: "Moisturizing Cream",
    brand: "CeraVe",
    categoryId: 3,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 6,
    name: "Water Cream",
    brand: "Tatcha",
    categoryId: 3,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 7,
    name: "Niacinamide 10%",
    brand: "The Ordinary",
    categoryId: 4,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 8,
    name: "Vitamin C Serum",
    brand: "Skinceuticals",
    categoryId: 4,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 9,
    name: "Hyaluronic Acid",
    brand: "The Ordinary",
    categoryId: 4,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 10,
    name: "UV Defense SPF50",
    brand: "La Roche-Posay",
    categoryId: 5,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 11,
    name: "Sunscreen SPF30",
    brand: "Supergoop",
    categoryId: 5,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 12,
    name: "Foaming Cleanser",
    brand: "CeraVe",
    categoryId: 6,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 13,
    name: "Oil Cleanser",
    brand: "DHC",
    categoryId: 6,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 14,
    name: "Clay Mask",
    brand: "Aztec Secret",
    categoryId: 7,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 15,
    name: "Sheet Mask Pack",
    brand: "Innisfree",
    categoryId: 7,
    image: require("../../assets/images/product.jpg"),
  },
];

const ITEMS_PER_PAGE = 6;

export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(ITEMS_PER_PAGE);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 0 || product.categoryId === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, debouncedSearch]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [hasMore]);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const renderProduct = useCallback(
    ({ item }: { item: (typeof products)[0] }) => (
      <TouchableOpacity
        className="w-[48%] mb-4 rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100"
        onPress={() => console.log("Ver producto:", item.name)}
      >
        <Image
          source={item.image}
          style={{ width: "100%", height: 120 }}
          resizeMode="cover"
        />
        <View className="p-3">
          <Text className="text-xs text-gray-400">{item.brand}</Text>
          <Text
            className="text-sm font-semibold text-gray-700 mt-1"
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "right", "left"]}>
      <View className="w-full px-4 pt-4">
        <Text className="text-primaryPink text-center text-2xl font-semibold">
          Explorar productos
        </Text>
        <View className="mt-4 relative">
          <TextInput
            className="text-gray-900 px-4 py-4 pr-12 rounded-full border border-gray-400"
            placeholder="Buscar"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          <View className="absolute right-4 top-0 bottom-0 justify-center">
            <Ionicons name="search" size={24} color="#BB6276" />
          </View>
        </View>
      </View>

      <View className="h-12 mt-4">
        <FlatList
          horizontal
          data={categories}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleCategoryChange(item.id)}
              className={`flex justify-center mr-2 px-4 py-2 rounded-full ${
                selectedCategory === item.id ? "bg-primaryPink" : "bg-lightPink"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedCategory === item.id ? "text-white" : "text-gray-500"
                }`}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="px-4 mt-4 mb-2" />

      <FlatList
        data={visibleProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text className="text-gray-400 mt-4">
              No se encontraron productos
            </Text>
          </View>
        }
        ListFooterComponent={
          hasMore ? (
            <View className="py-4 items-center">
              <ActivityIndicator size="small" color="#580423" />
            </View>
          ) : null
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}
