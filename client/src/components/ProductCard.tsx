import { Plus } from "lucide-react";
import { Link } from "wouter";
import { addToCart } from "./SiteShell";
import type { Product } from "@/lib/catalog";
import { naira } from "@/lib/catalog";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  return <article className="product-card"><div className="product-image"><Link href={`/product/${product.slug}`}><img src={product.image} alt={product.name} /></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="quick-add" aria-label={`Add ${product.name} to cart`} onClick={() => { addToCart(product.id); toast.success("Added to your bag"); }}><Plus size={18} /></button></div><div className="product-meta"><div><span className="product-category">{product.category}</span><h3><Link href={`/product/${product.slug}`}>{product.name}</Link></h3></div><strong>{naira(product.price)}</strong></div><p>{product.description}</p><div className="product-bottom"><span className={product.stock === "Low stock" ? "stock low" : "stock"}><span />{product.stock}</span><button onClick={() => { addToCart(product.id); toast.success("Added to your bag"); }}>Add to bag</button></div></article>;
}
