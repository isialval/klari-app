import ProductCard from "@/components/ProductCard";
import { categories } from "@/constants/products";
import { useAuth } from "@/context/AuthContext";
import { productService } from "@/services/productService";
import { userService } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "../types/product";

const ITEMS_PER_PAGE = 6;

interface ProductListBaseProps {
  title: string;
  filterType?: "favorites" | "myProducts";
  emptyMessage: string;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  showBackButton?: boolean;
  initialCategory?: string;
}

export default function ProductListBase({
  title,
  filterType,
  emptyMessage,
  emptyIcon,
  showBackButton = false,
  initialCategory,
}: ProductListBaseProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    initialCategory || 0
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [myProducts, setMyProducts] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const [productsData, favoritesData, inventoryData] = await Promise.all([
        productService.getAll(),
        userService.getFavorites(user.id),
        userService.getInventory(user.id),
      ]);

      setProducts(productsData);
      setFavorites(favoritesData.map((p) => p.id));
      setMyProducts(inventoryData.map((p) => p.id));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!user) return;

      try {
        if (favorites.includes(id)) {
          await userService.removeFavorite(user.id, id);
          setFavorites((prev) => prev.filter((x) => x !== id));
        } else {
          await userService.addFavorite(user.id, id);
          setFavorites((prev) => [...prev, id]);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [favorites, user]
  );

  const toggleMyProduct = useCallback(
    async (id: number) => {
      if (!user) return;

      try {
        if (myProducts.includes(id)) {
          await userService.removeFromInventory(user.id, id);
          setMyProducts((prev) => prev.filter((x) => x !== id));
        } else {
          await userService.addToInventory(user.id, id);
          setMyProducts((prev) => [...prev, id]);
        }
      } catch (error) {
        console.error("Error toggling inventory:", error);
      }
    },
    [myProducts, user]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleCount(ITEMS_PER_PAGE);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Filtrar productos base según el tipo de vista
  const baseProducts = useMemo(() => {
    if (filterType === "favorites") {
      return products.filter((p) => favorites.includes(p.id));
    }
    if (filterType === "myProducts") {
      return products.filter((p) => myProducts.includes(p.id));
    }
    return products;
  }, [filterType, favorites, myProducts, products]);

  const filteredProducts = useMemo(() => {
    return baseProducts.filter((product) => {
      const matchCategory =
        selectedCategory === 0 || product.category === selectedCategory;
      const matchSearch =
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.brand.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [baseProducts, selectedCategory, debouncedSearch]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [hasMore]);

  const handleCategoryChange = (categoryValue: string | number) => {
    setSelectedCategory(categoryValue);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        item={item}
        isFavorite={favorites.includes(item.id)}
        isInMyProducts={myProducts.includes(item.id)}
        onToggleFavorite={toggleFavorite}
        onToggleMyProduct={toggleMyProduct}
      />
    ),
    [favorites, myProducts, toggleFavorite, toggleMyProduct]
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#BB6276" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "right", "left"]}>
      <View className="w-full px-4 pt-4">
        <View className="relative items-center justify-center">
          {showBackButton && (
            <TouchableOpacity
              className="absolute left-0 p-2"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#BB6276" />
            </TouchableOpacity>
          )}
          <Text className="text-primaryPink text-center text-2xl font-semibold">
            {title}
          </Text>
        </View>

        <View className="mt-4 relative">
          <TextInput
            className="text-gray-900 px-4 py-4 pr-12 rounded-full border border-gray-400"
            placeholder="Buscar..."
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
              onPress={() => handleCategoryChange(item.value)}
              className={`flex justify-center mr-2 px-4 py-2 rounded-full ${
                selectedCategory === item.value
                  ? "bg-primaryPink"
                  : "bg-lightPink"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  selectedCategory === item.value
                    ? "text-white"
                    : "text-gray-500"
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
            <Ionicons name={emptyIcon} size={48} color="#ccc" />
            <Text className="text-gray-400 mt-4 text-center px-8">
              {emptyMessage}
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
