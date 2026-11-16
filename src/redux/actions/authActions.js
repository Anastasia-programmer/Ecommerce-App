import * as api from '../../api'
import { LOGIN_SUCCESS, LOGOUT } from '../actionTypes'

/**
 * Logs in with the backend and keeps the JWT in the store.
 * Thunks re-throw API errors so the form can display them.
 */
export const login = (email, password) => async (dispatch) => {
  const { token, user } = await api.login({ email, password })
  dispatch({ type: LOGIN_SUCCESS, payload: { token, user } })
  return user
}

/** Creates the account, then logs in directly with the same credentials. */
export const register = (name, email, password) => async (dispatch) => {
  await api.register({ name, email, password })
  return dispatch(login(email, password))
}

export const logout = () => ({ type: LOGOUT })
