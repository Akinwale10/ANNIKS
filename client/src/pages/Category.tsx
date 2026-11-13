import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import ProductCard from "@/components/ProductCard";
import { PageShell } from "@/components/SiteShell";
import { categoryContent, products, type Category } from "@/lib/catalog";

export default function CategoryPage() {
  const [location] = useLocation(); const key = location.includes("shades") ? "Shades" : location.includes("perfumes") ? "Perfumes" : "Food"; const content = categoryContent[key as Category]; const items = products.filter((p) => p.category === key);
  return <PageShell><main><section className={`category-hero category-${key.toLowerCase()}`}><div><span className="eyebrow">{content.eyebrow}</span><h1>{content.title}</h1><p>{content.description}</p><Link className="button button-orange" href="/shop">Shop the full edit <ArrowRight size={17} /></Link></div></section><section className="category-products"><div className="section-heading"><div><span className="eyebrow">{key} favourites</span><h2>Pick your pleasure.</h2></div><Link className="text-link" href="/shop">See everything <ArrowRight size={16} /></Link></div><div className="product-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div></section></main></PageShell>;
}
