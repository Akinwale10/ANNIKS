import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
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
  Trash2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { fromApiProduct } from "@/lib/catalog";

type Category = "All" | "Food" | "Shades" | "Perfumes";
type Product = {
  id: number;
  slug?: string;
  name: string;
  category: Exclude<Category, "All">;
  description: string;
  price: number;
  stock: string;
  badge?: string;
  featured?: boolean;
  image: string;
};

const imageBase = "/manus-storage/async-images/OI9xBlawlZzrQe1CFt29rD";
const products: Product[] = [
  { id: 1, slug: "classic-chin-chin", name: "Classic Chin Chin", category: "Food", description: "Golden, crunchy and lightly spiced.", price: 3500, stock: "In stock", badge: "Best seller", image: `${imageBase}/image-2.webp` },
  { id: 2, slug: "aviator-shade-no-02", name: "Aviator Shade No. 02", category: "Shades", description: "A clean everyday frame with warm tint.", price: 12000, stock: "In stock", badge: "New", image: `${imageBase}/image-3.webp` },
  { id: 3, slug: "amber-muse-fragrance", name: "Amber Muse Fragrance", category: "Perfumes", description: "Soft amber, citrus peel and skin musk.", price: 8500, stock: "Low stock", badge: "Editor's pick", image: `${imageBase}/image-4.webp` },
  { id: 4, slug: "small-chops-box", name: "Small Chops Box", category: "Food", description: "A party-ready mix made fresh to order.", price: 7500, stock: "Pre-order", image: `${imageBase}/image-2.webp` },
  { id: 5, slug: "olive-cat-eye", name: "Olive Cat-Eye", category: "Shades", description: "Sculpted lines for your main-character days.", price: 14500, stock: "In stock", image: `${imageBase}/image-3.webp` },
  { id: 6, slug: "citrus-bloom-mist", name: "Citrus Bloom Mist", category: "Perfumes", description: "A bright, easy layer for every day.", price: 6500, stock: "In stock", image: `${imageBase}/image-4.webp` },
];

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const heroHeadlinePhrases = ["Great finds.", "Everyday joy.", "Your kind of day."];

function TypewriterText({ text, delay = 0, speed = 42, loop = false }: { text: string | string[]; delay?: number; speed?: number; loop?: boolean }) {
  const phrases = useMemo(() => Array.isArray(text) ? text : [text], [text]);
  const [value, setValue] = useState("");
  useEffect(() => {
    let timer: number | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) { setValue(phrases[0]); return undefined; }
    setValue("");
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const tick = () => {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        characterIndex += 1;
        setValue(phrase.slice(0, characterIndex));
        if (characterIndex >= phrase.length) {
          if (!loop) return;
          deleting = true;
          timer = window.setTimeout(tick, 1800);
          return;
        }
      } else {
        characterIndex = Math.max(0, characterIndex - 1);
        setValue(phrase.slice(0, characterIndex));
        if (characterIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      timer = window.setTimeout(tick, deleting ? Math.max(18, speed / 2) : speed);
    };
    timer = window.setTimeout(tick, delay);
    return () => { if (timer) window.clearTimeout(timer); };
  }, [delay, loop, phrases, speed]);
  const label = phrases.join(" / ");
  const complete = !loop && value.length === phrases[0].length;
  return <span className="typewriter-text" aria-label={label}>{value}<span className={`typewriter-caret ${complete ? "complete" : ""}`} aria-hidden="true">▌</span></span>;
}

