# Anikks Treats & Trend — delivery checklist

## Customer storefront
- [x] The site uses the Anikks palette (#24310B, #FF8500, #FFFCEF, #E5092B, white, dark text) and presents a premium Nigerian retail/lifestyle visual system.
- [x] The responsive navigation includes Home, Shop, About Us, Our Services, Blog and Contact Us, plus search, cart counter, account affordance, mobile menu and sticky behavior.
- [x] The homepage includes the requested hero headline, supporting copy, SHOP NOW and EXPLORE OUR SERVICES CTAs, category cards for Food/Shades/Perfumes, featured product content, a services teaser, newsletter, contact details and footer links.
- [x] The homepage is now intentionally focused: deeper About, testimonial and Journal content is available on dedicated routes instead of being stacked into the landing page; header links, category cards, hero CTAs and footer links navigate to real pages.
- [x] Product cards show an image, name, description, Nigerian Naira display, stock state, Add to Cart and View Product affordances; sample prices are clearly labelled in the seeded demo catalog until admin-managed pricing is connected.

## Shopping and contact behavior
- [x] Customers can search and filter the catalog, add items, change quantities, remove items, view totals and retain cart state across refreshes.
- [x] WhatsApp checkout composes customer name, phone, delivery address, products, quantities, prices and total for +2349162259886.
- [x] WhatsApp, telephone, newsletter and enquiry interactions provide usable feedback and contact links.

## Backend-ready administration
- [x] The initialized server/database/auth stack remains intact, `/admin` uses the starter’s real Manus OAuth session and role check, and the OAuth callback accepts the hardened Preview cookie plus a compatible fallback cookie so state survives the portal redirect.
- [x] A signed-in setup user no longer gets a dead-end “Access requested” screen: when no administrator exists, the dashboard offers a one-time authenticated “Activate admin access” action; once claimed, the normal admin role guard remains active.
- [x] Durable product, stock, order and analytics flows are connected to Drizzle tables and server procedures; admin users can add/archive products, inspect analytics, view orders and update order status.
- [x] Admin-created products are read by the homepage, Shop page, Food/Shades/Perfumes category pages and product-detail routes, with the seeded catalog retained only as a fallback when the database has no rows.
- [x] Admin product creation accepts JPG, PNG, WEBP or GIF images directly from the browser file manager, validates a maximum 8MB size, uploads through the authenticated server to durable project storage, previews the selected image, persists its stable `/manus-storage/...` URL and refreshes the storefront catalog after save.
- [x] Product descriptions are optional during image-first uploads; blank descriptions are accepted and receive a safe Anikks fallback description server-side instead of returning a Zod `too_small` error.
- [ ] Blog posts, customer reviews, newsletter subscribers, homepage banners and contact enquiries still use the public-page presentation layer and need their own CRUD tables/procedures if the business wants those managed from admin.
- [x] The project has real route entries for Home, Shop, Food, Shades, Perfumes, Product detail, Services, About Us, Blog, Contact Us and Admin.

## Delivery quality
- [x] `/manus-routes.json` exists and matches the implemented routes.
- [x] TypeScript diagnostics and production build complete without actionable errors.
- [x] The preview server listens on port 3000 and the website is ready for checkpointing to the canonical repository.
- [x] The UI fits common phone, tablet and desktop viewports without horizontal overflow; narrow-phone grids, drawers, forms and the mobile navigation adapt to the available screen width.
- [x] The hero artwork is a smooth product carousel driven by live catalog images, with fallback brand imagery, auto-advance, hover/focus pause, previous/next controls, slide dots, product captions and links to the relevant product or category page.
- [x] Homepage product pictures and names in “Find your next favourite” open the matching product-detail route; cart rows expose a visible trash/delete action; and an open mobile hamburger menu closes when the user taps outside it.
- [x] Hero text uses a staggered typewriter effect for the eyebrow, headline, supporting copy and note, with a blinking caret, delayed CTA reveal and immediate full-text rendering under `prefers-reduced-motion`.
- [x] Persisted cart data is reconciled against the current storefront catalog so deleted or unavailable products disappear instead of showing as ghost items; cart totals/counts only include visible products; and the homepage exposes an always-available Open your bag shortcut.
- [x] The hero headline continues with a repeating type/delete typewriter sequence through “Great finds.”, “Everyday joy.” and “Your kind of day.” while preserving the reduced-motion fallback.
- [x] Shared hamburger navigation links and header icons close the menu reliably when activated, the brand/search/account/bag actions are clickable, the menu has accessible `aria-expanded` and close labels, and tapping outside the open mobile menu dismisses it.
- [x] Blog supports journal filters for Food & hosting, Style notes, Scent edit and Anikks updates, with four substantial five-minute-read articles, working Read story expansion, metadata, long-form paragraphs, Back to journal and Talk to Anikks actions.
- [x] Homepage “Find your next favourite” initially shows a focused product set and adds a below-grid View all products control that expands the current filtered catalog; on mobile, product cards render two across so the expanded catalog forms compact rows.
- [x] Expanded homepage View all products view includes a responsive Sort by dropdown with Popularity, Price: low to high and Price: high to low options; popularity prioritizes featured products and best-seller badges.
