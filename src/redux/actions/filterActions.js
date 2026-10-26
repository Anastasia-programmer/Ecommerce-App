import { SET_SEARCH_QUERY, SET_CATEGORY, SET_SORT, RESET_FILTERS } from '../actionTypes'

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: { query },
})

export const setCategory = (category) => ({
  type: SET_CATEGORY,
  payload: { category },
})

export const setSort = (sort) => ({
  type: SET_SORT,
  payload: { sort },
})

export const resetFilters = () => ({ type: RESET_FILTERS })
