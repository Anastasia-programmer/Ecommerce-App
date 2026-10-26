import { TOGGLE_FAVORITE } from '../actionTypes'

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

    default:
      return state
  }
}
