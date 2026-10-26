import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { initialState as cartInitialState } from './reducers/cartReducer'
import { initialState as favoritesInitialState } from './reducers/favoritesReducer'
import { initialState as uiInitialState } from './reducers/uiReducer'
import { actionLogger } from './middleware/actionLogger'
import { loadState, saveState } from './localStorage'
import products from '../data/products'

/** Rebuild the initial state from local storage, ignoring unknown products. */
function getPreloadedState() {
  const saved = loadState() ?? {}
  const productIds = new Set(products.map((product) => product.id))
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches

  return {
    cart: {
      ...cartInitialState,
      items: (saved.cart ?? []).filter((item) => productIds.has(item.id) && item.quantity > 0),
    },
    favorites: {
      ...favoritesInitialState,
      ids: (saved.favorites ?? []).filter((id) => productIds.has(id)),
    },
    ui: {
      ...uiInitialState,
      theme: saved.theme ?? (prefersDark ? 'dark' : 'light'),
    },
  }
}

/**
 * The Redux store: the single source of truth for the global state.
 * configureStore also enables the Redux DevTools browser extension.
 */
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLogger),
})

// Save the persisted part of the state whenever it changes.
let previous = store.getState()
store.subscribe(() => {
  const current = store.getState()
  if (
    current.cart !== previous.cart ||
    current.favorites !== previous.favorites ||
    current.ui.theme !== previous.ui.theme
  ) {
    saveState({
      cart: current.cart.items,
      favorites: current.favorites.ids,
      theme: current.ui.theme,
    })
  }
  previous = current
})
