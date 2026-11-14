export type Category = "Food" | "Shades" | "Perfumes";
export type Product = { id: number; slug: string; name: string; category: Category; description: string; price: number; stock: string; badge?: string; image: string; details: string[]; featured?: boolean };
export type ApiProduct = { id: number; slug: string; name: string; category: Category; description: string; price: number; stock: number; imageUrl: string; badge?: string | null; featured?: boolean };

const imageBase = "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD";
export const products: Product[] = [
  { id: 1, slug: "classic-chin-chin", name: "Classic Chin Chin", category: "Food", description: "Golden, crunchy and lightly spiced.", price: 3500, stock: "In stock", badge: "Best seller", image: `${imageBase}/image-2.webp`, details: ["Freshly packed in small batches", "Perfect for gifting, sharing or keeping close", "Made with simple, quality ingredients"] },
  { id: 2, slug: "aviator-shade-no-02", name: "Aviator Shade No. 02", category: "Shades", description: "A clean everyday frame with warm tint.", price: 12000, stock: "In stock", badge: "New", image: `${imageBase}/image-3.webp`, details: ["Lightweight everyday frame", "Warm-tint lenses", "Protective soft pouch included"] },
  { id: 3, slug: "amber-muse-fragrance", name: "Amber Muse Fragrance", category: "Perfumes", description: "Soft amber, citrus peel and skin musk.", price: 8500, stock: "Low stock", badge: "Editor's pick", image: `${imageBase}/image-4.webp`, details: ["Warm amber and soft musk notes", "Easy day-to-night wear", "Long-lasting 30ml bottle"] },
  { id: 4, slug: "small-chops-box", name: "Small Chops Box", category: "Food", description: "A party-ready mix made fresh to order.", price: 7500, stock: "Pre-order", image: `${imageBase}/image-2.webp`, details: ["A mix of puff-puff, samosa and spring rolls", "Made fresh to order", "Ideal for intimate gatherings"] },
  { id: 5, slug: "olive-cat-eye", name: "Olive Cat-Eye", category: "Shades", description: "Sculpted lines for your main-character days.", price: 14500, stock: "In stock", image: `${imageBase}/image-3.webp`, details: ["Sculpted cat-eye silhouette", "Comfortable nose bridge", "Comes with protective case"] },
  { id: 6, slug: "citrus-bloom-mist", name: "Citrus Bloom Mist", category: "Perfumes", description: "A bright, easy layer for every day.", price: 6500, stock: "In stock", image: `${imageBase}/image-4.webp`, details: ["Fresh citrus opening", "Soft floral dry-down", "Perfect for layering"] },
];

export const categoryContent: Record<Category, { eyebrow: string; title: string; description: string }> = {
  Food: { eyebrow: "The food edit", title: "Good things for the table.", description: "Freshly packed treats and party-ready favourites for ordinary days, celebrations and everything in between." },
  Shades: { eyebrow: "The eyewear edit", title: "Your everyday cool.", description: "Easy frames with enough personality to make the outfit. Find the shape that feels like you." },
  Perfumes: { eyebrow: "The scent edit", title: "Leave a little trail.", description: "Warm, bright and easy-to-wear scents for every mood, moment and version of you." },
};

export const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const fromApiProduct = (product: ApiProduct): Product => ({ ...product, stock: product.stock <= 0 ? "Out of stock" : product.stock <= 5 ? "Low stock" : "In stock", badge: product.badge ?? undefined, image: product.imageUrl, details: ["Quality checked by the Anikks team", "Available for WhatsApp ordering", "Delivery confirmed with your order"] });
