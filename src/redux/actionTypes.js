/**
 * Action types — every event that can change the global state.
 * Using constants avoids typos between action creators and reducers.
 */

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
