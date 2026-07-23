# MyStore — React E-commerce App

A simple, SEO-friendly React (Vite) e-commerce front end built **without any third-party UI library**
(no Bootstrap/MUI/Tailwind plugins, no react-helmet, no form libraries). Plain CSS + plain fetch.

## Tech
- React 19 + Vite
- `react-router-dom` only (routing) — everything else is hand-rolled
- Plain CSS with design tokens (`src/styles/variables.css`)
- Native `fetch` wrapped in `src/api/config.js`

## Folder Structure
```
src/
  api/              # All network calls. ONE base URL lives in config.js
    config.js       # BASE_URL, ENDPOINTS map, apiRequest() fetch wrapper
    authApi.js       # login/signup/otp/profile
    productApi.js    # products/categories
    cartApi.js        # cart + order/checkout

  utils/
    validation.js    # rules{} + validateForm() — reused by every form
    mockProducts.js  # placeholder data until backend is live

  context/
    AuthContext.jsx  # logged-in user + token persistence
    CartContext.jsx  # cart items, address, coupon, totals

  components/
    common/          # Button, Input, Header, BottomNav, Loader, Seo
    product/         # ProductCard, FilterPanel
    cart/            # Stepper (User Detail -> Delivery -> Payment)

  pages/
    Auth/            # Login, Signup, Otp
    Store/           # Home (Store landing)
    Product/         # ProductListing, ProductCategory, SingleProduct
    Cart/            # CartList, UserDetail, Delivery, Payment, OrderSuccess
    Profile/         # Profile, MyOrders
    Placeholder.jsx, NotFound.jsx

  routes/
    AppRoutes.jsx    # every route in one file, easy to scan/extend
    Layout.jsx        # shows BottomNav only on main tab pages

  styles/
    variables.css    # CSS custom properties (colors, spacing, radius)
    global.css       # resets + responsive breakpoints
```

## Setting the API Base URL
Everything points at **one** place: `.env`

```
VITE_API_BASE_URL=https://api.example.com/v1
```

Change this per environment (`.env.development`, `.env.production`, etc.) —
no component ever hardcodes a URL. All requests go through
`src/api/config.js -> apiRequest()`, which also attaches the auth token
automatically from `localStorage`.

To add a new API call: add the path to `ENDPOINTS` in `config.js`, then add
a function to the relevant `*Api.js` file. Never call `fetch` directly from
a page/component.

## Form Validation
`src/utils/validation.js` exports:
- `rules` — small pure functions (`required`, `email`, `phone`, `password`,
  `confirmPassword`, `pincode`, `otp`, `minLength`)
- `validateForm(values, schema)` — runs a schema object of
  `{ field: [validator, validator...] }` against form state and returns
  `{ isValid, errors }`

Every form (Login, Signup, OTP, User Detail, Delivery Address) follows the
same pattern: local `values`/`errors` state, `validateForm` on submit,
inline error text under each field.

## SEO
- `index.html` has descriptive `<title>`, meta description, robots, and
  Open Graph tags.
- `src/components/common/Seo.jsx` is a zero-dependency component (no
  react-helmet) that updates `document.title` and the meta description per
  page.
- Pages use semantic HTML (`<main>`, `<header>`, `<nav>`, `<h1>`, `<form>`,
  `<fieldset>`) and images use `alt` text + `loading="lazy"`.

## Responsiveness
Mobile-first. The whole app lives inside a centered `.app-shell` that widens
at breakpoints (`600px`, `900px`, `1200px`) defined in `global.css`. Product
grids go from 2 -> 3 -> 4 columns as the viewport grows.

## Running
```bash
npm install
npm run dev      # local dev server
npm run build    # production build (outputs to dist/)
```

## Connecting a Real Backend
1. Set `VITE_API_BASE_URL` in `.env`.
2. Confirm/adjust the endpoint paths in `src/api/config.js`.
3. Remove the `mockProducts` fallbacks in pages once the API is returning
   real data (`Home.jsx`, `ProductListing.jsx`, `ProductCategory.jsx`,
   `SingleProduct.jsx` — each currently falls back to mock data if the
   request fails, so the UI is easy to demo before the backend exists).
