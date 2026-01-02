import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const usuario = "Lucy";
  return (
    <SafeAreaView className="flex-1 bg-backgroundPink">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex p-4 mt-2">
          <Text className="text-primaryPink text-2xl font-semibold">
            Hola, {usuario}
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
              onPress={() => Alert.alert("Proximamente: Ir a Mis Favoritos")}
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
              onPress={() => Alert.alert("Proximamente: Ir a Mis Productos")}
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
              onPress={() => Alert.alert("Proximamente: Ir a Rutina de día")}
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
              onPress={() => Alert.alert("Proximamente: Ir a Rutina de Noche")}
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
      </ScrollView>
    </SafeAreaView>
  );
}
