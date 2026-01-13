export const categories = [
  { id: 0, name: "Todos" },
  { id: 1, name: "Contorno de ojos" },
  { id: 2, name: "Tónicos" },
  { id: 3, name: "Hidratantes" },
  { id: 4, name: "Serums" },
  { id: 5, name: "Protectores solares" },
  { id: 6, name: "Limpiadores" },
  { id: 7, name: "Mascarillas" },
];

export const products = [
  { id: 1, name: "Eye Cream Retinol", brand: "The Ordinary", categoryId: 1, image: require("@/assets/images/product.jpg") },
  { id: 2, name: "Caffeine Solution", brand: "The Ordinary", categoryId: 1, image: require("@/assets/images/product.jpg") },
  { id: 3, name: "Glycolic Acid Toner", brand: "Pixi", categoryId: 2, image: require("@/assets/images/product.jpg") },
  { id: 4, name: "Hydrating Toner", brand: "Klairs", categoryId: 2, image: require("@/assets/images/product.jpg") },
  { id: 5, name: "Moisturizing Cream", brand: "CeraVe", categoryId: 3, image: require("@/assets/images/product.jpg") },
  { id: 6, name: "Water Cream", brand: "Tatcha", categoryId: 3, image: require("@/assets/images/product.jpg") },
  { id: 7, name: "Niacinamide 10%", brand: "The Ordinary", categoryId: 4, image: require("@/assets/images/product.jpg") },
  { id: 8, name: "Vitamin C Serum", brand: "Skinceuticals", categoryId: 4, image: require("@/assets/images/product.jpg") },
  { id: 9, name: "Hyaluronic Acid", brand: "The Ordinary", categoryId: 4, image: require("@/assets/images/product.jpg") },
  { id: 10, name: "UV Defense SPF50", brand: "La Roche-Posay", categoryId: 5, image: require("@/assets/images/product.jpg") },
  { id: 11, name: "Sunscreen SPF30", brand: "Supergoop", categoryId: 5, image: require("@/assets/images/product.jpg") },
  { id: 12, name: "Foaming Cleanser", brand: "CeraVe", categoryId: 6, image: require("@/assets/images/product.jpg") },
  { id: 13, name: "Oil Cleanser", brand: "DHC", categoryId: 6, image: require("@/assets/images/product.jpg") },
  { id: 14, name: "Clay Mask", brand: "Aztec Secret", categoryId: 7, image: require("@/assets/images/product.jpg") },
  { id: 15, name: "Sheet Mask Pack", brand: "Innisfree", categoryId: 7, image: require("@/assets/images/product.jpg") },
];

export type Product = (typeof products)[0];
export type Category = (typeof categories)[0];