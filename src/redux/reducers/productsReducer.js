import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  PRODUCT_CREATED,
  PRODUCT_DELETED,
  PRODUCT_UPDATED,
} from '../actionTypes'

/**
 * The catalog, loaded from the backend API (GET /api/products).
 * status: 'idle' → 'loading' → 'succeeded' or 'failed'
 */
export const initialState = {
  items: [],
  status: 'idle',
  error: null,
}

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, status: 'loading', error: null }

    case FETCH_PRODUCTS_SUCCESS:
      return { items: action.payload, status: 'succeeded', error: null }

    case FETCH_PRODUCTS_FAILURE:
      return { ...state, status: 'failed', error: action.payload }

    // After a successful create / update / delete on the API, update the list
    // directly instead of downloading the whole catalog again.
    case PRODUCT_CREATED:
      return { ...state, items: [...state.items, action.payload] }

    case PRODUCT_UPDATED:
      return {
        ...state,
        items: state.items.map((product) => (product.id === action.payload.id ? action.payload : product)),
      }

    case PRODUCT_DELETED:
      return { ...state, items: state.items.filter((product) => product.id !== action.payload.id) }

    default:
      return state
  }
}
