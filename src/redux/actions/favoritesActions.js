import { TOGGLE_FAVORITE } from '../actionTypes'

export const toggleFavorite = (id) => ({
  type: TOGGLE_FAVORITE,
  payload: { id },
})
