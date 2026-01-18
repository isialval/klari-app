import ProductListBase from "@/components/ProductListBase";
import { useLocalSearchParams } from "expo-router";

export default function ExploreScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();

  return (
    <ProductListBase
      title="Explorar productos"
      emptyMessage="No se encontraron productos"
      emptyIcon="search-outline"
      initialCategory={category}
    />
  );
}
