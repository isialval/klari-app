import ProductListBase from "@/components/ProductListBase";

export default function MyProductsScreen() {
  return (
    <ProductListBase
      title="Mis productos"
      filterType="myProducts"
      emptyMessage="No tienes productos en tu inventario. ¡Agrega los que usas!"
      emptyIcon="cube-outline"
      showBackButton
    />
  );
}
