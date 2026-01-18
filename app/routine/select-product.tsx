import { useAuth } from "@/context/AuthContext";
import { productService } from "@/services/productService";
import { routineService } from "@/services/routineService";
import { userService } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

const filterTabs = [
  { id: "suggestions", name: "Sugerencias" },
  { id: "favorites", name: "Favoritos", icon: "heart" },
  { id: "myProducts", name: "Mis productos", icon: "checkmark-circle" },
];

const ITEMS_PER_PAGE = 6;

export default function SelectProductScreen() {
  const { category, type, routineId } = useLocalSearchParams<{
    category: string;
    type: "day" | "night";
    routineId: string;
  }>();

  const { user } = useAuth();
  const routineType = type || "day";
  const stepName = categoryNames[category] || category;

  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [myProducts, setMyProducts] = useState<number[]>([]);
  const [selectedTab, setSelectedTab] = useState("suggestions");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user || !category) return;

    setIsLoading(true);
    try {
      const [productsData, favoritesData, inventoryData] = await Promise.all([
        productService.getByCategory(category),
        userService.getFavorites(user.id),
        userService.getInventory(user.id),
      ]);

      setProducts(productsData);
      setFavorites(favoritesData.map((p) => p.id));
      setMyProducts(inventoryData.map((p) => p.id));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (selectedTab === "favorites") {
      filtered = products.filter((p) => favorites.includes(p.id));
    } else if (selectedTab === "myProducts") {
      filtered = products.filter((p) => myProducts.includes(p.id));
    }

    return filtered;
  }, [products, selectedTab, favorites, myProducts]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  const hasMore = visibleCount < filteredProducts.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }
  }, [hasMore]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSave = async () => {
    if (!selectedProduct || !routineId) return;

    setIsSaving(true);
    try {
      await routineService.addProduct(Number(routineId), selectedProduct.id);
      router.back();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => {
      const isSelected = selectedProduct?.id === item.id;

      return (
        <TouchableOpacity
          className={`w-[48%] mb-4 rounded-2xl overflow-hidden bg-white border-2 ${
            isSelected ? "border-primaryPink" : "border-gray-100"
          }`}
          onPress={() => setSelectedProduct(item)}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          {isSelected && (
            <View className="absolute top-2 right-2 z-10 bg-primaryPink rounded-full p-1">
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          )}
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: 120 }}
            resizeMode="cover"
          />
          <View className="p-3">
            <Text
              className="text-sm font-semibold text-gray-700"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text className="text-xs text-gray-400 mt-1">{item.brand}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedProduct]
  );

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
          <Ionicons name="chevron-back" size={28} color="#580423" />
        </TouchableOpacity>
        <Text className="text-primaryPink text-xl font-semibold ml-2">
          Seleccionar {stepName.toLowerCase()}
        </Text>
        <View className="px-2"></View>
      </View>

      <Text className="text-white text-sm text-center px-8 mt-2">
        Selecciona uno de los productos sugeridos para cambiar tu opción actual.
      </Text>

      <Text className="text-primaryPink font-semibold text-lg px-4 mt-6 mb-3">
        Productos sugeridos
      </Text>

      <View className="h-12 mb-2">
        <FlatList
          horizontal
          data={filterTabs}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = selectedTab === item.id;
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectedTab(item.id);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className={`flex-row items-center justify-center mr-2 px-4 py-2 rounded-full border ${
                  isActive
                    ? "bg-white border-primaryPink"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    isActive ? "text-primaryPink" : "text-gray-500"
                  }`}
                >
                  {item.name}
                </Text>
                {item.icon && (
                  <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={isActive ? "#580423" : "#9ca3af"}
                    style={{ marginLeft: 4 }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={visibleProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-10">
            <Ionicons name="search-outline" size={48} color="#FFFF" />
            <Text className="text-white mt-4 text-center">
              No se encontraron productos{"\n"}para este paso
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
      />

      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-backgroundPink">
        <TouchableOpacity
          onPress={handleSave}
          className={`rounded-2xl py-4 items-center ${
            selectedProduct && !isSaving ? "bg-primaryPink" : "bg-gray-300"
          }`}
          disabled={!selectedProduct || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold text-lg">
              Guardar cambio
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
