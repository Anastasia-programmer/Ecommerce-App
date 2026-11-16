import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './reducers'
import { initialState as authInitialState } from './reducers/authReducer'
import { initialState as cartInitialState } from './reducers/cartReducer'
import { initialState as favoritesInitialState } from './reducers/favoritesReducer'
import { initialState as uiInitialState } from './reducers/uiReducer'
import { actionLogger } from './middleware/actionLogger'
import { loadState, saveState } from './localStorage'

/** A JWT holds its expiry date ("exp", in seconds) in its middle, base64-encoded part. */
function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

/**
 * Rebuild the initial state from local storage.
 * Books that no longer exist are removed once the catalog is loaded from the API
 * (see FETCH_PRODUCTS_SUCCESS in the cart and favorites reducers).
 * An expired login is forgotten.
 */
function getPreloadedState() {
  const saved = loadState() ?? {}
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches

  return {
    auth: saved.auth?.token && isTokenValid(saved.auth.token) ? saved.auth : authInitialState,
    cart: {
      ...cartInitialState,
      items: (saved.cart ?? []).filter((item) => item.quantity > 0),
    },
    favorites: {
      ...favoritesInitialState,
      ids: saved.favorites ?? [],
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
    current.auth !== previous.auth ||
    current.cart !== previous.cart ||
    current.favorites !== previous.favorites ||
    current.ui.theme !== previous.ui.theme
  ) {
    saveState({
      auth: current.auth,
      cart: current.cart.items,
      favorites: current.favorites.ids,
      theme: current.ui.theme,
    })
  }
  previous = current
})
