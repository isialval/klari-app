import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");

  const handleRegister = () => {};

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TouchableOpacity
        onPress={() => router.back()}
        className="m-4 px-1 py-1 self-start rounded-lg border border-backgroundPink"
      >
        <Ionicons name="arrow-back" size={28} color="#BB6276" />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-2 flex-1 px-6 justify-between py-8">
            <Text className="text-3xl font-bold text-primaryPink mb-8 text-left">
              ¡Hola! Registrate para comenzar
            </Text>

            <View className="mb-4">
              <TextInput
                className="bg-gray-100 text-gray-900 px-4 py-4 rounded-xl border border-gray-200"
                placeholder="Ingresa tu email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View className="mb-4">
              <TextInput
                className="bg-gray-100 text-gray-900 px-4 py-4 rounded-xl border border-gray-200"
                placeholder="Ingresa tu nombre"
                placeholderTextColor="#9CA3AF"
                value={nombre}
                onChangeText={setNombre}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <View className="relative">
                <TextInput
                  className="bg-gray-100 text-gray-900 px-4 py-4 pr-12 rounded-xl border border-gray-200"
                  placeholder="Ingresa tu contraseña"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-0 bottom-0 justify-center"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="mb-6">
              <View className="relative">
                <TextInput
                  className="bg-gray-100 text-gray-900 px-4 py-4 pr-12 rounded-xl border border-gray-200"
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <TouchableOpacity
              className="bg-primaryPink rounded-2xl py-4 mb-4"
              onPress={handleRegister}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Crear Cuenta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className=""
              onPress={() => router.push("/(auth)/login")}
            >
              <Text className="text-gray-500 text-center">
                ¿Ya tienes una cuenta?{" "}
                <Text className="text-primaryPink font-semibold">
                  Iniciar sesión
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
