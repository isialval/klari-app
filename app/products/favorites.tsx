import ProductListBase from "@/components/ProductListBase";

export default function FavoritesScreen() {
  return (
    <ProductListBase
      title="Mis favoritos"
      filterType="favorites"
      emptyMessage="No tienes productos favoritos. ¡Explora y agrega algunos!"
      emptyIcon="heart-outline"
      showBackButton
    />
  );
}
