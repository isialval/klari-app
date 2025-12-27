import {
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <ImageBackground
      source={require("../assets/images/fondo.jpg")}
      style={styles.background}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} />

        <View className="px-6 pb-6">
          <View className="items-center mb-8">
            <Image
              source={require("../assets/images/logo.png")}
              style={{ width: 128, height: 128 }}
              resizeMode="contain"
            />
            <Text className="text-5xl font-bold text-white mt-4">
              <Text className="text-primaryPink">K</Text>lari
            </Text>
          </View>

          <TouchableOpacity
            className="bg-secondaryPink rounded-2xl py-4 mb-4"
            onPress={() => Alert.alert("Login", "Próximamente...")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <Text className="text-black text-center mb-4">¿Eres nuevo?</Text>

          <TouchableOpacity
            className="bg-primaryPink rounded-2xl py-4"
            onPress={() => Alert.alert("Registro", "Próximamente...")}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Crear Cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
