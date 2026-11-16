import { FETCH_PRODUCTS_SUCCESS, PRODUCT_DELETED, TOGGLE_FAVORITE } from '../actionTypes'

export const initialState = {
  ids: [],
}

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_FAVORITE: {
      const { id } = action.payload
      const ids = state.ids.includes(id)
        ? state.ids.filter((favoriteId) => favoriteId !== id)
        : [...state.ids, id]
      return { ...state, ids }
    }

    // Once the catalog arrives from the API, drop saved books that no longer exist.
    case FETCH_PRODUCTS_SUCCESS: {
      const productIds = new Set(action.payload.map((product) => product.id))
      return { ...state, ids: state.ids.filter((id) => productIds.has(id)) }
    }

    case PRODUCT_DELETED:
      return { ...state, ids: state.ids.filter((id) => id !== action.payload.id) }

    default:
      return state
  }
}
