# Anikks Treats & Trend — implementation plan

## Product approach
Build a polished React/TypeScript storefront on the initialized web-db-user starter. The first release focuses on a high-conversion customer-facing home/shop experience with local cart persistence, product search/filtering, WhatsApp checkout, service and contact storytelling, and an admin-ready information architecture. The existing server, tRPC, Drizzle and Manus OAuth scaffolding remain available for the next pass of durable catalog/order management; the front end uses a clean seeded catalog so the site is useful immediately without inventing real selling prices.

## Design direction
Three possible directions were considered:
- Editorial Nigerian market luxe — 0.07
- Soft minimal lifestyle studio — 0.06
- High-energy street retail — 0.05

Chosen direction: **Editorial Nigerian market luxe**.

- **Design Movement:** premium editorial commerce with the warmth of a Lagos concept store and the confidence of a modern fashion lookbook.
- **Core Principles:** strong art direction, generous cream space, crisp olive structure, orange moments for action, and tactile card surfaces.
- **Color Philosophy:** olive anchors the brand in trust and grounded quality; orange creates appetite and momentum; cream keeps the experience elevated; red is reserved for urgency and stock signals.
- **Layout Paradigm:** asymmetric editorial composition—large hero photography on the right, copy-led left rail, horizontal category and product stories, and dark full-bleed service panels.
- **Signature Elements:** orange underline rules, pill-shaped status labels, and small uppercase eyebrow labels with generous tracking.
- **Interaction Philosophy:** interactions should feel quick and tactile: obvious CTAs, optimistic hover lifts, compact cart feedback, and no hidden shopping state.
- **Animation:** restrained rise/fade on content, slow hero image drift, and micro-scale hover on cards; avoid noisy motion.
- **Typography System:** Fraunces for expressive headlines and display numbers; Manrope for navigation, body copy and metadata. Use tight display leading and wide uppercase labels.
- **Brand Essence:** a trusted one-stop destination for Nigerian everyday treats and trend-led essentials; warm, sharp, dependable.
- **Brand Voice:** direct, welcoming, and locally confident. Example lines: “Good taste, no long story.” / “Find your next everyday favourite.”
- **Wordmark & Logo:** a text-led wordmark with a compact orange spark/leaf mark; keep “Anikks” spelling consistent.
- **Signature Brand Color:** #FF8500, “Anikks Orange”, used as the visual spark that turns browsing into buying.

## Functional scope
- Responsive home, shop, services, about, blog and contact sections in a single scrollable storefront with route-ready anchors.
- Search and category filters over a seeded product catalog with explicit “sample price” language until admin data is connected.
- Persistent cart in localStorage, quantity controls, totals, and WhatsApp order composer targeting +2349162259886.
- Newsletter/contact interactions with validation and success feedback.
- Admin entry point and backend scaffolding preserved for authenticated product/order/dashboard implementation.

## Project structure
- `client/src/pages/Home.tsx`: storefront composition and interaction state.
- `client/src/index.css`: brand tokens, typography, responsive visual system.
- `client/public/assets/`: generated hero and category visuals.
- `client/public/manus-routes.json`: route manifest for page discovery.
- `drizzle/schema.ts`, `server/db.ts`, `server/routers.ts`: durable catalog/order extension points.
- `plan.md` and `TODO.md`: scope and delivery record.

## Upgrade completed in this iteration
The storefront is now route-based rather than anchor-only: `/shop`, `/food`, `/shades`, `/perfumes`, `/product/:slug`, `/services`, `/about`, `/blog`, `/contact` and `/admin` each render a dedicated page surface. Shared navigation, footer, product cards and catalog helpers keep the pages consistent. The managed database now owns `products` and `orders`; public tRPC procedures support catalog lookup and order creation, while admin-only procedures support analytics, product creation/archive and order status changes. The cart remains browser-persistent so browsing across pages does not lose the customer’s selections, and checkout records the order before opening WhatsApp.
