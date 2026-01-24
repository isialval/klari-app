import { useAuth } from "@/context/AuthContext";
import {
  PageResponse,
  productService,
  ProductSummaryDTO,
} from "@/services/productService";
import { routineService } from "@/services/routineService";
import { userService } from "@/services/userService";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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

const categoryNames: Record<string, string> = {
  LIMPIADOR: "Limpiador",
  TONICO: "Tónico",
  SERUM: "Serum",
  CONTORNO_DE_OJOS: "Contorno de ojos",
  HIDRATANTE: "Hidratante",
  MASCARILLA: "Mascarilla",
  PROTECTOR_SOLAR: "Protector solar",
};

const filterTabs = [
  { id: "suggestions", name: "Sugerencias" },
  { id: "favorites", name: "Favoritos", icon: "heart" },
  { id: "myProducts", name: "Mis productos", icon: "checkmark-circle" },
];

const PAGE_SIZE = 10;

type TabId = "suggestions" | "favorites" | "myProducts";

type TabState = {
  products: ProductSummaryDTO[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  loaded: boolean;
};

const initialTabState: TabState = {
  products: [],
  page: 0,
  hasMore: true,
  isLoading: false,
  isLoadingMore: false,
  loaded: false,
};

export default function SelectProductScreen() {
  const { category, type, routineId } = useLocalSearchParams<{
    category: string;
    type: "day" | "night";
    routineId: string;
  }>();

  const { user } = useAuth();
  const routineType = type || "day";
  const stepName = categoryNames[category] || category;

  const [selectedTab, setSelectedTab] = useState<TabId>("suggestions");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductSummaryDTO | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Estado por cada tab
  const [tabStates, setTabStates] = useState<Record<TabId, TabState>>({
    suggestions: { ...initialTabState },
    favorites: { ...initialTabState },
    myProducts: { ...initialTabState },
  });

  // Datos del perfil (cacheados)
  const profileRef = useRef<{ skinType: string; goals: string[] } | null>(null);

  // Función para actualizar estado de un tab específico
  const updateTabState = useCallback(
    (tabId: TabId, updates: Partial<TabState>) => {
      setTabStates((prev) => ({
        ...prev,
        [tabId]: { ...prev[tabId], ...updates },
      }));
    },
    [],
  );

  // Cargar datos de un tab específico
  const loadTabData = useCallback(
    async (tabId: TabId, page: number = 0) => {
      if (!user || !category) return;

      const isFirstPage = page === 0;

      if (isFirstPage) {
        updateTabState(tabId, { isLoading: true });
      } else {
        updateTabState(tabId, { isLoadingMore: true });
      }

      try {
        // Obtener perfil si no está cacheado
        if (!profileRef.current) {
          const profile = await userService.getProfile(user.id);
          profileRef.current = {
            skinType: profile.skinType,
            goals: profile.goals,
          };
        }

        const { skinType, goals } = profileRef.current;
        const applicationTime = routineType === "day" ? "DIA" : "NOCHE";

        let response: PageResponse<ProductSummaryDTO>;

        switch (tabId) {
          case "suggestions":
            response = await productService.getRecommendations(
              category,
              applicationTime,
              skinType,
              goals,
              page,
              PAGE_SIZE,
            );
            break;
          case "favorites":
            response = await userService.getFavorites(
              user.id,
              page,
              PAGE_SIZE,
              category,
            );
            break;
          case "myProducts":
            response = await userService.getInventory(
              user.id,
              page,
              PAGE_SIZE,
              category,
            );
            break;
        }

        updateTabState(tabId, {
          products: isFirstPage
            ? response.content
            : [...tabStates[tabId].products, ...response.content],
          page: page + 1,
          hasMore: !response.last,
          loaded: true,
        });
      } catch (error) {
        console.error(`Error loading ${tabId}:`, error);
      } finally {
        if (isFirstPage) {
          updateTabState(tabId, { isLoading: false });
        } else {
          updateTabState(tabId, { isLoadingMore: false });
        }
      }
    },
    [user, category, routineType, tabStates, updateTabState],
  );

  // Carga inicial - solo el tab de sugerencias
  useEffect(() => {
    const init = async () => {
      setIsInitialLoading(true);
      await loadTabData("suggestions", 0);
      setIsInitialLoading(false);
    };
    init();
  }, []);

  // Cargar datos cuando cambia de tab (lazy loading)
  useEffect(() => {
    const currentTabState = tabStates[selectedTab];
    if (!currentTabState.loaded && !currentTabState.isLoading) {
      loadTabData(selectedTab, 0);
    }
  }, [selectedTab]);

  // Cargar más productos
  const loadMore = useCallback(() => {
    const currentTabState = tabStates[selectedTab];
    if (
      currentTabState.hasMore &&
      !currentTabState.isLoading &&
      !currentTabState.isLoadingMore
    ) {
      loadTabData(selectedTab, currentTabState.page);
    }
  }, [selectedTab, tabStates, loadTabData]);

  // Guardar producto seleccionado
  const handleSave = async () => {
    if (!selectedProduct || !routineId) return;

    setIsSaving(true);
    try {
      await routineService.addProduct(Number(routineId), selectedProduct.id);
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo agregar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  // Cambiar de tab
  const handleTabChange = (tabId: TabId) => {
    setSelectedTab(tabId);
    // No resetear selección al cambiar de tab
  };

  // Renderizar producto
  const renderProduct = useCallback(
    ({ item }: { item: ProductSummaryDTO }) => {
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
    [selectedProduct],
  );

  // Estado actual del tab seleccionado
  const currentTabState = tabStates[selectedTab];

  if (isInitialLoading) {
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
                onPress={() => handleTabChange(item.id as TabId)}
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

      {currentTabState.isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#BB6276" />
        </View>
      ) : (
        <FlatList
          data={currentTabState.products}
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
            currentTabState.isLoadingMore ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#580423" />
              </View>
            ) : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      )}

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
