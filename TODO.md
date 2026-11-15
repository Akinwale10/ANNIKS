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
- [x] Durable product, stock, order and analytics flows are connected to Drizzle tables and server procedures; admin users can add/archive products, inspect analytics, view orders and update order status.
- [x] Admin-created products are read by the homepage, Shop page, Food/Shades/Perfumes category pages and product-detail routes, with the seeded catalog retained only as a fallback when the database has no rows.
- [ ] Blog posts, customer reviews, newsletter subscribers, homepage banners and contact enquiries still use the public-page presentation layer and need their own CRUD tables/procedures if the business wants those managed from admin.
- [x] The project has real route entries for Home, Shop, Food, Shades, Perfumes, Product detail, Services, About Us, Blog, Contact Us and Admin.

## Delivery quality
- [x] `/manus-routes.json` exists and matches the implemented routes.
- [x] TypeScript diagnostics and production build complete without actionable errors.
- [x] The preview server listens on port 3000 and the website is ready for checkpointing to the canonical repository.
- [x] The UI fits common phone, tablet and desktop viewports without horizontal overflow; narrow-phone grids, drawers, forms and the mobile navigation adapt to the available screen width.
- [x] The hero artwork is a smooth product carousel driven by live catalog images, with fallback brand imagery, auto-advance, hover/focus pause, previous/next controls, slide dots, product captions and links to the relevant product or category page.
