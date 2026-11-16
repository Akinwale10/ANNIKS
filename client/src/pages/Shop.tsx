import { ArrowRight, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { PageShell } from "@/components/SiteShell";
import { products, fromApiProduct, naira, type Category } from "@/lib/catalog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Shop() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Category>("All");
  const [bagOpen, setBagOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [showAllProducts, setShowAllProducts] = useState(false);
  const createOrder = trpc.orders.create.useMutation();
  const liveCatalog = trpc.catalog.list.useQuery(undefined, { retry: false });
  const storefrontProducts = useMemo(() => liveCatalog.data?.length ? liveCatalog.data.map(fromApiProduct) : products, [liveCatalog.data]);

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("anikks-cart") || "{}")); } catch { setCart({}); }
    if (window.location.hash === "#bag") setBagOpen(true);
  }, []);

  const filtered = useMemo(() => storefrontProducts.filter((product) => (category === "All" || product.category === category) && `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase())), [category, query, storefrontProducts]);
  const visibleProducts = showAllProducts ? filtered : filtered.slice(0, 4);
  const items = storefrontProducts.filter((product) => cart[product.id]);
  const count = Object.values(cart).reduce((sum, item) => sum + item, 0);
  const total = items.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  const persistCart = (next: Record<number, number>) => {
    setCart(next);
    localStorage.setItem("anikks-cart", JSON.stringify(next));
    window.dispatchEvent(new Event("anikks-cart-updated"));
  };

  const update = (id: number, delta: number) => {
    const next = { ...cart };
    next[id] = Math.max(0, (next[id] || 0) + delta);
    if (!next[id]) delete next[id];
    persistCart(next);
  };

  const checkout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!items.length) { toast.error("Your bag is empty."); return; }
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name"));
    const phone = String(form.get("phone"));
    const address = String(form.get("address"));
    const lines = items.map((product) => `• ${product.name} x${cart[product.id]} — ${naira(product.price * cart[product.id])}`).join("%0A");
    const message = `Hello Anikks!%0A%0AI'd like to place an order.%0A%0AName: ${name}%0APhone: ${phone}%0ADelivery address: ${address}%0A%0AOrder:%0A${lines}%0A%0ATotal: ${naira(total)}`;
    window.open(`https://wa.me/2349162259886?text=${message}`, "_blank");
    createOrder.mutate({ customerName: name, customerPhone: phone, deliveryAddress: address, total, items: items.map((product) => ({ productId: product.id, name: product.name, quantity: cart[product.id], price: product.price })) }, {
      onSuccess: () => toast.success("Order saved. WhatsApp is ready with your order."),
      onError: () => toast.success("WhatsApp is ready with your order.", { description: "We’ll confirm availability and delivery with you there." }),
    });
    persistCart({});
    setBagOpen(false);
    window.history.replaceState({}, "", "/shop");
  };

  return <PageShell><main><section className="inner-hero"><span className="eyebrow">The Anikks edit</span><h1>Find your next<br /><em>favourite.</em></h1><p>Shop food, shades and scents selected to make everyday feel a little more considered.</p></section><section className="shop-page-section"><div className="shop-toolbar"><div className="filter-tabs">{["All", "Food", "Shades", "Perfumes"].map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item as "All" | Category)}>{item}</button>)}</div><div className="shop-tools"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" aria-label="Search products" /></div><button className="bag-open-button" onClick={() => setBagOpen(true)}><ShoppingBag size={17} />Bag ({count})</button></div></div><div className="shop-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>{filtered.length > 4 && <div className="shop-view-all"><button className="button button-outline" onClick={() => setShowAllProducts((value) => !value)}>{showAllProducts ? "Show fewer products" : `View all ${filtered.length} products`} <ArrowRight size={16} /></button></div>}{filtered.length === 0 && <div className="empty-state"><Search size={28} /><h2>No exact match yet.</h2><p>Try a broader search or browse all of the edit.</p><button className="button button-orange" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</button></div>}</section></main>{bagOpen && <div className="drawer-backdrop" onClick={() => setBagOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Your bag</span><h2>{count} {count === 1 ? "item" : "items"}</h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setBagOpen(false)}><X size={20} /></button></div>{items.length === 0 ? <div className="empty-cart"><ShoppingBag size={32} /><p>Your bag is waiting for something good.</p><button className="button button-orange" onClick={() => setBagOpen(false)}>Keep shopping</button></div> : <><div className="cart-items">{items.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.category}</span><h3>{product.name}</h3><strong>{naira(product.price)}</strong><div className="qty"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => update(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => update(product.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{naira(total)}</strong></div><small>Delivery is calculated when we confirm your order.</small><form className="bag-checkout" onSubmit={checkout}><input name="name" required placeholder="Your name" aria-label="Your name" /><input name="phone" required placeholder="Phone number" aria-label="Phone number" /><textarea name="address" required rows={2} placeholder="Delivery address" aria-label="Delivery address" /><button className="button button-orange full" disabled={createOrder.isPending}>{createOrder.isPending ? "Saving order…" : <>Checkout on WhatsApp <ArrowRight size={17} /></>}</button></form></div></>}</aside></div>}</PageShell>;
}
