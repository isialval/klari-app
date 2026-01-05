import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#580423",
        tabBarInactiveTintColor: "#BB6276",
        tabBarStyle: {
          backgroundColor: "#F6E7EA",
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="routine/[type]" options={{ href: null }} />
      <Tabs.Screen name="routine/edit" options={{ href: null }} />
      <Tabs.Screen name="routine/select-product" options={{ href: null }} />
      <Tabs.Screen name="favorites" options={{ href: null }} />
      <Tabs.Screen name="inventory" options={{ href: null }} />
    </Tabs>
  );
}
