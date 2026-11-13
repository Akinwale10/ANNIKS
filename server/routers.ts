import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { createOrder, createProduct, deleteProduct, getAnalytics, getProductBySlug, listOrders, listProducts, updateOrderStatus, updateProduct } from "./db";

const productInput = z.object({
  slug: z.string().min(2).max(160), name: z.string().min(2).max(160), category: z.enum(["Food", "Shades", "Perfumes"]), description: z.string().min(2), price: z.number().int().nonnegative(), stock: z.number().int().nonnegative(), imageUrl: z.string().url().or(z.string().startsWith("/")), badge: z.string().max(80).optional(), active: z.boolean().optional(), featured: z.boolean().optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  catalog: router({
    list: publicProcedure.input(z.object({ category: z.enum(["Food", "Shades", "Perfumes"]).optional(), search: z.string().optional(), featured: z.boolean().optional() }).optional()).query(({ input }) => listProducts(input)),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getProductBySlug(input.slug)),
  }),
  orders: router({
    create: publicProcedure.input(z.object({ customerName: z.string().min(2), customerPhone: z.string().min(7), deliveryAddress: z.string().min(5), items: z.array(z.object({ productId: z.number().int(), name: z.string(), quantity: z.number().int().positive(), price: z.number().int().nonnegative() })).min(1), total: z.number().int().positive() })).mutation(({ input }) => createOrder({ customerName: input.customerName, customerPhone: input.customerPhone, deliveryAddress: input.deliveryAddress, items: JSON.stringify(input.items), total: input.total })),
  }),
  admin: router({
    analytics: adminProcedure.query(() => getAnalytics()),
    products: adminProcedure.query(() => listProducts()),
    createProduct: adminProcedure.input(productInput).mutation(({ input }) => createProduct({ ...input, imageUrl: input.imageUrl, active: input.active ?? true, featured: input.featured ?? false })),
    updateProduct: adminProcedure.input(productInput.extend({ id: z.number().int() })).mutation(({ input }) => { const { id, ...data } = input; return updateProduct(id, data); }),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int() })).mutation(({ input }) => deleteProduct(input.id)),
    orders: adminProcedure.query(() => listOrders()),
    updateOrderStatus: adminProcedure.input(z.object({ id: z.number().int(), status: z.enum(["pending", "confirmed", "processing", "dispatched", "completed"]) })).mutation(({ input }) => updateOrderStatus(input.id, input.status)),
  }),
});

export type AppRouter = typeof appRouter;
