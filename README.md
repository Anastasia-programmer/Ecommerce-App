# Maktaba · مكتبة — Algerian & world literature

> **TD-TP 2 — Create a React Application with Redux for State Management**
> Module WAMD · ENSTA · SS/IA, first semester 2026

| | |
|---|---|
| **Student** | AMEDJKOUH Darine |
| **Store name** | Maktaba (مكتبة — “bookshop” in Arabic) |
| **Category** | Books — Algerian and world literature |

> **TD-TP 3 (backend):** the REST API (Node.js, Express, MongoDB, JWT, OAuth 2.0, rate limiting)
> is in [`server/`](server/). See [server/README.md](server/README.md).
>
> **TD-TP 4 (full-stack integration):** the React shop now uses that API for its books, for sign-in
> (JWT) and to add, edit and delete books. See [section 9](#9-td-tp-4--full-stack-integration).

![Maktaba home page](screenshots/01-home.png)

---

## 1. Application description

**Maktaba** is a small e-commerce front-end for an online bookshop. Users browse a catalog of
20 books (Kateb Yacine, Assia Djebar, Mohammed Dib, Ahlam Mosteghanemi, Camus, Fanon, Sagan…),
search and filter it, open a book’s details, save favorites and manage a shopping basket
whose totals update instantly.

The visual identity is inspired by Algerian heritage: zellige stars, Moorish arches and Kabyle
motifs. **Every book cover is drawn in code** (SVG + CSS) by the reusable `<BookCover />`
component, so the project uses no image files and works offline.

In TD-TP 2 the catalog was static data loaded into the Redux store. Since TD-TP 3 it is
**fetched from the backend API** (`server/`), which stores the books in MongoDB. Checkout is
still a demo confirmation.

## 2. Technologies used

| Technology | Purpose |
|---|---|
| **React 19** (JSX, function components, hooks) | User interface |
| **Redux** via **Redux Toolkit** `configureStore` | Global state store (Redux DevTools enabled) |
| **React-Redux 9** (`Provider`, `useSelector`, `useDispatch`) | Connects components to the store |
| **Vite** | Dev server and production build |
| **JavaScript ES6+** | Application logic |
| **CSS** (custom properties, grid, container queries) | Styling, light/dark themes, responsive layout |
| **@fontsource** (Fraunces, Inter, Reem Kufi) | Self-hosted fonts, no internet needed |
| **ESLint** | Code quality |

## 3. How to run the application

Requirements: **Node.js 20.19+ or 22.12+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the backend API (first time: cd server && npm install && cp .env.example .env)
npm run api
# → http://localhost:3000

# 3. In a second terminal, start the website
npm run dev
# → open http://localhost:5173

# Optional
npm run build     # production build in dist/
npm run preview   # serve the production build
npm run lint      # check the code with ESLint
```

## 4. Project structure

```
src/
├── main.jsx                 # Entry point: <Provider store={store}> wraps <App />
├── App.jsx                  # Layout, simple navigation, details dialog
├── data/
│   └── products.js          # Shop constants (the books come from the API)
├── redux/
│   ├── store.js             # configureStore + localStorage persistence
│   ├── actionTypes.js       # All action type constants
│   ├── actions/             # Action creators
│   │   ├── cartActions.js
│   │   ├── favoritesActions.js
│   │   ├── filterActions.js
│   │   └── uiActions.js
│   ├── reducers/            # One reducer per part of the state
│   │   ├── index.js         # combineReducers → rootReducer
│   │   ├── productsReducer.js
│   │   ├── cartReducer.js
│   │   ├── favoritesReducer.js
│   │   ├── filtersReducer.js
│   │   └── uiReducer.js
│   ├── selectors.js         # Read & derive state (memoized with createSelector)
│   ├── localStorage.js      # Load / save persisted state
│   └── middleware/
│       └── actionLogger.js  # Records dispatched actions for the in-app inspector
├── pages/
│   ├── ShopPage.jsx         # Hero + filterable catalog
│   └── FavoritesPage.jsx    # Saved books
├── components/              # One folder per component (JSX + CSS)
│   ├── Header/  Hero/  Footer/  Logo/  Icon/
│   ├── ProductGrid/  ProductCard/  BookCover/  ProductDetails/
│   ├── CategoryFilter/  SortSelect/
│   ├── CartDrawer/  CartItem/  QuantityStepper/  Price/  RatingStars/
│   └── EmptyState/  Toast/  StateInspector/
├── styles/global.css        # Design tokens, light/dark themes, base styles
└── utils/format.js          # Price formatting (1 200 DA), discount %
```

## 5. Main React components

| Component | Role | Props | State used |
|---|---|---|---|
| `App` | Root layout, page switching, details dialog | — | **Local**: `page`, `selectedProductId` · **Redux**: theme, cart open |
| `Header` | Logo, navigation, search, theme toggle, basket button | `currentPage`, `onNavigate` | **Redux**: search query, theme, cart and favorites counts · **Local**: `isScrolled` |
| `Hero` | Landing section with featured books and stats | `onBrowse`, `onOpenDetails` | **Redux**: products, categories |
| `CategoryFilter` | Category chips with counts | — | **Redux**: `filters.category` |
| `SortSelect` | Sorting drop-down | — | **Redux**: `filters.sort` |
| `ProductGrid` | Reusable grid (shop + favorites) | `products`, `onOpenDetails` | — |
| `ProductCard` | One book: cover, info, price, add / quantity, favorite | `product`, `onOpenDetails`, `index` | **Redux**: quantity in cart, favorite status |
| `BookCover` | Reusable generated cover (card, dialog, cart, hero) | `book` | — |
| `ProductDetails` | Dialog with description, specs, quantity picker | `productId`, `onClose` | **Local**: chosen `quantity`, `justAdded` · **Redux**: product, cart, favorites |
| `CartDrawer` | Slide-in basket with totals and checkout | — | **Redux**: cart items, totals, open state · **Local**: `confirmedOrder` |
| `CartItem` | One basket line | `item` | dispatches cart actions |
| `QuantityStepper` | Reusable − / + control | `quantity`, `onIncrease`, `onDecrease`, `min`, `max`… | — (fully controlled by props) |
| `Price`, `RatingStars`, `EmptyState`, `Icon`, `Logo` | Small presentational components | various | — |
| `Toast` | Short feedback notification | — | **Redux**: `ui.toast` |
| `StateInspector` | Developer panel: live Redux state + last actions | — | **Local**: open / tab · **Redux**: whole state |

**Local state or Redux?** Data needed by several unrelated components (cart, favorites, filters,
theme, basket open/closed, notifications) lives in **Redux**. Data used by one component only
(the quantity picked in the dialog, the header shadow, the order confirmation) stays in
**React local state** (`useState`).

## 6. Redux state managed by the application

```js
{
  products:  { items: [ /* 20 books */ ], status: 'succeeded', error: null }, // loaded from the API
  cart:      { items: [ { id: 'nedjma', quantity: 2 } ] },
  favorites: { ids: [ 'l-etranger', 'memory-in-the-flesh' ] },
  filters:   { query: '', category: 'All', sort: 'featured' },
  ui:        { theme: 'light', isCartOpen: false, toast: null }
}
```

The cart only stores `{ id, quantity }`. Titles, prices and totals are **derived** by selectors
(`selectCartItems`, `selectCartTotals`), so no data is duplicated.

### Actions

| Reducer | Action type | Action creator | Effect |
|---|---|---|---|
| cart | `cart/addToCart` | `addToCart(id, quantity)` | Adds a book or increases its quantity (max 10) |
| cart | `cart/removeFromCart` | `removeFromCart(id)` | Removes a book |
| cart | `cart/increaseQuantity` | `increaseQuantity(id)` | +1 |
| cart | `cart/decreaseQuantity` | `decreaseQuantity(id)` | −1 (removes the book at 0) |
| cart | `cart/clearCart` | `clearCart()` | Empties the basket |
| favorites | `favorites/toggleFavorite` | `toggleFavorite(id)` | Adds / removes a favorite |
| filters | `filters/setSearchQuery` | `setSearchQuery(query)` | Search text |
| filters | `filters/setCategory` | `setCategory(category)` | Category filter |
| filters | `filters/setSort` | `setSort(sort)` | Sorting order |
| filters | `filters/resetFilters` | `resetFilters()` | Back to defaults |
| ui | `ui/toggleTheme` | `toggleTheme()` | Light ↔ dark |
| ui | `ui/openCart` / `ui/closeCart` | `openCart()` / `closeCart()` | Basket drawer |
| ui | `ui/showToast` / `ui/hideToast` | `showToast(message)` / `hideToast()` | Notifications |

### Data flow example — “Add to basket”

```
click “Add” in <ProductCard>
  → dispatch(addToCart('nedjma'))              // action { type: 'cart/addToCart', payload: { id, quantity: 1 } }
  → cartReducer returns a NEW state             // pure function, no mutation
  → store notifies subscribed components
  → <Header> badge, <ProductCard> stepper and <CartDrawer> totals re-render
  → store.subscribe saves the cart to localStorage
```

## 7. Implemented features

**Required**
- [x] React application with JSX and many reusable components
- [x] Props (e.g. `product`, `onOpenDetails`, `quantity`/`onIncrease`)
- [x] Local state where appropriate (`useState`)
- [x] User events (click, change, keyboard: Escape closes dialogs, `/` focuses search)
- [x] Product catalog with product information
- [x] Shopping cart: add, remove, and dynamic updates
- [x] Redux store, action types, action creators, reducers (`combineReducers`)
- [x] React-Redux: `Provider`, `useSelector` (read), `useDispatch` (dispatch)
- [x] Updated global state displayed everywhere (badges, steppers, totals, inspector panel)
- [x] Clear, responsive, user-friendly interface (desktop, tablet, mobile)

**Optional (from the lab’s list)**
- [x] Product search (title, author, accents ignored: “etranger” finds “L’Étranger”)
- [x] Category filtering with counts
- [x] Product sorting (price, rating, date, title)
- [x] Product details dialog
- [x] Quantity management (card, dialog and basket)
- [x] Cart total with subtotal, discounts, delivery fee and a free-delivery progress bar
- [x] Discount display (−20 % badges, struck-through old prices)
- [x] Favorites page
- [x] Dark / light mode (follows the system preference on first visit)
- [x] Simple navigation (Shop / Favorites)
- [x] Local storage (cart, favorites and theme survive a page reload)

**Testing and debugging**
- In-app **Redux inspector** (bottom-left “Redux” button): live store state and the last
  dispatched actions with their payloads.
- Compatible with the **Redux DevTools** browser extension (enabled by `configureStore`).
- Redux Toolkit’s development checks warn if a reducer mutates the state.

## 8. Screenshots

| | |
|---|---|
| ![Catalog](screenshots/02-catalog.png) Catalog with items in the basket | ![Details](screenshots/03-product-details.png) Product details |
| ![Cart](screenshots/04-cart.png) Shopping basket | ![Checkout](screenshots/05-checkout-confirmation.png) Order confirmation (demo) |
| ![Filters](screenshots/06-filter-and-sort.png) Category filter + sorting | ![No results](screenshots/07-no-results.png) Empty search state |
| ![Dark mode](screenshots/08-dark-mode.png) Dark mode | ![Redux inspector](screenshots/09-redux-inspector.png) Redux inspector |
| ![Favorites](screenshots/10-favorites.png) Favorites page | ![Mobile](screenshots/12-mobile-catalog.png) Mobile |

More screenshots are in the [`screenshots/`](screenshots) folder.

## 9. TD-TP 4 — Full-stack integration

```
React frontend (Redux)  ──fetch + JWT──▶  Express REST API (server/)  ──Mongoose──▶  MongoDB
```

| Task of the lab | Where it is done |
|---|---|
| Connect frontend and backend (Fetch API) | `src/api.js`: one `request()` function for every call (JSON body, `Authorization: Bearer <token>`, error messages) |
| Display products from MongoDB | `fetchProducts()` thunk on start-up → `GET /api/products` → products reducer |
| Registration and login | **Sign in** page (`src/pages/AccountPage.jsx`) → `POST /api/auth/register` / `login` |
| JWT authentication | The token is kept in the `auth` reducer and in local storage (forgotten when expired), and sent with every protected request |
| CRUD from the frontend | **Manage** page (`src/pages/ManagePage.jsx` + `ProductForm`), only for logged-in users → `POST`, `PUT`, `DELETE /api/products` |
| Loading states and errors | See the table below |

### Authentication flow

1. The user signs in. `login()` (`src/redux/actions/authActions.js`) calls `POST /api/auth/login`.
2. The API returns `{ token, user }`, and `auth/loginSuccess` stores them. The header shows the
   user's name and a **Manage** tab.
3. Creating, editing or deleting a book sends `Authorization: Bearer <token>`.
4. If the API answers **401** (token invalid or expired), the user is logged out automatically
   and asked to sign in again.
5. **Sign out** (`auth/logout`) removes the token from the store and from local storage.

### Error handling

| Situation | What the user sees |
|---|---|
| Catalog loading | “Loading the books…” |
| API not running | “Could not load the books — Cannot reach the server…” + **Try again** button |
| Wrong email or password (401) | “Invalid email or password” under the form |
| Email already used (409) | “Email already registered” |
| Too many login attempts (429) | “Too many login attempts, please try again in 15 minutes” |
| Invalid product data (400) | The API validation message under the product form |
| Expired or invalid token (401) | Automatic sign-out + “Your session has expired, please sign in again” |
| While saving | Buttons disabled, “Saving…” / “Please wait…” |

### Testing the full-stack application

With `npm run api` and `npm run dev` running:

1. The shop shows the 20 books from MongoDB.
2. **Sign in → Create an account** → you are logged in and taken to **Manage**.
3. **Add a book** → it appears in the table and in the shop.
4. Edit its price → the new price is shown everywhere.
5. Reload the page → you are still logged in, and the book is still there (it is in MongoDB).
6. Delete it → it disappears from the table, the shop, the basket and the favorites.
7. Stop the API and reload → the error message and the **Try again** button appear.

| | |
|---|---|
| ![Manage page](screenshots/14-manage-add-book.png) Manage page: adding a book | ![Register error](screenshots/15-register-error.png) API error shown in the form (409) |

---

_Book descriptions are short summaries written for this lab. Prices, ratings and review counts are fictional._
