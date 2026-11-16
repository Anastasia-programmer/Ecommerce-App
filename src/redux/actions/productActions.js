import * as api from '../../api'
import {
  FETCH_PRODUCTS_FAILURE,
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  PRODUCT_CREATED,
  PRODUCT_DELETED,
  PRODUCT_UPDATED,
} from '../actionTypes'
import { logout } from './authActions'
import { showToast } from './uiActions'

/**
 * Loads the catalog from the backend.
 * This is a "thunk": an action creator that returns a function instead of an object,
 * so it can wait for the HTTP request and dispatch other actions along the way
 * (configureStore enables thunks by default).
 */
export const fetchProducts = () => async (dispatch, getState) => {
  // React StrictMode runs effects twice in development: avoid a duplicate request
  if (getState().products.status === 'loading') return

  dispatch({ type: FETCH_PRODUCTS_REQUEST })
  try {
    const products = await api.getProducts()
    dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: products })
  } catch (error) {
    dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message })
  }
}

/**
 * Runs a protected API call with the JWT of the logged-in user.
 * A 401 means the token is missing, invalid or expired: the user is logged out.
 * Errors are re-thrown so the form can display them.
 */
const withToken = (call) => async (dispatch, getState) => {
  try {
    return await call(getState().auth.token)
  } catch (error) {
    if (error.status === 401) {
      dispatch(logout())
      dispatch(showToast('Your session has expired, please sign in again'))
    }
    throw error
  }
}

// POST /api/products
export const createProduct = (data) => async (dispatch) => {
  const product = await dispatch(withToken((token) => api.createProduct(data, token)))
  dispatch({ type: PRODUCT_CREATED, payload: product })
  return product
}

// PUT /api/products/:id
export const updateProduct = (id, changes) => async (dispatch) => {
  const product = await dispatch(withToken((token) => api.updateProduct(id, changes, token)))
  dispatch({ type: PRODUCT_UPDATED, payload: product })
  return product
}

// DELETE /api/products/:id
export const deleteProduct = (id) => async (dispatch) => {
  await dispatch(withToken((token) => api.deleteProduct(id, token)))
  dispatch({ type: PRODUCT_DELETED, payload: { id } })
}
