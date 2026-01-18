import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RoutineProvider } from "../context/RoutineContext";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RoutineProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="routine" />
          </Stack>
        </RoutineProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
