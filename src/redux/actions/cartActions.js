import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  INCREASE_QUANTITY,
  DECREASE_QUANTITY,
  CLEAR_CART,
} from '../actionTypes'

/** Action creators: plain functions that return an action object { type, payload }. */

export const addToCart = (id, quantity = 1) => ({
  type: ADD_TO_CART,
  payload: { id, quantity },
})

export const removeFromCart = (id) => ({
  type: REMOVE_FROM_CART,
  payload: { id },
})

export const increaseQuantity = (id) => ({
  type: INCREASE_QUANTITY,
  payload: { id },
})

export const decreaseQuantity = (id) => ({
  type: DECREASE_QUANTITY,
  payload: { id },
})

export const clearCart = () => ({ type: CLEAR_CART })
