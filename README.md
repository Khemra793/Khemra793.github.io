# Atelier shop

Full-stack sample store: catalog, cart, and checkout against Next.js API routes with mock products.

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API

- `GET /api/products?q=&category=` — list products and categories
- `GET /api/products/:id` — product detail
- `POST /api/orders` — place an order (`customer` + `items`)
- `GET /api/orders/:id` — order confirmation

Orders are stored in `data/orders.json`. Checkout does not take payment.
