import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  CLEAR_CART,
} from '../actionTypes'
import { MAX_QUANTITY } from '../../data/products'

/**
 * Cart state: an ordered list of { id, quantity }.
 * Product details (title, price…) are read from the products state by selectors,
 * so they are never duplicated.
 */
export const initialState = {
  items: [],
}

const clamp = (quantity) => Math.min(Math.max(quantity, 0), MAX_QUANTITY)

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CART: {
      const { id, quantity } = action.payload
      const existing = state.items.find((item) => item.id === id)

      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: clamp(item.quantity + quantity) } : item,
          ),
        }
      }
      return { ...state, items: [...state.items, { id, quantity: clamp(quantity) }] }
    }

    case REMOVE_FROM_CART:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload.id) }

    case INCREASE_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: clamp(item.quantity + 1) } : item,
        ),
      }

    case DECREASE_QUANTITY:
      // Going below 1 removes the product from the cart.
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case CLEAR_CART:
      return initialState

    default:
      return state
  }
}
