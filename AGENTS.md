<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository Agent Guide

### Project Snapshot

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4.
- Domain: sample e-commerce flow with product browsing, cart, checkout, and order lookup.
- Data model:
	- Product data is currently in-memory in `lib/products.ts`.
	- Orders persist to `data/orders.json` through `lib/orders.ts`.

### Key Paths

- UI routes: `app/`
	- Catalog: `app/products/page.tsx`
	- Product detail: `app/products/[id]/page.tsx`
	- Cart: `app/cart/page.tsx`
	- Checkout: `app/checkout/page.tsx`
	- Order confirmation: `app/orders/[id]/page.tsx`
- API routes:
	- Products list/detail: `app/api/products/route.ts`, `app/api/products/[id]/route.ts`
	- Orders create/detail: `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`
- Shared logic:
	- Types: `lib/types.ts`
	- Currency formatting: `lib/format.ts`
	- Cart state/provider: `components/cart-provider.tsx`

### Runbook

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Run production build: `npm run start`

### Agent Behavior Expectations

- Keep changes scoped and minimal; avoid unrelated refactors.
- Preserve existing route contracts and payload shapes for `/api/products` and `/api/orders`.
- Validate user-visible and API behavior when modifying checkout, cart, or order code.
- Favor type-safe changes and keep TypeScript strictness intact.
- When changing API handlers:
	- Return meaningful HTTP status codes.
	- Keep JSON error responses stable and clear.
- When changing UI:
	- Maintain responsive behavior for mobile and desktop.
	- Preserve accessibility basics (labels, semantic controls, readable error states).

### Known Constraints

- Product stock is mutated in process memory during order creation and is not durable across server restarts.
- Order persistence uses a local JSON file and is not suitable for concurrent multi-instance deployments.
- Checkout intentionally does not process payments.

### Recommended Testing Focus

- API behavior:
	- Invalid checkout payloads return `400` with helpful errors.
	- Missing product/order IDs return expected error responses.
- Cart and checkout UX:
	- Empty-cart behavior for checkout and cart routes.
	- Successful checkout navigates to `/orders/:id` and clears cart.
- Product browsing:
	- Query and category filters in catalog route.

### Definition Of Done For Code Changes

- `npm run lint` passes.
- Relevant routes/components still render and function as expected.
- No accidental changes to unrelated files.
