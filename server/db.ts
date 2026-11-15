import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertOrder, InsertProduct, InsertUser, Order, Product, orders, products, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  values.lastSignedIn ||= new Date(); if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function bootstrapFirstAdmin(openId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const existingAdmin = await db.select({ id: users.id }).from(users).where(eq(users.role, "admin")).limit(1);
  if (existingAdmin.length) throw new Error("An administrator already exists. Ask the project owner to grant access.");
  await db.update(users).set({ role: "admin" }).where(eq(users.openId, openId));
  return { success: true } as const;
}

const seedProducts: InsertProduct[] = [
  { slug: "classic-chin-chin", name: "Classic Chin Chin", category: "Food", description: "Golden, crunchy and lightly spiced.", price: 3500, stock: 24, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-2.webp", badge: "Best seller", featured: true },
  { slug: "aviator-shade-no-02", name: "Aviator Shade No. 02", category: "Shades", description: "A clean everyday frame with warm tint.", price: 12000, stock: 10, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-3.webp", badge: "New", featured: true },
  { slug: "amber-muse-fragrance", name: "Amber Muse Fragrance", category: "Perfumes", description: "Soft amber, citrus peel and skin musk.", price: 8500, stock: 6, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-4.webp", badge: "Editor's pick", featured: true },
  { slug: "small-chops-box", name: "Small Chops Box", category: "Food", description: "A party-ready mix made fresh to order.", price: 7500, stock: 18, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-2.webp" },
  { slug: "olive-cat-eye", name: "Olive Cat-Eye", category: "Shades", description: "Sculpted lines for your main-character days.", price: 14500, stock: 8, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-3.webp" },
  { slug: "citrus-bloom-mist", name: "Citrus Bloom Mist", category: "Perfumes", description: "A bright, easy layer for every day.", price: 6500, stock: 12, imageUrl: "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD/image-4.webp" },
];

export async function ensureSeedProducts() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => { const db = await getDb(); if (!db) return; const existing = await db.select({ id: products.id }).from(products).limit(1); if (!existing.length) await db.insert(products).values(seedProducts); })().finally(() => { seedPromise = null; });
  return seedPromise;
}

export async function listProducts(input?: { category?: "Food" | "Shades" | "Perfumes"; search?: string; featured?: boolean }) {
  const db = await getDb(); if (!db) return [];
  await ensureSeedProducts();
  const filters = [eq(products.active, true)];
  if (input?.category) filters.push(eq(products.category, input.category));
  if (input?.featured !== undefined) filters.push(eq(products.featured, input.featured));
  if (input?.search) filters.push(or(like(products.name, `%${input.search}%`), like(products.description, `%${input.search}%`))!);
  return db.select().from(products).where(and(...filters)).orderBy(desc(products.createdAt));
}

export async function getProductBySlug(slug: string) { const db = await getDb(); if (!db) return undefined; await ensureSeedProducts(); const result = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.active, true))).limit(1); return result[0]; }
export async function createProduct(product: InsertProduct) { const db = await getDb(); if (!db) throw new Error("Database is not available"); const result = await db.insert(products).values(product); return { id: result[0].insertId }; }
export async function updateProduct(id: number, data: Partial<InsertProduct>) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.update(products).set(data).where(eq(products.id, id)); }
export async function deleteProduct(id: number) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.update(products).set({ active: false }).where(eq(products.id, id)); }

export async function createOrder(input: Omit<InsertOrder, "orderNumber">) { const db = await getDb(); if (!db) throw new Error("Database is not available"); const orderNumber = `AN-${Date.now().toString(36).toUpperCase()}`; await db.insert(orders).values({ ...input, orderNumber }); return orderNumber; }
export async function listOrders(): Promise<Order[]> { const db = await getDb(); if (!db) return []; return db.select().from(orders).orderBy(desc(orders.createdAt)); }
export async function updateOrderStatus(id: number, status: Order["status"]) { const db = await getDb(); if (!db) throw new Error("Database is not available"); await db.update(orders).set({ status }).where(eq(orders.id, id)); }
export async function getAnalytics() { const db = await getDb(); if (!db) return { orders: 0, products: 0, stock: 0, sales: 0 }; const allOrders = await db.select().from(orders); const allProducts = await db.select().from(products).where(eq(products.active, true)); return { orders: allOrders.length, products: allProducts.length, stock: allProducts.reduce((sum, item) => sum + item.stock, 0), sales: allOrders.reduce((sum, item) => sum + item.total, 0) }; }
