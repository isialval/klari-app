import { Stack } from "expo-router";

export default function RoutineLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[type]" />
      <Stack.Screen name="edit" />
      <Stack.Screen name="select-product" />
    </Stack>
  );
}
