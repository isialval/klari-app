import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

const categorias = [
  {
    id: 1,
    nombre: "Contorno de ojos",
    value: "CONTORNO_DE_OJOS",
    imagen: require("../../assets/images/categories/contorno.jpg"),
  },
  {
    id: 2,
    nombre: "Tónicos",
    value: "TONICO",
    imagen: require("../../assets/images/categories/tonico.jpg"),
  },
  {
    id: 3,
    nombre: "Hidratantes",
    value: "HIDRATANTE",
    imagen: require("../../assets/images/categories/hidratante.jpg"),
  },
  {
    id: 4,
    nombre: "Serums",
    value: "SERUM",
    imagen: require("../../assets/images/categories/serum.jpg"),
  },
  {
    id: 5,
    nombre: "Protectores solares",
    value: "PROTECTOR_SOLAR",
    imagen: require("../../assets/images/categories/protector.jpg"),
  },
  {
    id: 6,
    nombre: "Limpiadores",
    value: "LIMPIADOR",
    imagen: require("../../assets/images/categories/limpiador.jpg"),
  },
  {
    id: 7,
    nombre: "Mascarillas",
    value: "MASCARILLA",
    imagen: require("../../assets/images/categories/mascarilla.jpg"),
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  return (
    <SafeAreaView
      className="flex-1 bg-backgroundPink"
      edges={["top", "right", "left"]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex p-4 mt-2">
          <Text className="text-primaryPink text-2xl font-semibold">
            Hola, {user?.username}
          </Text>
        </View>
        <View className="rounded-3xl bg-white p-4 overflow-hidden shadow-md">
          <View className="rounded-3xl w-full h-32">
            <ImageBackground
              source={require("../../assets/images/home_banner.jpeg")}
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                borderRadius: 20,
                overflow: "hidden",
              }}
              resizeMode="cover"
            />
          </View>
          <View className="mt-4 flex w-full flex-row justify-between">
            <TouchableOpacity
              className="px-1 bg-lightPink rounded-2xl"
              onPress={() => router.push("/products/favorites")}
            >
              <View className="w-44 h-40 bg-lightPink rounded-2xl items-center justify-center">
                <Image
                  source={require("../../assets/images/favorites.png")}
                  style={{ width: 80, height: 80 }}
                  resizeMode="contain"
                />
                <Text className="mt-2 font-semibold text-secondaryPink">
                  Mis favoritos
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-1 bg-lightPink rounded-2xl"
              onPress={() => router.push("/products/my-products")}
            >
              <View className="w-44 h-40 bg-lightPink rounded-2xl items-center justify-center">
                <Image
                  source={require("../../assets/images/inventory.png")}
                  style={{ width: 120, height: 80 }}
                  resizeMode="contain"
                />
                <Text className="mt-2 font-semibold text-secondaryPink">
                  Mis Productos
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex w-full">
            <TouchableOpacity
              className="h-20 rounded-2xl"
              onPress={() => router.push("/routine/day")}
            >
              <ImageBackground
                source={require("../../assets/images/day.jpg")}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                  overflow: "hidden",
                  justifyContent: "center",
                }}
                resizeMode="cover"
              >
                <Text
                  className="pl-6 text-xl text-white font-semibold"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.13)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Rutina de día
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View className="mt-4 flex w-full">
            <TouchableOpacity
              className="h-20 rounded-2xl"
              onPress={() => router.push("/routine/night")}
            >
              <ImageBackground
                source={require("../../assets/images/night.jpg")}
                style={{
                  flex: 1,
                  width: "100%",
                  height: "100%",
                  borderRadius: 16,
                  overflow: "hidden",
                  justifyContent: "center",
                }}
                resizeMode="cover"
              >
                <Text
                  className="pl-6 text-xl text-white font-semibold"
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.13)",
                    textShadowOffset: { width: 1, height: 1 },
                    textShadowRadius: 2,
                  }}
                >
                  Rutina de Noche
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex">
          <Text className="my-4 text-xl text-secondaryPink font-semibold text-center">
            Explora nuevos productos
          </Text>
          <View className="flex flex-row flex-wrap justify-between px-4">
            {categorias.map((categoria) => (
              <TouchableOpacity
                className="mb-4 w-[48%] rounded-2xl overflow-hidden shadow-md bg-white"
                key={categoria.id}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/explore",
                    params: { category: categoria.value },
                  } as any)
                }
              >
                <Image
                  source={categoria.imagen}
                  style={{ width: "100%", height: 100 }}
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text className="text-center text-secondaryPink font-semibold">
                    {categoria.nombre}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
