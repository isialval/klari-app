import ProductCard from "@/components/ProductCard";
import { categories } from "@/constants/products";
import { useAuth } from "@/context/AuthContext";
import {
  PageResponse,
  productService,
  ProductSummaryDTO,
} from "@/services/productService";
import { userService } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProductListBaseProps {
  title: string;
  filterType?: "favorites" | "myProducts";
  emptyMessage: string;
  emptyIcon: keyof typeof Ionicons.glyphMap;
  showBackButton?: boolean;
  initialCategory?: string;
}

const PAGE_SIZE = 20;

export default function ProductListBase({
  title,
  filterType,
  emptyMessage,
  emptyIcon,
  showBackButton = false,
  initialCategory,
}: ProductListBaseProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    initialCategory || 0,
  );

  const [products, setProducts] = useState<ProductSummaryDTO[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [inventoryIds, setInventoryIds] = useState<Set<number>>(new Set());

  const isLoadingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearch, selectedCategory]);

  const loadUserLists = useCallback(async () => {
    if (!user) return;

    try {
      const [favResponse, invResponse] = await Promise.all([
        userService.getFavorites(user.id, 0, 1000),
        userService.getInventory(user.id, 0, 1000),
      ]);

      setFavoriteIds(new Set(favResponse.content.map((p) => p.id)));
      setInventoryIds(new Set(invResponse.content.map((p) => p.id)));
    } catch (error) {
      console.error("Error loading user lists:", error);
    }
  }, [user]);

  const loadProducts = useCallback(
    async (pageToLoad: number, reset: boolean = false) => {
      if (!user || isLoadingRef.current) return;

      isLoadingRef.current = true;
      const isFirstPage = pageToLoad === 0;

      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        let response: PageResponse<ProductSummaryDTO>;
        const categoryParam =
          selectedCategory === 0 ? undefined : (selectedCategory as string);
        const hasSearch = debouncedSearch.trim().length > 0;

        if (filterType === "favorites") {
          response = await userService.getFavorites(
            user.id,
            pageToLoad,
            PAGE_SIZE,
            categoryParam,
          );
        } else if (filterType === "myProducts") {
          response = await userService.getInventory(
            user.id,
            pageToLoad,
            PAGE_SIZE,
            categoryParam,
          );
        } else if (hasSearch) {
          response = await productService.search(
            debouncedSearch,
            categoryParam,
            pageToLoad,
            PAGE_SIZE,
          );
        } else if (categoryParam) {
          const categoryResponse = await productService.getByCategory(
            categoryParam,
            pageToLoad,
            PAGE_SIZE,
          );
          response = {
            ...categoryResponse,
            content: categoryResponse.content.map((p) => ({
              id: p.id,
              name: p.name,
              brand: p.brand,
              imageUrl: p.imageUrl,
              category: p.category,
            })),
          };
        } else {
          response = await productService.getPage(pageToLoad, PAGE_SIZE);
        }

        let filteredContent = response.content;
        if (filterType && hasSearch) {
          const searchLower = debouncedSearch.toLowerCase();
          filteredContent = response.content.filter(
            (p) =>
              p.name.toLowerCase().includes(searchLower) ||
              p.brand.toLowerCase().includes(searchLower),
          );
        }

        if (reset || isFirstPage) {
          setProducts(filteredContent);
        } else {
          setProducts((prev) => {
            const existingIds = new Set(prev.map((p) => p.id));
            const newProducts = filteredContent.filter(
              (p) => !existingIds.has(p.id),
            );
            return [...prev, ...newProducts];
          });
        }

        setHasMore(!response.last && response.content.length > 0);
        setPage(pageToLoad + 1);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        isLoadingRef.current = false;
      }
    },
    [user, filterType, selectedCategory, debouncedSearch],
  );

  useEffect(() => {
    loadUserLists();
  }, [loadUserLists]);

  useEffect(() => {
    loadProducts(0, true);
  }, [debouncedSearch, selectedCategory, filterType]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore) return;
    loadProducts(page, false);
  }, [hasMore, isLoading, isLoadingMore, page, loadProducts]);

  const toggleFavorite = useCallback(
    async (id: number) => {
      if (!user) return;

      const isFav = favoriteIds.has(id);

      try {
        if (isFav) {
          await userService.removeFavorite(user.id, id);
          setFavoriteIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });

          if (filterType === "favorites") {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }
        } else {
          await userService.addFavorite(user.id, id);
          setFavoriteIds((prev) => new Set(prev).add(id));
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    },
    [user, favoriteIds, filterType],
  );

  const toggleMyProduct = useCallback(
    async (id: number) => {
      if (!user) return;

      const isInv = inventoryIds.has(id);

      try {
        if (isInv) {
          await userService.removeFromInventory(user.id, id);
          setInventoryIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });

          if (filterType === "myProducts") {
            setProducts((prev) => prev.filter((p) => p.id !== id));
          }
        } else {
          await userService.addToInventory(user.id, id);
          setInventoryIds((prev) => new Set(prev).add(id));
        }
      } catch (error) {
        console.error("Error toggling inventory:", error);
      }
    },
    [user, inventoryIds, filterType],
  );

  const renderProduct = useCallback(
    ({ item }: { item: ProductSummaryDTO }) => (
      <ProductCard
        item={item as any}
        isFavorite={favoriteIds.has(item.id)}
        isInMyProducts={inventoryIds.has(item.id)}
        onToggleFavorite={toggleFavorite}
        onToggleMyProduct={toggleMyProduct}
      />
    ),
    [favoriteIds, inventoryIds, toggleFavorite, toggleMyProduct],
  );

  const keyExtractor = useCallback(
    (item: ProductSummaryDTO) => item.id.toString(),
    [],
  );

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
              onPress={() => setSelectedCategory(item.value)}
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
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        ListEmptyComponent={
          isLoading ? (
            <View className="flex-1 items-center justify-center py-10">
              <ActivityIndicator size="large" color="#BB6276" />
              <Text className="text-gray-400 mt-4">Cargando productos...</Text>
            </View>
          ) : (
            <View className="flex-1 items-center justify-center py-10">
              <Ionicons name={emptyIcon} size={48} color="#ccc" />
              <Text className="text-gray-400 mt-4 text-center px-8">
                {emptyMessage}
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          isLoadingMore ? (
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
