import { TOGGLE_THEME, OPEN_CART, CLOSE_CART, SHOW_TOAST, HIDE_TOAST } from '../actionTypes'

export const initialState = {
  theme: 'light',
  isCartOpen: false,
  toast: null, // { id, message, showCartLink }
}

export default function uiReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_THEME:
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' }

    case OPEN_CART:
      return { ...state, isCartOpen: true }

    case CLOSE_CART:
      return { ...state, isCartOpen: false }

    case SHOW_TOAST:
      return { ...state, toast: action.payload }

    case HIDE_TOAST:
      return { ...state, toast: null }

    default:
      return state
  }
}
