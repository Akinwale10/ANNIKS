import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export function useCartCount() {
  const [count, setCount] = useState(0);
  useEffect(() => { const update = () => { try { const value = JSON.parse(localStorage.getItem("anikks-cart") || "{}"); setCount(Object.values(value).reduce((sum: number, item) => sum + Number(item), 0)); } catch { setCount(0); } }; update(); window.addEventListener("anikks-cart-updated", update); return () => window.removeEventListener("anikks-cart-updated", update); }, []);
  return count;
}

export function addToCart(id: number) {
  const current = JSON.parse(localStorage.getItem("anikks-cart") || "{}");
  current[id] = (current[id] || 0) + 1;
  localStorage.setItem("anikks-cart", JSON.stringify(current));
  window.dispatchEvent(new Event("anikks-cart-updated"));
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const count = useCartCount();
  const [location] = useLocation();
  const links = [["Home", "/"], ["Shop", "/shop"], ["About Us", "/about"], ["Our Services", "/services"], ["Blog", "/blog"], ["Contact Us", "/contact"]];
  return <><div className="top-strip"><span>Free delivery on orders over ₦25,000 in Ogun</span><span>WhatsApp orders: +234 916 225 9886</span></div><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></Link><nav className={open ? "main-nav open" : "main-nav"}>{links.map(([label, href]) => <Link className={location === href ? "active" : ""} key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav><div className="header-actions"><Link className="icon-button" href="/shop" aria-label="Search"><Search size={19} /></Link><Link className="icon-button account-button" href="/admin" aria-label="Account"><UserRound size={19} /></Link><Link className="cart-button" href="/shop#bag"><ShoppingBag size={19} /><span>Bag</span>{count > 0 && <b>{count}</b>}</Link><button className="mobile-menu" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>{open ? <X size={22} /> : <Menu size={22} />}</button></div></header></>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="footer-brand"><Link className="brand inverse" href="/"><span className="brand-mark">✦</span><span>anikks<small>treats & trend</small></span></Link><p>Quality treats, trend-led finds and everyday essentials — all in one happy place.</p><div className="socials"><a href="https://instagram.com" aria-label="Instagram">◎</a><a href="https://tiktok.com" aria-label="TikTok">♪</a></div></div><div className="footer-links"><div><span>Explore</span><Link href="/shop">Shop all</Link><Link href="/about">About us</Link><Link href="/services">Our services</Link><Link href="/blog">Journal</Link></div><div><span>Need help?</span><Link href="/contact">Contact us</Link><a href="https://wa.me/2349162259886">WhatsApp us</a><a href="tel:+2348124705254">Call +234 812 470 5254</a></div></div><div className="footer-bottom"><span>© 2026 Anikks Treats & Trend</span><span>Made with care in Ogun State, Nigeria</span><span>Privacy · Terms</span></div></footer>;
}

export function PageShell({ children }: { children: React.ReactNode }) { return <div className="site-shell"><SiteHeader />{children}<SiteFooter /></div>; }