export default function Home() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const liveCatalog = trpc.catalog.list.useQuery(undefined, { retry: false });
  const storefrontProducts = useMemo(() => liveCatalog.data?.length ? liveCatalog.data.map(fromApiProduct) : products, [liveCatalog.data]);
  const heroSlides = useMemo(() => {
    const liveSlides = storefrontProducts.slice(0, 3).map((product) => {
      const slug = (product as unknown as { slug?: string }).slug;
      return { image: product.image, kicker: product.category, name: product.name, href: slug ? `/product/${slug}` : "/shop" };
    });
    const fallbackSlides = [
      { image: `${imageBase}/image-1.webp`, kicker: "The Anikks edit", name: "Made for your kind of day", href: "/shop" },
      { image: `${imageBase}/image-2.webp`, kicker: "Food favourites", name: "Good things for the table", href: "/food" },
      { image: `${imageBase}/image-3.webp`, kicker: "The eyewear edit", name: "Your everyday cool", href: "/shades" },
    ];
    return [...liveSlides, ...fallbackSlides].slice(0, 3);
  }, [storefrontProducts]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroIndex >= heroSlides.length) setHeroIndex(0);
  }, [heroIndex, heroSlides.length]);
  useEffect(() => {
    if (heroPaused || heroSlides.length < 2) return;
    const timer = window.setInterval(() => setHeroIndex((current) => (current + 1) % heroSlides.length), 5200);
    return () => window.clearInterval(timer);
  }, [heroPaused, heroSlides.length]);

  useEffect(() => {
    const saved = localStorage.getItem("anikks-cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (liveCatalog.isLoading) return;
    const validIds = new Set(storefrontProducts.map((product) => product.id));
    setCart((current) => Object.fromEntries(Object.entries(current).filter(([id, quantity]) => validIds.has(Number(id)) && Number.isFinite(quantity) && quantity > 0)));
  }, [liveCatalog.isLoading, storefrontProducts]);
  useEffect(() => {
    localStorage.setItem("anikks-cart", JSON.stringify(cart));
  }, [cart]);

  const filteredProducts = useMemo(() => storefrontProducts.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const text = `${product.name} ${product.description} ${product.category}`.toLowerCase();
    return matchesCategory && text.includes(query.toLowerCase());
  }).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [category, query, storefrontProducts]);

  const cartItems = storefrontProducts.filter((product) => cart[product.id]);
  const cartCount = cartItems.reduce((sum, product) => sum + cart[product.id], 0);
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
  const removeFromCart = (id: number) => setCart((current) => { const copy = { ...current }; delete copy[id]; return copy; });
  const productHref = (product: Product) => product.slug ? `/product/${product.slug}` : "/shop";
  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <div className="top-strip"><span>Free delivery on orders over ₦25,000 in Ogun</span><span>WhatsApp orders: +234 916 225 9886</span></div>
      <header className="site-header">
        <Link className="brand" href="/" onClick={() => setMenuOpen(false)}><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></Link>
        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          {[['Home', '/'], ['Shop', '/shop'], ['About Us', '/about'], ['Our Services', '/services'], ['Blog', '/blog'], ['Contact Us', '/contact']].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="icon-button" aria-label="Search" href="/shop"><Search size={19} /></Link>
          <Link className="icon-button account-button" aria-label="Account" href="/admin"><UserRound size={19} /></Link>
          <button className="cart-button" aria-label={`Open shopping bag${cartCount ? ` with ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`} title="Open shopping bag" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span>{cartCount > 0 && <b>{cartCount}</b>}</button>
          <button className="mobile-menu" aria-label="Toggle menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </header>
      {menuOpen && <button className="menu-backdrop" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> <TypewriterText text="Your everyday, elevated" delay={120} speed={48} /></div>
            <h1><TypewriterText text="Good taste." delay={420} speed={75} /><br /><em><TypewriterText text={heroHeadlinePhrases} delay={1200} speed={75} loop /></em></h1>
            <p className="hero-lede"><TypewriterText text="Your one-stop shop for food, fashion and everyday essentials. Curated with care, delivered with a smile." delay={2100} speed={24} /></p>
            <div className="hero-actions typewriter-actions"><Link className="button button-orange" href="/shop">Shop the edit <ArrowRight size={17} /></Link><Link className="text-link" href="/services">Explore our services <ArrowRight size={16} /></Link><button className="text-link cart-home-link" onClick={() => setCartOpen(true)}><ShoppingBag size={16} /> {cartCount > 0 ? `View your bag (${cartCount})` : "Open your bag"}</button></div>
            <div className="hero-note"><span className="note-dot" /><span><TypewriterText text="Small joys, thoughtfully sourced." delay={5000} speed={34} /></span></div>
          </div>
          <div className="hero-art" onMouseEnter={() => setHeroPaused(true)} onMouseLeave={() => setHeroPaused(false)} onFocus={() => setHeroPaused(true)} onBlur={() => setHeroPaused(false)}>
            <div className="hero-slides" aria-live="polite">
              {heroSlides.map((slide, index) => <Link className={`hero-slide ${index === heroIndex ? "active" : ""}`} href={slide.href} key={`${slide.image}-${index}`} tabIndex={index === heroIndex ? 0 : -1} aria-hidden={index !== heroIndex}>
                <img src={slide.image} alt={`${slide.kicker}: ${slide.name}`} />
                <span className="hero-slide-caption"><small>{slide.kicker}</small><strong>{slide.name}</strong></span>
              </Link>)}
            </div>
            <div className="hero-sticker"><Sparkles size={15} /><span>Made for<br /><strong>your kind of day</strong></span></div>
            <div className="hero-index">{String(heroIndex + 1).padStart(2, "0")} <span>/</span> {String(heroSlides.length).padStart(2, "0")}</div>
            <div className="hero-controls"><button type="button" aria-label="Previous hero slide" onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)}><ChevronLeft size={16} /></button><div className="hero-dots">{heroSlides.map((slide, index) => <button type="button" key={slide.image} aria-label={`Go to hero slide ${index + 1}`} className={index === heroIndex ? "active" : ""} onClick={() => setHeroIndex(index)} />)}</div><button type="button" aria-label="Next hero slide" onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)}><ChevronRight size={16} /></button></div>
          </div>
        </section>

        <section className="category-section" aria-label="Shop by category">
          <div className="section-heading"><div><span className="eyebrow">Shop by mood</span><h2>Pick your pleasure.</h2></div><Link className="text-link" href="/shop">View all products <ArrowRight size={16} /></Link></div>
          <div className="category-grid">
            {[{ name: "Food", kicker: "For the table", image: `${imageBase}/image-2.webp`, copy: "Treats that disappear fast.", href: "/food" }, { name: "Shades", kicker: "For the look", image: `${imageBase}/image-3.webp`, copy: "Your everyday cool.", href: "/shades" }, { name: "Perfumes", kicker: "For the mood", image: `${imageBase}/image-4.webp`, copy: "Leave a little trail.", href: "/perfumes" }].map((item) => <Link className="category-card" key={item.name} href={item.href}><img src={item.image} alt={item.name} /><span className="category-overlay" /><div className="category-content"><span className="eyebrow light">{item.kicker}</span><h3>{item.name}</h3><span>{item.copy} <ArrowUpRightIcon /></span></div></Link>)}
          </div>
        </section>

        <section className="shop-section" id="shop">
          <div className="shop-topline"><div><span className="eyebrow">The Anikks edit</span><h2>Find your next favourite.</h2></div><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products" /></div></div>
          <div className="filter-row"><div className="filter-tabs">{["All", "Food", "Shades", "Perfumes"].map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item as Category)}>{item}</button>)}</div><span className="result-count">{filteredProducts.length} pieces to love</span></div>
          <div className="product-grid">{filteredProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><Link className="product-image-link" href={productHref(product)} aria-label={`View ${product.name}`}><img src={product.image} alt={product.name} /></Link>{product.badge && <span className="product-badge">{product.badge}</span>}<button className="quick-add" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.id)}><Plus size={18} /></button></div><div className="product-meta"><div><span className="product-category">{product.category}</span><h3><Link href={productHref(product)}>{product.name}</Link></h3></div><strong>{naira(product.price)}</strong></div><p>{product.description}</p><div className="product-bottom"><span className={product.stock === "Low stock" ? "stock low" : "stock"}><span />{product.stock}</span><button onClick={() => addToCart(product.id)}>Add to bag</button></div></article>)}</div>
        </section>

        <section className="service-band"><div className="service-copy"><span className="eyebrow light">More than shopping</span><h2>Good things,<br /><em>made easy.</em></h2><p>From quick WhatsApp orders to everyday financial services, we’re here to make the little things feel lighter.</p><Link className="button button-cream" href="/services">Talk to our team <ArrowRight size={17} /></Link></div><div className="service-list"><div className="service-item"><span className="service-icon"><Truck /></span><div><h3>Easy orders & delivery</h3><p>Send us a WhatsApp, we’ll handle the rest.</p></div><ArrowRight size={18} /></div><div className="service-item"><span className="service-icon"><Zap /></span><div><h3>Moniepoint services</h3><p>Loans, POS, ATM, account opening and more.</p></div><ArrowRight size={18} /></div><div className="service-item"><span className="service-icon"><PackageCheck /></span><div><h3>Quality, always</h3><p>Thoughtful picks, checked before they reach you.</p></div><ArrowRight size={18} /></div></div></section>

        <section className="about-section home-secondary"><div className="about-visual"><div className="about-block orange-block" /><div className="about-card"><span className="about-number">01</span><span>Quality products.<br /><strong>Real convenience.</strong></span></div></div><div className="about-copy"><span className="eyebrow">Our story</span><h2>A little bit of<br /><em>everything good.</em></h2><p>Anikks Treats & Trend is your trusted destination for quality food, fashion accessories, fragrances and everyday essentials. We’re committed to providing quality products, affordable prices and excellent customer service.</p><div className="values"><div><Check size={16} /><span><strong>Our mission</strong>Make everyday shopping feel personal.</span></div><div><Check size={16} /><span><strong>Why choose us?</strong>Thoughtful service, fair prices, no stress.</span></div></div><Link className="text-link" href="/about">Get to know Anikks <ArrowRight size={16} /></Link></div></section>

        <section className="testimonial-section home-secondary"><div className="testimonial-heading"><span className="eyebrow">Kind words</span><h2>Loved by our people.</h2></div><div className="testimonial-card"><div className="stars">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={15} fill="currentColor" />)}</div><blockquote>“The chin chin finished before the movie even started. And the perfume? I’ve had three compliments today.”</blockquote><div className="reviewer"><span className="avatar">AM</span><span><strong>Amaka M.</strong><small>Sample customer review</small></span></div></div><div className="testimonial-side"><span>★★★★★</span><p>“Easy to order, lovely packaging and everything arrived exactly as promised.”</p><strong>— Tolu A.</strong></div></section>

        <section className="blog-section home-secondary"><div className="section-heading"><div><span className="eyebrow">The journal</span><h2>Notes from Anikks.</h2></div><Link className="text-link" href="/blog">Read all stories <ArrowRight size={16} /></Link></div><div className="blog-grid"><article className="blog-feature"><div className="blog-art food-art"><span>01</span></div><div><span className="blog-tag">Food & hosting</span><h3>Small chops, big mood: building a table people remember.</h3><Link className="text-link" href="/blog">Read story <ArrowRight size={15} /></Link></div></article><article className="blog-small"><span className="blog-tag">Style notes</span><h3>Three shades that do the most.</h3><Link className="text-link" href="/blog">Read story <ArrowRight size={15} /></Link></article><article className="blog-small orange-paper"><span className="blog-tag">Scent edit</span><h3>How to find a fragrance that feels like you.</h3><Link className="text-link" href="/blog">Read story <ArrowRight size={15} /></Link></article></div></section>

        <section className="newsletter-section"><div><span className="eyebrow light">Keep in touch</span><h2>Good things,<br /><em>in your inbox.</em></h2></div><form onSubmit={(event) => { event.preventDefault(); toast.success("You’re on the list.", { description: "Watch your inbox for the good stuff." }); }}><p>New drops, helpful tips and the occasional sweet surprise. No noise.</p><div className="newsletter-input"><input type="email" required placeholder="Your email address" /><button type="submit"><ArrowRight size={19} /></button></div><small>By subscribing, you agree to receive Anikks updates.</small></form></section>

        <section className="contact-section" id="contact"><div><span className="eyebrow">Come say hello</span><h2>Let’s make it<br /><em>easy for you.</em></h2><p>Questions, orders or just a quick hello? We’re here.</p></div><div className="contact-details"><a href="https://wa.me/2349162259886" target="_blank" rel="noreferrer"><span>WhatsApp</span><strong>+234 916 225 9886</strong></a><a href="tel:+2348124705254"><span>Telephone</span><strong>+234 812 470 5254</strong></a><div><span>Find us in</span><strong>Ifo & Ilaro, Ogun State</strong></div></div></section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><Link className="brand inverse" href="/"><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></Link><p>Quality treats, trend-led finds and everyday essentials — all in one happy place.</p><div className="socials"><a href="https://instagram.com" aria-label="Instagram"><Instagram size={17} /></a><a href="https://tiktok.com" aria-label="TikTok">♪</a></div></div><div className="footer-links"><div><span>Explore</span><Link href="/shop">Shop all</Link><Link href="/about">About us</Link><Link href="/services">Our services</Link></div><div><span>Need help?</span><Link href="/contact">Contact us</Link><a href="https://wa.me/2349162259886">WhatsApp us</a><a href="tel:+2348124705254">Call +234 812 470 5254</a></div></div><div className="footer-bottom"><span>© 2026 Anikks Treats & Trend</span><span>Made with care in Ogun State, Nigeria</span><span>Privacy · Terms</span></div></footer>

      {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">Your bag</span><h2>{cartCount} {cartCount === 1 ? "item" : "items"}</h2></div><button className="icon-button" onClick={() => setCartOpen(false)}><X size={20} /></button></div>{cartItems.length === 0 ? <div className="empty-cart"><ShoppingBag size={32} /><p>Your bag is waiting for something good.</p><button className="button button-orange" onClick={() => { setCartOpen(false); scrollTo("shop"); }}>Start shopping</button></div> : <><div className="cart-items">{cartItems.map((product) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} /><div><span>{product.category}</span><h3>{product.name}</h3><strong>{naira(product.price)}</strong><div className="qty"><button onClick={() => updateQuantity(product.id, -1)}><Minus size={13} /></button><span>{cart[product.id]}</span><button onClick={() => updateQuantity(product.id, 1)}><Plus size={13} /></button><button className="remove-item" aria-label={`Remove ${product.name} from cart`} onClick={() => removeFromCart(product.id)}><Trash2 size={14} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{naira(cartTotal)}</strong></div><small>Delivery is calculated when we confirm your order.</small><button className="button button-orange full" onClick={() => setCheckoutOpen(true)}>Checkout on WhatsApp <ArrowRight size={17} /></button></div></>}</aside></div>}
      {checkoutOpen && <div className="modal-backdrop"><div className="checkout-modal"><button className="modal-close" onClick={() => setCheckoutOpen(false)}><X size={18} /></button><span className="eyebrow">Almost there</span><h2>Where should we send the good stuff?</h2><form onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const name = String(form.get("name")); const phone = String(form.get("phone")); const address = String(form.get("address")); const lines = cartItems.map((item) => `• ${item.name} x${cart[item.id]} — ${naira(item.price * cart[item.id])}`).join("%0A"); const message = `Hello Anikks!%0A%0AI'd like to place an order.%0A%0AName: ${name}%0APhone: ${phone}%0ADelivery address: ${address}%0A%0AOrder:%0A${lines}%0A%0ATotal: ${naira(cartTotal)}`; window.open(`https://wa.me/2349162259886?text=${message}`, "_blank"); setCheckoutOpen(false); setCartOpen(false); toast.success("WhatsApp is ready with your order."); }}><label>Name<input name="name" required placeholder="Your full name" /></label><label>Phone number<input name="phone" required placeholder="+234" /></label><label>Delivery address<textarea name="address" required rows={3} placeholder="Where should we deliver?" /></label><button className="button button-orange full" type="submit">Open WhatsApp <ArrowRight size={17} /></button></form></div></div>}
    </div>
  );
}

function ArrowUpRightIcon() { return <ArrowRight size={15} />; }
