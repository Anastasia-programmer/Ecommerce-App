import { combineReducers } from '@reduxjs/toolkit'
import productsReducer from './productsReducer'
import cartReducer from './cartReducer'
import favoritesReducer from './favoritesReducer'
import filtersReducer from './filtersReducer'
import uiReducer from './uiReducer'
import authReducer from './authReducer'

/** The root reducer: each key of the global state is managed by its own reducer. */
const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
  filters: filtersReducer,
  ui: uiReducer,
})

export default rootReducer
