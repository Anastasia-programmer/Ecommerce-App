import { SET_SEARCH_QUERY, SET_CATEGORY, SET_SORT, RESET_FILTERS } from '../actionTypes'

export const initialState = {
  query: '',
  category: 'All',
  sort: 'featured',
}

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_QUERY:
      return { ...state, query: action.payload.query }

    case SET_CATEGORY:
      return { ...state, category: action.payload.category }

    case SET_SORT:
      return { ...state, sort: action.payload.sort }

    case RESET_FILTERS:
      return initialState

    default:
      return state
  }
}
