import { LOGIN_SUCCESS, LOGOUT } from '../actionTypes'

/**
 * The logged-in user and the JWT returned by POST /api/auth/login.
 * The token is sent with every protected request (create, update, delete a product).
 */
export const initialState = {
  user: null, // { id, name, email }
  token: null,
}

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return { user: action.payload.user, token: action.payload.token }

    case LOGOUT:
      return initialState

    default:
      return state
  }
}
