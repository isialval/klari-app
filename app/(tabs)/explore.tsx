import ProductListBase from "@/components/ProductListBase";

export default function ExploreScreen() {
  return (
    <ProductListBase
      title="Explorar productos"
      emptyMessage="No se encontraron productos"
      emptyIcon="search-outline"
    />
  );
}
