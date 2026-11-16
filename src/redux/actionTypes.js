/**
 * Action types — every event that can change the global state.
 * Using constants avoids typos between action creators and reducers.
 */

// Products (loaded from the backend API)
export const FETCH_PRODUCTS_REQUEST = 'products/fetchRequest'
export const FETCH_PRODUCTS_SUCCESS = 'products/fetchSuccess'
export const FETCH_PRODUCTS_FAILURE = 'products/fetchFailure'
export const PRODUCT_CREATED = 'products/created'
export const PRODUCT_UPDATED = 'products/updated'
export const PRODUCT_DELETED = 'products/deleted'

// Authentication (JWT from the backend)
export const LOGIN_SUCCESS = 'auth/loginSuccess'
export const LOGOUT = 'auth/logout'

// Cart
export const ADD_TO_CART = 'cart/addToCart'
export const REMOVE_FROM_CART = 'cart/removeFromCart'
export const INCREASE_QUANTITY = 'cart/increaseQuantity'
export const DECREASE_QUANTITY = 'cart/decreaseQuantity'
export const CLEAR_CART = 'cart/clearCart'

// Favorites
export const TOGGLE_FAVORITE = 'favorites/toggleFavorite'

// Filters (search, category, sorting)
export const SET_SEARCH_QUERY = 'filters/setSearchQuery'
export const SET_CATEGORY = 'filters/setCategory'
export const SET_SORT = 'filters/setSort'
export const RESET_FILTERS = 'filters/resetFilters'

// UI
export const TOGGLE_THEME = 'ui/toggleTheme'
export const OPEN_CART = 'ui/openCart'
export const CLOSE_CART = 'ui/closeCart'
export const SHOW_TOAST = 'ui/showToast'
export const HIDE_TOAST = 'ui/hideToast'
