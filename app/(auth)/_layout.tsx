import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" options={{ title: "Iniciar Sesión" }} />
      <Stack.Screen name="register" options={{ title: "Crear Cuenta" }} />
      <Stack.Screen
        name="skin-type"
        options={{ title: "Seleccionar tipo de Piel" }}
      />
      <Stack.Screen name="goals" options={{ title: "Seleccionar objetivos" }} />
    </Stack>
  );
}
