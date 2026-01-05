import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoutine } from "../../context/RoutineContext";

// Tipos
type Product = {
  id: number;
  name: string;
  brand: string;
  categoryId: number;
  image: any;
};

// Mapeo de pasos a categorías
const stepToCategoryMap: Record<number, number> = {
  1: 6, // Limpiador -> Limpiadores
  2: 2, // Tónico -> Tónicos
  3: 4, // Serum -> Serums
  4: 1, // Contorno de ojos -> Contorno de ojos
  5: 3, // Hidratante -> Hidratantes
  6: 7, // Mascarilla -> Mascarillas
  7: 5, // Protector solar -> Protectores solares
};

// Productos de ejemplo
const allProducts: Product[] = [
  {
    id: 1,
    name: "Eye Cream Retinol",
    brand: "The Ordinary",
    categoryId: 1,
    image: require("../../assets/images/product.jpg"),
  },
  {
    id: 2,
    name: "Caffeine Solution 5%",
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
    name: "Hyaluronic Acid 2%",
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

// Tabs de filtro
const filterTabs = [
  { id: "suggestions", name: "Sugerencias App" },
  { id: "favorites", name: "Favoritos", icon: "heart" },
  { id: "myProducts", name: "Mis productos", icon: "checkmark-circle" },
];

const ITEMS_PER_PAGE = 6;

export default function SelectProductScreen() {
  const { stepId, type } = useLocalSearchParams<{
    stepId: string;
    type: "day" | "night";
  }>();

  // Obtener datos del context
  const { daySteps, nightSteps, updateStepProduct } = useRoutine();

  const stepIdNum = parseInt(stepId || "1", 10);
  const routineType = type || "day";

  // Obtener paso actual y su producto
  const steps = routineType === "day" ? daySteps : nightSteps;
  const currentStep = steps.find((s) => s.id === stepIdNum);
  const stepName = currentStep?.name || "Paso";
  const currentProduct = currentStep?.product || null;
  const categoryId = stepToCategoryMap[stepIdNum] || 0;

  const [selectedTab, setSelectedTab] = useState("suggestions");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    currentProduct
      ? {
          ...currentProduct,
          categoryId: categoryId,
        }
      : null
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Filtrar productos por categoría del paso
  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => p.categoryId === categoryId);

    if (selectedTab === "favorites") {
      filtered = filtered.filter((p) => [1, 7, 10].includes(p.id));
    } else if (selectedTab === "myProducts") {
      filtered = filtered.filter((p) => [2, 8, 12].includes(p.id));
    }

    return filtered;
  }, [categoryId, selectedTab]);

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

  const handleSave = () => {
    if (selectedProduct) {
      // Guardar en el context (sin categoryId)
      updateStepProduct(routineType, stepIdNum, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        brand: selectedProduct.brand,
        image: selectedProduct.image,
      });
    }
    // Volver a edit.tsx
    router.back();
  };

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => {
      const isSelected = selectedProduct?.id === item.id;

      return (
        <TouchableOpacity
          className={`w-[48%] mb-4 rounded-2xl overflow-hidden bg-white border-2 ${
            isSelected ? "border-primaryPink" : "border-gray-100"
          }`}
          onPress={() => handleSelectProduct(item)}
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
            source={item.image}
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

  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#580423" />
        </TouchableOpacity>
        <Text className="text-primaryPink text-xl font-semibold ml-2">
          Cambiar {stepName.toLowerCase()}
        </Text>
        <View className="px-2"></View>
      </View>

      {/* Descripción */}
      <Text className="text-white text-sm text-center px-8 mt-2">
        Selecciona uno de los productos sugeridos para cambiar tu opción actual.
      </Text>

      {/* Producto actual */}
      {currentProduct && (
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 flex-row items-center">
          <View
            className="w-16 h-16 rounded-full overflow-hidden border-2 border-lightPink"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            <Image
              source={currentProduct.image}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-gray-800 font-semibold">
              {stepName}{" "}
              <Text className="text-gray-400 font-normal">(Opción actual)</Text>
            </Text>
            <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
              {currentProduct.brand} {currentProduct.name}
            </Text>
          </View>
        </View>
      )}

      {/* Título productos sugeridos */}
      <Text className="text-primaryPink font-semibold text-lg px-4 mt-6 mb-3">
        Productos sugeridos
      </Text>

      {/* Tabs de filtro */}
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

      {/* Grid de productos */}
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

      {/* Botón guardar */}
      <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4 bg-backgroundPink">
        <TouchableOpacity
          onPress={handleSave}
          className={`rounded-2xl py-4 items-center ${
            selectedProduct ? "bg-primaryPink" : "bg-gray-300"
          }`}
          disabled={!selectedProduct}
        >
          <Text className="text-white font-semibold text-lg">
            Guardar cambio
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
