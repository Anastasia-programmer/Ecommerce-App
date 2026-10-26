import { createSelector } from '@reduxjs/toolkit'
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../data/products'

/**
 * Selectors read (and derive) data from the global state.
 * `createSelector` memoizes derived values so components only re-render
 * when the underlying state actually changes.
 */

// ---- Simple selectors -------------------------------------------------------
export const selectProducts = (state) => state.products.items
export const selectCartEntries = (state) => state.cart.items
export const selectFavoriteIds = (state) => state.favorites.ids
export const selectFilters = (state) => state.filters
export const selectTheme = (state) => state.ui.theme
export const selectIsCartOpen = (state) => state.ui.isCartOpen
export const selectToast = (state) => state.ui.toast

export const selectProductById = (state, id) =>
  state.products.items.find((product) => product.id === id)

export const selectQuantityInCart = (state, id) =>
  state.cart.items.find((item) => item.id === id)?.quantity ?? 0

export const selectIsFavorite = (state, id) => state.favorites.ids.includes(id)

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export const selectFavoritesCount = (state) => state.favorites.ids.length

// ---- Derived selectors ------------------------------------------------------
const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase()

const sorters = {
  featured: () => 0,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => b.year - a.year,
  title: (a, b) => a.title.localeCompare(b.title, 'fr'),
}

export const selectVisibleProducts = createSelector(
  [selectProducts, selectFilters],
  (products, { query, category, sort }) => {
    const search = normalize(query.trim())

    return products
      .filter((product) => category === 'All' || product.category === category)
      .filter((product) => {
        if (!search) return true
        const haystack = [product.title, product.author, product.category, product.coverTitle ?? '']
          .map(normalize)
          .join(' ')
        return haystack.includes(search)
      })
      .toSorted(sorters[sort] ?? sorters.featured)
  },
)

export const selectCategoryCounts = createSelector([selectProducts], (products) =>
  products.reduce(
    (counts, product) => ({ ...counts, [product.category]: (counts[product.category] ?? 0) + 1 }),
    { All: products.length },
  ),
)

export const selectFavoriteProducts = createSelector(
  [selectProducts, selectFavoriteIds],
  (products, ids) => ids.map((id) => products.find((product) => product.id === id)).filter(Boolean),
)

/** Cart entries joined with their product details. */
export const selectCartItems = createSelector(
  [selectCartEntries, selectProducts],
  (entries, products) =>
    entries
      .map(({ id, quantity }) => {
        const product = products.find((p) => p.id === id)
        return product ? { ...product, quantity, lineTotal: product.price * quantity } : null
      })
      .filter(Boolean),
)

export const selectCartTotals = createSelector([selectCartItems], (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0)
  const savings = items.reduce(
    (sum, item) => sum + (item.oldPrice ? (item.oldPrice - item.price) * item.quantity : 0),
    0,
  )
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = subtotal === 0 || qualifiesForFreeShipping ? 0 : SHIPPING_FEE

  return {
    subtotal,
    savings,
    shipping,
    total: subtotal + shipping,
    remainingForFreeShipping: Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0),
    freeShippingProgress: Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1),
  }
})
