import { ArrowLeft, ArrowRight, Check, ShoppingBag, Star } from "lucide-react";
import { Link, useRoute } from "wouter";
import { PageShell, addToCart } from "@/components/SiteShell";
import { fromApiProduct, getProduct, naira } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Product() {
  const [, params] = useRoute("/product/:slug"); const slug = params?.slug || ""; const liveProduct = trpc.catalog.bySlug.useQuery({ slug }, { retry: false }); const product = liveProduct.data ? fromApiProduct(liveProduct.data) : getProduct(slug);
  if (!product) return <PageShell><div className="empty-state page-empty"><h2>That product has moved on.</h2><Link className="button button-orange" href="/shop">Back to shop</Link></div></PageShell>;
  return <PageShell><main className="product-detail"><Link className="back-link" href="/shop"><ArrowLeft size={15} /> Back to shop</Link><div className="product-detail-grid"><div className="product-detail-image"><img src={product.image} alt={product.name} /></div><div className="product-detail-copy"><span className="eyebrow">{product.category} · {product.stock}</span><h1>{product.name}</h1><div className="detail-rating"><span>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</span><small>Sample customer favourite</small></div><strong className="detail-price">{naira(product.price)}</strong><p>{product.description}</p><div className="detail-actions"><button className="button button-orange" onClick={() => { addToCart(product.id); toast.success("Added to your bag"); }}><ShoppingBag size={17} /> Add to bag</button><a className="button button-outline" href={`https://wa.me/2349162259886?text=Hello%20Anikks%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.name)}`} target="_blank" rel="noreferrer">Ask on WhatsApp <ArrowRight size={17} /></a></div><div className="detail-points">{product.details.map((detail) => <div key={detail}><Check size={16} /><span>{detail}</span></div>)}</div></div></div></main></PageShell>;
}
