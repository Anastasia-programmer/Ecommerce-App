import { TOGGLE_THEME, OPEN_CART, CLOSE_CART, SHOW_TOAST, HIDE_TOAST } from '../actionTypes'

export const toggleTheme = () => ({ type: TOGGLE_THEME })

export const openCart = () => ({ type: OPEN_CART })

export const closeCart = () => ({ type: CLOSE_CART })

// `id` lets the <Toast /> component restart its timer when a new message arrives.
// `showCartLink` adds a "View" button that opens the basket.
export const showToast = (message, { showCartLink = false } = {}) => ({
  type: SHOW_TOAST,
  payload: { id: Date.now(), message, showCartLink },
})

export const hideToast = () => ({ type: HIDE_TOAST })
