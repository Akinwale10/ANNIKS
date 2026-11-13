import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Instagram,
  Menu,
  Minus,
  PackageCheck,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type Category = "All" | "Food" | "Shades" | "Perfumes";
type Product = {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  price: number;
  stock: string;
  badge?: string;
  image: string;
};

const imageBase = "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD";
const products: Product[] = [
  { id: 1, name: "Classic Chin Chin", category: "Food", description: "Golden, crunchy and lightly spiced.", price: 3500, stock: "In stock", badge: "Best seller", image: `${imageBase}/image-2.webp` },
  { id: 2, name: "Aviator Shade No. 02", category: "Shades", description: "A clean everyday frame with warm tint.", price: 12000, stock: "In stock", badge: "New", image: `${imageBase}/image-3.webp` },
  { id: 3, name: "Amber Muse Fragrance", category: "Perfumes", description: "Soft amber, citrus peel and skin musk.", price: 8500, stock: "Low stock", badge: "Editor's pick", image: `${imageBase}/image-4.webp` },
  { id: 4, name: "Small Chops Box", category: "Food", description: "A party-ready mix made fresh to order.", price: 7500, stock: "Pre-order", image: `${imageBase}/image-2.webp` },
  { id: 5, name: "Olive Cat-Eye", category: "Shades", description: "Sculpted lines for your main-character days.", price: 14500, stock: "In stock", image: `${imageBase}/image-3.webp` },
  { id: 6, name: "Citrus Bloom Mist", category: "Perfumes", description: "A bright, easy layer for every day.", price: 6500, stock: "In stock", image: `${imageBase}/image-4.webp` },
];

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function Home() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("anikks-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("anikks-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }), [category, query]);

  const cartItems = products.filter((product) => cart[product.id]);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  const addToCart = (id: number) => {
    setCart((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    toast.success("Added to your bag", { description: "Your pick is waiting in the cart." });
  };
  const updateQuantity = (id: number, delta: number) => {
    setCart((current) => {
      const next = Math.max(0, (current[id] || 0) + delta);
      const copy = { ...current };
      if (next === 0) delete copy[id]; else copy[id] = next;
      return copy;
    });
  };
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <div className="top-strip"><span>Free delivery on orders over ₦25,000 in Ogun</span><span>WhatsApp orders: +234 916 225 9886</span></div>
      <header className="site-header">
        <a className="brand" href="#top" onClick={() => scrollTo("top")}><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></a>
        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          {[["Home", "top"], ["Shop", "shop"], ["About Us", "about"], ["Our Services", "services"], ["Blog", "blog"], ["Contact Us", "contact"]].map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search" onClick={() => scrollTo("shop")}><Search size={19} /></button>
          <button className="icon-button account-button" aria-label="Account" onClick={() => toast.info("Account access is coming soon.")}><UserRound size={19} /></button>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Your everyday, elevated</div>
            <h1>Good taste.<br /><em>Great finds.</em></h1>
            <p className="hero-lede">Your one-stop shop for food, fashion and everyday essentials. Curated with care, delivered with a smile.</p>
            <div className="hero-actions"><button className="button button-orange" onClick={() => scrollTo("shop")}>Shop the edit <ArrowRight size={17} /></button><button className="text-link" onClick={() => scrollTo("services")}>Explore our services <ArrowRight size={16} /></button></div>
            <div className="hero-note"><span className="note-dot" /><span>Small joys, thoughtfully sourced.</span></div>
          </div>
          <div className="hero-art"><img src={`${imageBase}/image-1.webp`} alt="Anikks treats, fragrance and fashion edit" /><div className="hero-sticker"><Sparkles size={15} /><span>Made for<br /><strong>your kind of day</strong></span></div><div className="hero-index">01 <span>/</span> 03</div></div>
        </section>

        <section className="category-section" aria-label="Shop by category">
          <div className="section-heading"><div><span className="eyebrow">Shop by mood</span><h2>Pick your pleasure.</h2></div><button className="text-link" onClick={() => { setCategory("All"); scrollTo("shop"); }}>View all products <ArrowRight size={16} /></button></div>
          <div className="category-grid">
            {[{ name: "Food", kicker: "For the table", image: `${imageBase}/image-2.webp`, copy: "Treats that disappear fast." }, { name: "Shades", kicker: "For the look", image: `${imageBase}/image-3.webp`, copy: "Your everyday cool." }, { name: "Perfumes", kicker: "For the mood", image: `${imageBase}/image-4.webp`, copy: "Leave a little trail." }].map((item) => <button className="category-card" key={item.name} onClick={() => { setCategory(item.name as Category); scrollTo("shop"); }}><img src={item.image} alt={item.name} /><span className="category-overlay" /><div className="category-content"><span className="eyebrow light">{item.kicker}</span><h3>{item.name}</h3><span>{item.copy} <ArrowUpRightIcon /></span></div></button>)}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="shop-topline"><div><span className="eyebrow">The Anikks edit</span><h2>Find your next favourite.</h2></div><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></div></div>
          <div className="filter-row"><div className="filter-tabs">{["All", "Food", "Shades", "Perfumes"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item as Category)}>{item}</button>)}</div><span className="result-count">{filteredProducts.length} pieces to love</span></div>
          <div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.image} alt={product.name} />{product.badge && <span className="product-badge">{product.badge}</span>}<button className="quick-add" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.id)}><Plus size={18} /></button></div><div className="product-meta"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><strong>{naira(product.price)}</strong></div><p>{product.description}</p><div className="product-bottom"><span className={product.stock === "Low stock" ? "stock low" : "stock"}><span />{product.stock}</span><button onClick={() => addToCart(product.id)}>Add to bag</button></div></article>)}</div>
        </section>

        <section className="service-band" id="services"><div className="service-copy"><span className="eyebrow light">More than shopping</span><h2>Good things,<br /><em>made easy.</em></h2><p>From quick WhatsApp orders to everyday financial services, we’re here to make the little things feel lighter.</p><button className="button button-cream" onClick={() => scrollTo("contact")}>Talk to our team <ArrowRight size={17} /></button></div><div className="service-list"><div className="service-item"><span className="service-icon"><Truck /></span><div><h3>Easy orders & delivery</h3><p>Send us a WhatsApp, we’ll handle the rest.</p></div><ArrowRight size={18} /></div><div className="service-item"><span className="service-icon"><Zap /></span><div><h3>Moniepoint services</h3><p>Loans, POS, ATM, account opening and more.</p></div><ArrowRight size={18} /></div><div className="service-item"><span className="service-icon"><PackageCheck /></span><div><h3>Quality, always</h3><p>Thoughtful picks, checked before they reach you.</p></div><ArrowRight size={18} /></div></div></section>

        <section className="about-section" id="about"><div className="about-visual"><div className="about-block orange-block" /><div className="about-card"><span className="about-number">01</span><span>Quality products.<br /><strong>Real convenience.</strong></span></div></div><div className="about-copy"><span className="eyebrow">Our story</span><h2>A little bit of<br /><em>everything good.</em></h2><p>Anikks Treats & Trend is your trusted destination for quality food, fashion accessories, fragrances and everyday essentials. We’re committed to providing quality products, affordable prices and excellent customer service.</p><div className="values"><div><Check size={16} /><span><strong>Our mission</strong>Make everyday shopping feel personal.</span></div><div><Check size={16} /><span><strong>Why choose us?</strong>Thoughtful service, fair prices, no stress.</span></div></div><button className="text-link" onClick={() => scrollTo("contact")}>Get to know Anikks <ArrowRight size={16} /></button></div></section>

        <section className="testimonial-section"><div className="testimonial-heading"><span className="eyebrow">Kind words</span><h2>Loved by our people.</h2></div><div className="testimonial-card"><div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><blockquote>“The chin chin finished before the movie even started. And the perfume? I’ve had three compliments today.”</blockquote><div className="reviewer"><span className="avatar">AM</span><span><strong>Amaka M.</strong><small>Sample customer review</small></span></div></div><div className="testimonial-side"><span>★★★★★</span><p>“Easy to order, lovely packaging and everything arrived exactly as promised.”</p><strong>— Tolu A.</strong></div></section>

        <section className="blog-section" id="blog"><div className="section-heading"><div><span className="eyebrow">The journal</span><h2>Notes from Anikks.</h2></div><button className="text-link" onClick={() => toast.info("More journal stories are on the way.")}>Read all stories <ArrowRight size={16} /></button></div><div className="blog-grid"><article className="blog-feature"><div className="blog-art food-art"><span>01</span></div><div><span className="blog-tag">Food & hosting</span><h3>Small chops, big mood: building a table people remember.</h3><button className="text-link" onClick={() => toast.info("Story preview coming soon.")}>Read story <ArrowRight size={15} /></button></div></article><article className="blog-small"><span className="blog-tag">Style notes</span><h3>Three shades that do the most.</h3><button className="text-link" onClick={() => toast.info("Story preview coming soon.")}>Read story <ArrowRight size={15} /></button></article><article className="blog-small orange-paper"><span className="blog-tag">Scent edit</span><h3>How to find a fragrance that feels like you.</h3><button className="text-link" onClick={() => toast.info("Story preview coming soon.")}>Read story <ArrowRight size={15} /></button></article></div></section>

        <section className="newsletter-section"><div><span className="eyebrow light">Keep in touch</span><h2>Good things,<br /><em>in your inbox.</em></h2></div><form onSubmit={(event) => { event.preventDefault(); toast.success("You’re on the list.", { description: "Watch your inbox for the good stuff." }); }}><p>New drops, helpful tips and the occasional sweet surprise. No noise.</p><div className="newsletter-input"><input type="email" required placeholder="Your email address" /><button type="submit"><ArrowRight size={19} /></button></div><small>By subscribing, you agree to receive Anikks updates.</small></form></section>

        <section className="contact-section" id="contact"><div><span className="eyebrow">Come say hello</span><h2>Let’s make it<br /><em>easy for you.</em></h2><p>Questions, orders or just a quick hello? We’re here.</p></div><div className="contact-details"><a href="https://wa.me/2349162259886" target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>+234 916 225 9886</strong></a><a href="tel:+2348124705254"><span>Telephone</span><strong>+234 812 470 5254</strong></a><div><span>Find us in</span><strong>Ifo & Ilaro, Ogun State</strong></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><a className="brand inverse" href="#top"><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></a><p>Quality treats, trend-led finds and everyday essentials — all in one happy place.</p><div className="socials"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={17} /></a><a href="https://tiktok.com" aria-label="TikTok">♪</a></div></div><div className="footer-links"><div><span>Explore</span><button onClick={() => scrollTo("shop")}>Shop all</button><button onClick={() => scrollTo("about")}>About us</button><button onClick={() => scrollTo("services")}>Our services</button></div><div><span>Need help?</span><button onClick={() => scrollTo("contact")}>Contact us</button><a href="https://wa.me/2349162259886">WhatsApp us</a><a href="tel:+2348124705254">Call +234 812 470 5254</a></div></div><div className="footer-bottom"><span>© 2026 Anikks Treats & Trend</span><span>Made with care in Ogun State, Nigeria</span><span>Privacy · Terms</span></div></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Your bag</span><h2>{cartCount} {cartCount === 1 ? "item" : "items"}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X size={20} /></button></div>{cartItems.length === 0 ? <div className="empty-cart"><ShoppingBag size={32} /><p>Your bag is waiting for something good.</p><button className="button button-orange" onClick={() => { setCartOpen(false); scrollTo("shop"); }}>Start shopping</button></div> : <><div className="cart-items">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.category}</span><h3>{product.name}</h3><strong>{naira(product.price)}</strong><div className="qty"><button onClick={() => updateQuantity(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button onClick={() => updateQuantity(product.id, 1)}><Plus size={13} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{naira(cartTotal)}</strong></div><small>Delivery is calculated when we confirm your order.</small><button className="button button-orange full" onClick={() => setCheckoutOpen(true)}>Checkout on WhatsApp <ArrowRight size={17} /></button></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close" onClick={() => setCheckoutOpen(false)}><X size={18} /></button><span className="eyebrow">Almost there</span><h2>Where should we send the good stuff?</h2><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name")); const phone = String(form.get("phone")); const address = String(form.get("address")); const lines = cartItems.map((item) => `• ${item.name} x${cart[item.id]} — ${naira(item.price * cart[item.id])}`).join("%0A"); const message = `Hello Anikks!%0A%0AI'd like to place an order.%0A%0AName: ${name}%0APhone: ${phone}%0ADelivery address: ${address}%0A%0AOrder:%0A${lines}%0A%0ATotal: ${naira(cartTotal)}`; window.open(`https://wa.me/2349162259886?text=${message}`, "_blank"); setCheckoutOpen(false); setCartOpen(false); toast.success("WhatsApp is ready with your order."); }}><label>Name<input name="name" required placeholder="Your full name" /></label><label>Phone number<input name="phone" required placeholder="+234" /></label><label>Delivery address<textarea name="address" required rows={3} placeholder="Where should we deliver?" /></label><button className="button button-orange full" type="submit">Open WhatsApp <ArrowRight size={17} /></button></form></div></div>}
    </div>
  );
}

function ArrowUpRightIcon() { return <ArrowRight size={15} />; }
